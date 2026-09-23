'use client';

import { useState } from 'react';
import { Wallet, Lock, Unlock, ArrowRight } from 'lucide-react';
import WithdrawalModal from './WithdrawalModal';
import styles from '@/styles/WithdrawalPhases.module.css';

export default function WithdrawalPhases() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalAmount = 4000000; // 4 milhões
  const phases = [
    {
      id: 1,
      percentage: 30,
      amount: 1380009.00,
      status: 'available',
      title: '1ª Fase',
      description: '30% do total recuperado'
    },
    {
      id: 2,
      percentage: 50,
      amount: 2300015.00,
      status: 'locked',
      title: '2ª Fase',
      description: '50% do total recuperado'
    },
    {
      id: 3,
      percentage: 20,
      amount: 920006.00,
      status: 'locked',
      title: '3ª Fase',
      description: '20% do total recuperado'
    }
  ];

  const handlePhaseClick = (phaseId: number, isAvailable: boolean) => {
    if (isAvailable) {
      setSelectedPhase(phaseId);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(null);
  };

  return (
    <div className={styles.withdrawalPhases}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>TOTAL RECUPERADO</h3>
        <p className={styles.sectionSubtitle}>Sistema de levantamento por fases</p>
      </div>

      <div className={styles.totalDisplay}>
        <div className={styles.totalIcon}>
          <Wallet size={32} />
        </div>
        <div className={styles.totalInfo}>
          <span className={styles.totalLabel}>Valor Total</span>
          <span className={styles.totalValue}>
            US$ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className={styles.phasesGrid}>
        {phases.map((phase) => {
          const isAvailable = phase.status === 'available';
          return (
            <div
              key={phase.id}
              className={`${styles.phaseCard} ${isAvailable ? styles.available : styles.locked}`}
              onClick={() => handlePhaseClick(phase.id, isAvailable)}
            >
              <div className={styles.phaseHeader}>
                <div className={`${styles.phaseIcon} ${isAvailable ? styles.availableIcon : styles.lockedIcon}`}>
                  {isAvailable ? <Unlock size={20} /> : <Lock size={20} />}
                </div>
                <div className={styles.phaseInfo}>
                  <h4 className={styles.phaseTitle}>{phase.title}</h4>
                  <p className={styles.phaseDescription}>{phase.description}</p>
                </div>
              </div>

              <div className={styles.phaseAmount}>
                <span className={styles.amountLabel}>Montante:</span>
                <span className={styles.amountValue}>
                  US$ {phase.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className={styles.phaseStatus}>
                <span className={`${styles.statusBadge} ${isAvailable ? styles.availableStatus : styles.lockedStatus}`}>
                  {isAvailable ? 'Disponível para levantamento' : 'Bloqueado'}
                </span>
              </div>

              {isAvailable && (
                <div className={styles.phaseAction}>
                  <span className={styles.actionText}>Levantar</span>
                  <ArrowRight size={16} className={styles.actionIcon} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        phase={selectedPhase || 1}
        amount={phases.find(p => p.id === selectedPhase)?.amount || 0}
        isAvailable={selectedPhase !== null && phases.find(p => p.id === selectedPhase)?.status === 'available'}
      />
    </div>
  );
}