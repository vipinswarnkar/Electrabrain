"""
backend/main.py

FastAPI wrapper around ml/predict.py. This file does NOT reimplement any
ML logic -- it only validates incoming requests and calls
predict_battery_health(), which does the real work.
"""

import sys
from pathlib import Path

# Make ml/ (and therefore ml/src/) importable, since backend/ is a
# sibling folder to ml/, not a subfolder of it.
ML_DIR = Path(__file__).resolve().parent.parent / "ml"
sys.path.insert(0, str(ML_DIR))

from predict import predict_battery_health  # noqa: E402  (import after sys.path fix, intentional)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional


app = FastAPI(
    title="SBMS Battery Health API",
    description="Serves SOC/SOH/RUL predictions from the AHRF-v1 model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CycleSignals(BaseModel):
    Voltage_measured: list[float]
    Current_measured: list[float]
    Temperature_measured: list[float]
    Voltage_load: list[float]
    Current_load: list[float]
    Time: list[float]


class ImpedanceReading(BaseModel):
    Re: float
    Rct: float


class CycleInput(BaseModel):
    capacity_ah: float = Field(..., description="Measured capacity for this cycle, in Amp-hours")
    signals: CycleSignals
    impedance: Optional[ImpedanceReading] = None


class PredictRequest(BaseModel):
    recent_cycles: list[CycleInput] = Field(
        ..., min_length=2,
        description="Oldest cycle first, latest cycle last. 5+ cycles recommended.",
    )


class PredictResponse(BaseModel):
    SOC: float
    SOH: float
    RUL: float
    status: str
    recommendation: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        cycles_as_dicts = [cycle.model_dump(exclude_none=True) for cycle in request.recent_cycles]
        result = predict_battery_health(cycles_as_dicts)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")
