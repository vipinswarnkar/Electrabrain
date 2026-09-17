// Deterministic mock data for dashboard
export const KPI_STATS = {
  totalBatteries: 24,
  online: 24,
  offline: 0,
  averageSoh: 87.6,
  sohChangePct: 2.4,
  predictedRulAvg: 612,
  predictedRulChange: -38,
  totalCycles: 1842,
  cyclesChange: 124,
  activeAlerts: 3,
};

export const SOH_DISTRIBUTION = [
  { name: 'Excellent (90-100%)', value: 9 },
  { name: 'Good (80-90%)', value: 8 },
  { name: 'Fair (70-80%)', value: 5 },
  { name: 'Poor (<70%)', value: 2 },
];

export const SOH_TREND = [
  { label: 'May 29', soh: 89 },
  { label: 'May 31', soh: 88.2 },
  { label: 'Jun 2', soh: 87.6 },
  { label: 'Jun 4', soh: 87.1 },
  { label: 'Jun 5', soh: 86.9 },
];

export const RUL_PREDICTION = [
  { label: "May '24", rul: 1100 },
  { label: "Jun '24", rul: 900 },
  { label: "Jul '24", rul: 700 },
  { label: "Aug '24", rul: 420 },
  { label: "Sep '24", rul: 120 },
];

export const BATTERY_STATUS_ROWS = [
  { id: 'B0005', soh: 92.1, soc: 78, status: 'Healthy', rul: 820, temp: 28.4 },
  { id: 'B0006', soh: 88.3, soc: 62, status: 'Healthy', rul: 620, temp: 27.1 },
  { id: 'B0007', soh: 85.7, soc: 53, status: 'Warning', rul: 512, temp: 29.3 },
  { id: 'B0018', soh: 71.2, soc: 40, status: 'Critical', rul: 132, temp: 31.8 },
  { id: 'B0021', soh: 90.4, soc: 67, status: 'Healthy', rul: 732, temp: 26.7 },
];

export const DEGRADATION_SERIES = Array.from({ length: 220 }).map((_, i) => {
  const cycle = i;
  const actual = 95 - i * 0.15 + (i % 7 === 0 ? -0.3 : 0);
  const predicted = 85 - i * 0.18;
  return { cycle, actual: Math.max(30, actual), predicted: Math.max(20, predicted) };
});

export const HEALTH_RADAR = [
  { metric: 'Capacity', value: 87 },
  { metric: 'Voltage', value: 91 },
  { metric: 'Internal Resistance', value: 73 },
  { metric: 'Temperature Stability', value: 89 },
  { metric: 'Charge Efficiency', value: 85 },
];

export const RECENT_ALERTS = [
  { title: 'High Temperature Alert', message: 'Battery B0018 temperature is above threshold (31.8°C)', time: '2m ago', batteryId: 'B0018', severity: 'High' },
  { title: 'Rapid Degradation Detected', message: 'Battery B0007 showing faster degradation than normal', time: '1h ago', batteryId: 'B0007', severity: 'Medium' },
  { title: 'Calibration Reminder', message: 'Battery B0006 calibration recommended', time: '5h ago', batteryId: 'B0006', severity: 'Low' },
];

export const MODEL_PERFORMANCE = {
  mae: 2.31,
  maeDelta: -0.41,
  r2: 0.942,
  r2Delta: 0.012,
};

export const SYSTEM_OVERVIEW = {
  dataSources: 3,
  lastSync: '2 min ago',
  modelsDeployed: 4,
  uptime: '99.8%',
};

export default {};
