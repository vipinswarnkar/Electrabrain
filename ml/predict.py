"""
predict.py

The single entry point FastAPI will call. Wraps Friend A's existing src/
pipeline into one function: raw recent cycle data in -> SOC/SOH/RUL +
status out. Does not change any logic in src/ -- only orchestrates it.
"""

import joblib
import numpy as np
import pandas as pd
from pathlib import Path

from src.feature_engineering.extractor import extract_features_from_cycle
from src.feature_engineering.trend_features import add_capacity_fade_rate, add_rolling_features
from src.decision_engine.rules import classify_battery_status

MODELS_DIR = Path(__file__).parent / "models"
TARGETS = ["soc", "soh", "rul"]

# Columns that get the 5-cycle rolling mean/std treatment (must match
# what Notebook 05 actually used -- these are the *_rolling_* names
# visible in feature_columns.pkl).
ROLLING_COLUMNS = ["Voltage_measured_mean", "Time_max", "Temperature_measured_mean"]

# Loaded once, at import time -- NOT per-request. This is what FastAPI's
# startup event will trigger.
_models, _feature_columns, _imputers = {}, {}, {}
for target in TARGETS:
    _models[target] = joblib.load(MODELS_DIR / f"{target}_ahrf_v1.pkl")
    _feature_columns[target] = joblib.load(MODELS_DIR / f"{target}_feature_columns.pkl")
    _imputers[target] = joblib.load(MODELS_DIR / f"{target}_imputer.pkl")


def _build_feature_row(recent_cycles):
    """
    recent_cycles: list of dicts, oldest cycle first, latest cycle last.
    Each dict must have:
        "capacity_ah": float   -- measured capacity for this cycle
        "signals": {col_name: [list of raw readings]} for
                   Voltage_measured, Current_measured, Temperature_measured,
                   Voltage_load, Current_load, Time
        "impedance": {"Re": float, "Rct": float} -- OPTIONAL, omit if unavailable

    Returns: one-row DataFrame of engineered features for the LATEST cycle,
    with full trend/rolling context from the earlier cycles in the list.
    """
    if len(recent_cycles) < 2:
        raise ValueError(
            "Need at least 2 recent cycles to compute trend features "
            "(5+ recommended for accurate rolling/fade-rate features)."
        )

    rows = []
    for i, cycle in enumerate(recent_cycles):
        df = pd.DataFrame(cycle["signals"])
        features = extract_features_from_cycle(df)
        features["cycle_index"] = i + 1
        features["Capacity"] = cycle["capacity_ah"]
        if "impedance" in cycle:
            features["Re"] = cycle["impedance"]["Re"]
            features["Rct"] = cycle["impedance"]["Rct"]
        rows.append(features)

    feature_df = pd.DataFrame(rows)

    feature_df = add_capacity_fade_rate(feature_df, capacity_col="Capacity", cycle_col="cycle_index")
    feature_df = add_rolling_features(feature_df, columns=ROLLING_COLUMNS, cycle_col="cycle_index")

    # Impedance trend: only if every cycle supplied it; otherwise fall back
    # to 0, matching add_impedance_trend_features()'s own no-data behavior.
    if "Re" in feature_df.columns and "Rct" in feature_df.columns:
        feature_df["Re_nearest"] = feature_df["Re"]
        feature_df["Rct_nearest"] = feature_df["Rct"]
        feature_df["Re_trend"] = feature_df["Re"].rolling(window=5, min_periods=2).apply(
            lambda s: np.polyfit(range(len(s)), s, 1)[0], raw=True
        ).fillna(0.0)
        feature_df["Rct_trend"] = feature_df["Rct"].rolling(window=5, min_periods=2).apply(
            lambda s: np.polyfit(range(len(s)), s, 1)[0], raw=True
        ).fillna(0.0)
    else:
        feature_df["Re_nearest"] = 0.0
        feature_df["Rct_nearest"] = 0.0
        feature_df["Re_trend"] = 0.0
        feature_df["Rct_trend"] = 0.0

    return feature_df.iloc[[-1]]  # only the latest cycle's row


def predict_battery_health(recent_cycles):
    """
    Main entry point. recent_cycles: see _build_feature_row() docstring.

    Returns a dict: {"SOC": float, "SOH": float, "RUL": float,
                      "status": str, "recommendation": str}
    """
    latest_row = _build_feature_row(recent_cycles)

    predictions = {}
    for target in TARGETS:
        cols = _feature_columns[target]
        # Reindex guarantees exact column order the model was trained on;
        # any column the model expects but we didn't compute becomes NaN,
        # which the imputer then handles -- same as Notebook 08's approach.
        X = latest_row.reindex(columns=cols)
        X_imputed = _imputers[target].transform(X)
        pred = _models[target].predict(X_imputed)[0]
        predictions[target.upper()] = float(pred)

    decision = classify_battery_status(
        soc=predictions["SOC"], soh=predictions["SOH"], rul=predictions["RUL"],
    )
    predictions.update(decision)
    return predictions
