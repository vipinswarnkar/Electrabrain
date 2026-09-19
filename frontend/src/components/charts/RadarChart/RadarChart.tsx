import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/constants/chartTheme';
import { ChartContainer, chartTooltipStyle } from '../chartUtils';

interface RadarChartProps {
  data: Record<string, unknown>[];
  angleKey: string;
  series: { dataKey: string; name?: string; color?: string }[];
  height?: number;
}

export function RadarChart({ data, angleKey, series, height = 280 }: RadarChartProps) {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey={angleKey} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          {series.map((s) => (
            <Radar
              key={s.dataKey}
              name={s.name ?? s.dataKey}
              dataKey={s.dataKey}
              stroke={s.color ?? CHART_COLORS.primary}
              fill={s.color ?? CHART_COLORS.primary}
              fillOpacity={0.2}
              isAnimationActive={false}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
