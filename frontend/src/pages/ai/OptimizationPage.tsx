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

  const minValue = useMemo(() => Math.min(...historyData.map((d) => d.value)), [historyData]);
  const maxValue = useMemo(() => Math.max(...historyData.map((d) => d.value)), [historyData]);

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
        subtitle="Real Optuna hyperparameter search results for the AHRF model (target: SOH)"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'Optimization' }]}
      />

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Optimization Status</p>
          <h2 className={styles.heroTitle}>Real Optuna run for the AHRF model</h2>
          <p className={styles.heroText}>
            This page shows a real Optuna hyperparameter search: 25 real trials, each training and
            cross-validating the actual AHRF model on real B0005 cycle data, using chronological
            (TimeSeriesSplit) validation to avoid leaking future cycles into training.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Status" value={result?.status ?? 'loading'} />
          <MetricCard label="Trials" value={String(result?.trialCount ?? 0)} />
          <MetricCard label="Best Trial" value={String(result?.bestTrial ?? 0)} />
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Optimization History" subtitle="Real MAE per trial -- lower is better">
          <div className={styles.chartArea}>
            {historyData.map((point) => (
              <div key={point.label} className={styles.historyRow}>
                <span>{point.label}</span>
                <div className={styles.historyTrack}>
                  <div className={styles.historyFill} style={{ width: `${Math.max(6, 100 - ((point.value - minValue) / (maxValue - minValue || 1)) * 100)}%` }} />
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
        <ChartCard title="Best Score" subtitle="Real best cross-validated score found">
          <div className={styles.scoreBox}>
            <span className={styles.scoreValue}>{result?.bestValue.toFixed(3) ?? '0.000'}</span>
            <span className={styles.scoreMetric}>{result?.metric ?? 'RMSE'}</span>
          </div>
        </ChartCard>

        <ChartCard title="Best Parameters" subtitle="Real best hyperparameter combination found">
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
