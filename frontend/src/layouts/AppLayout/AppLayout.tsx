import React, { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import styles from './AppLayout.module.css';

export const AppLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((c) => !c);
  }, []);

  return (
    <div
      className={styles.layout}
      data-sidebar-collapsed={sidebarCollapsed || undefined}
    >
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className={styles.main}>
        <Topbar />

        <main className={styles.content} role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
