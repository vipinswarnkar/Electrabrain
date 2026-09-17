import { Calendar } from 'lucide-react';
import styles from './DatePicker.module.css';

const RANGES = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

export function DatePicker() {
  return (
    <div className={styles.wrapper}>
      <Calendar size={16} className={styles.icon} />
      <select className={styles.select} defaultValue="30d" aria-label="Date range">
        {RANGES.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}
