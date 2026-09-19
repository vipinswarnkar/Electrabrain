import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AreaChart } from '@/components/charts/AreaChart';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { ANALYTICS_HEALTH_DATA } from '@/services/mocks/analyticsData.mock';
import styles from './AnalyticsPage.module.css';

export function HealthAnalysisPage() {
  const latest = ANALYTICS_HEALTH_DATA[ANALYTICS_HEALTH_DATA.length - 1];

  return (
    <PageContainer>
      <PageHeader title="Health Analysis" subtitle="Fleet health indicators with trend-based battery physics signals." />

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Capacity</span>
          <strong>{latest.capacity.toFixed(1)}%</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Capacity retention</span>
          <strong>{latest.capacityRetention.toFixed(1)}%</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Capacity fade</span>
          <strong>{latest.capacityFade.toFixed(1)}%</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Overall health</span>
          <strong>{latest.overallHealth.toFixed(1)}%</strong>
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Capacity & retention" subtitle="Capacity trajectory vs retained capacity">
          <AreaChart
            data={ANALYTICS_HEALTH_DATA}
            xKey="cycle"
            series={[
              { dataKey: 'capacity', name: 'Capacity', color: '#4f46e5' },
              { dataKey: 'capacityRetention', name: 'Retention', color: '#0f766e' },
            ]}
            height={260}
          />
        </ChartCard>
        <ChartCard title="Resistance & temperature" subtitle="Electrochemical degradation indicators">
          <LineChart
            data={ANALYTICS_HEALTH_DATA}
            xKey="cycle"
            series={[
              { dataKey: 'internalResistance', name: 'Internal resistance', color: '#dc2626' },
              { dataKey: 'temperature', name: 'Temperature', color: '#f59e0b' },
            ]}
            height={260}
          />
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="Electrochemical metrics" subtitle="Model-ready battery features">
          <div className={styles.list}>
            <div className={styles.listItem}><span className={styles.listLabel}>Re</span><strong>{latest.re.toFixed(4)} Ω</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Rct</span><strong>{latest.rct.toFixed(4)} Ω</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Voltage</span><strong>{latest.voltage.toFixed(2)} V</strong></div>
          </div>
        </ChartCard>
        <ChartCard title="Charge efficiency" subtitle="Energy retention during charging">
          <div className={styles.list}>
            <div className={styles.listItem}><span className={styles.listLabel}>Efficiency</span><strong>{latest.chargeEfficiency.toFixed(1)}%</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Current trend</span><strong>Stable</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Thermal state</span><strong>Moderate</strong></div>
          </div>
        </ChartCard>
        <ChartCard title="Snapshot" subtitle="Current fleet status summary">
          <div className={styles.list}>
            <MetricCard label="SOH" value={`${latest.overallHealth.toFixed(1)}%`} />
            <MetricCard label="Fade" value={`${latest.capacityFade.toFixed(1)}%`} />
            <MetricCard label="IR" value={`${latest.internalResistance.toFixed(2)} Ω`} />
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
