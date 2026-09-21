import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { MetricCard } from '@/components/ui/MetricCard';
import modelArchitecture from '@/data/model_architecture.json';
import styles from './AhrfModelPage.module.css';

type Target = 'soc' | 'soh' | 'rul';

interface TargetArchitecture {
  n_estimators: number;
  max_depth: number;
  weighting_method: string;
  weight_min: number;
  weight_max: number;
  weight_mean: number;
  top_trees: { tree: number; weight: number }[];
}

const ARCH = modelArchitecture as Record<Target, TargetArchitecture>;

const TARGET_LABELS: Record<Target, string> = { soc: 'SOC', soh: 'SOH', rul: 'RUL' };

const predictionTargets = [
  { label: 'SOC', detail: 'State-of-charge estimation for operational awareness.' },
  { label: 'SOH', detail: 'State-of-health tracking for degradation monitoring.' },
  { label: 'RUL', detail: 'Remaining useful life forecasting for maintenance planning.' },
];

export function AhrfModelPage() {
  const [target, setTarget] = useState<Target>('soh');
  const arch = ARCH[target];
  const spreadRatio = (arch.weight_max / arch.weight_min).toFixed(0);

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="AHRF Model"
        subtitle="Adaptive Hybrid Random Forest -- real architecture and learned tree weights from the actual trained model"
        breadcrumbs={[{ label: 'AI & Predictions', path: '/predictions' }, { label: 'AHRF Model' }]}
      />

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Model Overview</p>
          <h2 className={styles.heroTitle}>Adaptive Hybrid Random Forest</h2>
          <p className={styles.heroText}>
            AHRF-v1 is a Random Forest whose final prediction is a weighted average of its trees, where each
            tree's weight comes from its own out-of-bag (OOB) error -- trees that predicted more accurately
            on data they didn't see during their own bootstrap sample get more influence over the final answer.
            The numbers below are read directly from the actual trained {'.pkl'} model files, not illustrative placeholders.
          </p>
        </div>
        <div className={styles.heroStats}>
          <MetricCard label="Weighting method" value={arch.weighting_method.toUpperCase()} />
          <MetricCard label="Prediction scope" value="SOC · SOH · RUL" />
          <MetricCard label="Presentation mode" value="Real trained model" />
        </div>
      </section>

      <div style={{ margin: '16px 0' }}>
        <label htmlFor="target-select" style={{ marginRight: '8px', fontWeight: 500 }}>
          Prediction target:
        </label>
        <select
          id="target-select"
          value={target}
          onChange={(e) => setTarget(e.target.value as Target)}
          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          {(Object.keys(ARCH) as Target[]).map((t) => (
            <option key={t} value={t}>{TARGET_LABELS[t]}</option>
          ))}
        </select>
      </div>

      <section className={styles.gridThree}>
        <ChartCard title="Model Configuration" subtitle={`Real hyperparameters for the ${TARGET_LABELS[target]} model`}>
          <div className={styles.configGrid}>
            <div className={styles.configItem}><span>Trees</span><strong>{arch.n_estimators}</strong></div>
            <div className={styles.configItem}><span>Max depth</span><strong>{arch.max_depth}</strong></div>
            <div className={styles.configItem}><span>Weighting</span><strong>{arch.weighting_method.toUpperCase()}-based</strong></div>
            <div className={styles.configItem}><span>Weight range</span><strong>{arch.weight_min.toFixed(5)} - {arch.weight_max.toFixed(5)}</strong></div>
            <div className={styles.configItem}><span>Mean weight</span><strong>{arch.weight_mean.toFixed(5)}</strong></div>
            <div className={styles.configItem}><span>Max/min spread</span><strong>{spreadRatio}x</strong></div>
          </div>
        </ChartCard>

        <ChartCard title="Prediction Targets" subtitle="Outputs served by this model">
          <div className={styles.targetList}>
            {predictionTargets.map((t) => (
              <div key={t.label} className={styles.targetItem}>
                <strong>{t.label}</strong>
                <p>{t.detail}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Weight Distribution Insight" subtitle="What the spread tells us">
          <ul className={styles.list}>
            <li>
              {arch.weight_max / arch.weight_mean > 2
                ? `For ${TARGET_LABELS[target]}, tree weights vary widely (${spreadRatio}x between strongest and weakest tree) -- OOB weighting meaningfully differentiates tree quality for this target.`
                : `For ${TARGET_LABELS[target]}, tree weights are nearly uniform (only ${spreadRatio}x spread) -- OOB weighting barely differentiates trees, so AHRF behaves close to a plain Random Forest here.`}
            </li>
            <li>Real out-of-bag weights, computed once at training time and stored in the model file.</li>
          </ul>
        </ChartCard>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title={`Top 6 highest-weighted trees (${TARGET_LABELS[target]})`} subtitle="Real learned OOB weights from the trained forest">
          <div className={styles.treeList}>
            {arch.top_trees.map((tree) => (
              <div key={tree.tree} className={styles.treeRow}>
                <div>
                  <strong>Tree #{tree.tree}</strong>
                </div>
                <span className={styles.weightBadge}>{tree.weight.toFixed(5)}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="How the final prediction is formed" subtitle="Real mechanism, from weighted_random_forest.py">
          <div className={styles.list}>
            <p>Each of the {arch.n_estimators} trees produces its own prediction.</p>
            <p>The final output is a weighted average of all {arch.n_estimators} predictions, using each tree's real OOB-error-based weight (not a simple average, unlike a plain Random Forest).</p>
            <p>Trees that generalized better during training (lower OOB error) contribute more to every future prediction.</p>
          </div>
        </ChartCard>
      </section>

      <section className={styles.statusCard}>
        <div>
          <p className={styles.eyebrow}>Model Status</p>
          <h3 className={styles.statusTitle}>Real, trained model -- deployed and serving predictions</h3>
          <p className={styles.heroText}>
            This page reads real hyperparameters and real learned tree weights directly from the trained{' '}
            {target}_ahrf_v1.pkl model file. See the Model Comparison page for real evaluation metrics
            (RMSE/MAE/R²) on held-out battery data.
          </p>
        </div>
        <div className={styles.statusPill}>Real trained model</div>
      </section>
    </PageContainer>
  );
}
