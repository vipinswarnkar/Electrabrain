import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import type { BreadcrumbItem } from '@/types';
import styles from './PagePlaceholder.module.css';

interface PagePlaceholderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  section?: string;
}

export function PagePlaceholder({
  title,
  subtitle,
  breadcrumbs,
  section = 'Phase 2 — Content module',
}: PagePlaceholderProps) {
  return (
    <PageContainer>
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <div className={styles.card}>
        <span className={styles.tag}>{section}</span>
        <p className={`body ${styles.message}`}>
          This route is wired into navigation and the global layout. Business logic and content for{' '}
          <strong>{title}</strong> will be implemented in a later phase.
        </p>
      </div>
    </PageContainer>
  );
}
