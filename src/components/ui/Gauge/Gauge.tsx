import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/constants/chartTheme';
import styles from './Gauge.module.css';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  color?: string;
  height?: number;
}

export function Gauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = '%',
  color = CHART_COLORS.primary,
  height = 160,
}: GaugeProps) {
  const normalized = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const data = [{ name: label ?? 'Value', value: normalized, fill: color }];

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={height}>
        <RadialBarChart
          cx="50%"
          cy="70%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={14}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: '#e5e7eb' }} dataKey="value" cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.value}>
        {value}
        {unit}
      </span>
    </div>
  );
}
