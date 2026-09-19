import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import styles from './AhrfModelPage.module.css';

const treeWeights = [
  { name: 'Tree 1', weight: 0.24, role: 'Voltage and current envelope' },
  { name: 'Tree 2', weight: 0.19, role: 'Temperature and impedance balance' },
  { name: 'Tree 3', weight: 0.17, role: 'Cycle-history degradation patterns' },
  { name: 'Tree 4', weight: 0.15, role: 'Charge efficiency and hysteresis' },
  { name: 'Tree 5', weight: 0.13, role: 'Cell-to-pack consistency signals' },
  { name: 'Tree 6', weight: 0.12, role: 'Anomaly and sensor drift flags' },
];

const configItems = [
  { label: 'Trees', value: '6' },
  { label: 'Max depth', value: '8' },
  { label: 'Feature subset', value: '√p' },
  { label: 'Validation', value: 'Time-based split' },
  { label: 'Bootstrap', value: 'Enabled' },
  { label: 'Drift guard', value: 'Adaptive' },
];

const predictionTargets = [
  { label: 'SOC', detail: 'State-of-charge estimation for operational awareness.' },
  { label: 'SOH', detail: 'State-of-health tracking for degradation monitoring.' },
  { label: 'RUL', detail: 'Remaining useful life forecasting for maintenance planning.' },
];

const trainingNotes = [
  'The layout below is a mock research storyboard for the AHRF concept and is not a claim of live experimental performance.',
  'Tree weights are illustrative placeholders intended to show how adaptive aggregation could be presented once a backend model service is connected.',
  'The architecture is designed to support future replacement with real training metadata, validation metrics, and weighting logic from an ML service.',
];

export function AhrfModelPage() {
  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="AHRF Model"
        subtitle="Adaptive Hybrid Random Forest for battery intelligence and forecasting"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'AHRF Model' }]}
      />

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Model Overview</p>
          <h2 className={styles.heroTitle}>Adaptive Hybrid Random Forest</h2>
          <p className={styles.heroText}>
            This view explains the research contribution behind the AHRF concept: a hybrid ensemble that blends multiple tree specialists,
            then adjusts their influence based on validation behavior and feature relevance.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Research focus" value="Adaptive weighting" />
          <MetricCard label="Prediction scope" value="SOC · SOH · RUL" />
          <MetricCard label="Presentation mode" value="Mock storyboard" />
        </div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Architecture" subtitle="Flow from input signals to a final prediction">
          <div className={styles.diagram}>
            {[
              'Input Features',
              'Decision Trees',
              'Validation Performance',
              'Adaptive Weights',
              'Weighted Aggregation',
              'Final Prediction',
            ].map((step, index) => (
              <div key={step} className={styles.diagramStep}>
                <span className={styles.stepLabel}>{step}</span>
                {index < 5 && <span className={styles.arrow}>↓</span>}
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Adaptive Tree Weighting" subtitle="Illustrative mock tree weights for the ensemble view">
          <div className={styles.weightList}>
            {treeWeights.map((tree) => (
              <div key={tree.name} className={styles.weightRow}>
                <div>
                  <strong>{tree.name}</strong>
                  <p>{tree.role}</p>
                </div>
                <span className={styles.weightBadge}>{tree.weight.toFixed(2)} weight</span>
              </div>
            ))}
          </div>
          <div className={styles.finalPredictionBox}>
            <span className={styles.finalLabel}>Final weighted prediction</span>
            <strong>Ensemble output assembled from the weighted tree contributions above.</strong>
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="Model Configuration" subtitle="Configuration values used by the current mock view">
          <div className={styles.configGrid}>
            {configItems.map((item) => (
              <div key={item.label} className={styles.configItem}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Prediction Targets" subtitle="Primary targets exposed by the model concept">
          <div className={styles.targetList}>
            {predictionTargets.map((target) => (
              <div key={target.label} className={styles.targetItem}>
                <strong>{target.label}</strong>
                <p>{target.detail}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Training Information" subtitle="Context for the research-oriented draft page">
          <ul className={styles.list}>
            {trainingNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </ChartCard>
      </section>

      <section className={styles.statusCard}>
        <div>
          <p className={styles.eyebrow}>Model Status</p>
          <h3 className={styles.statusTitle}>Research concept ready for service integration</h3>
          <p className={styles.heroText}>
            The current implementation is a UI-ready mock layout for the AHRF contribution. It highlights the architecture, weighting concept,
            and target outputs without presenting mock values as verified experimental results.
          </p>
        </div>
        <div className={styles.statusPill}>Mock-only presentation</div>
      </section>
    </PageContainer>
  );
}
