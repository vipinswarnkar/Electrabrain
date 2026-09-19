import type { ReactNode } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './StatCard.module.css';

type IconColor = 'lavender' | 'blue' | 'green' | 'yellow' | 'red';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  iconColor?: IconColor;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  iconColor = 'lavender',
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  const trendDirection = trend === undefined ? 'neutral' : trend > 0 ? 'up' : trend < 0 ? 'down' : 'neutral';

  return (
    <article className={cn(styles.card, className)}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <div className={cn(styles.iconWrapper, styles[iconColor])}>{icon}</div>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      {(trend !== undefined || trendLabel) && (
        <div className={styles.footer}>
          {trend !== undefined && (
            <span
              className={
                trendDirection === 'up'
                  ? styles.trendUp
                  : trendDirection === 'down'
                    ? styles.trendDown
                    : styles.trendNeutral
              }
            >
              {trendDirection === 'up' && <TrendingUp size={14} />}
              {trendDirection === 'down' && <TrendingDown size={14} />}
              {trendDirection === 'neutral' && <Minus size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className={styles.trendLabel}>{trendLabel}</span>}
        </div>
      )}
    </article>
  );
}
