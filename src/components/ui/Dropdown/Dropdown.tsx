import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import styles from './Dropdown.module.css';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Dropdown() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setOpen(false);
  };

  if (!user) return null;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className={styles.avatar}>{getInitials(user.name)}</span>
        <span className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userRole}>{user.role}</span>
        </span>
        <ChevronDown size={16} className={styles.chevron} />
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <Link to="/settings/profile" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}>
            <User size={16} />
            Profile
          </Link>
          <Link to="/settings" className={styles.menuItem} role="menuitem" onClick={() => setOpen(false)}>
            <Settings size={16} />
            Settings
          </Link>
          <div className={styles.divider} />
          <button type="button" className={`${styles.menuItem} ${styles.danger}`} onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
