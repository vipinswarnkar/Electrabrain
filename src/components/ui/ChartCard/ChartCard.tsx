import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './ChartCard.module.css';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  noPadding?: boolean;
  className?: string;
}

export function ChartCard({
  title,
  subtitle,
  actions,
  footer,
  children,
  noPadding,
  className,
}: ChartCardProps) {
  return (
    <article className={cn(styles.card, className)}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </header>
      <div className={cn(styles.body, noPadding && styles.noPadding)}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </article>
  );
}
