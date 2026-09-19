import { cn } from '@/utils/cn';
import styles from './HealthBadge.module.css';

type HealthLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

interface HealthBadgeProps {
  soh: number;
  className?: string;
}

function getHealthLevel(soh: number): HealthLevel {
  if (soh >= 90) return 'excellent';
  if (soh >= 80) return 'good';
  if (soh >= 70) return 'fair';
  if (soh >= 60) return 'poor';
  return 'critical';
}

const LABELS: Record<HealthLevel, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
  critical: 'Critical',
};

export function HealthBadge({ soh, className }: HealthBadgeProps) {
  const level = getHealthLevel(soh);

  return (
    <span className={cn(styles.badge, styles[level], className)}>
      {LABELS[level]} · {soh.toFixed(1)}%
    </span>
  );
}
