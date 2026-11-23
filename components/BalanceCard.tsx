'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight } from 'lucide-react';
import styles from '@/styles/BalanceCard.module.css';

export default function BalanceCard({ totalRecovered: propTotal }: { totalRecovered?: number }) {
  const [totalRecovered, setTotalRecovered] = useState(propTotal || 4600030);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  useEffect(() => {
    if (propTotal) setTotalRecovered(propTotal);
    // Carregar total levantado do localStorage
    const list = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]').map((w:any) => w.id === 'WD-120K-BRL' ? { ...w, exchangeRate: 1.0 } : w);
    let source = list;
    if (!source || source.length === 0) {
      source = [{
        id: 'WD-120K-BRL',
        currency: 'BRL',
        amount: 120000.00,
        status: 'completed',
        exchangeRate: 1.0
      }];
      localStorage.setItem('withdrawalHistory', JSON.stringify(source));
    }
    const completed = source.filter((w:any)=>w.status==='completed'||w.status==='approved');
    let total=0;
    completed.forEach((w:any)=>{
      const cur=w.currency||'USD'; const amt=w.amount||0; const rate=w.exchangeRate||5;
      total += cur==='USD' ? amt : amt/rate;
    });
    setTotalWithdrawn(total);
    localStorage.setItem('totalWithdrawnUSD', total.toString());

    // Listener para atualizar quando localStorage mudar
    const handleStorageChange = () => {
      const updatedTotalWithdrawn = localStorage.getItem('totalWithdrawnUSD');
      if (updatedTotalWithdrawn) {
        setTotalWithdrawn(parseFloat(updatedTotalWithdrawn));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('customStorageUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customStorageUpdate', handleStorageChange);
    };
  }, []);

  // Calcular valor disponível (total recuperado - total levantado)
  const availableBalance = Math.max(0, totalRecovered - totalWithdrawn);

  const balanceData = [
    {
      title: 'SALDO DISPONÍVEL',
      amount: availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: Wallet,
      change: '+2.5%',
      isPositive: true,
      color: '#fc8a00'
    },
    {
      title: 'TOTAL RECUPERADO',
      amount: totalRecovered.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: DollarSign,
      change: '+127.8%',
      isPositive: true,
      color: '#00a4fa'
    },
    {
      title: 'TOTAL LEVANTADO',
      amount: totalWithdrawn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      icon: TrendingUp,
      change: '+0.0%',
      isPositive: true,
      color: '#fc8a00'
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
                backgroundColor: card.isPositive ? 'rgba(0, 164, 250, 0.1)' : 'rgba(0, 63, 160, 0.1)',
                color: card.isPositive ? '#00a4fa' : '#003fa0'
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