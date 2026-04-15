import React, { useState } from 'react';
import styles from './Tabs.module.css';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActive,
  onChange,
  className,
}) => {
  const [internalActive, setInternalActive] = useState(
    defaultTab ?? tabs[0]?.id ?? '',
  );
  const activeTab = controlledActive ?? internalActive;

  const handleClick = (tabId: string) => {
    setInternalActive(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <div className={styles.list} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={tab.id === activeTab}
            disabled={tab.disabled}
            className={[
              styles.tab,
              tab.id === activeTab && styles.active,
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.panel} role="tabpanel">
        {activeContent}
      </div>
    </div>
  );
};
