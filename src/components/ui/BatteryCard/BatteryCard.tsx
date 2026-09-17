import { Link } from 'react-router-dom';
import type { Battery } from '@/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPercent } from '@/utils/formatters';
import styles from './BatteryCard.module.css';

interface BatteryCardProps {
  battery: Battery;
}

export function BatteryCard({ battery }: BatteryCardProps) {
  return (
    <Link to={`/batteries/${battery.id}`} className={styles.card}>
      <div className={styles.header}>
        <div className={styles.info}>
          <div className={styles.name}>{battery.name}</div>
          <div className={styles.serial}>{battery.serialNumber}</div>
        </div>
        <StatusBadge label={battery.status} status={battery.status} />
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>SOC</span>
          <span className={styles.metricValue}>{formatPercent(battery.soc)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>SOH</span>
          <span className={styles.metricValue}>{formatPercent(battery.soh)}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>RUL</span>
          <span className={styles.metricValue}>{battery.rul} cyc</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span>{battery.model}</span>
        <span>{battery.cycleCount} cycles</span>
      </div>
    </Link>
  );
}
