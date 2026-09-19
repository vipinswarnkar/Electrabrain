import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './FilterPanel.module.css';

export interface FilterField {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterPanelProps {
  title?: string;
  fields: FilterField[];
  onApply?: () => void;
  onClear?: () => void;
  footer?: ReactNode;
}

export function FilterPanel({
  title = 'Filters',
  fields,
  onApply,
  onClear,
  footer,
}: FilterPanelProps) {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {onClear && (
          <button type="button" className={styles.clearButton} onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <div className={styles.fields}>
        {fields.map((field) => (
          <div key={field.id} className={styles.field}>
            <label className={styles.fieldLabel} htmlFor={field.id}>
              {field.label}
            </label>
            <select
              id={field.id}
              className={styles.select}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {(onApply || footer) && (
        <div className={styles.footer}>
          {onApply && (
            <Button variant="primary" onClick={onApply}>
              Apply Filters
            </Button>
          )}
          {footer}
        </div>
      )}
    </aside>
  );
}
