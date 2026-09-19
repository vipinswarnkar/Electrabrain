import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore, type Toast as ToastType } from '@/stores/uiStore';
import styles from './Toast.module.css';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useUIStore((state) => state.removeToast);
  const Icon = ICONS[toast.type];

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`} role="alert">
      <Icon size={18} className={styles.icon} />
      <div className={styles.content}>
        <div className={styles.title}>{toast.title}</div>
        {toast.message && <div className={styles.message}>{toast.message}</div>}
      </div>
      <button
        type="button"
        className={styles.close}
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
