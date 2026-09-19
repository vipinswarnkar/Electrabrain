import type {
  Battery,
  PredictionResponse,
  SHAPExplanation,
  ModelMetrics,
  OptimizationResult,
  MaintenanceRecommendation,
  Dataset,
  Experiment,
  Alert,
  Report,
} from '@/types';

export interface BatteryService {
  getBatteries(): Promise<Battery[]>;
  getBattery(id: string): Promise<Battery | null>;
}

export interface PredictionService {
  getPredictions(): Promise<PredictionResponse[]>;
  getPrediction(batteryId: string): Promise<PredictionResponse | null>;
  runLivePrediction?(recentCycles: unknown[]): Promise<PredictionResponse | null>;
}

export interface ExplainabilityService {
  getSHAPExplanation(
    batteryId?: string,
    target?: 'SOC' | 'SOH' | 'RUL',
    cycle?: number,
  ): Promise<SHAPExplanation>;
}

export interface ModelService {
  getModelMetrics(): Promise<Record<string, ModelMetrics>>;
}

export interface OptimizationService {
  getOptimizationResult(): Promise<OptimizationResult>;
}

export interface MaintenanceService {
  getMaintenanceRecommendations(): Promise<MaintenanceRecommendation[]>;
}

export interface DatasetService {
  getDatasets(): Promise<Dataset[]>;
  getDataset(id: string): Promise<Dataset | null>;
  uploadDataset(input: {
    name: string;
    description: string;
    source: string;
    status?: Dataset['status'];
  }): Promise<Dataset>;
}

export interface ExperimentService {
  getExperiments(): Promise<Experiment[]>;
}

export interface AlertService {
  getAlerts(): Promise<Alert[]>;
}

export interface ReportService {
  getReports(): Promise<Report[]>;
}
