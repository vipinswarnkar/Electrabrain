import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button type="button" className={cn(styles.button, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
