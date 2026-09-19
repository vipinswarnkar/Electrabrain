import { cn } from '@/utils/cn';
import styles from './ProgressRing.module.css';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  label,
  color = 'primary',
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference - percent * circumference;

  return (
    <div className={cn(styles.container, className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={styles.svg}>
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={cn(styles.progress, styles[color])}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.label}>
        <span className={styles.value}>{value.toFixed(0)}%</span>
        {label && <span className={styles.subLabel}>{label}</span>}
      </div>
    </div>
  );
}
