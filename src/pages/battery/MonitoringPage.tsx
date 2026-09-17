import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { batteryService } from '@/services';
import type { Battery } from '@/types';
import styles from './BatteryPage.module.css';

export function MonitoringPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);

  useEffect(() => {
    let active = true;

    batteryService.getBatteries().then((data) => {
      if (active) {
        setBatteries(data);
      }
    });

    const interval = window.setInterval(() => {
      setBatteries((current) =>
        current.map((battery, index) => {
          const drift = (index % 3) - 1;
          const nextSoc = Math.min(99, Math.max(15, battery.soc + drift * 0.8));
          const nextTemperature = Math.min(46, Math.max(28, battery.temperature + drift * 0.4));
          const nextVoltage = Math.min(75.5, Math.max(46, battery.voltage + drift * 0.06));
          const telemetry = [...(battery.telemetry ?? []), { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), soc: nextSoc, temperature: nextTemperature, voltage: nextVoltage }].slice(-8);

          return {
            ...battery,
            soc: nextSoc,
            temperature: nextTemperature,
            voltage: nextVoltage,
            lastUpdated: new Date().toISOString(),
            telemetry,
          };
        }),
      );
    }, 2200);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  const focusBattery = batteries[0];
  const telemetryData = useMemo(() => {
    return (focusBattery?.telemetry ?? []).map((point) => ({ time: point.time, soc: point.soc, temperature: point.temperature }));
  }, [focusBattery]);

  const averageSoc = batteries.length > 0 ? batteries.reduce((sum, battery) => sum + battery.soc, 0) / batteries.length : 0;
  const averageTemperature = batteries.length > 0 ? batteries.reduce((sum, battery) => sum + battery.temperature, 0) / batteries.length : 0;

  return (
    <PageContainer>
      <PageHeader title="Live Monitoring" subtitle="Simulated telemetry stream for the current fleet without requiring a socket connection." />

      <section className={styles.summaryGrid}>
        <MetricCard label="Fleet SOC" value={`${averageSoc.toFixed(1)}%`} />
        <MetricCard label="Avg temp" value={`${averageTemperature.toFixed(1)}°C`} />
        <MetricCard label="Active packs" value={batteries.length} />
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Telemetry stream" subtitle="Incoming battery readings over time">
          <LineChart
            data={telemetryData}
            xKey="time"
            series={[
              { dataKey: 'soc', name: 'SOC', color: '#4f46e5' },
              { dataKey: 'temperature', name: 'Temp', color: '#f59e0b' },
            ]}
            height={260}
            yUnit="%"
          />
        </ChartCard>
        <ChartCard title="Live pack status" subtitle="Most recent state updates">
          <div className={styles.list}>
            {batteries.map((battery) => (
              <div key={battery.id} className={styles.liveRow}>
                <div>
                  <strong>{battery.name}</strong>
                  <div className={styles.mutedText}>{battery.location ?? 'Fleet'}</div>
                </div>
                <div className={styles.liveMeta}>
                  <StatusBadge label={battery.status} status={battery.status} />
                  <span>{battery.soc.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
