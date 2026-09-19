import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/constants/chartTheme';
import { ChartContainer, chartAxisStyle, chartGridStyle, chartTooltipStyle } from '../chartUtils';

export interface LineChartSeries {
  dataKey: string;
  name?: string;
  color?: string;
  strokeDasharray?: string;
}

interface LineChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  series: LineChartSeries[];
  height?: number;
  yUnit?: string;
}

export function LineChart({ data, xKey, series, height = 280, yUnit }: LineChartProps) {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid {...chartGridStyle} vertical={false} />
          <XAxis dataKey={xKey} {...chartAxisStyle} />
          <YAxis {...chartAxisStyle} unit={yUnit} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.dataKey}
              type="monotone"
              dataKey={s.dataKey}
              name={s.name ?? s.dataKey}
              stroke={s.color ?? CHART_COLORS.primary}
              strokeWidth={2}
              dot={false}
              strokeDasharray={s.strokeDasharray}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
