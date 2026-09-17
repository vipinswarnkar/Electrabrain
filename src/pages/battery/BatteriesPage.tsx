import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { BatteryTable } from '@/components/ui/BatteryTable';
import { Button } from '@/components/ui/Button';
import { Search } from '@/components/ui/Search';
import { batteryService } from '@/services';
import type { Battery, BatteryStatus } from '@/types';
import styles from './BatteryPage.module.css';

const PAGE_SIZE = 4;
const STATUS_OPTIONS: Array<{ value: 'all' | BatteryStatus; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'online', label: 'Online' },
  { value: 'charging', label: 'Charging' },
  { value: 'discharging', label: 'Discharging' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'critical', label: 'Critical' },
  { value: 'offline', label: 'Offline' },
];

type SortOption = 'updated' | 'soc' | 'soh' | 'rul' | 'cycles';

export function BatteriesPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BatteryStatus>('all');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    batteryService.getBatteries().then((data) => {
      if (active) {
        setBatteries(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, sortBy]);

  const filteredBatteries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let next = [...batteries].filter((battery) => {
      const matchesStatus = statusFilter === 'all' || battery.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [battery.name, battery.serialNumber, battery.model, battery.location ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesStatus && matchesQuery;
    });

    next.sort((left, right) => {
      switch (sortBy) {
        case 'soc':
          return right.soc - left.soc;
        case 'soh':
          return right.soh - left.soh;
        case 'rul':
          return right.rul - left.rul;
        case 'cycles':
          return right.cycleCount - left.cycleCount;
        case 'updated':
        default:
          return new Date(right.lastUpdated).getTime() - new Date(left.lastUpdated).getTime();
      }
    });

    return next;
  }, [batteries, query, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBatteries.length / PAGE_SIZE));
  const paginatedBatteries = filteredBatteries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader
        title="Battery Fleet"
        subtitle="Search, filter, sort, and inspect battery health across the operational fleet."
      />

      <section className={styles.toolbar}>
        <Search value={query} onChange={setQuery} placeholder="Search battery, serial, or site" fullWidth />
        <label className={styles.selectGroup}>
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'all' | BatteryStatus)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.selectGroup}>
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)}>
            <option value="updated">Most recently updated</option>
            <option value="soc">SOC</option>
            <option value="soh">SOH</option>
            <option value="rul">RUL</option>
            <option value="cycles">Cycle count</option>
          </select>
        </label>
        <Button
          variant="secondary"
          onClick={() => {
            setQuery('');
            setStatusFilter('all');
            setSortBy('updated');
          }}
        >
          Reset
        </Button>
      </section>

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Fleet coverage</span>
          <strong>{batteries.length} packs</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Visible packs</span>
          <strong>{filteredBatteries.length}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Page</span>
          <strong>{page} / {totalPages}</strong>
        </div>
      </section>

      <section className={styles.panel}>
        <BatteryTable batteries={paginatedBatteries} />
        <div className={styles.pagination}>
          <Button variant="secondary" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className={styles.paginationStatus}>Page {page} of {totalPages}</span>
          <Button
            variant="secondary"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
