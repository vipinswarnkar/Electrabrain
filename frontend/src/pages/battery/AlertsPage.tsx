import { useEffect, useMemo, useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { AlertCard } from '@/components/ui/AlertCard';
import { Button } from '@/components/ui/Button';
import { alertService } from '@/services';
import type { Alert, AlertSeverity, AlertStatus } from '@/types';
import styles from './BatteryPage.module.css';

const severityOptions: Array<'all' | AlertSeverity> = ['all', 'critical', 'warning', 'info'];
const statusOptions: Array<'all' | AlertStatus> = ['all', 'active', 'resolved'];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [severity, setSeverity] = useState<'all' | AlertSeverity>('all');
  const [status, setStatus] = useState<'all' | AlertStatus>('active');

  useEffect(() => {
    let active = true;

    alertService.getAlerts().then((data) => {
      if (active) {
        setAlerts(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSeverity = severity === 'all' || alert.severity === severity;
      const matchesStatus = status === 'all' || alert.status === status;
      return matchesSeverity && matchesStatus;
    });
  }, [alerts, severity, status]);

  const counts = useMemo(() => {
    return {
      critical: alerts.filter((alert) => alert.severity === 'critical').length,
      warning: alerts.filter((alert) => alert.severity === 'warning').length,
      info: alerts.filter((alert) => alert.severity === 'info').length,
      resolved: alerts.filter((alert) => alert.status === 'resolved').length,
    };
  }, [alerts]);

  return (
    <PageContainer>
      <PageHeader title="Alerts" subtitle="Monitor critical, warning, and informational events across the fleet." />

      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Critical</span>
          <strong>{counts.critical}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Warnings</span>
          <strong>{counts.warning}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Info</span>
          <strong>{counts.info}</strong>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Resolved</span>
          <strong>{counts.resolved}</strong>
        </div>
      </section>

      <section className={styles.toolbar}>
        <div className={styles.chipGroup}>
          {severityOptions.map((option) => (
            <Button
              key={option}
              variant={severity === option ? 'primary' : 'secondary'}
              onClick={() => setSeverity(option)}
            >
              {option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}
            </Button>
          ))}
        </div>
        <div className={styles.chipGroup}>
          {statusOptions.map((option) => (
            <Button
              key={option}
              variant={status === option ? 'primary' : 'secondary'}
              onClick={() => setStatus(option)}
            >
              {option === 'all' ? 'All' : option === 'resolved' ? 'Resolved' : 'Active'}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.list}>
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </section>
    </PageContainer>
  );
}
