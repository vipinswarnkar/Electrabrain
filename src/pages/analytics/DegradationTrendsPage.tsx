import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { ANALYTICS_DEGRADATION_DATA } from '@/services/mocks/analyticsData.mock';
import styles from './AnalyticsPage.module.css';

export function DegradationTrendsPage() {
  return (
    <PageContainer>
      <PageHeader title="Degradation Trends" subtitle="Lifecycle signals for SOH, capacity, resistance, temperature, voltage, and degradation rate." />

      <section className={styles.gridTwo}>
        <ChartCard title="SOH vs cycle" subtitle="State-of-health decline across use cycles">
          <LineChart data={ANALYTICS_DEGRADATION_DATA} xKey="cycle" series={[{ dataKey: 'soh', name: 'SOH', color: '#4f46e5' }]} height={240} />
        </ChartCard>
        <ChartCard title="Capacity vs cycle" subtitle="Capacity fade trajectory">
          <LineChart data={ANALYTICS_DEGRADATION_DATA} xKey="cycle" series={[{ dataKey: 'capacity', name: 'Capacity', color: '#0f766e' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Resistance vs cycle" subtitle="Internal resistance growth">
          <LineChart data={ANALYTICS_DEGRADATION_DATA} xKey="cycle" series={[{ dataKey: 'resistance', name: 'Resistance', color: '#dc2626' }]} height={240} />
        </ChartCard>
        <ChartCard title="Temperature vs cycle" subtitle="Thermal stress over the operating life">
          <LineChart data={ANALYTICS_DEGRADATION_DATA} xKey="cycle" series={[{ dataKey: 'temperature', name: 'Temperature', color: '#f59e0b' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Voltage vs cycle" subtitle="Cell voltage under nominal discharge conditions">
          <LineChart data={ANALYTICS_DEGRADATION_DATA} xKey="cycle" series={[{ dataKey: 'voltage', name: 'Voltage', color: '#2563eb' }]} height={240} />
        </ChartCard>
        <ChartCard title="Degradation rate" subtitle="Acceleration of capacity loss per cycle">
          <LineChart data={ANALYTICS_DEGRADATION_DATA} xKey="cycle" series={[{ dataKey: 'degradationRate', name: 'Rate', color: '#7c3aed' }]} height={240} />
        </ChartCard>
      </section>
    </PageContainer>
  );
}
