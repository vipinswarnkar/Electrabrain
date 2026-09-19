import type { CSSProperties, ReactNode } from 'react';
import { CHART_DEFAULTS } from '@/constants/chartTheme';

export const chartTooltipStyle: CSSProperties = {
  backgroundColor: CHART_DEFAULTS.tooltipBg,
  border: `1px solid ${CHART_DEFAULTS.tooltipBorder}`,
  borderRadius: '8px',
  fontSize: CHART_DEFAULTS.fontSize,
  fontFamily: CHART_DEFAULTS.fontFamily,
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
};

export const chartAxisStyle = {
  tick: { fill: CHART_DEFAULTS.axisStroke, fontSize: CHART_DEFAULTS.fontSize },
  axisLine: { stroke: CHART_DEFAULTS.gridStroke },
  tickLine: false,
};

export const chartGridStyle = {
  strokeDasharray: '3 3',
  stroke: CHART_DEFAULTS.gridStroke,
};

interface ChartContainerProps {
  children: ReactNode;
  height?: number;
}

export function ChartContainer({ children, height = 280 }: ChartContainerProps) {
  return <div style={{ width: '100%', height }}>{children}</div>;
}
