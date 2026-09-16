'use client';

import styles from '@/styles/InvestmentsSection.module.css';

export default function InvestmentsSection() {
  const investments = [
    {
      name: 'Crypto Conservative',
      type: 'Criptomoedas',
      amount: 2000,
      profit: 12.5,
      status: 'Ativo'
    },
    {
      name: 'Stocks Growth',
      type: 'Ações',
      amount: 1500,
      profit: 8.3,
      status: 'Ativo'
    },
    {
      name: 'Forex Strategy',
      type: 'Forex',
      amount: 1000,
      profit: 15.2,
      status: 'Ativo'
    },
    {
      name: 'AI Trading Bot',
      type: 'Automatizado',
      amount: 500,
      profit: 20.1,
      status: 'Ativo'
    }
  ];

  return (
    <div className={styles.investmentsSection}>
      <h2 className={styles.sectionTitle}>Investimentos</h2>
      
      <div className={styles.investmentsGrid}>
        {investments.map((investment, index) => (
          <div key={index} className={styles.investmentCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.investmentName}>{investment.name}</h3>
              <span className={styles.investmentType}>{investment.type}</span>
            </div>
            
            <div className={styles.investmentDetails}>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Valor investido</span>
                <span className={styles.detailValue}>${investment.amount.toLocaleString()}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Lucro</span>
                <span className={`${styles.detailValue} ${styles.profit}`}>+{investment.profit}%</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.detailLabel}>Status</span>
                <span className={`${styles.detailValue} ${styles.status}`}>{investment.status}</span>
              </div>
            </div>

            <div className={styles.investmentActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`}>Gerenciar</button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>Detalhes</button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>Resumo de Investimentos</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Total investido</span>
            <span className={styles.summaryValue}>$5,000.00</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Lucro total</span>
            <span className={`${styles.summaryValue} ${styles.profit}`}>+$840.00</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>ROI médio</span>
            <span className={`${styles.summaryValue} ${styles.profit}`}>+16.8%</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Investimentos ativos</span>
            <span className={styles.summaryValue}>4</span>
          </div>
        </div>
      </div>
    </div>
  );
}