'use client';

import { useState, useEffect } from 'react';
import { Wallet, Lock, Unlock, ArrowRight } from 'lucide-react';
import WithdrawalModal from './WithdrawalModal';
import styles from '@/styles/WithdrawalPhases.module.css';
import { useLanguage } from '@/components/LanguageProvider';

interface Phase {
  id: number;
  percentage: number;
  amount: number;
  status: 'available' | 'locked';
  title: string;
  description: string;
}

interface WithdrawalPhasesProps {
  totalAmount: number;
  phases: Phase[];
}

export default function WithdrawalPhases({ totalAmount, phases }: WithdrawalPhasesProps) {
  const { t } = useLanguage();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  const fallbackRates: Record<string, number> = {
    USD: 1, EUR: 0.92, USDT: 1, BTC: 0.000015, ETH: 0.00031, BRL: 5.0,
    GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, SOL: 3.72,
    ARS: 850.0, MXN: 17.2, COP: 4100
  };

  const calculateApprovedUSD = (list: any[]) => {
    const completed = list.filter((w: any) => w.status === 'completed' || w.status === 'approved');
    let total = 0;
    completed.forEach((w: any) => {
      const currency = w.currency || 'USD';
      const amount = w.amount || 0;
      const rate = w.exchangeRate || fallbackRates[currency] || 1;
      if (currency === 'USD') total += amount;
      else total += amount / rate;
    });
    return total;
  };

  useEffect(() => {
    const load = () => {
      let saved = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
      if (!saved || saved.length === 0) {
        // garantir levantamento aprovado conhecido
        saved = [{
          id: 'WD-120K-BRL',
          currency: 'BRL',
          amount: 120000.00,
          status: 'completed',
          exchangeRate: 5.0
        }];
        localStorage.setItem('withdrawalHistory', JSON.stringify(saved));
      }
      const total = calculateApprovedUSD(saved);
      setTotalWithdrawn(total);
      localStorage.setItem('totalWithdrawnUSD', total.toString());
      window.dispatchEvent(new Event('customStorageUpdate'));
    };
    load();

    const handleStorageChange = () => load();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customStorageUpdate', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customStorageUpdate', handleStorageChange);
    };
  }, []);

  // Calcular saldo disponível
  const availableBalance = totalAmount - totalWithdrawn;

  // Recalcular valores das fases baseado no saldo disponível
  const adjustedPhases = phases.map(phase => {
    // Reduzir o valor disponível da fase 1 em função dos levantamentos concluídos (aprovados),
    // ignorando os pendentes
    let adjustedAmount = phase.amount;
    if (phase.id === 1 && phase.status === 'available') {
      adjustedAmount = Math.max(0, phase.amount - totalWithdrawn);
    }
    return {
      ...phase,
      amount: phase.status === 'available' ? Math.min(adjustedAmount, availableBalance) : phase.amount
    };
  });

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
        <h3 className={styles.sectionTitle}>{t('totalRecovered').toUpperCase()}</h3>
        <p className={styles.sectionSubtitle}>Sistema de levantamento por fases</p>
      </div>

      <div className={styles.totalDisplay}>
        <div className={styles.totalIcon}>
          <Wallet size={32} />
        </div>
        <div className={styles.totalInfo}>
          <span className={styles.totalLabel}>{t('availableBalance')}</span>
          <span className={styles.totalValue}>
            US$ {availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className={styles.phasesGrid}>
        {adjustedPhases.map((phase) => {
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
                <span className={styles.amountLabel}>{t('amount')}:</span>
                <span className={styles.amountValue}>
                  US$ {phase.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className={styles.phaseStatus}>
                <span className={`${styles.statusBadge} ${isAvailable ? styles.availableStatus : styles.lockedStatus}`}>
                  {isAvailable ? t('available') : t('locked')}
                </span>
              </div>

              {isAvailable && (
                <div className={styles.phaseAction}>
                  <span className={styles.actionText}>{t('withdraw')}</span>
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
        amount={adjustedPhases.find(p => p.id === selectedPhase)?.amount || 0}
        isAvailable={selectedPhase !== null && adjustedPhases.find(p => p.id === selectedPhase)?.status === 'available'}
      />
    </div>
  );
}