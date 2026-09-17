import type { Alert } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDateTime } from '@/utils/formatters';
import styles from './AlertCard.module.css';

interface AlertCardProps {
  alert: Alert;
}

export function AlertCard({ alert }: AlertCardProps) {
  return (
    <article className={`${styles.card} ${styles[alert.severity]}`}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{alert.title}</h4>
          <StatusBadge
            label={alert.severity}
            variant={alert.severity === 'critical' ? 'danger' : alert.severity}
          />
        </div>
        <p className={styles.message}>{alert.message}</p>
        <div className={styles.meta}>
          {alert.batteryName} · {formatDateTime(alert.timestamp)}
        </div>
      </div>
    </article>
  );
}
