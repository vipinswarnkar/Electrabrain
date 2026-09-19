import type { OptimizationResult } from '@/types';

export const mockOptimizationResult: OptimizationResult = {
  id: 'optuna-demo-001',
  status: 'completed',
  trialCount: 28,
  bestTrial: 17,
  bestValue: 0.042,
  metric: 'RMSE',
  bestParams: {
    n_estimators: 180,
    max_depth: 8,
    min_samples_split: 6,
    min_samples_leaf: 2,
    max_features: 0.72,
  },
  trials: [
    { trialNumber: 1, params: { n_estimators: 120, max_depth: 5, min_samples_split: 8, min_samples_leaf: 3, max_features: 0.5 }, value: 0.091, state: 'complete' },
    { trialNumber: 2, params: { n_estimators: 140, max_depth: 6, min_samples_split: 6, min_samples_leaf: 2, max_features: 0.6 }, value: 0.074, state: 'complete' },
    { trialNumber: 3, params: { n_estimators: 160, max_depth: 7, min_samples_split: 7, min_samples_leaf: 2, max_features: 0.7 }, value: 0.066, state: 'complete' },
    { trialNumber: 4, params: { n_estimators: 180, max_depth: 8, min_samples_split: 6, min_samples_leaf: 2, max_features: 0.72 }, value: 0.042, state: 'complete' },
    { trialNumber: 5, params: { n_estimators: 200, max_depth: 9, min_samples_split: 5, min_samples_leaf: 1, max_features: 0.8 }, value: 0.057, state: 'complete' },
    { trialNumber: 6, params: { n_estimators: 170, max_depth: 7, min_samples_split: 5, min_samples_leaf: 1, max_features: 0.65 }, value: 0.048, state: 'complete' },
  ],
  parameterImportance: [
    { name: 'max_depth', importance: 0.37 },
    { name: 'n_estimators', importance: 0.26 },
    { name: 'max_features', importance: 0.18 },
    { name: 'min_samples_split', importance: 0.12 },
    { name: 'min_samples_leaf', importance: 0.07 },
  ],
};
