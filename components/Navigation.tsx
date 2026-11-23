'use client';

import { useState } from 'react';
import { Home, Wallet, TrendingUp, History, LogOut, Menu, X, User, MessageCircle, ArrowUpRight } from 'lucide-react';
import styles from '@/styles/Navigation.module.css';
import { useLanguage } from '@/components/LanguageProvider';

interface NavigationProps {
  onLogout: () => void;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ onLogout, onTabChange }: NavigationProps) {
  const { t, language, setLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'wallet', label: t('wallet'), icon: Wallet },
    { id: 'investments', label: t('investments'), icon: TrendingUp },
    { id: 'withdrawals', label: t('withdrawals'), icon: ArrowUpRight },
    { id: 'history', label: t('history'), icon: History },
    { id: 'support', label: t('support'), icon: MessageCircle },
    { id: 'settings', label: t('settings'), icon: User },
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
          <img src="/gincana-logo.png" alt="GINCANA" className={styles.sidebarLogo} />
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
          <div className={styles.languageSelector}>
            <label className={styles.languageLabel}>{t('language')}</label>
            <select
              className={styles.languageSelect}
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <button
            className={styles.logoutButton}
            onClick={onLogout}
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
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