import { useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { getComparisonRows, getComparisonNote } from '@/data/modelComparisonV2';
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

  const comparisonRows = useMemo(() => getComparisonRows(selectedTarget), [selectedTarget]);
  const note = useMemo(() => getComparisonNote(selectedTarget), [selectedTarget]);

  const bestModel = useMemo(() => {
    return [...comparisonRows].sort((a, b) => {
      if (a.metrics.r2 === b.metrics.r2) {
        return a.metrics.rmse - b.metrics.rmse;
      }
      return b.metrics.r2 - a.metrics.r2;
    })[0];
  }, [comparisonRows]);

  // Bar width scaled RELATIVE to the max value in this series -- not a
  // fixed multiplier, since real RMSE/MAE/R2 values span very different
  // ranges depending on target. Negative values (possible for R2) are
  // clamped to a thin visible sliver rather than a negative width.
  const metricSeries = (metric: MetricKey, higherIsBetter: boolean) => {
    const values = comparisonRows.map((row) => row.metrics[metric]);
    const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 0.0001);
    return comparisonRows.map((row) => {
      const value = row.metrics[metric];
      const widthPct = value < 0 ? 4 : Math.max(4, (Math.abs(value) / maxAbs) * 100);
      return { label: row.name, value, widthPct };
    }).sort((a, b) => (higherIsBetter ? b.value - a.value : a.value - b.value));
  };

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="Model Comparison"
        subtitle="Real metrics comparing candidate regression models against the production AHRF model"
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
        <div className={styles.demoNote}>{note}</div>
      </section>

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Best Model Summary</p>
          <h2 className={styles.heroTitle}>Real ranking for {TARGET_LABELS[selectedTarget]}</h2>
          <p className={styles.heroText}>
            Ranked by real cross-validated/held-out performance -- not a demonstration or illustrative ordering.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Selected target" value={TARGET_LABELS[selectedTarget]} />
          <MetricCard label="Top model" value={bestModel?.name ?? '—'} />
          <MetricCard label="R²" value={bestModel ? bestModel.metrics.r2.toFixed(2) : '—'} />
        </div>
      </section>

      <section className={styles.tableCard}>
        <ChartCard title="Comparison Table" subtitle={`Real metrics for ${comparisonRows.length} models on ${TARGET_LABELS[selectedTarget]}`}>
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
        <ChartCard title="RMSE Bar Chart" subtitle="Lower is better -- bars scaled relative to the worst model in this set">
          <div className={styles.barList}>
            {metricSeries('rmse', false).map((item) => (
              <div key={item.label} className={styles.barRow}>
                <span>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.widthPct}%` }} />
                </div>
                <strong>{item.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="MAE Bar Chart" subtitle="Lower is better -- bars scaled relative to the worst model in this set">
          <div className={styles.barList}>
            {metricSeries('mae', false).map((item) => (
              <div key={item.label} className={styles.barRow}>
                <span>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.widthPct}%` }} />
                </div>
                <strong>{item.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="R² Bar Chart" subtitle="Higher is better -- negative values shown as a thin bar with the real (negative) number">
          <div className={styles.barList}>
            {metricSeries('r2', true).map((item) => (
              <div key={item.label} className={styles.barRow}>
                <span>{item.label}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${item.widthPct}%` }} />
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
