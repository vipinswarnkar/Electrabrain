import { useState } from 'react';
import { Bell, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { Search } from '@/components/ui/Search';
import { Dropdown } from '@/components/ui/Dropdown';
import { DatePicker } from '@/components/ui/DatePicker';
import styles from './Navbar.module.css';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  showDateRange?: boolean;
}

export function Navbar({ onMobileMenuToggle, showDateRange = false }: NavbarProps) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={onMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className={styles.searchWrapper}>
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search batteries, alerts..."
          />
        </div>
      </div>

      <div className={styles.right}>
        {showDateRange && <DatePicker />}

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.notificationDot} />
        </button>

        <span className={styles.divider} />

        <Dropdown />
      </div>
    </header>
  );
}
