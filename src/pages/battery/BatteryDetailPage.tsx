import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { BarChart } from '@/components/charts/BarChart';
import { LineChart } from '@/components/charts/LineChart';
import { ChartCard } from '@/components/ui/ChartCard';
import { HealthBadge } from '@/components/ui/HealthBadge';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { batteryService, predictionService } from '@/services';
import type { Battery, PredictionResponse } from '@/types';
import { formatDate, formatPercent } from '@/utils/formatters';
import styles from './BatteryPage.module.css';

export function BatteryDetailPage() {
  const { batteryId } = useParams();
  const [battery, setBattery] = useState<Battery | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  useEffect(() => {
    if (!batteryId) return;

    let active = true;

    Promise.all([batteryService.getBattery(batteryId), predictionService.getPrediction(batteryId)]).then(
      ([batteryData, predictionData]) => {
        if (active) {
          setBattery(batteryData);
          setPrediction(predictionData);
        }
      },
    );

    return () => {
      active = false;
    };
  }, [batteryId]);

  const healthTrendData = useMemo(() => {
    return (battery?.health?.trend ?? []).map((value, index) => ({ label: `Cycle ${index + 1}`, soh: value }));
  }, [battery]);

  const cycleData = useMemo(() => {
    return (battery?.cycles?.cycleTrend ?? []).map((value, index) => ({ label: `C${index + 1}`, cycles: value }));
  }, [battery]);

  if (!battery) {
    return (
      <PageContainer>
        <PageHeader title="Battery Details" subtitle="Loading battery context..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={battery.name}
        subtitle={`${battery.serialNumber} · ${battery.model}`}
        breadcrumbs={[{ label: 'Batteries', path: '/batteries' }, { label: battery.name }]}
      />

      <section className={styles.heroCard}>
        <div>
          <div className={styles.heroHeader}>
            <h2 className={styles.heroTitle}>{battery.name}</h2>
            <StatusBadge label={battery.status} status={battery.status} />
          </div>
          <p className={styles.heroText}>
            {battery.overview?.description ?? 'Pack details and service guidance are available below.'}
          </p>
          <div className={styles.heroMeta}>
            <span>Location: {battery.location ?? 'Unknown'}</span>
            <span>Last updated: {formatDate(battery.lastUpdated)}</span>
          </div>
        </div>
        <div className={styles.metricGrid}>
          <MetricCard label="SOC" value={`${battery.soc.toFixed(1)}%`} />
          <MetricCard label="SOH" value={`${battery.soh.toFixed(1)}%`} />
          <MetricCard label="RUL" value={battery.rul} unit="cycles" />
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Health" subtitle="Recent state-of-health trend">
          <LineChart data={healthTrendData} xKey="label" series={[{ dataKey: 'soh', name: 'SOH', color: '#4f46e5' }]} height={240} yUnit="%" />
        </ChartCard>
        <ChartCard title="Cycles" subtitle="Lifecycle progression for the current pack">
          <BarChart data={cycleData} xKey="label" bars={[{ dataKey: 'cycles', name: 'Cycle count', color: '#0f766e' }]} height={240} />
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="Overview" subtitle="Operational context">
          <div className={styles.infoList}>
            <div className={styles.infoItem}><span>Installed</span><strong>{formatDate(battery.overview?.installedAt ?? battery.lastUpdated)}</strong></div>
            <div className={styles.infoItem}><span>Warranty ends</span><strong>{formatDate(battery.overview?.warrantyEnds ?? battery.lastUpdated)}</strong></div>
            <div className={styles.infoItem}><span>Owner</span><strong>{battery.overview?.owner ?? 'Fleet Ops'}</strong></div>
            <div className={styles.infoItem}><span>Mode</span><strong>{battery.overview?.operatingMode ?? 'Balanced operation'}</strong></div>
          </div>
        </ChartCard>

        <ChartCard title="Sensors" subtitle="Pack sensor envelope">
          <div className={styles.sensorList}>
            {battery.sensors?.map((sensor) => (
              <div key={sensor.name} className={styles.sensorItem}>
                <div>
                  <strong>{sensor.name}</strong>
                  <div className={styles.mutedText}>{sensor.value}</div>
                </div>
                <span className={styles.sensorStatus}>{sensor.status}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Predictions" subtitle="Estimated next maintenance and risk">
          <div className={styles.infoList}>
            <div className={styles.infoItem}><span>Maintenance</span><strong>{battery.predictions?.nextMaintenance ?? 'Scheduled from model'}</strong></div>
            <div className={styles.infoItem}><span>RUL</span><strong>{battery.predictions?.estimatedRul ?? battery.rul} cycles</strong></div>
            <div className={styles.infoItem}><span>Confidence</span><strong>{formatPercent(battery.predictions?.confidence ?? 0.9, 0)}</strong></div>
            <div className={styles.infoItem}><span>Failure risk</span><strong>{battery.predictions?.nextFailureRisk ?? 'Low'}</strong></div>
          </div>
          {prediction && (
            <div className={styles.predictionFootnote}>
              AHRF v{prediction.modelVersion} · SOC {prediction.soc.predictedValue.toFixed(1)}% · SOH {prediction.soh.predictedValue.toFixed(1)}%
            </div>
          )}
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Degradation" subtitle="Capacity and resistance trend">
          <div className={styles.infoList}>
            <div className={styles.infoItem}><span>Capacity fade</span><strong>{battery.degradation?.capacityFadePercent.toFixed(1)}%</strong></div>
            <div className={styles.infoItem}><span>Resistance growth</span><strong>{battery.degradation?.resistanceGrowthPercent.toFixed(1)}%</strong></div>
            <div className={styles.infoItem}><span>Trend</span><strong>{battery.degradation?.trend ?? 'stable'}</strong></div>
          </div>
          <div className={styles.notesList}>
            {battery.degradation?.notes?.map((note) => <p key={note}>{note}</p>)}
          </div>
        </ChartCard>

        <ChartCard title="Maintenance" subtitle="Upcoming actions and service cadence">
          <div className={styles.maintenanceList}>
            {battery.maintenance?.map((item) => (
              <div key={item.title} className={styles.maintenanceItem}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <div className={styles.maintenanceMeta}>
                  <span>{item.dueDate}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Health summary" subtitle="Current battery wellness">
          <div className={styles.healthSummary}>
            <HealthBadge soh={battery.soh} />
            <p>{battery.health?.summary ?? 'Battery health remains within the expected operating envelope.'}</p>
          </div>
        </ChartCard>
        <ChartCard title="Pack metrics" subtitle="Electrical and thermal profile">
          <div className={styles.metricGrid}>
            <MetricCard label="Voltage" value={`${battery.voltage.toFixed(1)} V`} />
            <MetricCard label="Current" value={`${battery.current.toFixed(1)} A`} />
            <MetricCard label="Temp" value={`${battery.temperature.toFixed(1)}°C`} />
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
