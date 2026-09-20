import type { ModelMetrics } from '@/types';
import type { ComparisonMetricRow, ComparisonTarget } from '@/services/mocks/modelComparison.mock';
import modelComparisonResults from './model_comparison_results.json';

// Real model comparison: RMSE/MAE/R2 computed by actually evaluating all
// 3 model variants Friend A built (AHRF-v1, AHRF-v2, plain Random Forest)
// against real held-out NASA batteries (B0006/B0007/B0018 -- the model
// was trained only on B0005, so this tests real generalization).
// See ml/compare_models.py. Units: SOC/SOH in %, RUL in cycles --
// NOT the 0-1 normalized scale the old mock data used.

interface RawResult {
  soc: { rmse: number; mae: number; r2: number };
  soh: { rmse: number; mae: number; r2: number };
  rul: { rmse: number; mae: number; r2: number };
}

const RESULTS = modelComparisonResults as Record<string, RawResult>;

const MODEL_NAMES: Record<string, string> = {
  ahrf_v1: 'AHRF v1 (production)',
  ahrf_v2: 'AHRF v2 (experimental)',
  random_forest: 'Plain Random Forest (baseline)',
};

function toMetric(m: { rmse: number; mae: number; r2: number }): ModelMetrics {
  return { rmse: m.rmse, mae: m.mae, r2: m.r2 };
}

export const REAL_MODEL_COMPARISON: ComparisonMetricRow[] = Object.entries(RESULTS).map(
  ([id, result]) => ({
    id,
    name: MODEL_NAMES[id] ?? id,
    metrics: {
      SOC: toMetric(result.soc),
      SOH: toMetric(result.soh),
      RUL: toMetric(result.rul),
    } as Record<ComparisonTarget, ModelMetrics>,
  }),
);
