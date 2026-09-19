import { cn } from '@/utils/cn';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  highlight?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtext,
  highlight,
  className,
}: MetricCardProps) {
  return (
    <div className={cn(styles.card, highlight && styles.highlight, className)}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {subtext && <span className={styles.subtext}>{subtext}</span>}
    </div>
  );
}
