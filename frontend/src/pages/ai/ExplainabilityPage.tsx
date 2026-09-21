import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import shapResults from '@/data/shap_results.json';
import styles from './ExplainabilityPage.module.css';

type TargetOption = 'SOC' | 'SOH' | 'RUL';

const TARGET_LABELS: Record<TargetOption, string> = {
  SOC: 'State of Charge',
  SOH: 'State of Health',
  RUL: 'Remaining Useful Life',
};

interface ShapFeature {
  name: string;
  importance: number;
  value?: number;
}

interface PerBatteryLocal {
  localFeatures: ShapFeature[];
  outputValue: number;
  cycle: number;
}

interface ShapResult {
  globalFeatures: ShapFeature[];
  baseValue: number;
  perBattery: Record<string, PerBatteryLocal>;
}

const RESULTS = shapResults as Record<'soc' | 'soh' | 'rul', ShapResult>;

export function ExplainabilityPage() {
  const [selectedTarget, setSelectedTarget] = useState<TargetOption>('SOH');
  const targetResult = RESULTS[selectedTarget.toLowerCase() as 'soc' | 'soh' | 'rul'];
  const availableBatteries = Object.keys(targetResult.perBattery);
  const [selectedBatteryId, setSelectedBatteryId] = useState(availableBatteries[0]);

  const local = targetResult.perBattery[selectedBatteryId] ?? targetResult.perBattery[availableBatteries[0]];
  const positiveFeatures = local.localFeatures.filter((f) => (f.value ?? 0) > 0).slice(0, 3);
  const negativeFeatures = local.localFeatures.filter((f) => (f.value ?? 0) < 0).slice(0, 3);

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="Explainable AI"
        subtitle="Real SHAP feature-attribution values, computed from the actual trained AHRF-v1 model"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'Explainable AI' }]}
      />

      <section className={styles.controlsCard}>
        <div className={styles.controlGroup}>
          <label htmlFor="battery">Battery</label>
          <select id="battery" value={selectedBatteryId} onChange={(event) => setSelectedBatteryId(event.target.value)}>
            {availableBatteries.map((id) => (
              <option key={id} value={id}>{id}</option>
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
          <h2 className={styles.heroTitle}>Real SHAP TreeExplainer output</h2>
          <p className={styles.heroText}>
            These values come from running SHAP's TreeExplainer on the actual trained {selectedTarget} model
            (via its underlying real RandomForestRegressor), against real engineered features from real
            NASA battery cycle data. Not illustrative -- genuine attribution values.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Battery" value={selectedBatteryId} />
          <MetricCard label="Target" value={TARGET_LABELS[selectedTarget]} />
          <MetricCard label="Cycle" value={`C${local.cycle}`} />
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Global Feature Importance" subtitle="Fixed across all batteries by design -- real mean |SHAP value| across all 4 batteries combined. Switch battery below to see per-battery LOCAL explanations instead.">
          <div className={styles.barList}>
            {targetResult.globalFeatures.map((feature) => {
              const maxImportance = targetResult.globalFeatures[0].importance;
              return (
                <div key={feature.name} className={styles.barRow}>
                  <div className={styles.barLabelRow}>
                    <span>{feature.name}</span>
                    <strong>{feature.importance.toFixed(3)}</strong>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${Math.max(8, (feature.importance / maxImportance) * 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="SHAP Summary" subtitle={`Real local explanation for ${selectedBatteryId}, cycle ${local.cycle}`}>
          <div className={styles.summaryRows}>
            <div className={styles.summaryCard}>
              <span>Base value (expected)</span>
              <strong>{targetResult.baseValue.toFixed(2)}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Output value (actual prediction)</span>
              <strong>{local.outputValue.toFixed(2)}</strong>
            </div>
            <div className={styles.summaryCard}>
              <span>Target</span>
              <strong>{selectedTarget}</strong>
            </div>
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="Feature Selection" subtitle="Top positive-contribution features for this real prediction">
          <div className={styles.listBlock}>
            {positiveFeatures.length > 0 ? positiveFeatures.map((feature) => (
              <div key={feature.name} className={styles.selectionItem}>
                <strong>{feature.name}</strong>
                <span>+{(feature.value ?? 0).toFixed(2)}</span>
              </div>
            )) : <p className={styles.muted}>No positive contributions for this prediction.</p>}
          </div>
        </ChartCard>

        <ChartCard title="Local Prediction Explanation" subtitle="Real positive and negative contribution directions">
          <div className={styles.contributionSection}>
            <div>
              <h4 className={styles.subTitle}>Positive contributions</h4>
              {positiveFeatures.length > 0 ? positiveFeatures.map((feature) => (
                <div key={feature.name} className={styles.contributionRow}>
                  <span>{feature.name}</span>
                  <strong>+{(feature.value ?? 0).toFixed(2)}</strong>
                </div>
              )) : <p className={styles.muted}>No positive contributions for this prediction.</p>}
            </div>
            <div>
              <h4 className={styles.subTitle}>Negative contributions</h4>
              {negativeFeatures.length > 0 ? negativeFeatures.map((feature) => (
                <div key={feature.name} className={styles.contributionRow}>
                  <span>{feature.name}</span>
                  <strong>{(feature.value ?? 0).toFixed(2)}</strong>
                </div>
              )) : <p className={styles.muted}>No negative contributions for this prediction.</p>}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Feature Contribution Details" subtitle="All real features involved in this explanation">
          <div className={styles.detailsBlock}>
            <div>
              <h4 className={styles.subTitle}>Global top features</h4>
              <ul>{targetResult.globalFeatures.map((feature) => <li key={feature.name}>{feature.name}</li>)}</ul>
            </div>
            <div>
              <h4 className={styles.subTitle}>Positive drivers (this prediction)</h4>
              <ul>{positiveFeatures.map((feature) => <li key={feature.name}>{feature.name}</li>)}</ul>
            </div>
            <div>
              <h4 className={styles.subTitle}>Negative drivers (this prediction)</h4>
              <ul>{negativeFeatures.map((feature) => <li key={feature.name}>{feature.name}</li>)}</ul>
            </div>
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
