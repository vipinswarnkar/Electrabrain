import analyticsResults from './analytics_results.json';

// Real per-battery health/degradation/cycle-detail data, computed from
// real NASA B0005/6/7/18 discharge, charge, and impedance test data.
// See ml/extract_analytics.py. Replaces analyticsData.mock.ts.

export interface HealthPoint {
  cycle: number;
  capacity: number;
  capacityRetention: number;
  capacityFade: number;
  internalResistance: number | null;
  re: number | null;
  rct: number | null;
  temperature: number;
  voltage: number;
  overallHealth: number;
}

export interface DegradationPoint {
  cycle: number;
  soh: number;
  capacity: number;
  resistance: number | null;
  temperature: number;
  voltage: number;
  degradationRate: number;
}

export interface CyclePoint {
  cycleNumber: number;
  capacity: number;
  voltage: number;
  current: number;
  temperature: number;
  energy: number;
  efficiency: number | null;
  cycleDuration: number;
}

interface BatteryAnalytics {
  health: HealthPoint[];
  degradation: DegradationPoint[];
  cycles: CyclePoint[];
}

const RESULTS = analyticsResults as Record<string, BatteryAnalytics>;

export const AVAILABLE_BATTERY_IDS = Object.keys(RESULTS);

export function getBatteryAnalytics(batteryId: string): BatteryAnalytics {
  return RESULTS[batteryId] ?? RESULTS[AVAILABLE_BATTERY_IDS[0]];
}
