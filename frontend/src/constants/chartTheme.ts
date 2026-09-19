export const CHART_COLORS = {
  primary: '#7c6cf0',
  secondary: '#93c5fd',
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
  lavender: '#c4b5fd',
  teal: '#5eead4',
  gray: '#9ca3af',
} as const;

export const CHART_PALETTE = [
  CHART_COLORS.primary,
  CHART_COLORS.info,
  CHART_COLORS.success,
  CHART_COLORS.warning,
  CHART_COLORS.lavender,
  CHART_COLORS.teal,
  CHART_COLORS.secondary,
  CHART_COLORS.danger,
];

export const CHART_DEFAULTS = {
  gridStroke: '#e5e7eb',
  axisStroke: '#9ca3af',
  tooltipBg: '#ffffff',
  tooltipBorder: '#e5e7eb',
  fontSize: 12,
  fontFamily: "'Inter', sans-serif",
};
