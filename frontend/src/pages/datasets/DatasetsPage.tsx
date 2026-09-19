import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { ChartCard } from '@/components/ui/ChartCard';
import { datasetService } from '@/services';
import type { Dataset } from '@/types';
import styles from './DatasetsPage.module.css';

const PAGE_SIZE = 4;

export function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Dataset['status']>('all');
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    let active = true;

    datasetService.getDatasets().then((items) => {
      if (active) {
        setDatasets(items);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return datasets.filter((dataset) => {
      const matchesQuery = `${dataset.name} ${dataset.description}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || dataset.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [datasets, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter]);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const created = await datasetService.uploadDataset({
      name,
      description,
      source,
      status: 'processing',
    });

    setDatasets((current) => [created, ...current]);
    setName('');
    setDescription('');
    setSource('');
  };

  return (
    <PageContainer size="full" spacing="spacious">
      <PageHeader
        title="Datasets"
        subtitle="Mock dataset management for NASA battery and internal experimental data"
        breadcrumbs={[{ label: 'Data', path: '/datasets' }, { label: 'Datasets' }]}
      />

      <section className={styles.uploadCard}>
        <div>
          <p className={styles.eyebrow}>Upload UI</p>
          <h2 className={styles.sectionTitle}>Add a dataset placeholder</h2>
          <p className={styles.sectionText}>This form demonstrates the upload workflow without processing or uploading a real ML dataset.</p>
        </div>
        <form className={styles.form} onSubmit={handleUpload}>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Dataset name" required />
          <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" required />
          <input value={source} onChange={(event) => setSource(event.target.value)} placeholder="Source" required />
          <button type="submit">Create mock dataset</button>
        </form>
      </section>

      <section className={styles.controlsCard}>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search datasets" />
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | Dataset['status'])}>
          <option value="all">All statuses</option>
          <option value="ready">Ready</option>
          <option value="processing">Processing</option>
          <option value="error">Error</option>
          <option value="archived">Archived</option>
        </select>
      </section>

      <ChartCard title="Dataset Table" subtitle="Browse available datasets with filters and paging">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Records</th>
                <th>Battery Count</th>
                <th>Updated</th>
                <th>Preview</th>
              </tr>
            </thead>
            <tbody>
              {visibleItems.map((dataset) => (
                <tr key={dataset.id}>
                  <td>
                    <Link to={`/datasets/${dataset.id}`} className={styles.link}>
                      {dataset.name}
                    </Link>
                    <div className={styles.muted}>{dataset.source}</div>
                  </td>
                  <td>{dataset.status}</td>
                  <td>{dataset.recordCount}</td>
                  <td>{dataset.batteryCount}</td>
                  <td>{dataset.uploadedAt}</td>
                  <td>
                    <Link to={`/datasets/${dataset.id}`} className={styles.link}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.pagination}>
          <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      </ChartCard>
    </PageContainer>
  );
}
