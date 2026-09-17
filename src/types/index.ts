export type BatteryStatus = 'online' | 'offline' | 'charging' | 'discharging' | 'maintenance' | 'critical';

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'resolved';

export type MaintenanceLevel =
  | 'normal'
  | 'monitor'
  | 'preventive'
  | 'replacement'
  | 'immediate';

export type ExperimentStatus = 'pending' | 'running' | 'completed' | 'failed';

export type DatasetStatus = 'processing' | 'ready' | 'error' | 'archived';

export interface BatteryOverview {
  description: string;
  installedAt: string;
  warrantyEnds: string;
  owner: string;
  operatingMode: string;
}

export interface BatteryHealth {
  summary: string;
  trend: number[];
  notes: string[];
}

export interface BatteryCycleData {
  total: number;
  lastCycleDate: string;
  cycleTrend: number[];
  chargeRate: number;
  dischargeRate: number;
}

export interface BatterySensorReading {
  name: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
  unit: string;
}

export interface BatteryPredictionSummary {
  nextMaintenance: string;
  estimatedRul: number;
  confidence: number;
  nextFailureRisk: string;
}

export interface BatteryDegradation {
  capacityFadePercent: number;
  resistanceGrowthPercent: number;
  trend: 'stable' | 'rising' | 'critical';
  notes: string[];
}

export interface BatteryMaintenanceItem {
  title: string;
  detail: string;
  status: 'scheduled' | 'due' | 'done';
  dueDate: string;
  action: string;
}

export interface BatteryTelemetryPoint {
  time: string;
  soc: number;
  temperature: number;
  voltage: number;
}

export interface Battery {
  id: string;
  name: string;
  serialNumber: string;
  model: string;
  status: BatteryStatus;
  soc: number;
  soh: number;
  rul: number;
  voltage: number;
  current: number;
  temperature: number;
  capacity: number;
  internalResistance: number;
  cycleCount: number;
  location?: string;
  lastUpdated: string;
  overview?: BatteryOverview;
  health?: BatteryHealth;
  cycles?: BatteryCycleData;
  sensors?: BatterySensorReading[];
  predictions?: BatteryPredictionSummary;
  degradation?: BatteryDegradation;
  maintenance?: BatteryMaintenanceItem[];
  telemetry?: BatteryTelemetryPoint[];
}

export interface SOCResult {
  batteryId: string;
  value: number;
  confidence: number;
  timestamp: string;
  predicted?: boolean;
}

export interface SOHResult {
  batteryId: string;
  value: number;
  confidence: number;
  timestamp: string;
  predicted?: boolean;
}

export interface RULResult {
  batteryId: string;
  value: number;
  unit: 'cycles' | 'days';
  confidence: number;
  expectedEol: string;
  timestamp: string;
}

export interface PredictionMetric {
  currentValue: number;
  predictedValue: number;
  confidence: number;
  unit: string;
  historicalTrend: number[];
  predictionTrend: number[];
}

export interface PredictionResponse {
  id: string;
  batteryId: string;
  batteryName: string;
  modelVersion: string;
  generatedAt: string;
  currentCycle: number;
  expectedEol: string;
  remainingCycles: number;
  soc: PredictionMetric;
  soh: PredictionMetric;
  rul: PredictionMetric;
}

export interface PredictionResult {
  batteryId: string;
  soc: SOCResult;
  soh: SOHResult;
  rul: RULResult;
  modelVersion: string;
  generatedAt: string;
}

export interface Alert {
  id: string;
  batteryId: string;
  batteryName: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  timestamp: string;
  acknowledged: boolean;
}

export interface DatasetPreviewRow {
  id: string;
  batteryId: string;
  cycle: number;
  voltage: number;
  temperature: number;
  capacity: number;
}

export interface DatasetStatistics {
  observations: number;
  missingValues: number;
  normalized: boolean;
  lastUpdated: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  source: string;
  status: DatasetStatus;
  recordCount: number;
  batteryCount: number;
  featureCount: number;
  schema: string[];
  uploadedAt: string;
  sizeBytes: number;
  version?: string;
  cycleCount?: number;
  batteries?: string[];
  features?: string[];
  previewRows?: DatasetPreviewRow[];
  statistics?: DatasetStatistics;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  type: string;
  target: 'SOC' | 'SOH' | 'RUL' | 'multi';
  trainingDate: string;
  datasetId: string;
  features: string[];
  treeCount?: number;
  metrics: ModelMetrics;
}

export interface ModelMetrics {
  rmse: number;
  mae: number;
  r2: number;
}

export interface Experiment {
  id: string;
  name: string;
  datasetId: string;
  datasetName: string;
  target: string;
  model: string;
  featureSet: string[];
  dataSplit: { train: number; validation: number; test: number };
  status: ExperimentStatus;
  metrics?: ModelMetrics;
  createdAt: string;
}

export interface SHAPFeature {
  name: string;
  importance: number;
  value?: number;
}

export interface SHAPExplanation {
  batteryId?: string;
  predictionId?: string;
  globalFeatures: SHAPFeature[];
  localFeatures: SHAPFeature[];
  baseValue: number;
  outputValue: number;
  target: 'SOC' | 'SOH' | 'RUL';
}

export interface OptimizationTrial {
  trialNumber: number;
  params: Record<string, number | string>;
  value: number;
  state: 'complete' | 'running' | 'failed';
}

export interface OptimizationResult {
  id: string;
  status: 'idle' | 'running' | 'completed';
  trialCount: number;
  bestTrial: number;
  bestParams: Record<string, number | string>;
  bestValue: number;
  metric: string;
  trials: OptimizationTrial[];
  parameterImportance: SHAPFeature[];
}

export interface MaintenanceRecommendation {
  id: string;
  batteryId: string;
  batteryName: string;
  level: MaintenanceLevel;
  riskScore: number;
  status: 'open' | 'scheduled' | 'completed' | 'dismissed';
  reason: string;
  recommendedAction: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  predictionSummary: string;
  createdAt: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  description: string;
  generatedAt?: string;
  status: 'available' | 'generating' | 'failed';
}

export type ExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface ExportJob {
  id: string;
  name: string;
  format: ExportFormat;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  createdAt: string;
  downloadUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

export interface NavSection {
  id: string;
  title: string;
  items: NavItem[];
}
