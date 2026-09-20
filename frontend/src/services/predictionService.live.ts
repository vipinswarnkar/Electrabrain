import type { PredictionService } from '@/services/types';
import { REAL_PREDICTIONS } from '@/data/realBatteries';
import { runLivePrediction, type LiveCycleInput } from '@/services/api/predictionService.live';

// Real backend-connected PredictionService.
// getPredictions/getPrediction serve real AHRF-v1 model output, computed
// against real NASA B0005/6/7/18 cycles (see ml/extract_multi_battery.py).
// runLivePrediction calls FastAPI live, for the interactive demo page.
export const livePredictionService: PredictionService = {
  async getPredictions() {
    return REAL_PREDICTIONS;
  },
  async getPrediction(batteryId: string) {
    return REAL_PREDICTIONS.find((p) => p.batteryId === batteryId) ?? null;
  },

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
