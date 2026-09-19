import type { PredictionService } from '@/services/types';
import { mockPredictionService } from '@/services/mocks/predictionService.mock';
import { runLivePrediction, type LiveCycleInput } from '@/services/api/predictionService.live';

// Real backend-connected PredictionService. getPredictions/getPrediction
// still delegate to the mock -- FastAPI has no concept of a stored list
// of batteries/predictions (that would need a database, out of scope for
// this project). runLivePrediction is the one real, FastAPI-backed method.
export const livePredictionService: PredictionService = {
  getPredictions: mockPredictionService.getPredictions,
  getPrediction: mockPredictionService.getPrediction,

  async runLivePrediction(recentCycles: unknown[]) {
    const result = await runLivePrediction(recentCycles as LiveCycleInput[]);

    const metric = (predictedValue: number, unit: string) => ({
      currentValue: predictedValue,
      predictedValue,
      confidence: 1,
      unit,
      historicalTrend: [],
      predictionTrend: [predictedValue],
    });

    return {
      id: `live-${Date.now()}`,
      batteryId: 'live-prediction',
      batteryName: 'Live Prediction',
      modelVersion: 'AHRF-v1',
      generatedAt: new Date().toISOString(),
      currentCycle: recentCycles.length,
      expectedEol: '',
      remainingCycles: Math.round(result.RUL),
      soc: metric(result.SOC, '%'),
      soh: metric(result.SOH, '%'),
      rul: metric(result.RUL, 'cycles'),
    };
  },
};
