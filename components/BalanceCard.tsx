'use client';

import styles from '@/styles/BalanceCard.module.css';

export default function BalanceCard() {
  return (
    <div className={styles.balanceCards}>
      <div className={styles.balanceCard}>
        <h3 className={styles.cardTitle}>SALDO DISPONÍVEL</h3>
        <div className={styles.balanceValue}>
          <span className={styles.amount}>$ 0.08</span>
        </div>
      </div>
      <div className={styles.balanceCard}>
        <h3 className={styles.cardTitle}>TOTAL RECUPERADO</h3>
        <div className={styles.balanceValue}>
          <span className={styles.amount}>$ 4,600,030.00</span>
        </div>
      </div>
      <div className={styles.balanceCard}>
        <h3 className={styles.cardTitle}>VALOR INVESTIDO</h3>
        <div className={styles.balanceValue}>
          <span className={styles.amount}>$ 1,000,000.122</span>
        </div>
      </div>
    </div>
  );
}