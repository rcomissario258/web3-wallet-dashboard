'use client';

import styles from '@/styles/TransactionHistory.module.css';

interface Transaction {
  date: string;
  type: string;
  amount: string;
  status: string;
}

export default function TransactionHistory() {
  const transactions: Transaction[] = [
    {
      date: '16/10/26',
      type: 'Levantamento',
      amount: '+R$120.000,00',
      status: 'Concluído',
    },
    {
      date: '10/10/26',
      type: 'Levantamento',
      amount: '+R$70.000,00',
      status: 'Pendente de aprovação',
    },
    {
      date: '09/10/26',
      type: 'Levantamento',
      amount: '+R$150.000,00',
      status: 'Pendente de aprovação',
    },
    {
      date: '09/10/26',
      type: 'Levantamento',
      amount: '+R$50.000,00',
      status: 'Pendente de aprovação',
    },
  ];

  return (
    <div className={styles.transactionHistory}>
      <h3 className={styles.sectionTitle}>Histórico</h3>
      <div className={styles.transactionList}>
        {transactions.map((tx, index) => (
          <div key={index} className={styles.transactionItem}>
            <div className={styles.transactionDate}>{tx.date}</div>
            <div className={styles.transactionType}>{tx.type}</div>
            <div className={styles.transactionAmount}>{tx.amount}</div>
            <div className={styles.transactionStatus}>{tx.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
