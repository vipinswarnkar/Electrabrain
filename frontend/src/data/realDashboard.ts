import { REAL_BATTERIES } from './realBatteries';
import { REAL_ALERTS } from './realAlerts';
import { REAL_MODEL_COMPARISON } from './realModelComparison';
import { getBatteryAnalytics } from './realAnalytics';
import multiBatteryResults from './multi_battery_results.json';

// Real dashboard summary data, replacing src/mocks/dashboard.ts entirely.
// Everything here is derived from actual AHRF-v1 predictions and real
// NASA B0005/6/7/18 test data -- see ml/extract_multi_battery.py,
// ml/extract_analytics.py, and ml/compare_models.py for how each piece
// was computed.

const PRIMARY_BATTERY_ID = 'B0005'; // the battery the model was trained on

export const KPI_STATS = {
  totalBatteries: REAL_BATTERIES.length,
  averageSoh: Number((REAL_BATTERIES.reduce((sum, b) => sum + b.soh, 0) / REAL_BATTERIES.length).toFixed(1)),
  predictedRulAvg: Math.round(REAL_BATTERIES.reduce((sum, b) => sum + b.rul, 0) / REAL_BATTERIES.length),
  activeAlerts: REAL_ALERTS.length,
};

export const SOH_DISTRIBUTION = [
  { name: 'Excellent (90-100%)', value: REAL_BATTERIES.filter((b) => b.soh >= 90).length },
  { name: 'Good (80-90%)', value: REAL_BATTERIES.filter((b) => b.soh >= 80 && b.soh < 90).length },
  { name: 'Fair (70-80%)', value: REAL_BATTERIES.filter((b) => b.soh >= 70 && b.soh < 80).length },
  { name: 'Poor (<70%)', value: REAL_BATTERIES.filter((b) => b.soh < 70).length },
];

// Real SOH trend for the primary battery, across its real checkpoints
export const SOH_TREND = getBatteryAnalytics(PRIMARY_BATTERY_ID).health.map((h) => ({
  label: `Cycle ${h.cycle}`,
  soh: h.overallHealth,
}));

// Real RUL prediction trend for the primary battery
type CheckpointResult = { cycle: number; SOC: number; SOH: number; RUL: number; status: string };
const primaryPredictions = (multiBatteryResults as Record<string, CheckpointResult[]>)[PRIMARY_BATTERY_ID];
export const RUL_PREDICTION = primaryPredictions.map((c) => ({
  label: `Cycle ${c.cycle}`,
  rul: Math.round(c.RUL),
}));

export const BATTERY_STATUS_ROWS = REAL_BATTERIES.map((b) => ({
  id: b.id,
  soh: b.soh,
  soc: b.soc,
  status: b.status === 'critical' ? 'Critical' : b.status === 'maintenance' ? 'Warning' : 'Healthy',
  rul: b.rul,
  temp: b.temperature,
}));

// Real actual (ground-truth, from measured Capacity) vs predicted (real
// AHRF-v1 model output) SOH for the primary battery. Cycle numbers come
// from two independently-generated checkpoint sets, so they don't align
// perfectly point-for-point -- both are real, genuine trends plotted
// against the same x-axis (cycle number).
const groundTruthSoh = getBatteryAnalytics(PRIMARY_BATTERY_ID).degradation.map((d) => ({
  cycle: d.cycle,
  actual: d.soh,
}));
// Pair each real ground-truth checkpoint with its NEAREST real predicted
// checkpoint (both are genuine real values -- resampled onto a shared
// x-axis so the chart draws a continuous, comparable line for both).
export const DEGRADATION_SERIES = groundTruthSoh.map((g) => {
  const nearest = primaryPredictions.reduce((best, p) =>
    Math.abs(p.cycle - g.cycle) < Math.abs(best.cycle - g.cycle) ? p : best
  );
  return { cycle: g.cycle, actual: g.actual, predicted: Math.round(nearest.SOH * 10) / 10 };
});

// Simple, honestly-derived 0-100 indicators from real latest data for the
// primary battery. Not a rigorous composite health index -- just a
// visualization of real underlying signals on a comparable 0-100 scale.
const latestHealth = getBatteryAnalytics(PRIMARY_BATTERY_ID).health.slice(-1)[0];
const latestCycle = getBatteryAnalytics(PRIMARY_BATTERY_ID).cycles.filter((c) => c.efficiency != null).slice(-1)[0];
export const HEALTH_RADAR = [
  { metric: 'Capacity', value: latestHealth.overallHealth },
  { metric: 'Voltage', value: Math.round((latestHealth.voltage / 4.2) * 100) },
  { metric: 'Charge Efficiency', value: latestCycle?.efficiency ?? 0 },
  { metric: 'Temperature Headroom', value: Math.max(0, Math.round(100 - ((latestHealth.temperature - 25) / 15) * 100)) },
];

export const RECENT_ALERTS = REAL_ALERTS.map((a) => ({
  title: a.title,
  message: a.message,
  time: 'Real-time (from latest checkpoint)',
  batteryId: a.batteryId,
  severity: a.severity === 'critical' ? 'High' : 'Medium',
}));

// Real AHRF-v1 SOH evaluation metrics, same source as Model Comparison page
const ahrfV1 = REAL_MODEL_COMPARISON.find((m) => m.id === 'ahrf_v1');
export const MODEL_PERFORMANCE = {
  mae: ahrfV1?.metrics.SOH.mae ?? 0,
  r2: ahrfV1?.metrics.SOH.r2 ?? 0,
};

export const SYSTEM_OVERVIEW = {
  dataSources: 'NASA B0005 / B0006 / B0007 / B0018',
  lastSync: 'Static dataset (not live)',
  modelsDeployed: 3, // AHRF-v1, AHRF-v2, Random Forest
  uptime: 'N/A (local demo)',
};
