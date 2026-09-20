import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { modelService } from '@/services';
import { REAL_MODEL_COMPARISON } from '@/data/realModelComparison';
import type { ComparisonTarget } from '@/services/mocks/modelComparison.mock';
import styles from './ModelComparisonPage.module.css';

type MetricKey = 'rmse' | 'mae' | 'r2';

const TARGET_LABELS: Record<ComparisonTarget, string> = {
  SOC: 'State of Charge',
  SOH: 'State of Health',
  RUL: 'Remaining Useful Life',
};

export function ModelComparisonPage() {
  const [selectedTarget, setSelectedTarget] = useState<ComparisonTarget>('SOH');

  useEffect(() => {
    let active = true;

    modelService.getModelMetrics().then(() => {
      if (active) {
        // Mock service already provides the model comparison dataset used by the page.
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const comparisonRows = useMemo(() => {
    return REAL_MODEL_COMPARISON.map((row) => ({
      ...row,
      metrics: row.metrics[selectedTarget],
    }));
  }, [selectedTarget]);

  const bestModel = useMemo(() => {
    return [...comparisonRows].sort((a, b) => {
      if (a.metrics.r2 === b.metrics.r2) {
        return a.metrics.rmse - b.metrics.rmse;
      }
      return b.metrics.r2 - a.metrics.r2;
    })[0];
  }, [comparisonRows]);

  const metricSeries = (metric: MetricKey) =>
    comparisonRows.map((row) => ({
      label: row.name,
      value: row.metrics[metric],
    }));

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="Model Comparison"
        subtitle="Demo metrics comparison for candidate regression models"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'Model Comparison' }]}
      />

      <section className={styles.controlsCard}>
        <div className={styles.controlGroup}>
          <label htmlFor="target">Target</label>
          <select id="target" value={selectedTarget} onChange={(event) => setSelectedTarget(event.target.value as ComparisonTarget)}>
            <option value="SOC">SOC</option>
            <option value="SOH">SOH</option>
            <option value="RUL">RUL</option>
          </select>
        </div>
        <div className={styles.demoNote}>Demo data only — not a verified benchmark.</div>
      </section>

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Best Model Summary</p>
          <h2 className={styles.heroTitle}>Current demo ranking for {TARGET_LABELS[selectedTarget]}</h2>
          <p className={styles.heroText}>
            The ranking below is based on the supplied mock experiment data and is shown as a demonstration view rather than a claim of
            real-world superiority.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Selected target" value={TARGET_LABELS[selectedTarget]} />
          <MetricCard label="Top model" value={bestModel?.name ?? '—'} />
          <MetricCard label="R²" value={bestModel ? bestModel.metrics.r2.toFixed(2) : '—'} />
        </div>
      </section>

      <section className={styles.tableCard}>
        <ChartCard title="Comparison Table" subtitle="Mock metrics by model and target">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>RMSE</th>
                  <th>MAE</th>
                  <th>R²</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td>{row.metrics.rmse.toFixed(3)}</td>
                    <td>{row.metrics.mae.toFixed(3)}</td>
                    <td>{row.metrics.r2.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="RMSE Bar Chart" subtitle="Lower is better">
          <div className={styles.barList}>
            {metricSeries('rmse').map((item) => (
              <div key={item.label} className={styles.barRow}>
                <span>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${Math.min(100, item.value * 140)}%` }} />
                </div>
                <strong>{item.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="MAE Bar Chart" subtitle="Lower is better">
          <div className={styles.barList}>
            {metricSeries('mae').map((item) => (
              <div key={item.label} className={styles.barRow}>
                <span>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${Math.min(100, item.value * 140)}%` }} />
                </div>
                <strong>{item.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="R² Bar Chart" subtitle="Higher is better">
          <div className={styles.barList}>
            {metricSeries('r2').map((item) => (
              <div key={item.label} className={styles.barRow}>
                <span>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${Math.min(100, item.value * 110)}%` }} />
                </div>
                <strong>{item.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
