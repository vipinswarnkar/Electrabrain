import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_PALETTE } from '@/constants/chartTheme';
import { ChartContainer, chartTooltipStyle } from '../chartUtils';

interface DonutChartProps {
  data: { name: string; value: number }[];
  height?: number;
  innerRadius?: number | string;
  outerRadius?: number | string;
}

export function DonutChart({
  data,
  height = 280,
  innerRadius = '55%',
  outerRadius = '80%',
}: DonutChartProps) {
  return (
    <ChartContainer height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            isAnimationActive={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
