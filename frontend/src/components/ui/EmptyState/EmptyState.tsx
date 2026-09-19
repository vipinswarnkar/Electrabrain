import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>{icon ?? <Inbox size={28} />}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
