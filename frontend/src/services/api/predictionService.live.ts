import { apiClient } from '@/services/api/client';

// Mirrors backend/main.py's CycleInput / PredictRequest / PredictResponse
// exactly. Keep these two files in sync if the backend contract changes.

export interface LiveCycleSignals {
  Voltage_measured: number[];
  Current_measured: number[];
  Temperature_measured: number[];
  Voltage_load: number[];
  Current_load: number[];
  Time: number[];
}

export interface LiveCycleInput {
  capacity_ah: number;
  signals: LiveCycleSignals;
  impedance?: { Re: number; Rct: number };
}

export interface LivePredictionResult {
  SOC: number;
  SOH: number;
  RUL: number;
  status: string;
  recommendation: string;
}

export async function runLivePrediction(
  recentCycles: LiveCycleInput[],
): Promise<LivePredictionResult> {
  const response = await apiClient.post<LivePredictionResult>('/predict', {
    recent_cycles: recentCycles,
  });
  return response.data;
}
