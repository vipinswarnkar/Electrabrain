import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { CHART_PALETTE } from '@/constants/chartTheme';
import { ChartContainer, chartAxisStyle, chartGridStyle, chartTooltipStyle } from '../chartUtils';

interface ScatterSeries {
  name: string;
  data: { x: number; y: number; z?: number }[];
  color?: string;
}

interface ScatterChartProps {
  series: ScatterSeries[];
  xLabel?: string;
  yLabel?: string;
  height?: number;
}

export function ScatterChart({ series, height = 280 }: ScatterChartProps) {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid {...chartGridStyle} />
          <XAxis type="number" dataKey="x" name="x" {...chartAxisStyle} />
          <YAxis type="number" dataKey="y" name="y" {...chartAxisStyle} />
          <ZAxis type="number" dataKey="z" range={[40, 200]} />
          <Tooltip contentStyle={chartTooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          {series.map((s, i) => (
            <Scatter
              key={s.name}
              name={s.name}
              data={s.data}
              fill={s.color ?? CHART_PALETTE[i % CHART_PALETTE.length]}
              isAnimationActive={false}
            />
          ))}
        </RechartsScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
