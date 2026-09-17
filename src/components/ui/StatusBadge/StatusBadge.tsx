import type { BatteryStatus } from '@/types';
import { cn } from '@/utils/cn';
import styles from './StatusBadge.module.css';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  status?: BatteryStatus;
  showDot?: boolean;
  className?: string;
}

const STATUS_VARIANT: Record<BatteryStatus, BadgeVariant> = {
  online: 'success',
  offline: 'default',
  charging: 'info',
  discharging: 'warning',
  maintenance: 'primary',
  critical: 'danger',
};

export function StatusBadge({
  label,
  variant = 'default',
  status,
  showDot = true,
  className,
}: StatusBadgeProps) {
  const resolvedVariant = status ? STATUS_VARIANT[status] : variant;

  return (
    <span className={cn(styles.badge, styles[resolvedVariant], className)}>
      {showDot && <span className={styles.dot} />}
      {label}
    </span>
  );
}
