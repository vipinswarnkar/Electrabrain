import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray-500)' }}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ textAlign: col.align ?? 'left' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{ textAlign: col.align ?? 'left' }}
                  className={cn(col.className)}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
