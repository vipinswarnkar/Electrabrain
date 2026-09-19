import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { predictionService } from '@/services';
import type { PredictionResponse } from '@/types';
import { formatDate } from '@/utils/formatters';
import styles from './PredictionPage.module.css';

export function PredictionDetailPage() {
  const { batteryId } = useParams();
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    if (!batteryId) return;

    let active = true;

    predictionService.getPrediction(batteryId).then((data) => {
      if (active) {
        setPrediction(data);
      }
    });

    return () => {
      active = false;
    };
  }, [batteryId]);

  if (!prediction) {
    return (
      <PageContainer>
        <PageHeader title="Prediction Details" subtitle="Loading prediction context..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={prediction.batteryName}
        subtitle={`${prediction.batteryId} · ${prediction.modelVersion}`}
        breadcrumbs={[{ label: 'Predictions', path: '/predictions' }, { label: prediction.batteryName }]}
      />

      <section className={styles.summaryGrid}>
        <MetricCard label="Current cycle" value={prediction.currentCycle} />
        <MetricCard label="Expected EOL" value={formatDate(prediction.expectedEol)} />
        <MetricCard label="Remaining cycles" value={prediction.remainingCycles} />
      </section>

      <section className={styles.grid}>
        <ChartCard title="SOC" subtitle="Current vs predicted state of charge">
          <div className={styles.metricStack}>
            <div className={styles.metricLine}><span>Current</span><strong>{prediction.soc.currentValue.toFixed(1)}%</strong></div>
            <div className={styles.metricLine}><span>Predicted</span><strong>{prediction.soc.predictedValue.toFixed(1)}%</strong></div>
            <div className={styles.metricLine}><span>Confidence</span><strong>{Math.round(prediction.soc.confidence * 100)}%</strong></div>
          </div>
          <LineChart data={prediction.soc.historicalTrend.map((value, index) => ({ step: index + 1, value }))} xKey="step" series={[{ dataKey: 'value', name: 'Historical', color: '#4f46e5' }]} height={200} />
        </ChartCard>

        <ChartCard title="SOH" subtitle="Current vs predicted state of health">
          <div className={styles.metricStack}>
            <div className={styles.metricLine}><span>Current</span><strong>{prediction.soh.currentValue.toFixed(1)}%</strong></div>
            <div className={styles.metricLine}><span>Predicted</span><strong>{prediction.soh.predictedValue.toFixed(1)}%</strong></div>
            <div className={styles.metricLine}><span>Confidence</span><strong>{Math.round(prediction.soh.confidence * 100)}%</strong></div>
          </div>
          <LineChart data={prediction.soh.predictionTrend.map((value, index) => ({ step: index + 1, value }))} xKey="step" series={[{ dataKey: 'value', name: 'Prediction trend', color: '#0f766e' }]} height={200} />
        </ChartCard>

        <ChartCard title="RUL" subtitle="Remaining useful life forecast">
          <div className={styles.metricStack}>
            <div className={styles.metricLine}><span>Current</span><strong>{prediction.rul.currentValue.toFixed(0)} cycles</strong></div>
            <div className={styles.metricLine}><span>Predicted</span><strong>{prediction.rul.predictedValue.toFixed(0)} cycles</strong></div>
            <div className={styles.metricLine}><span>Confidence</span><strong>{Math.round(prediction.rul.confidence * 100)}%</strong></div>
          </div>
          <LineChart data={prediction.rul.historicalTrend.map((value, index) => ({ step: index + 1, value }))} xKey="step" series={[{ dataKey: 'value', name: 'Historical', color: '#7c3aed' }]} height={200} />
        </ChartCard>
      </section>
    </PageContainer>
  );
}
