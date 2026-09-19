import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { PageContainer } from '@/components/layout/PageContainer';
import { ToastContainer } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/cn';
import styles from './AppLayout.module.css';

const DATE_RANGE_ROUTES = [
  '/dashboard',
  '/monitoring',
  '/analytics/health',
  '/analytics/degradation',
  '/analytics/cycles',
  '/predictions',
];

export function AppLayout() {
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const showDateRange = DATE_RANGE_ROUTES.some(
    (route) => location.pathname === route || location.pathname.startsWith(`${route}/`),
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.appLayout}>
      <Sidebar mobileOpen={mobileOpen} />

      {mobileOpen && (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={cn(styles.mainWrapper, sidebarCollapsed && styles.collapsed)}>
        <Navbar
          showDateRange={showDateRange}
          onMobileMenuToggle={() => setMobileOpen((prev) => !prev)}
        />
        <main className={styles.content}>
          <ErrorBoundary
            fallback={
              <PageContainer>
                <ErrorState
                  title="Unable to load page"
                  description="This page encountered an error. Try refreshing or return to the dashboard."
                  compact
                  action={
                    <>
                      <Button variant="primary" onClick={() => window.location.reload()}>
                        Refresh
                      </Button>
                      <Button variant="secondary" onClick={() => window.location.assign('/dashboard')}>
                        Dashboard
                      </Button>
                    </>
                  }
                />
              </PageContainer>
            }
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
