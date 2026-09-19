import type { PredictionService } from '@/services/types';
import { MOCK_PREDICTIONS_RESPONSE } from './predictionData.mock';

export const mockPredictionService: PredictionService = {
  async getPredictions() {
    return MOCK_PREDICTIONS_RESPONSE;
  },
  async getPrediction(batteryId: string) {
    return MOCK_PREDICTIONS_RESPONSE.find((prediction) => prediction.batteryId === batteryId) ?? null;
  },
};
