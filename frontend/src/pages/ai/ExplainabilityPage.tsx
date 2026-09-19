import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { batteryService, explainabilityService } from '@/services';
import type { Battery, SHAPExplanation } from '@/types';
import styles from './ExplainabilityPage.module.css';

type TargetOption = 'SOC' | 'SOH' | 'RUL';

const TARGET_LABELS: Record<TargetOption, string> = {
  SOC: 'State of Charge',
  SOH: 'State of Health',
  RUL: 'Remaining Useful Life',
};

export function ExplainabilityPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [selectedBatteryId, setSelectedBatteryId] = useState('battery-001');
  const [selectedCycle, setSelectedCycle] = useState(128);
  const [selectedTarget, setSelectedTarget] = useState<TargetOption>('SOH');
  const [explanation, setExplanation] = useState<SHAPExplanation | null>(null);

  useEffect(() => {
    let active = true;

    batteryService.getBatteries().then((items) => {
      if (!active) return;
      setBatteries(items);
      if (items.length > 0) {
        setSelectedBatteryId(items[0].id);
        setSelectedCycle(items[0].cycleCount);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    explainabilityService.getSHAPExplanation(selectedBatteryId, selectedTarget, selectedCycle).then((data) => {
      if (active) {
        setExplanation(data);
      }
    });

    return () => {
      active = false;
    };
  }, [selectedBatteryId, selectedCycle, selectedTarget]);

  const selectedBattery = useMemo(
    () => batteries.find((battery) => battery.id === selectedBatteryId) ?? batteries[0] ?? null,
    [batteries, selectedBatteryId],
  );

  const cycleOptions = useMemo(() => {
    if (!selectedBattery) return [120, 121, 122];
    return [Math.max(1, selectedBattery.cycleCount - 2), selectedBattery.cycleCount - 1, selectedBattery.cycleCount];
  }, [selectedBattery]);

  const positiveFeatures = useMemo(() => {
    return (explanation?.localFeatures ?? []).filter((feature) => (feature.value ?? 0) > 0).slice(0, 3);
  }, [explanation]);

  const negativeFeatures = useMemo(() => {
    return (explanation?.localFeatures ?? []).filter((feature) => (feature.value ?? 0) < 0).slice(0, 3);
  }, [explanation]);

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="Explainable AI"
        subtitle="Mock SHAP-style explanations for research storytelling and UI integration"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'Explainable AI' }]}
      />

      <section className={styles.controlsCard}>
        <div className={styles.controlGroup}>
          <label htmlFor="battery">Battery</label>
          <select id="battery" value={selectedBatteryId} onChange={(event) => setSelectedBatteryId(event.target.value)}>
            {batteries.map((battery) => (
              <option key={battery.id} value={battery.id}>
                {battery.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label htmlFor="cycle">Cycle</label>
          <select id="cycle" value={selectedCycle} onChange={(event) => setSelectedCycle(Number(event.target.value))}>
            {cycleOptions.map((cycle) => (
              <option key={cycle} value={cycle}>
                Cycle {cycle}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.controlGroup}>
          <label htmlFor="target">Target</label>
          <select id="target" value={selectedTarget} onChange={(event) => setSelectedTarget(event.target.value as TargetOption)}>
            <option value="SOC">SOC</option>
            <option value="SOH">SOH</option>
            <option value="RUL">RUL</option>
          </select>
        </div>
      </section>

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Explanation Overview</p>
          <h2 className={styles.heroTitle}>Research-oriented SHAP walkthrough</h2>
          <p className={styles.heroText}>
            This page illustrates how feature-attribution explanations could be presented for the AHRF workflow. The values are mock
            placeholders and are not connected to a live Python SHAP model.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Battery" value={selectedBattery?.name ?? 'Loading'} />
          <MetricCard label="Target" value={TARGET_LABELS[selectedTarget]} />
          <MetricCard label="Cycle" value={`C${selectedCycle}`} />
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Global Feature Importance" subtitle="Relative contribution of each feature to the model output">
          <div className={styles.barList}>
            {(explanation?.globalFeatures ?? []).map((feature) => (
              <div key={feature.name} className={styles.barRow}>
                <div className={styles.barLabelRow}>
                  <span>{feature.name}</span>
                  <strong>{feature.importance.toFixed(2)}</strong>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${Math.max(8, feature.importance * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="SHAP Summary" subtitle="Mock local explanation summary for the selected target">
          <div className={styles.summaryRows}>
            <div className={styles.summaryCard}>
              <span>Base value</span>
              <strong>{explanation?.baseValue.toFixed(2) ?? '0.00'}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Output value</span>
              <strong>{explanation?.outputValue.toFixed(2) ?? '0.00'}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Target</span>
              <strong>{selectedTarget}</strong>
            </div>
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="Feature Selection" subtitle="Most influential features chosen for the explanation view">
          <div className={styles.listBlock}>
            {positiveFeatures.map((feature) => (
              <div key={feature.name} className={styles.selectionItem}>
                <strong>{feature.name}</strong>
                <span>+{(feature.value ?? 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Local Prediction Explanation" subtitle="Positive and negative contribution directions">
          <div className={styles.contributionSection}>
            <div>
              <h4 className={styles.subTitle}>Positive contributions</h4>
              {positiveFeatures.length > 0 ? positiveFeatures.map((feature) => (
                <div key={feature.name} className={styles.contributionRow}>
                  <span>{feature.name}</span>
                  <strong>+{(feature.value ?? 0).toFixed(2)}</strong>
                </div>
              )) : <p className={styles.muted}>No positive contributions in the current mock set.</p>}
            </div>
            <div>
              <h4 className={styles.subTitle}>Negative contributions</h4>
              {negativeFeatures.length > 0 ? negativeFeatures.map((feature) => (
                <div key={feature.name} className={styles.contributionRow}>
                  <span>{feature.name}</span>
                  <strong>{(feature.value ?? 0).toFixed(2)}</strong>
                </div>
              )) : <p className={styles.muted}>No negative contributions in the current mock set.</p>}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Feature Contribution Details" subtitle="Original, selected, and removed features">
          <div className={styles.detailsBlock}>
            <div>
              <h4 className={styles.subTitle}>Original Features</h4>
              <ul>{(explanation?.globalFeatures ?? []).map((feature) => <li key={feature.name}>{feature.name}</li>)}</ul>
            </div>
            <div>
              <h4 className={styles.subTitle}>Selected Features</h4>
              <ul>{positiveFeatures.map((feature) => <li key={feature.name}>{feature.name}</li>)}</ul>
            </div>
            <div>
              <h4 className={styles.subTitle}>Removed Features</h4>
              <ul>{negativeFeatures.map((feature) => <li key={feature.name}>{feature.name}</li>)}</ul>
            </div>
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
