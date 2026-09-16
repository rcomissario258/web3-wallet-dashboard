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
      date: '12 Sep',
      type: 'Recuperação',
      amount: '+$500.00',
      status: 'Concluído',
    },
    {
      date: '05 Sep',
      type: 'Lucro IA',
      amount: '+$180.00',
      status: 'Concluído',
    },
    {
      date: '29 Aug',
      type: 'Recuperação',
      amount: '+$350.00',
      status: 'Concluído',
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
