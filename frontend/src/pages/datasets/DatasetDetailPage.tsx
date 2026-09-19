import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { datasetService } from '@/services';
import type { Dataset } from '@/types';
import styles from './DatasetDetailPage.module.css';

export function DatasetDetailPage() {
  const { datasetId } = useParams();
  const [dataset, setDataset] = useState<Dataset | null>(null);

  useEffect(() => {
    if (!datasetId) return;

    let active = true;

    datasetService.getDataset(datasetId).then((item) => {
      if (active) {
        setDataset(item);
      }
    });

    return () => {
      active = false;
    };
  }, [datasetId]);

  const previewRows = useMemo(() => dataset?.previewRows ?? [], [dataset]);

  if (!dataset) {
    return (
      <PageContainer>
        <PageHeader title="Dataset Details" subtitle="Loading dataset context..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title={dataset.name}
        subtitle={dataset.description}
        breadcrumbs={[{ label: 'Datasets', path: '/datasets' }, { label: dataset.name }]}
      />

      <section className={styles.heroCard}>
        <div>
          <p className={styles.eyebrow}>Dataset Details</p>
          <h2 className={styles.heroTitle}>NASA-style battery dataset preview</h2>
          <p className={styles.heroText}>This page presents a mock preview of a dataset profile, including schema, statistics, battery list, and status metadata.</p>
        </div>
        <div className={styles.statusPill}>{dataset.status}</div>
      </section>

      <section className={styles.gridTwo}>
        <ChartCard title="Dataset Statistics" subtitle="High-level counts and quality indicators">
          <div className={styles.statsGrid}>
            <div className={styles.statCard}><span>Records</span><strong>{dataset.recordCount}</strong></div>
            <div className={styles.statCard}><span>Cycle count</span><strong>{dataset.cycleCount ?? '—'}</strong></div>
            <div className={styles.statCard}><span>Features</span><strong>{dataset.featureCount}</strong></div>
            <div className={styles.statCard}><span>Missing values</span><strong>{dataset.statistics?.missingValues ?? 0}</strong></div>
            <div className={styles.statCard}><span>Normalized</span><strong>{dataset.statistics?.normalized ? 'Yes' : 'No'}</strong></div>
            <div className={styles.statCard}><span>Last updated</span><strong>{dataset.statistics?.lastUpdated ?? dataset.uploadedAt}</strong></div>
          </div>
        </ChartCard>

        <ChartCard title="Schema" subtitle="Columns available in the mock preview">
          <div className={styles.tagList}>
            {dataset.schema.map((field) => (
              <span key={field} className={styles.tag}>{field}</span>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className={styles.gridThree}>
        <ChartCard title="Feature List" subtitle="Summarized features exposed in the dataset">
          <ul className={styles.list}>
            {(dataset.features ?? []).map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </ChartCard>

        <ChartCard title="Battery List" subtitle="Batteries represented in this dataset">
          <ul className={styles.list}>
            {(dataset.batteries ?? []).map((battery) => <li key={battery}>{battery}</li>)}
          </ul>
        </ChartCard>

        <ChartCard title="Version Information" subtitle="Metadata for the current mock view">
          <div className={styles.metaList}>
            <div><span>Source</span><strong>{dataset.source}</strong></div>
            <div><span>Version</span><strong>{dataset.version ?? 'n/a'}</strong></div>
            <div><span>Status</span><strong>{dataset.status}</strong></div>
            <div><span>Uploaded</span><strong>{dataset.uploadedAt}</strong></div>
          </div>
        </ChartCard>
      </section>

      <section className={styles.previewCard}>
        <ChartCard title="Dataset Preview" subtitle="Sample rows from the mock dataset">
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Battery</th>
                  <th>Cycle</th>
                  <th>Voltage</th>
                  <th>Temperature</th>
                  <th>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.batteryId}</td>
                    <td>{row.cycle}</td>
                    <td>{row.voltage.toFixed(2)}</td>
                    <td>{row.temperature.toFixed(1)}</td>
                    <td>{row.capacity.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </section>
    </PageContainer>
  );
}
