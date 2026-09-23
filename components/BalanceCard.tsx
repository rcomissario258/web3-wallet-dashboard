'use client';

import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight } from 'lucide-react';
import styles from '@/styles/BalanceCard.module.css';

export default function BalanceCard() {
  const balanceData = [
    {
      title: 'SALDO DISPONÍVEL',
      amount: '0.08',
      icon: Wallet,
      change: '+2.5%',
      isPositive: true,
      color: '#3b82f6'
    },
    {
      title: 'TOTAL RECUPERADO',
      amount: '4,600,030.00',
      icon: DollarSign,
      change: '+127.8%',
      isPositive: true,
      color: '#10b981'
    },
    {
      title: 'VALOR INVESTIDO',
      amount: '1,000,000.122',
      icon: TrendingUp,
      change: '+460.0%',
      isPositive: true,
      color: '#f59e0b'
    }
  ];

  return (
    <div className={styles.balanceCards}>
      {balanceData.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={styles.balanceCard} style={{ '--card-color': card.color } as React.CSSProperties}>
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer} style={{ backgroundColor: `${card.color}20` }}>
                <Icon size={24} style={{ color: card.color }} />
              </div>
              <div className={styles.changeBadge} style={{ 
                backgroundColor: card.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: card.isPositive ? '#10b981' : '#ef4444'
              }}>
                {card.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{card.change}</span>
              </div>
            </div>
            
            <h3 className={styles.cardTitle}>{card.title}</h3>
            
            <div className={styles.balanceValue}>
              <span className={styles.currencySymbol}>US$</span>
              <span className={styles.amount}>{card.amount}</span>
            </div>
            
            <div className={styles.cardFooter}>
              <span className={styles.lastUpdate}>Atualizado agora</span>
              <ArrowUpRight size={16} className={styles.arrowIcon} />
            </div>
          </div>
        );
      })}
    </div>
  );
}