import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import styles from './Search.module.css';

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
}

export function Search({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  fullWidth,
}: SearchProps) {
  return (
    <div className={cn(styles.wrapper, fullWidth && styles.fullWidth, className)}>
      <SearchIcon size={16} className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
