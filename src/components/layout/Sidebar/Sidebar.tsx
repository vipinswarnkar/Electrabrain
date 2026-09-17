import type { ComponentType } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Battery,
  Bell,
  HeartPulse,
  TrendingDown,
  RefreshCw,
  Brain,
  GitBranch,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  FlaskConical,
  Database,
  FileText,
  Download,
  Wrench,
  Settings,
  HelpCircle,
  Zap,
  Microscope,
} from 'lucide-react';
import { NAV_SECTIONS } from '@/constants/navigation';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/utils/cn';
import styles from './Sidebar.module.css';

const ICON_MAP: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  Activity,
  Battery,
  Bell,
  HeartPulse,
  TrendingDown,
  RefreshCw,
  Brain,
  GitBranch,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  FlaskConical,
  Database,
  FileText,
  Download,
  Wrench,
  Settings,
  HelpCircle,
};

interface SidebarProps {
  mobileOpen?: boolean;
}

export function Sidebar({ mobileOpen = false }: SidebarProps) {
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={cn(
        styles.sidebar,
        sidebarCollapsed && styles.collapsed,
        mobileOpen && styles.open,
      )}
      aria-label="Main navigation"
    >
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={20} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>ElectraBrain</span>
          <span className={styles.logoSubtitle}>AI Battery Management</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <ul className={styles.navList}>
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
                const active = isActive(item.path);

                return (
                  <li key={item.id}>
                    <NavLink
                      to={item.path}
                      className={cn(styles.navLink, active && styles.active)}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <span className={styles.navIcon}>
                        <Icon size={18} />
                      </span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={styles.badge}>{item.badge}</span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.researchTag}>
          <Microscope size={14} />
          <span>
            Powered by <strong>AHRF</strong> — Adaptive Hybrid Random Forest
          </span>
        </div>
      </div>
    </aside>
  );
}
