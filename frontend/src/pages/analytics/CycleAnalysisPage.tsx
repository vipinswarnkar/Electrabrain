import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { getBatteryAnalytics } from '@/data/realAnalytics';
import { useBatterySelector } from '@/hooks/useBatterySelector';
import styles from './AnalyticsPage.module.css';

export function CycleAnalysisPage() {
  const { selectedBatteryId, setSelectedBatteryId, availableIds } = useBatterySelector();
  const data = getBatteryAnalytics(selectedBatteryId).cycles;

  return (
    <PageContainer>
      <PageHeader
        title="Cycle Analysis"
        subtitle="Real cycle-level performance from actual NASA discharge/charge data -- capacity, voltage, current, temperature, energy, efficiency, and duration."
      />

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="battery-select" style={{ marginRight: '8px', fontWeight: 500 }}>
          Battery pack:
        </label>
        <select
          id="battery-select"
          value={selectedBatteryId}
          onChange={(e) => setSelectedBatteryId(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          {availableIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      <section className={styles.gridTwo}>
        <ChartCard title="Capacity vs cycle" subtitle="Cycle-by-cycle capacity retention">
          <LineChart data={data as any} xKey="cycleNumber" series={[{ dataKey: 'capacity', name: 'Capacity', color: '#4f46e5' }]} height={240} />
        </ChartCard>
        <ChartCard title="Voltage vs cycle" subtitle="Nominal pack voltage trend">
          <LineChart data={data as any} xKey="cycleNumber" series={[{ dataKey: 'voltage', name: 'Voltage', color: '#0f766e' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Current vs cycle" subtitle="Charge/discharge current trend">
          <LineChart data={data as any} xKey="cycleNumber" series={[{ dataKey: 'current', name: 'Current', color: '#f59e0b' }]} height={240} />
        </ChartCard>
        <ChartCard title="Temperature vs cycle" subtitle="Thermal response throughout the cycle sequence">
          <LineChart data={data as any} xKey="cycleNumber" series={[{ dataKey: 'temperature', name: 'Temperature', color: '#dc2626' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Energy vs cycle" subtitle="Real delivered energy, integrated from V x I over time">
          <LineChart data={data as any} xKey="cycleNumber" series={[{ dataKey: 'energy', name: 'Energy', color: '#2563eb' }]} height={240} />
        </ChartCard>
        <ChartCard title="Efficiency & duration" subtitle="Real cycle efficiency and duration trend">
          <LineChart
            data={data as any}
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
