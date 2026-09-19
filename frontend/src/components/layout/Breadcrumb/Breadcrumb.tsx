import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/utils/cn';
import styles from './Breadcrumb.module.css';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn(styles.breadcrumb, className)} aria-label="Breadcrumb">
      <span className={styles.item}>
        <Link to="/dashboard" className={styles.link} aria-label="Home">
          <Home size={14} />
        </Link>
      </span>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className={styles.item}>
            <ChevronRight size={14} className={styles.separator} aria-hidden />
            {item.path && !isLast ? (
              <Link to={item.path} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
