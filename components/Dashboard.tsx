'use client';

import { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import BalanceCard from './BalanceCard';
import GincanaEngine from './GincanaEngine';
import TransactionHistory from './TransactionHistory';
import DetailedTransactionHistory from './DetailedTransactionHistory';
import Navigation from './Navigation';
import WalletSection from './WalletSection';
import InvestmentsSection from './InvestmentsSection';
import UnlockPhases from './UnlockPhases';
import WithdrawalPhases from './WithdrawalPhases';
import WithdrawalHistory from './WithdrawalHistory';
import ProfileSettings from './ProfileSettings';
import NotificationCenter from './NotificationCenter';
import SupportCenter from './SupportCenter';
import LoadingOverlay from './LoadingOverlay';
import styles from '@/styles/Dashboard.module.css';
import { useLanguage } from '@/components/LanguageProvider';

// User data configuration
const USERS = {
  eduardo: {
    username: 'EduardodeOliveira',
    password: 'eduardo123',
    fullName: 'Eduardo Oliveira',
    displayName: 'Eduardo Oliveira',
    usernameHandle: '@eduardo2liveira',
    accountLevel: 'Platinum',
    securityScore: '98%',
    totalRecovered: 4600030,
    phases: [
      { id: 1, percentage: 30, amount: 1380009.00, status: 'available' as const, title: '1ª Fase', description: '30% do total recuperado' },
      { id: 2, percentage: 50, amount: 2300015.00, status: 'available' as const, title: '2ª Fase', description: '50% do total recuperado' },
      { id: 3, percentage: 20, amount: 920006.00, status: 'locked' as const, title: '3ª Fase', description: '20% do total recuperado' }
    ],
    recovery: {
      percentage: 65,
      initialInvestment: 5000,
      recovered: 3250,
      pending: 1750,
      nextRecovery: 500
    },
    isNewUser: false
  },
  francisco: {
    username: 'FranciscoLeite',
    password: 'francisco123',
    fullName: 'FRANCISCO LEITE BEZERRA FRANÇA',
    displayName: 'Francisco Leite Bezerra França',
    usernameHandle: '@franciscolfranca',
    accountLevel: 'Gold',
    securityScore: '95%',
    totalRecovered: 33800,
    phases: [
      { id: 1, percentage: 25, amount: 8450.00, status: 'locked' as const, title: '1ª Fase', description: '25% do total recuperado' },
      { id: 2, percentage: 25, amount: 8450.00, status: 'locked' as const, title: '2ª Fase', description: '25% do total recuperado' },
      { id: 3, percentage: 25, amount: 8450.00, status: 'locked' as const, title: '3ª Fase', description: '25% do total recuperado' },
      { id: 4, percentage: 25, amount: 8450.00, status: 'locked' as const, title: '4ª Fase', description: '25% do total recuperado' }
    ],
    recovery: {
      percentage: 0,
      initialInvestment: 33800,
      recovered: 0,
      pending: 33800,
      nextRecovery: 8450
    },
    isNewUser: true
  },
  teste: {
    username: 'teste',
    password: 'teste123',
    fullName: 'Usuario Teste',
    displayName: 'Usuario Teste',
    usernameHandle: '@teste',
    accountLevel: 'Silver',
    securityScore: '90%',
    totalRecovered: 10000,
    phases: [
      { id: 1, percentage: 50, amount: 5000.00, status: 'available' as const, title: '1ª Fase', description: '50% do total recuperado' },
      { id: 2, percentage: 50, amount: 5000.00, status: 'locked' as const, title: '2ª Fase', description: '50% do total recuperado' }
    ],
    recovery: {
      percentage: 50,
      initialInvestment: 10000,
      recovered: 5000,
      pending: 5000,
      nextRecovery: 2500
    },
    isNewUser: false
  },
  wolfgang: {
    username: 'WolfgangSieder',
    password: 'wolfgang123',
    fullName: 'Wolfgang Sieder-Scheidt',
    displayName: 'Wolfgang Sieder-Scheidt',
    usernameHandle: '@wolfgang',
    accountLevel: 'Gold',
    securityScore: '92%',
    totalRecovered: 30401.02,
    phases: [
      { id: 1, percentage: 33, amount: 10133.67, status: 'locked' as const, title: '1ª Fase', description: '33% do total recuperado' },
      { id: 2, percentage: 33, amount: 10133.67, status: 'locked' as const, title: '2ª Fase', description: '33% do total recuperado' },
      { id: 3, percentage: 34, amount: 10133.68, status: 'locked' as const, title: '3ª Fase', description: '34% do total recuperado' }
    ],
    recovery: {
      percentage: 100,
      initialInvestment: 10000,
      recovered: 30401.02,
      pending: 0,
      nextRecovery: 0
    },
    isNewUser: false
  }
};

export default function Dashboard() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentUser, setCurrentUser] = useState<keyof typeof USERS | null>(null);

  const createConfetti = () => {
    const pieces = Array.from({ length: 50 }, (_, i) => i);
    setConfettiPieces(pieces);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 30000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn && mounted) {
      createConfetti();
    }
  }, [isLoggedIn, mounted]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setLoginError('');
    setCurrentUser(null);
    try { localStorage.removeItem('currentUser'); } catch (e) {}
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check against configured users
    let foundUser: keyof typeof USERS | null = null;
    for (const [key, user] of Object.entries(USERS)) {
      if (username === user.username && password === user.password) {
        foundUser = key as keyof typeof USERS;
        break;
      }
    }

    if (foundUser) {
      setIsLoading(true);
      setLoadingProgress(0);
      
      // Simular progresso do loading
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 3.33; // 100% em 30 segundos
        });
      }, 1000);

      // 30 segundos de loading
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsLoading(false);
        setIsLoggedIn(true);
        setCurrentUser(foundUser);
        setLoginError('');
        try {
          localStorage.setItem('currentUser', foundUser);
          localStorage.removeItem('withdrawalHistory');
          localStorage.setItem('totalWithdrawnUSD', '0');
          if (foundUser === 'eduardo' || foundUser === 'teste') {
            // manter levantamento aprovado do eduardo
            if (foundUser === 'eduardo') {
              localStorage.setItem('withdrawalHistory', JSON.stringify([{
                id: 'WD-120K-BRL',
                currency: 'BRL',
                amount: 120000.00,
                status: 'completed',
                exchangeRate: 1.0
              }]));
              localStorage.setItem('totalWithdrawnUSD', '120000');
            }
          }
          window.dispatchEvent(new Event('customStorageUpdate'));
        } catch (e) {}
      }, 30000);
    } else {
      setLoginError(t('invalidCredentials'));
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginScreen}>
        <div className={styles.loginBackground}>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
          <div className={styles.particle}></div>
        </div>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>
            <div className={styles.logoImageWrapper}>
              <img src="/gincana-logo.png" alt="GINCANA" className={styles.logoImage} />
            </div>
          </div>
          <h1 className={styles.loginTitle}>{t('welcomeBack')}</h1>
          <p className={styles.loginSubtitle}>{t('loginSubtitle')}</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>{t('username')}</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>{t('password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            {loginError && <p className={styles.loginError}>{loginError}</p>}
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              <span className={styles.btnText}>{t('login')}</span>
              <span className={styles.btnGlow}></span>
            </button>
          </form>
          <div className={styles.loginFooter}>
            <p className={styles.copyright}>© 2024 GINCANA. Todos os direitos reservados.</p>
          </div>
        </div>
        <LoadingOverlay 
          isVisible={isLoading} 
          message="Autenticando..."
          progress={loadingProgress}
        />
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <Navigation onLogout={handleLogout} onTabChange={handleTabChange} />
      
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{t('appTitle')}</h1>
            <span className={styles.subtitle}>Automated Investment Platform</span>
          </div>
          <NotificationCenter />
        </header>
        
        <main className={styles.main}>
          <div className={styles.container}>
            {activeTab === 'dashboard' && currentUser && (
              <div className={styles.dashboardGrid}>
                {/* Profile Section */}
                <div className={`${styles.profileSection} ${styles.fadeIn} ${styles.stagger1}`}>
                  <UserProfile userData={USERS[currentUser]} />
                </div>

                {/* Balance Cards */}
                <div className={`${styles.balanceSection} ${styles.fadeIn} ${styles.stagger2}`}>
                  <BalanceCard totalRecovered={USERS[currentUser].totalRecovered} />
                </div>

                {/* Withdrawal Phases */}
                <div className={`${styles.withdrawalSection} ${styles.fadeIn} ${styles.stagger3}`}>
                  <WithdrawalPhases totalAmount={USERS[currentUser].totalRecovered} phases={USERS[currentUser].phases} />
                </div>

                {/* Unlock Phases */}
                <div className={`${styles.recoverySection} ${styles.fadeIn} ${styles.stagger4}`}>
                  <UnlockPhases />
                </div>

                {/* Gincana Engine */}
                <div className={`${styles.engineSection} ${styles.fadeIn} ${styles.stagger5}`}>
                  <GincanaEngine />
                </div>

                {/* Transaction History - Only show for existing users */}
                {!USERS[currentUser].isNewUser && (
                  <div className={`${styles.historySection} ${styles.fadeIn} ${styles.stagger6}`}>
                    <TransactionHistory />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wallet' && (
              <WalletSection />
            )}

            {activeTab === 'investments' && currentUser && (
              <InvestmentsSection recoveryData={USERS[currentUser].recovery} />
            )}

            {activeTab === 'withdrawals' && currentUser && !USERS[currentUser].isNewUser ? (
              <div className={styles.withdrawalSection}>
                <WithdrawalHistory />
              </div>
            ) : activeTab === 'withdrawals' && currentUser && USERS[currentUser].isNewUser ? (
              <div className={styles.withdrawalSection}>
                <div className={styles.emptyState}>
                  <p>Nenhum histórico de levantamento disponível para novos usuários.</p>
                </div>
              </div>
            ) : null}

            {activeTab === 'history' && currentUser && !USERS[currentUser].isNewUser ? (
              <div className={styles.historySection}>
                <DetailedTransactionHistory />
              </div>
            ) : activeTab === 'history' && currentUser && USERS[currentUser].isNewUser ? (
              <div className={styles.historySection}>
                <div className={styles.emptyState}>
                  <p>Nenhum histórico de transações disponível para novos usuários.</p>
                </div>
              </div>
            ) : null}

            {activeTab === 'settings' && (
              <div className={styles.settingsSection}>
                <ProfileSettings />
              </div>
            )}

            {activeTab === 'support' && (
              <div className={styles.supportSection}>
                <SupportCenter />
              </div>
            )}
          </div>
        </main>
      </div>

      {showCelebration && (
        <div className={styles.celebrationOverlay}>
          {confettiPieces.map((piece, index) => (
            <div
              key={piece}
              className={styles.confetti}
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#fc8a00', '#fc8a00', '#fc8a00', '#fc8a00', '#fc8a00', '#003fa0', '#00a4fa', '#00a4fa'][Math.floor(Math.random() * 8)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${4 + Math.random() * 3}s`,
              }}
            />
          ))}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className={styles.sparkleParticle}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`light-${i}`}
              className={styles.lightRay}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${5 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
