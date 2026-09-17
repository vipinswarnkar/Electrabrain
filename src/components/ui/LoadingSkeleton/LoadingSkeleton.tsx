import { cn } from '@/utils/cn';
import styles from './LoadingSkeleton.module.css';

type SkeletonVariant = 'text' | 'title' | 'card' | 'chart' | 'circle';

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
      aria-hidden
    />
  );
}
