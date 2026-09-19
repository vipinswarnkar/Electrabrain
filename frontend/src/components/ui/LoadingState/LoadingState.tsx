import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import styles from './LoadingState.module.css';

interface LoadingStateProps {
  message?: string;
  variant?: 'page' | 'inline';
}

export function LoadingState({ message, variant = 'page' }: LoadingStateProps) {
  if (variant === 'inline') {
    return (
      <div className={styles.container} role="status" aria-live="polite" aria-busy="true">
        <LoadingSkeleton variant="text" width="100%" />
        <LoadingSkeleton variant="text" width="80%" />
        {message && <p className={styles.message}>{message}</p>}
      </div>
    );
  }

  return (
    <div className={styles.grid} role="status" aria-live="polite" aria-busy="true">
      <LoadingSkeleton variant="title" />
      <div className={styles.row}>
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
      <LoadingSkeleton variant="chart" />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
