import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/constants/chartTheme';
import { ChartContainer, chartAxisStyle, chartGridStyle, chartTooltipStyle } from '../chartUtils';

export interface AreaChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
}

interface AreaChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: AreaChartSeries[];
  height?: number;
  stacked?: boolean;
}

export function AreaChart({ data, xKey, series, height = 280, stacked }: AreaChartProps) {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid {...chartGridStyle} vertical={false} />
          <XAxis dataKey={xKey} {...chartAxisStyle} />
          <YAxis {...chartAxisStyle} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          {series.map((s) => (
            <Area
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={s.color ?? CHART_COLORS.primary}
              fill={s.color ?? CHART_COLORS.primary}
              fillOpacity={0.15}
              strokeWidth={2}
              stackId={stacked ? 'stack' : undefined}
              isAnimationActive={false}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
