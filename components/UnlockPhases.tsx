'use client';

import styles from '@/styles/UnlockPhases.module.css';

export default function UnlockPhases() {
  const logisticsFee = {
    percentage: 50,
    paid: 4500.08,
    currency: 'USDT',
    remaining: 7000.00
  };

  const phase1 = {
    name: 'FASE 1',
    percentage: 30,
    amount: 1380009.00,
    status: 'PENDENTE',
    description: 'Aguardando a conclusão do pagamento total da Fase 1 da operação logística'
  };

  const phase2 = {
    name: 'FASE 2',
    percentage: 50,
    amount: 2300015.00,
    status: 'PENDENTE',
    description: 'Aguardando a conclusão do pagamento total da Fase 2 da operação logística'
  };

  const phase3 = {
    name: 'FASE 3',
    percentage: 20,
    amount: 920006.00,
    status: 'PENDENTE',
    description: 'Aguardando a conclusão do pagamento total da Fase 2 da operação logística'
  };

  return (
    <div className={styles.unlockPhases}>
      <h3 className={styles.sectionTitle}>FASES DE DESBLOQUEIO</h3>
      
      {/* Fase 1 - Taxa Operação Logística */}
      <div className={styles.phaseCard}>
        <div className={styles.phaseHeader}>
          <h4 className={styles.phaseTitle}>FASE 1 - Taxa da operação logística</h4>
          <span className={styles.phasePercentage}>{logisticsFee.percentage}%</span>
        </div>
        
        <div className={styles.phaseDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Valor Pago</span>
            <span className={styles.detailValue}>{logisticsFee.paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {logisticsFee.currency}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Remanescente</span>
            <span className={`${styles.detailValue} ${styles.highlight}`}>US$ {logisticsFee.remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Fase 2 - Desbloqueio 30% */}
      <div className={styles.phaseCard}>
        <div className={styles.phaseHeader}>
          <h4 className={styles.phaseTitle}>1ª fase - Desbloqueio 30%</h4>
          <span className={`${styles.phasePercentage} ${styles.pending}`}>{phase1.percentage}%</span>
        </div>
        
        <div className={styles.phaseDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Valor a ser desbloqueado</span>
            <span className={styles.detailValue}>US$ {phase1.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estado</span>
            <span className={`${styles.statusBadge} ${styles.statusPending}`}>{phase1.status}</span>
          </div>
          <div className={styles.phaseDescription}>
            <p>{phase1.description}</p>
          </div>
        </div>
      </div>

      {/* Fase 3 - Desbloqueio 50% */}
      <div className={styles.phaseCard}>
        <div className={styles.phaseHeader}>
          <h4 className={styles.phaseTitle}>2ª fase - Desbloqueio 50%</h4>
          <span className={`${styles.phasePercentage} ${styles.pending}`}>{phase2.percentage}%</span>
        </div>
        
        <div className={styles.phaseDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Valor a ser desbloqueado</span>
            <span className={styles.detailValue}>US$ {phase2.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estado</span>
            <span className={`${styles.statusBadge} ${styles.statusPending}`}>{phase2.status}</span>
          </div>
          <div className={styles.phaseDescription}>
            <p>{phase2.description}</p>
          </div>
        </div>
      </div>

      {/* Fase 4 - Desbloqueio 20% */}
      <div className={styles.phaseCard}>
        <div className={styles.phaseHeader}>
          <h4 className={styles.phaseTitle}>3ª fase - Desbloqueio 20%</h4>
          <span className={`${styles.phasePercentage} ${styles.pending}`}>{phase3.percentage}%</span>
        </div>
        
        <div className={styles.phaseDetails}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Valor a ser desbloqueado</span>
            <span className={styles.detailValue}>US$ {phase3.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Estado</span>
            <span className={`${styles.statusBadge} ${styles.statusPending}`}>{phase3.status}</span>
          </div>
          <div className={styles.phaseDescription}>
            <p>{phase3.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
