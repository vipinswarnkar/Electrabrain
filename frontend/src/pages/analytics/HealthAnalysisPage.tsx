import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AreaChart } from '@/components/charts/AreaChart';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { getBatteryAnalytics } from '@/data/realAnalytics';
import { useBatterySelector } from '@/hooks/useBatterySelector';
import styles from './AnalyticsPage.module.css';

function fmt(value: number | null | undefined, digits = 1, suffix = ''): string {
  return value == null ? 'N/A' : `${value.toFixed(digits)}${suffix}`;
}

export function HealthAnalysisPage() {
  const { selectedBatteryId, setSelectedBatteryId, availableIds } = useBatterySelector();
  const { health, cycles } = getBatteryAnalytics(selectedBatteryId);
  const latest = health[health.length - 1];
  const latestEfficiency = [...cycles].reverse().find((c) => c.efficiency != null)?.efficiency ?? null;

  return (
    <PageContainer>
      <PageHeader
        title="Health Analysis"
        subtitle="Real battery health indicators computed from actual NASA test data -- capacity, resistance, and thermal signals."
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

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Capacity</span>
          <strong>{fmt(latest.capacity, 1, '%')}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Capacity retention</span>
          <strong>{fmt(latest.capacityRetention, 1, '%')}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Capacity fade</span>
          <strong>{fmt(latest.capacityFade, 1, '%')}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Overall health</span>
          <strong>{fmt(latest.overallHealth, 1, '%')}</strong>
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Capacity & retention" subtitle="Capacity trajectory vs retained capacity">
          <AreaChart
            data={health}
            xKey="cycle"
            series={[
              { dataKey: 'capacity', name: 'Capacity', color: '#4f46e5' },
              { dataKey: 'capacityRetention', name: 'Retention', color: '#0f766e' },
            ]}
            height={260}
          />
        </ChartCard>
        <ChartCard title="Resistance & temperature" subtitle="Electrochemical degradation indicators (real impedance test data)">
          <LineChart
            data={health}
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
        <ChartCard title="Electrochemical metrics" subtitle="Real impedance-test-derived features">
          <div className={styles.list}>
            <div className={styles.listItem}><span className={styles.listLabel}>Re</span><strong>{fmt(latest.re, 4, ' Ω')}</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Rct</span><strong>{fmt(latest.rct, 4, ' Ω')}</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Voltage</span><strong>{fmt(latest.voltage, 2, ' V')}</strong></div>
          </div>
        </ChartCard>
        <ChartCard title="Charge efficiency" subtitle="Real discharge energy / real charge energy">
          <div className={styles.list}>
            <div className={styles.listItem}><span className={styles.listLabel}>Efficiency</span><strong>{fmt(latestEfficiency, 1, '%')}</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Current trend</span><strong>{latest.capacityFade > 15 ? 'Declining' : 'Stable'}</strong></div>
            <div className={styles.listItem}><span className={styles.listLabel}>Thermal state</span><strong>{latest.temperature > 30 ? 'Elevated' : 'Moderate'}</strong></div>
          </div>
        </ChartCard>
        <ChartCard title="Snapshot" subtitle="Current battery status summary">
          <div className={styles.list}>
            <MetricCard label="SOH" value={fmt(latest.overallHealth, 1, '%')} />
            <MetricCard label="Fade" value={fmt(latest.capacityFade, 1, '%')} />
            <MetricCard label="IR" value={fmt(latest.internalResistance, 2, ' Ω')} />
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
