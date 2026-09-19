import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again or contact support if the problem persists.',
  icon,
  action,
  compact,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(styles.container, compact && styles.compact, className)} role="alert">
      <div className={styles.iconWrapper}>{icon ?? <AlertTriangle size={24} />}</div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.actions}>{action}</div>}
    </div>
  );
}
