'use client';

import { useState } from 'react';
import UserProfile from './UserProfile';
import BalanceCard from './BalanceCard';
import InvestmentRecovery from './InvestmentRecovery';
import AutotradeEngine from './AutotradeEngine';
import TransactionHistory from './TransactionHistory';
import Navigation from './Navigation';
import WalletSection from './WalletSection';
import InvestmentsSection from './InvestmentsSection';
import UnlockPhases from './UnlockPhases';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>AUTOTRADE IA</h1>
          <p className={styles.loginSubtitle}>AI Automated Investment Platform</p>
          <button
            onClick={() => setIsLoggedIn(true)}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Navigation onLogout={handleLogout} onTabChange={handleTabChange} />
      
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>AUTOTRADE IA</h1>
            <span className={styles.subtitle}>AI Automated Investment Platform</span>
          </div>
        </header>
        
        <main className={styles.main}>
          <div className={styles.container}>
            {activeTab === 'dashboard' && (
              <div className={styles.dashboardGrid}>
                {/* Profile Section */}
                <div className={styles.profileSection}>
                  <UserProfile />
                </div>

                {/* Balance Cards */}
                <div className={styles.balanceSection}>
                  <BalanceCard />
                </div>

                {/* Investment Recovery */}
                <div className={styles.recoverySection}>
                  <InvestmentRecovery />
                </div>

                {/* Unlock Phases */}
                <div className={styles.recoverySection}>
                  <UnlockPhases />
                </div>

                {/* Autotrade AI Engine */}
                <div className={styles.engineSection}>
                  <AutotradeEngine />
                </div>

                {/* Transaction History */}
                <div className={styles.historySection}>
                  <TransactionHistory />
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <WalletSection />
            )}

            {activeTab === 'investments' && (
              <InvestmentsSection />
            )}

            {activeTab === 'history' && (
              <div className={styles.historySection}>
                <TransactionHistory />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
