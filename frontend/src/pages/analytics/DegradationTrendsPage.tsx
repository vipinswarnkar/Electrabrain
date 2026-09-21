import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { getBatteryAnalytics } from '@/data/realAnalytics';
import { useBatterySelector } from '@/hooks/useBatterySelector';
import styles from './AnalyticsPage.module.css';

export function DegradationTrendsPage() {
  const { selectedBatteryId, setSelectedBatteryId, availableIds } = useBatterySelector();
  const data = getBatteryAnalytics(selectedBatteryId).degradation;

  return (
    <PageContainer>
      <PageHeader
        title="Degradation Trends"
        subtitle="Real lifecycle signals for SOH, capacity, resistance, temperature, voltage, and degradation rate -- computed from actual NASA battery test data."
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
        <ChartCard title="SOH vs cycle" subtitle="State-of-health decline across use cycles">
          <LineChart data={data as any} xKey="cycle" series={[{ dataKey: 'soh', name: 'SOH', color: '#4f46e5' }]} height={240} />
        </ChartCard>
        <ChartCard title="Capacity vs cycle" subtitle="Capacity fade trajectory">
          <LineChart data={data as any} xKey="cycle" series={[{ dataKey: 'capacity', name: 'Capacity', color: '#0f766e' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Resistance vs cycle" subtitle="Internal resistance growth (real impedance test data)">
          <LineChart data={data as any} xKey="cycle" series={[{ dataKey: 'resistance', name: 'Resistance', color: '#dc2626' }]} height={240} />
        </ChartCard>
        <ChartCard title="Temperature vs cycle" subtitle="Thermal stress over the operating life">
          <LineChart data={data as any} xKey="cycle" series={[{ dataKey: 'temperature', name: 'Temperature', color: '#f59e0b' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Voltage vs cycle" subtitle="Cell voltage under nominal discharge conditions">
          <LineChart data={data as any} xKey="cycle" series={[{ dataKey: 'voltage', name: 'Voltage', color: '#2563eb' }]} height={240} />
        </ChartCard>
        <ChartCard title="Degradation rate" subtitle="Acceleration of capacity loss per cycle">
          <LineChart data={data as any} xKey="cycle" series={[{ dataKey: 'degradationRate', name: 'Rate', color: '#7c3aed' }]} height={240} />
        </ChartCard>
      </section>
    </PageContainer>
  );
}
