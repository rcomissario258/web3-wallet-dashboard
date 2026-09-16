'use client';

import styles from '@/styles/WalletSection.module.css';

export default function WalletSection() {
  return (
    <div className={styles.walletSection}>
      <h2 className={styles.sectionTitle}>Carteira</h2>
      
      <div className={styles.walletCards}>
        <div className={styles.walletCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Carteira Principal</h3>
            <span className={styles.cardStatus}>Ativa</span>
          </div>
          <div className={styles.cardBalance}>
            <span className={styles.balanceLabel}>Saldo disponível</span>
            <span className={styles.balanceValue}>$0.08</span>
          </div>
          <div className={styles.cardActions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>Depositar</button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>Sacar</button>
          </div>
        </div>

        <div className={styles.walletCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Carteira de Investimentos</h3>
            <span className={styles.cardStatus}>Ativa</span>
          </div>
          <div className={styles.cardBalance}>
            <span className={styles.balanceLabel}>Valor investido</span>
            <span className={styles.balanceValue}>$1,000,000.122</span>
          </div>
          <div className={styles.cardActions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>Adicionar fundos</button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>Transferir</button>
          </div>
        </div>
      </div>

      <div className={styles.walletInfo}>
        <h3 className={styles.infoTitle}>Informações da Carteira</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Endereço</span>
            <span className={styles.infoValue}>0x1234...5678</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Rede</span>
            <span className={styles.infoValue}>Ethereum Mainnet</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Lucro total</span>
            <span className={`${styles.infoValue} ${styles.profit}`}>+$840.00</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ROI</span>
            <span className={`${styles.infoValue} ${styles.profit}`}>+16.8%</span>
          </div>
        </div>
      </div>
    </div>
  );
}