import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styles from './Drawer.module.css';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} role="presentation" />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className={styles.header}>
          <h2 id="drawer-title" className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </aside>
    </>,
    document.body,
  );
}
