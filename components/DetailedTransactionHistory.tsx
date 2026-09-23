'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download } from 'lucide-react';
import styles from '@/styles/DetailedTransactionHistory.module.css';

export default function DetailedTransactionHistory() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    {
      id: 'TXN-001',
      type: 'deposit',
      amount: 11500.08,
      currency: 'USD',
      status: 'completed',
      date: '2024-09-21T14:30:00',
      description: 'Pagamento Fase 1 - Taxa Operacional',
      from: 'Autotrade AI',
      to: 'Eduardo Oliveira',
      network: 'Bank Transfer',
      fee: 25.00
    },
    {
      id: 'TXN-002',
      type: 'deposit',
      amount: 5750.00,
      currency: 'USD',
      status: 'completed',
      date: '2024-09-21T15:45:00',
      description: 'Taxa Abonatória - Fase 2',
      from: 'Autotrade AI',
      to: 'Eduardo Oliveira',
      network: 'Bank Transfer',
      fee: 15.00
    },
    {
      id: 'TXN-003',
      type: 'withdrawal',
      amount: 500.00,
      currency: 'USDT',
      status: 'pending',
      date: '2024-09-22T10:15:00',
      description: 'Levantamento para carteira externa',
      from: 'Eduardo Oliveira',
      to: '0x1234...5678',
      network: 'TRC20',
      fee: 5.00
    },
    {
      id: 'TXN-004',
      type: 'withdrawal',
      amount: 1000.00,
      currency: 'EUR',
      status: 'failed',
      date: '2024-09-22T11:30:00',
      description: 'Transferência bancária - dados inválidos',
      from: 'Eduardo Oliveira',
      to: 'Banco XYZ',
      network: 'SEPA',
      fee: 10.00
    },
    {
      id: 'TXN-005',
      type: 'deposit',
      amount: 2500.00,
      currency: 'BTC',
      status: 'processing',
      date: '2024-09-23T09:00:00',
      description: 'Depósito de criptomoeda',
      from: 'Carteira Externa',
      to: 'Eduardo Oliveira',
      network: 'BTC',
      fee: 0.0005
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className={styles.completedIcon} />;
      case 'pending':
      case 'processing':
        return <Clock size={16} className={styles.pendingIcon} />;
      case 'failed':
        return <XCircle size={16} className={styles.failedIcon} />;
      default:
        return <AlertCircle size={16} className={styles.warningIcon} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'deposit' ? (
      <ArrowDownLeft size={16} className={styles.depositIcon} />
    ) : (
      <ArrowUpRight size={16} className={styles.withdrawalIcon} />
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter || transaction.status === filter;
    const matchesSearch = searchTerm === '' || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={styles.transactionHistory}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.sectionTitle}>Histórico de Transações</h3>
          <p className={styles.sectionSubtitle}>Todas as suas operações em um só lugar</p>
        </div>
        <button className={styles.exportButton}>
          <Download size={16} />
          <span>Exportar</span>
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'deposit' ? styles.active : ''}`}
            onClick={() => setFilter('deposit')}
          >
            Depósitos
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'withdrawal' ? styles.active : ''}`}
            onClick={() => setFilter('withdrawal')}
          >
            Levantamentos
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Concluídas
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </button>
        </div>
      </div>

      <div className={styles.transactionList}>
        {filteredTransactions.length === 0 ? (
          <div className={styles.emptyState}>
            <AlertCircle size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Nenhuma transação encontrada</p>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`${styles.transactionCard} stagger-item`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.transactionHeader}>
                <div className={styles.transactionIcon}>
                  {getTypeIcon(transaction.type)}
                </div>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionId}>
                    <span className={styles.idLabel}>ID:</span>
                    <span className={styles.idValue}>{transaction.id}</span>
                  </div>
                  <h4 className={styles.transactionDescription}>{transaction.description}</h4>
                </div>
                <div className={`${styles.statusBadge} ${styles[transaction.status]}`}>
                  {getStatusIcon(transaction.status)}
                  <span>{getStatusText(transaction.status)}</span>
                </div>
              </div>

              <div className={styles.transactionDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Montante:</span>
                  <span className={`${styles.detailValue} ${transaction.type === 'deposit' ? styles.positive : styles.negative}`}>
                    {transaction.type === 'deposit' ? '+' : '-'}
                    {transaction.currency} {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Data:</span>
                  <span className={styles.detailValue}>{formatDate(transaction.date)}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>De:</span>
                  <span className={styles.detailValue}>{transaction.from}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Para:</span>
                  <span className={styles.detailValue}>{transaction.to}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Rede:</span>
                  <span className={styles.detailValue}>{transaction.network}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Taxa:</span>
                  <span className={styles.detailValue}>
                    {transaction.currency} {transaction.fee.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.transactionFooter}>
                <button className={styles.viewDetailsButton}>
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <button className={styles.paginationButton} disabled>
          Anterior
        </button>
        <span className={styles.paginationInfo}>
          Página 1 de 1
        </span>
        <button className={styles.paginationButton} disabled>
          Próxima
        </button>
      </div>
    </div>
  );
}