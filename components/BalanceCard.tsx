'use client';

import styles from '@/styles/BalanceCard.module.css';

export default function BalanceCard() {
  return (
    <div className={styles.balanceCards}>
      <div className={styles.balanceCard}>
        <h3 className={styles.cardTitle}>SALDO ACTUAL</h3>
        <div className={styles.balanceValue}>
          <span className={styles.amount}>$ 5,840.00</span>
          <span className={styles.profit}>+ $840.00</span>
        </div>
      </div>
      <div className={styles.balanceCard}>
        <h3 className={styles.cardTitle}>VALOR INVESTIDO</h3>
        <div className={styles.balanceValue}>
          <span className={styles.amount}>$ 5,000.00</span>
        </div>
      </div>
    </div>
  );
}