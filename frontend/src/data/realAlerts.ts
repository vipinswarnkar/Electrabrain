import type { Alert } from '@/types';
import multiBatteryResults from './multi_battery_results.json';

// Real alerts: generated from the actual AHRF-v1 model's WARNING/CRITICAL
// status calls on real NASA batteries (see ml/extract_multi_battery.py).
// Not scripted/fictional events -- each alert reflects a real point where
// the model's decision_engine/rules.py flagged that battery's real
// predicted SOH/RUL as degraded.

interface CheckpointResult {
  cycle: number;
  SOC: number;
  SOH: number;
  RUL: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  recommendation: string;
}

const RESULTS = multiBatteryResults as Record<string, CheckpointResult[]>;

const BATTERY_NAMES: Record<string, string> = {
  B0005: 'NASA Pack B0005',
  B0006: 'NASA Pack B0006',
  B0007: 'NASA Pack B0007',
  B0018: 'NASA Pack B0018',
};

function buildAlerts(): Alert[] {
  const alerts: Alert[] = [];

  for (const [batteryId, checkpoints] of Object.entries(RESULTS)) {
    // Only the LATEST checkpoint per battery becomes an active alert --
    // earlier WARNING/CRITICAL points are the battery's history, not
    // separate current alerts.
    const latest = checkpoints[checkpoints.length - 1];
    if (latest.status === 'HEALTHY') continue;

    alerts.push({
      id: `alert-${batteryId}`,
      batteryId,
      batteryName: BATTERY_NAMES[batteryId] ?? batteryId,
      title: latest.status === 'CRITICAL'
        ? 'Critical battery health predicted'
        : 'Battery health warning',
      message: latest.recommendation,
      severity: latest.status === 'CRITICAL' ? 'critical' : 'warning',
      status: 'active',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    });
  }

  return alerts;
}

export const REAL_ALERTS: Alert[] = buildAlerts();
