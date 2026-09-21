import modelComparisonV2Results from './model_comparison_v2_results.json';
import { REAL_MODEL_COMPARISON } from './realModelComparison';
import type { ComparisonTarget } from '@/services/mocks/modelComparison.mock';
import type { ModelMetrics } from '@/types';

// SOH: real 7-model comparison (Notebook 06's exact protocol -- leakage-safe
// features, real chronological 80/20 split on B0005's real 168 cycles, fair
// documented hyperparameters), including both AHRF-v1 and AHRF-v2.
// SOC/RUL: real 3-model AHRF-family comparison (cross-battery generalization
// test) -- Notebook 06 only ever covered SOH, so this is genuinely all the
// real comparison data that exists for those two targets.

interface ComparisonRow {
  id: string;
  name: string;
  metrics: ModelMetrics;
}

const SOH_ROWS: ComparisonRow[] = (modelComparisonV2Results as Array<{ id: string; name: string; rmse: number; mae: number; r2: number }>).map((r) => ({
  id: r.id,
  name: r.name,
  metrics: { rmse: r.rmse, mae: r.mae, r2: r.r2 },
}));

export function getComparisonRows(target: ComparisonTarget): ComparisonRow[] {
  if (target === 'SOH') {
    return SOH_ROWS;
  }
  return REAL_MODEL_COMPARISON.map((row) => ({
    id: row.id,
    name: row.name,
    metrics: row.metrics[target],
  }));
}

export function getComparisonNote(target: ComparisonTarget): string {
  if (target === 'SOH') {
    return '7 real models, evaluated under a leakage-safe chronological 80/20 split on B0005\'s real cycle history (matching the original research notebook\'s protocol). Note: this test window falls in the battery\'s near-end-of-life region, where SOH varies very little in absolute terms -- R2 is an unreliable metric there, so MAE is the more meaningful comparison.';
  }
  return '3 real AHRF-family models, evaluated by cross-battery generalization (trained on B0005, tested on held-out real batteries). Notebook 06\'s 6-model comparison only covers SOH.';
}
