import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { optimizationService } from '@/services';
import type { OptimizationResult } from '@/types';
import styles from './OptimizationPage.module.css';

export function OptimizationPage() {
  const [result, setResult] = useState<OptimizationResult | null>(null);

  useEffect(() => {
    let active = true;

    optimizationService.getOptimizationResult().then((data) => {
      if (active) {
        setResult(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const historyData = useMemo(() => {
    return (result?.trials ?? []).map((trial) => ({
      label: `Trial ${trial.trialNumber}`,
      value: trial.value,
    }));
  }, [result]);

  const parameterImportance = useMemo(() => {
    return (result?.parameterImportance ?? []).map((item) => ({
      label: item.name,
      value: item.importance,
    }));
  }, [result]);

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="Hyperparameter Optimization"
        subtitle="Optuna-style optimization workflow shown with demonstration data"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'Optimization' }]}
      />

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Optimization Status</p>
          <h2 className={styles.heroTitle}>Demo Optuna run for the AHRF model</h2>
          <p className={styles.heroText}>
            This page visualizes a mock Optuna optimization process. All values are demonstration data and are not intended to represent a
            real experimental result.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Status" value={result?.status ?? 'loading'} />
          <MetricCard label="Trials" value={String(result?.trialCount ?? 0)} />
          <MetricCard label="Best Trial" value={String(result?.bestTrial ?? 0)} />
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Optimization History" subtitle="Trial performance trend over the mock run">
          <div className={styles.chartArea}>
            {historyData.map((point) => (
              <div key={point.label} className={styles.historyRow}>
                <span>{point.label}</span>
                <div className={styles.historyTrack}>
                  <div className={styles.historyFill} style={{ width: `${Math.max(6, point.value * 120)}%` }} />
                </div>
                <strong>{point.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Hyperparameter Importance" subtitle="Relative importance of each tuned parameter">
          <div className={styles.chartArea}>
            {parameterImportance.map((item) => (
              <div key={item.label} className={styles.historyRow}>
                <span>{item.label}</span>
                <div className={styles.historyTrack}>
                  <div className={styles.historyFill} style={{ width: `${item.value * 100}%` }} />
                </div>
                <strong>{item.value.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Best Score" subtitle="Best objective score found in the demo run">
          <div className={styles.scoreBox}>
            <span className={styles.scoreValue}>{result?.bestValue.toFixed(3) ?? '0.000'}</span>
            <span className={styles.scoreMetric}>{result?.metric ?? 'RMSE'}</span>
          </div>
        </ChartCard>

        <ChartCard title="Best Parameters" subtitle="Best hyperparameter values from the mock Optuna run">
          <div className={styles.paramGrid}>
            {result?.bestParams && Object.entries(result.bestParams).map(([name, value]) => (
              <div key={name} className={styles.paramCard}>
                <span>{name}</span>
                <strong>{String(value)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
