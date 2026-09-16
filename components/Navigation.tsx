'use client';

import { useState } from 'react';
import { Home, Wallet, TrendingUp, History, LogOut, Menu, X } from 'lucide-react';
import styles from '@/styles/Navigation.module.css';

interface NavigationProps {
  onLogout: () => void;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ onLogout, onTabChange }: NavigationProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'wallet', label: 'Carteira', icon: Wallet },
    { id: 'investments', label: 'Investimentos', icon: TrendingUp },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={styles.mobileMenuButton}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>AUTOTRADE IA</h2>
          <button
            className={styles.closeButton}
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul className={styles.navList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    className={`${styles.navItem} ${
                      activeTab === item.id ? styles.active : ''
                    }`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            className={styles.logoutButton}
            onClick={onLogout}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}