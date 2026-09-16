'use client';

import styles from '@/styles/InvestmentRecovery.module.css';

export default function InvestmentRecovery() {
  const recoveryPercentage = 65;
  const initialInvestment = 5000;
  const recovered = 3250;
  const pending = 1750;
  const nextRecovery = 500;

  return (
    <div className={styles.investmentRecovery}>
      <h3 className={styles.sectionTitle}>RECUPERAÇÃO DO INVESTIMENTO</h3>
      
      <div className={styles.recoveryDetails}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Investimento inicial</span>
          <span className={styles.detailValue}>${initialInvestment.toFixed(2)}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Recuperado</span>
          <span className={styles.detailValue}>${recovered.toFixed(2)}</span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>Pendente</span>
          <span className={styles.detailValue}>${pending.toFixed(2)}</span>
        </div>
      </div>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${recoveryPercentage}%` }}
          />
        </div>
        <span className={styles.progressText}>{recoveryPercentage}%</span>
      </div>

      <div className={styles.nextRecovery}>
        <span className={styles.nextRecoveryLabel}>Próxima recuperação prevista:</span>
        <span className={styles.nextRecoveryValue}>${nextRecovery.toFixed(2)}</span>
      </div>
    </div>
  );
}