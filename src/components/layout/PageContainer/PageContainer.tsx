import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './PageContainer.module.css';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'full';
  spacing?: 'compact' | 'default' | 'spacious';
}

export function PageContainer({
  children,
  className,
  size = 'default',
  spacing = 'default',
}: PageContainerProps) {
  return (
    <div
      className={cn(
        styles.container,
        styles[size],
        spacing !== 'default' && styles[spacing],
        className,
      )}
    >
      {children}
    </div>
  );
}
