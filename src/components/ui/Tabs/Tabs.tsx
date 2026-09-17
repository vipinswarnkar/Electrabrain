import { useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  variant?: 'pills' | 'underline';
  className?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({
  items,
  defaultTab,
  variant = 'pills',
  className,
  onChange,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? items[0]?.id ?? '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = items.find((item) => item.id === activeTab)?.content;

  return (
    <div className={cn(styles.tabs, variant === 'underline' && styles.underline, className)}>
      <div className={styles.list} role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTab === item.id}
            className={cn(styles.tab, activeTab === item.id && styles.active)}
            onClick={() => handleTabChange(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
}
