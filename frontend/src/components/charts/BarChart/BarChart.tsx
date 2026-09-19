import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_PALETTE } from '@/constants/chartTheme';
import { ChartContainer, chartAxisStyle, chartGridStyle, chartTooltipStyle } from '../chartUtils';

interface BarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { dataKey: string; name?: string; color?: string }[];
  height?: number;
  layout?: 'horizontal' | 'vertical';
}

export function BarChart({
  data,
  xKey,
  bars,
  height = 280,
  layout = 'horizontal',
}: BarChartProps) {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid {...chartGridStyle} vertical={false} />
          {layout === 'horizontal' ? (
            <>
              <XAxis dataKey={xKey} {...chartAxisStyle} />
              <YAxis {...chartAxisStyle} />
            </>
          ) : (
            <>
              <XAxis type="number" {...chartAxisStyle} />
              <YAxis type="category" dataKey={xKey} {...chartAxisStyle} width={100} />
            </>
          )}
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name ?? bar.dataKey}
              fill={bar.color ?? CHART_PALETTE[i % CHART_PALETTE.length]}
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
