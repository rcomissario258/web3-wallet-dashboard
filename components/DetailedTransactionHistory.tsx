'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download, FileText, X } from 'lucide-react';
import styles from '@/styles/DetailedTransactionHistory.module.css';

export default function DetailedTransactionHistory() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser === 'wolfgang') {
      setTransactions([]);
      return;
    }
    setTransactions([
    {
      id: 'WD-120K-BRL',
      type: 'withdrawal',
      amount: 120000.00,
      currency: 'BRL',
      status: 'completed',
      date: '2026-10-16T10:03:39',
      description: 'Levantamento - Brasil Bitcoin',
      from: 'Eduardo Oliveira',
      to: 'TYcDTj5PNTnorhehnkCEcxwRLMzSBLXawD',
      network: 'Tron',
      fee: 0.00
    },
    {
      id: 'WD-70K-BRL',
      type: 'withdrawal',
      amount: 70000.00,
      currency: 'BRL',
      status: 'pending_approval',
      date: '2026-10-10T14:30:00',
      description: 'Levantamento - Brasil Bitcoin',
      from: 'Eduardo Oliveira',
      to: 'TYcDTj5PNTnorhehnkCEcxwRLMzSBLXawD',
      network: 'Tron',
      fee: 0.00
    },
    {
      id: 'WD-50K-BRL',
      type: 'withdrawal',
      amount: 50000.00,
      currency: 'BRL',
      status: 'pending_approval',
      date: '2026-10-09T10:30:00',
      description: 'Levantamento - BRADESCO',
      from: 'Eduardo Oliveira',
      to: 'BRADESCO - Agência N/A, Conta N/A',
      network: 'Transferência Bancária',
      fee: 0.00
    },
    {
      id: 'WD-150K-BRL',
      type: 'withdrawal',
      amount: 150000.00,
      currency: 'BRL',
      status: 'pending_approval',
      date: '2026-10-09T13:18:00',
      description: 'Levantamento - 1ª Fase',
      from: 'Eduardo Oliveira',
      to: 'bc1qttgzghlagrncvhkmu9zqh9jn99f68e6rfn7rzc',
      network: 'BTC',
      fee: 0.00
    },
    {
      id: 'TXN-001',
      type: 'deposit',
      amount: 11500.08,
      currency: 'USD',
      status: 'completed',
      date: '2024-09-21T14:30:00',
      description: 'Pagamento Fase 1 - Taxa Operacional',
      from: 'GINCANA',
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
      from: 'GINCANA',
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
  ]);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className={styles.completedIcon} />;
      case 'pending':
      case 'processing':
      case 'pending_approval':
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
      case 'pending_approval':
        return 'Pendente de aprovação';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'BRL': 'R$',
      'BTC': '₿',
      'ETH': 'Ξ',
      'USDT': '₮'
    };
    return symbols[currency] || currency;
  };

  const getLocaleForCurrency = (currency: string) => {
    const localeMap: { [key: string]: string } = {
      'BRL': 'pt-BR',
      'EUR': 'pt-PT',
      'GBP': 'en-GB',
      'JPY': 'ja-JP',
      'CNY': 'zh-CN',
      'KRW': 'ko-KR',
      'RUB': 'ru-RU',
      'INR': 'en-IN',
      'USD': 'en-US'
    };
    return localeMap[currency] || 'en-US';
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

  const openDetailsModal = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const closeDetailsModal = () => {
    setSelectedTransaction(null);
  };

  const openReceiptModal = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };

  const closeReceiptModal = () => {
    setShowReceiptModal(false);
    setSelectedTransaction(null);
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
                    {getCurrencySymbol(transaction.currency)} {transaction.amount.toLocaleString(getLocaleForCurrency(transaction.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    {getCurrencySymbol(transaction.currency)} {transaction.fee.toLocaleString(getLocaleForCurrency(transaction.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className={styles.transactionFooter}>
                <button
                  className={styles.viewDetailsButton}
                  onClick={() => openDetailsModal(transaction)}
                >
                  Ver Detalhes
                </button>
                {transaction.status === 'completed' && (
                  <button
                    className={styles.receiptButton}
                    onClick={() => openReceiptModal(transaction)}
                  >
                    <FileText size={16} />
                    <span>Gerar Recibo</span>
                  </button>
                )}
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

      {/* Details Modal */}
      {selectedTransaction && !showReceiptModal && (
        <div className={styles.modalOverlay} onClick={closeDetailsModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Detalhes da Transação</h3>
              <button className={styles.closeButton} onClick={closeDetailsModal}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>ID:</span>
                <span className={styles.detailValue}>{selectedTransaction.id}</span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Descrição:</span>
                <span className={styles.detailValue}>{selectedTransaction.description}</span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Tipo:</span>
                <span className={styles.detailValue}>
                  {selectedTransaction.type === 'deposit' ? 'Depósito' : 'Levantamento'}
                </span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Montante:</span>
                <span className={`${styles.detailValue} ${selectedTransaction.type === 'deposit' ? styles.positive : styles.negative}`}>
                  {selectedTransaction.type === 'deposit' ? '+' : '-'}
                  {getCurrencySymbol(selectedTransaction.currency)} {selectedTransaction.amount.toLocaleString(getLocaleForCurrency(selectedTransaction.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Data:</span>
                <span className={styles.detailValue}>{formatDate(selectedTransaction.date)}</span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>De:</span>
                <span className={styles.detailValue}>{selectedTransaction.from}</span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Para:</span>
                <span className={styles.detailValue}>{selectedTransaction.to}</span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Rede:</span>
                <span className={styles.detailValue}>{selectedTransaction.network}</span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Taxa:</span>
                <span className={styles.detailValue}>
                  {getCurrencySymbol(selectedTransaction.currency)} {selectedTransaction.fee.toLocaleString(getLocaleForCurrency(selectedTransaction.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Status:</span>
                <div className={`${styles.statusBadge} ${styles[selectedTransaction.status]}`}>
                  {getStatusIcon(selectedTransaction.status)}
                  <span>{getStatusText(selectedTransaction.status)}</span>
                </div>
              </div>
            </div>
            {selectedTransaction.status === 'completed' && (
              <div className={styles.modalFooter}>
                <button
                  className={styles.receiptButton}
                  onClick={() => {
                    closeDetailsModal();
                    openReceiptModal(selectedTransaction);
                  }}
                >
                  <FileText size={16} />
                  <span>Gerar Recibo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction && (
        <div className={styles.modalOverlay} onClick={closeReceiptModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Recibo da Transação</h3>
              <button className={styles.closeButton} onClick={closeReceiptModal}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.receiptHeader}>
                <div className={styles.receiptLogo}>
                  <img src="/gincana-logo.png" alt="GINCANA" className={styles.receiptLogoImage} />
                </div>
              </div>
              <div className={styles.receiptDetails}>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>ID da Transação:</span>
                  <span className={styles.receiptValue}>{selectedTransaction.id}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Descrição:</span>
                  <span className={styles.receiptValue}>{selectedTransaction.description}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Tipo:</span>
                  <span className={styles.receiptValue}>
                    {selectedTransaction.type === 'deposit' ? 'Depósito' : 'Levantamento'}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Montante:</span>
                  <span className={`${styles.receiptValue} ${selectedTransaction.type === 'deposit' ? styles.positive : styles.negative}`}>
                    {selectedTransaction.type === 'deposit' ? '+' : '-'}
                    {getCurrencySymbol(selectedTransaction.currency)} {selectedTransaction.amount.toLocaleString(getLocaleForCurrency(selectedTransaction.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Data:</span>
                  <span className={styles.receiptValue}>{formatDate(selectedTransaction.date)}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>De:</span>
                  <span className={styles.receiptValue}>{selectedTransaction.from}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Para:</span>
                  <span className={styles.receiptValue}>{selectedTransaction.to}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Rede:</span>
                  <span className={styles.receiptValue}>{selectedTransaction.network}</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Taxa:</span>
                  <span className={styles.receiptValue}>
                    {getCurrencySymbol(selectedTransaction.currency)} {selectedTransaction.fee.toLocaleString(getLocaleForCurrency(selectedTransaction.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Status:</span>
                  <div className={`${styles.statusBadge} ${styles[selectedTransaction.status]}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    <span>{getStatusText(selectedTransaction.status)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.exportButton}>
                <Download size={16} />
                <span>Exportar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}