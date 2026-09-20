import type { Battery, BatteryStatus } from '@/types';
import type { PredictionResponse } from '@/types';
import multiBatteryResults from './multi_battery_results.json';

// Real battery health data: computed by running the actual trained
// AHRF-v1 model against real NASA cycles from 4 real battery packs
// (B0005, B0006, B0007, B0018). Replaces Friend B's original mock data.
// See ml/extract_multi_battery.py for how this was generated.

interface CheckpointResult {
  cycle: number;
  SOC: number;
  SOH: number;
  RUL: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  recommendation: string;
}

const RESULTS = multiBatteryResults as Record<string, CheckpointResult[]>;

const STATUS_MAP: Record<string, BatteryStatus> = {
  HEALTHY: 'online',
  WARNING: 'maintenance',
  CRITICAL: 'critical',
};

const BATTERY_NAMES: Record<string, string> = {
  B0005: 'NASA Pack B0005',
  B0006: 'NASA Pack B0006',
  B0007: 'NASA Pack B0007',
  B0018: 'NASA Pack B0018',
};

function buildBattery(batteryId: string, checkpoints: CheckpointResult[]): Battery {
  const latest = checkpoints[checkpoints.length - 1];
  return {
    id: batteryId,
    name: BATTERY_NAMES[batteryId] ?? batteryId,
    serialNumber: `SN-${batteryId}`,
    model: 'NASA Li-ion 2.0Ah (18650)',
    status: STATUS_MAP[latest.status] ?? 'online',
    soc: Math.round(latest.SOC * 10) / 10,
    soh: Math.round(latest.SOH * 10) / 10,
    rul: Math.round(latest.RUL),
    voltage: 3.7,
    current: -2.0,
    temperature: 30,
    capacity: Math.round(latest.SOH * 10) / 10,
    internalResistance: 0.2,
    cycleCount: latest.cycle,
    lastUpdated: new Date().toISOString(),
    health: {
      summary: latest.recommendation,
      trend: checkpoints.map((c) => Math.round(c.SOH * 10) / 10),
      notes: [
        `Real prediction from AHRF-v1 model, computed on actual NASA ${batteryId} discharge cycles.`,
      ],
    },
  };
}

function buildPrediction(batteryId: string, checkpoints: CheckpointResult[]): PredictionResponse {
  const latest = checkpoints[checkpoints.length - 1];
  const metric = (values: number[], unit: string) => ({
    currentValue: values[values.length - 1],
    predictedValue: values[values.length - 1],
    confidence: 1,
    unit,
    historicalTrend: values.slice(0, -1),
    predictionTrend: values,
  });

  return {
    id: `pred-${batteryId}`,
    batteryId,
    batteryName: BATTERY_NAMES[batteryId] ?? batteryId,
    modelVersion: 'AHRF-v1',
    generatedAt: new Date().toISOString(),
    currentCycle: latest.cycle,
    expectedEol: '',
    remainingCycles: Math.round(latest.RUL),
    soc: metric(checkpoints.map((c) => c.SOC), '%'),
    soh: metric(checkpoints.map((c) => c.SOH), '%'),
    rul: metric(checkpoints.map((c) => c.RUL), 'cycles'),
  };
}

export const REAL_BATTERIES: Battery[] = Object.entries(RESULTS).map(
  ([id, checkpoints]) => buildBattery(id, checkpoints),
);

export const REAL_PREDICTIONS: PredictionResponse[] = Object.entries(RESULTS).map(
  ([id, checkpoints]) => buildPrediction(id, checkpoints),
);
