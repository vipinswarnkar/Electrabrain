import type { SHAPExplanation } from '@/types';

const makeExplanation = (batteryId: string, target: 'SOC' | 'SOH' | 'RUL'): SHAPExplanation => {
  const featureMap = {
    SOC: [
      { name: 'Voltage', importance: 0.41, value: 0.18 },
      { name: 'Temperature', importance: 0.27, value: -0.09 },
      { name: 'Current', importance: 0.16, value: 0.06 },
      { name: 'Internal Resistance', importance: 0.11, value: -0.04 },
      { name: 'Cycle Count', importance: 0.05, value: 0.02 },
    ],
    SOH: [
      { name: 'Capacity Fade', importance: 0.37, value: 0.21 },
      { name: 'Resistance Growth', importance: 0.24, value: -0.08 },
      { name: 'Temperature', importance: 0.19, value: -0.05 },
      { name: 'Charge Efficiency', importance: 0.12, value: 0.04 },
      { name: 'Cycle Count', importance: 0.08, value: 0.03 },
    ],
    RUL: [
      { name: 'Cycle Age', importance: 0.34, value: 0.12 },
      { name: 'Capacity Trend', importance: 0.23, value: -0.07 },
      { name: 'Thermal Stress', importance: 0.18, value: -0.06 },
      { name: 'Voltage Stability', importance: 0.15, value: 0.05 },
      { name: 'Maintenance Gap', importance: 0.10, value: -0.03 },
    ],
  } satisfies Record<'SOC' | 'SOH' | 'RUL', Array<{ name: string; importance: number; value: number }>>;

  const globalFeatures = featureMap[target].map((feature) => ({
    name: feature.name,
    importance: feature.importance,
    value: feature.value,
  }));

  const localFeatures = [...globalFeatures].sort((a, b) => Math.abs(b.value ?? 0) - Math.abs(a.value ?? 0));

  return {
    batteryId,
    predictionId: `pred-${batteryId}`,
    globalFeatures,
    localFeatures,
    baseValue: 0.18,
    outputValue: 0.62,
    target,
  };
};

export const mockExplainabilityData: Record<string, Record<'SOC' | 'SOH' | 'RUL', SHAPExplanation>> = {
  'battery-001': {
    SOC: makeExplanation('battery-001', 'SOC'),
    SOH: makeExplanation('battery-001', 'SOH'),
    RUL: makeExplanation('battery-001', 'RUL'),
  },
  'battery-002': {
    SOC: makeExplanation('battery-002', 'SOC'),
    SOH: makeExplanation('battery-002', 'SOH'),
    RUL: makeExplanation('battery-002', 'RUL'),
  },
  'battery-003': {
    SOC: makeExplanation('battery-003', 'SOC'),
    SOH: makeExplanation('battery-003', 'SOH'),
    RUL: makeExplanation('battery-003', 'RUL'),
  },
};
