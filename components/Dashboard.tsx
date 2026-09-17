'use client';

import { useState } from 'react';
import UserProfile from './UserProfile';
import BalanceCard from './BalanceCard';
import AutotradeEngine from './AutotradeEngine';
import TransactionHistory from './TransactionHistory';
import Navigation from './Navigation';
import WalletSection from './WalletSection';
import InvestmentsSection from './InvestmentsSection';
import UnlockPhases from './UnlockPhases';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'eduardo2liveira' && password === 'eduardo123') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas');
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>AUTOTRADE</h1>
          <p className={styles.loginSubtitle}>Automated Investment Platform</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.formInput}
                placeholder="digite seu email"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                placeholder="digite sua senha"
                required
              />
            </div>
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Entrar
            </button>
          </form>
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
            <h1 className={styles.title}>AUTOTRADE</h1>
            <span className={styles.subtitle}>Automated Investment Platform</span>
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

                {/* Unlock Phases */}
                <div className={styles.recoverySection}>
                  <UnlockPhases />
                </div>

                {/* Autotrade Engine */}
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
