import type { PredictionResult } from '@/types';
import { formatDateTime, formatPercent } from '@/utils/formatters';
import styles from './PredictionCard.module.css';

interface PredictionCardProps {
  prediction: PredictionResult;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h3 className={styles.title}>Battery {prediction.batteryId}</h3>
        <span className={styles.badge}>AHRF v{prediction.modelVersion}</span>
      </header>

      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>SOC</span>
          <span className={styles.value}>{formatPercent(prediction.soc.value)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>SOH</span>
          <span className={styles.value}>{formatPercent(prediction.soh.value)}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>RUL</span>
          <span className={styles.value}>{prediction.rul.value} {prediction.rul.unit}</span>
        </div>
      </div>

      <div className={styles.confidence}>
        Confidence: SOC {formatPercent(prediction.soc.confidence, 0)} · SOH{' '}
        {formatPercent(prediction.soh.confidence, 0)} · RUL{' '}
        {formatPercent(prediction.rul.confidence, 0)}
        <span className={styles.mockLabel}>Mock</span>
      </div>
      <div className={styles.confidence} style={{ marginTop: '0.5rem', paddingTop: 0, border: 'none' }}>
        Generated {formatDateTime(prediction.generatedAt)}
      </div>
    </article>
  );
}
