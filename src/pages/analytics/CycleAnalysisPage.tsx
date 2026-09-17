import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { ANALYTICS_CYCLE_DATA } from '@/services/mocks/analyticsData.mock';
import styles from './AnalyticsPage.module.css';

export function CycleAnalysisPage() {
  return (
    <PageContainer>
      <PageHeader title="Cycle Analysis" subtitle="Cycle-level performance for capacity, voltage, current, temperature, energy, efficiency, and duration." />

      <section className={styles.gridTwo}>
        <ChartCard title="Capacity vs cycle" subtitle="Cycle-by-cycle capacity retention">
          <LineChart data={ANALYTICS_CYCLE_DATA} xKey="cycleNumber" series={[{ dataKey: 'capacity', name: 'Capacity', color: '#4f46e5' }]} height={240} />
        </ChartCard>
        <ChartCard title="Voltage vs cycle" subtitle="Nominal pack voltage trend">
          <LineChart data={ANALYTICS_CYCLE_DATA} xKey="cycleNumber" series={[{ dataKey: 'voltage', name: 'Voltage', color: '#0f766e' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Current vs cycle" subtitle="Charge/discharge current trend">
          <LineChart data={ANALYTICS_CYCLE_DATA} xKey="cycleNumber" series={[{ dataKey: 'current', name: 'Current', color: '#f59e0b' }]} height={240} />
        </ChartCard>
        <ChartCard title="Temperature vs cycle" subtitle="Thermal response throughout the cycle sequence">
          <LineChart data={ANALYTICS_CYCLE_DATA} xKey="cycleNumber" series={[{ dataKey: 'temperature', name: 'Temperature', color: '#dc2626' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Energy vs cycle" subtitle="Delivered energy profile">
          <LineChart data={ANALYTICS_CYCLE_DATA} xKey="cycleNumber" series={[{ dataKey: 'energy', name: 'Energy', color: '#2563eb' }]} height={240} />
        </ChartCard>
        <ChartCard title="Efficiency & duration" subtitle="Cycle efficiency and duration trend">
          <LineChart
            data={ANALYTICS_CYCLE_DATA}
            xKey="cycleNumber"
            series={[
              { dataKey: 'efficiency', name: 'Efficiency', color: '#7c3aed' },
              { dataKey: 'cycleDuration', name: 'Duration', color: '#14b8a6' },
            ]}
            height={240}
          />
        </ChartCard>
      </section>
    </PageContainer>
  );
}
