import { Link } from 'react-router-dom';
import type { Battery } from '@/types';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPercent } from '@/utils/formatters';
import styles from './BatteryTable.module.css';

interface BatteryTableProps {
  batteries: Battery[];
}

export function BatteryTable({ batteries }: BatteryTableProps) {
  const columns: Column<Battery>[] = [
    {
      key: 'name',
      header: 'Battery',
      render: (row) => (
        <Link to={`/batteries/${row.id}`} className={styles.link}>
          {row.name}
        </Link>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge label={row.status} status={row.status} />,
    },
    {
      key: 'soc',
      header: 'SOC',
      render: (row) => <span className={styles.numeric}>{formatPercent(row.soc)}</span>,
      align: 'right',
    },
    {
      key: 'soh',
      header: 'SOH',
      render: (row) => <span className={styles.numeric}>{formatPercent(row.soh)}</span>,
      align: 'right',
    },
    {
      key: 'rul',
      header: 'RUL',
      render: (row) => <span className={styles.numeric}>{row.rul} cycles</span>,
      align: 'right',
    },
    {
      key: 'cycles',
      header: 'Cycles',
      render: (row) => <span className={styles.numeric}>{row.cycleCount}</span>,
      align: 'right',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={batteries}
      keyExtractor={(row) => row.id}
      emptyMessage="No batteries found"
    />
  );
}
