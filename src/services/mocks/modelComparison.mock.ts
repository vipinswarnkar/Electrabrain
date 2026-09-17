import type { ModelMetrics } from '@/types';

export type ComparisonTarget = 'SOC' | 'SOH' | 'RUL';

export interface ComparisonMetricRow {
  id: string;
  name: string;
  metrics: Record<ComparisonTarget, ModelMetrics>;
}

export const mockModelComparisonData: ComparisonMetricRow[] = [
  {
    id: 'linear-regression',
    name: 'Linear Regression',
    metrics: {
      SOC: { rmse: 0.081, mae: 0.064, r2: 0.74 },
      SOH: { rmse: 0.093, mae: 0.071, r2: 0.69 },
      RUL: { rmse: 0.112, mae: 0.089, r2: 0.61 },
    },
  },
  {
    id: 'polynomial-regression',
    name: 'Polynomial Regression',
    metrics: {
      SOC: { rmse: 0.071, mae: 0.056, r2: 0.79 },
      SOH: { rmse: 0.082, mae: 0.062, r2: 0.75 },
      RUL: { rmse: 0.099, mae: 0.078, r2: 0.67 },
    },
  },
  {
    id: 'decision-tree',
    name: 'Decision Tree',
    metrics: {
      SOC: { rmse: 0.068, mae: 0.051, r2: 0.81 },
      SOH: { rmse: 0.076, mae: 0.058, r2: 0.79 },
      RUL: { rmse: 0.091, mae: 0.074, r2: 0.71 },
    },
  },
  {
    id: 'random-forest',
    name: 'Random Forest',
    metrics: {
      SOC: { rmse: 0.061, mae: 0.047, r2: 0.84 },
      SOH: { rmse: 0.071, mae: 0.053, r2: 0.82 },
      RUL: { rmse: 0.086, mae: 0.069, r2: 0.74 },
    },
  },
  {
    id: 'gradient-boosting',
    name: 'Gradient Boosting',
    metrics: {
      SOC: { rmse: 0.057, mae: 0.043, r2: 0.86 },
      SOH: { rmse: 0.067, mae: 0.049, r2: 0.84 },
      RUL: { rmse: 0.081, mae: 0.064, r2: 0.77 },
    },
  },
  {
    id: 'xgboost',
    name: 'XGBoost',
    metrics: {
      SOC: { rmse: 0.054, mae: 0.040, r2: 0.88 },
      SOH: { rmse: 0.064, mae: 0.046, r2: 0.86 },
      RUL: { rmse: 0.078, mae: 0.061, r2: 0.79 },
    },
  },
  {
    id: 'ahrf',
    name: 'AHRF',
    metrics: {
      SOC: { rmse: 0.052, mae: 0.038, r2: 0.89 },
      SOH: { rmse: 0.061, mae: 0.044, r2: 0.87 },
      RUL: { rmse: 0.075, mae: 0.058, r2: 0.81 },
    },
  },
];
