import allTargetsResults from './model_comparison_all_targets.json';
import { REAL_MODEL_COMPARISON } from './realModelComparison';
import type { ComparisonTarget } from '@/services/mocks/modelComparison.mock';
import type { ModelMetrics } from '@/types';

// SOH/SOC: real 7-model comparison (Notebook 06's protocol -- leakage-safe
// features, real chronological 80/20 split on B0005's real 168 cycles),
// using each target's REAL production hyperparameters (pulled from the
// actual deployed .pkl models), including both AHRF-v1 and AHRF-v2.
//
// RUL: this same 7-model protocol was attempted for RUL too, but the
// chronological 80/20 split places the ENTIRE test window past B0005's
// real end-of-life point, where RUL floors at exactly 0 for every row
// (zero variance). R2 and "best model" are mathematically meaningless
// on a constant target, so RUL falls back to the earlier 3-model
// AHRF-family comparison (cross-battery generalization), which uses a
// properly-varied evaluation set instead.

interface RawRow { id: string; name: string; rmse: number; mae: number; r2: number }
interface ComparisonRow { id: string; name: string; metrics: ModelMetrics }

const ALL_TARGETS = allTargetsResults as Record<'soh' | 'soc' | 'rul', RawRow[]>;

function toRows(raw: RawRow[]): ComparisonRow[] {
  return raw.map((r) => ({ id: r.id, name: r.name, metrics: { rmse: r.rmse, mae: r.mae, r2: r.r2 } }));
}

export function getComparisonRows(target: ComparisonTarget): ComparisonRow[] {
  if (target === 'SOH') return toRows(ALL_TARGETS.soh);
  if (target === 'SOC') return toRows(ALL_TARGETS.soc);
  // RUL: fall back to the 3-model AHRF-family comparison (see note above)
  return REAL_MODEL_COMPARISON.map((row) => ({ id: row.id, name: row.name, metrics: row.metrics.RUL }));
}

export function getComparisonNote(target: ComparisonTarget): string {
  if (target === 'SOH' || target === 'SOC') {
    return `7 real models, evaluated under a leakage-safe chronological 80/20 split on B0005's real cycle history, using each target's real production hyperparameters. ${target === 'SOH' ? "Note: this test window falls in the battery's near-end-of-life region, where SOH varies very little in absolute terms -- R2 is an unreliable metric there, so MAE is the more meaningful comparison." : ''}`;
  }
  return "RUL uses a different, 3-model AHRF-family comparison here: the same chronological 80/20 split used for SOH/SOC places the entire RUL test window past B0005's real end-of-life point, where RUL is exactly 0 for every test row (zero variance) -- R2 and model ranking are mathematically meaningless on a constant target, so this falls back to a cross-battery generalization comparison instead.";
}
