import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { cn } from '@/utils/cn';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn(styles.header, className)}>
      <div className={styles.top}>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} className={styles.breadcrumb} />
      )}
    </header>
  );
}
