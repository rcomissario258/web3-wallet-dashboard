'use client';

import styles from '@/styles/InvestmentRecovery.module.css';

interface RecoveryData {
  percentage: number;
  initialInvestment: number;
  recovered: number;
  pending: number;
  nextRecovery: number;
}

interface InvestmentRecoveryProps {
  recoveryData: RecoveryData;
}

export default function InvestmentRecovery({ recoveryData }: InvestmentRecoveryProps) {
  const { percentage, initialInvestment, recovered, pending, nextRecovery } = recoveryData;

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
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={styles.progressText}>{percentage}%</span>
      </div>

      <div className={styles.nextRecovery}>
        <span className={styles.nextRecoveryLabel}>Próxima recuperação prevista:</span>
        <span className={styles.nextRecoveryValue}>${nextRecovery.toFixed(2)}</span>
      </div>
    </div>
  );
}