'use client';

import { Shield, Verified, Clock, Settings } from 'lucide-react';
import styles from '@/styles/UserProfile.module.css';

interface UserProfileProps {
  userData: {
    displayName: string;
    usernameHandle: string;
    accountLevel: string;
    securityScore: string;
  };
}

export default function UserProfile({ userData }: UserProfileProps) {
  const initial = userData.displayName.charAt(0).toUpperCase();

  return (
    <div className={styles.userProfile}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.verifiedBadge}>
            <Verified size={12} />
          </div>
        </div>
        
        <div className={styles.userInfo}>
          <div className={styles.userMeta}>
            <h3 className={styles.userName}>{userData.displayName}</h3>
            <div className={styles.verifiedTag}>
              <Shield size={12} />
              <span>Verificado</span>
            </div>
          </div>
          <p className={styles.username}>{userData.usernameHandle}</p>
        </div>
        
        <button className={styles.settingsButton}>
          <Settings size={20} />
        </button>
      </div>
      
      <div className={styles.profileStats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{userData.accountLevel}</div>
          <div className={styles.statLabel}>Nível da Conta</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <div className={styles.statValue}>{userData.securityScore}</div>
          <div className={styles.statLabel}>Score de Segurança</div>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            <Clock size={14} />
            <span>2h</span>
          </div>
          <div className={styles.statLabel}>Última Atividade</div>
        </div>
      </div>
    </div>
  );
}