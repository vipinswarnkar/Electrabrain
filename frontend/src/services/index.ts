import type {
  BatteryService,
  PredictionService,
  ExplainabilityService,
  ModelService,
  OptimizationService,
  MaintenanceService,
  DatasetService,
  ExperimentService,
  AlertService,
  ReportService,
} from '@/services/types';
import { MOCK_ALERTS } from './mocks/batteryData.mock';
import { REAL_ALERTS } from '@/data/realAlerts';
import { mockBatteryService } from './mocks/batteryService.mock';
import { realBatteryService } from './batteryService.real';
import { mockPredictionService } from './mocks/predictionService.mock';
import { livePredictionService } from './predictionService.live';
import { mockExplainabilityData } from './mocks/explainability.mock';
import { mockOptimizationResult } from './mocks/optimization.mock';
import { mockModelComparisonData } from './mocks/modelComparison.mock';
import { mockDatasetService } from './mocks/datasetService.mock';

export const mockExplainabilityService: ExplainabilityService = {
  async getSHAPExplanation(batteryId?: string, target?: 'SOC' | 'SOH' | 'RUL', _cycle?: number) {
    const resolvedBatteryId = batteryId ?? 'battery-001';
    const resolvedTarget = target ?? 'SOH';
    return mockExplainabilityData[resolvedBatteryId]?.[resolvedTarget] ?? mockExplainabilityData['battery-001'].SOH;
  },
};

export const mockModelService: ModelService = {
  async getModelMetrics() {
    return mockModelComparisonData.reduce<Record<string, { rmse: number; mae: number; r2: number }>>(
      (acc, model) => {
        acc[model.id] = { rmse: 0, mae: 0, r2: 0 };
        return acc;
      },
      {},
    );
  },
};

export const mockOptimizationService: OptimizationService = {
  async getOptimizationResult() {
    return mockOptimizationResult;
  },
};

export const mockMaintenanceService: MaintenanceService = {
  async getMaintenanceRecommendations() {
    return [];
  },
};


export const mockExperimentService: ExperimentService = {
  async getExperiments() {
    return [];
  },
};

export const realAlertService: AlertService = {
  async getAlerts() {
    return REAL_ALERTS;
  },
};

export const mockReportService: ReportService = {
  async getReports() {
    return [];
  },
};

/** Swap these exports when connecting to Express/FastAPI */
export const batteryService: BatteryService = realBatteryService;
export const predictionService: PredictionService = livePredictionService;
export const explainabilityService: ExplainabilityService = mockExplainabilityService;
export const modelService: ModelService = mockModelService;
export const optimizationService: OptimizationService = mockOptimizationService;
export const maintenanceService: MaintenanceService = mockMaintenanceService;
export const datasetService: DatasetService = mockDatasetService;
export const experimentService: ExperimentService = mockExperimentService;
export const alertService: AlertService = realAlertService;
export const reportService: ReportService = mockReportService;
