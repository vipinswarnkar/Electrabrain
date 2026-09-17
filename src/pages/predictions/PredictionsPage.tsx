import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { predictionService } from '@/services';
import type { PredictionResponse } from '@/types';
import { formatDate } from '@/utils/formatters';
import styles from './PredictionPage.module.css';

export function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);

  useEffect(() => {
    let active = true;

    predictionService.getPredictions().then((data) => {
      if (active) {
        setPredictions(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const overallSummary = useMemo(() => {
    if (predictions.length === 0) {
      return null;
    }

    const averageSoc = predictions.reduce((sum, item) => sum + item.soc.predictedValue, 0) / predictions.length;
    const averageSoh = predictions.reduce((sum, item) => sum + item.soh.predictedValue, 0) / predictions.length;
    const averageRul = predictions.reduce((sum, item) => sum + item.rul.predictedValue, 0) / predictions.length;

    return { averageSoc, averageSoh, averageRul };
  }, [predictions]);

  return (
    <PageContainer>
      <PageHeader title="Predictions" subtitle="Forecasted SOC, SOH, and RUL for the active fleet." />

      <section className={styles.summaryGrid}>
        <MetricCard label="Avg SOC" value={`${overallSummary?.averageSoc.toFixed(1) ?? '--'}%`} />
        <MetricCard label="Avg SOH" value={`${overallSummary?.averageSoh.toFixed(1) ?? '--'}%`} />
        <MetricCard label="Avg RUL" value={`${overallSummary?.averageRul.toFixed(0) ?? '--'} cycles`} />
      </section>

      <section className={styles.grid}>
        {predictions.map((prediction) => (
          <ChartCard key={prediction.id} title={prediction.batteryName} subtitle={`Model ${prediction.modelVersion}`}>
            <div className={styles.cardBody}>
              <div className={styles.metricsRow}>
                <div className={styles.metricTile}>
                  <span className={styles.label}>SOC</span>
                  <strong>{prediction.soc.currentValue.toFixed(1)}%</strong>
                  <span className={styles.value}>→ {prediction.soc.predictedValue.toFixed(1)}%</span>
                </div>
                <div className={styles.metricTile}>
                  <span className={styles.label}>SOH</span>
                  <strong>{prediction.soh.currentValue.toFixed(1)}%</strong>
                  <span className={styles.value}>→ {prediction.soh.predictedValue.toFixed(1)}%</span>
                </div>
                <div className={styles.metricTile}>
                  <span className={styles.label}>RUL</span>
                  <strong>{prediction.rul.currentValue.toFixed(0)} cyc</strong>
                  <span className={styles.value}>→ {prediction.rul.predictedValue.toFixed(0)} cyc</span>
                </div>
              </div>
              <div className={styles.infoRow}>
                <span>Confidence: {Math.round(prediction.soc.confidence * 100)}% / {Math.round(prediction.soh.confidence * 100)}% / {Math.round(prediction.rul.confidence * 100)}%</span>
                <span>Expected EOL: {formatDate(prediction.expectedEol)}</span>
              </div>
              <div className={styles.footer}>
                <span>Cycle {prediction.currentCycle} · {prediction.remainingCycles} cycles remaining</span>
                <Link to={`/predictions/${prediction.batteryId}`} className={styles.link}>View details</Link>
              </div>
            </div>
          </ChartCard>
        ))}
      </section>
    </PageContainer>
  );
}
