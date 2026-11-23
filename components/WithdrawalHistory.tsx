'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, CheckCircle, Clock, XCircle, Filter, Search, Download, FileText, FileSpreadsheet, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import styles from '@/styles/WithdrawalHistory.module.css';

export default function WithdrawalHistory() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  // Buscar taxas de câmbio
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error('Erro ao buscar taxas de câmbio:', error);
        // Taxas de fallback
        const fallbackRates = {
          USD: 1,
          EUR: 0.92,
          USDT: 1,
          BTC: 0.000015,
          ETH: 0.00031,
          BRL: 5.0,
          GBP: 0.79,
          JPY: 149.5,
          CAD: 1.36,
          AUD: 1.53,
          CHF: 0.88,
          SOL: 3.72,
          ARS: 850.0,
          MXN: 17.2,
          COP: 4100
        };
        setExchangeRates(fallbackRates);
      }
    };

    fetchExchangeRates();
  }, []);

  // Função para calcular total levantado em USD
  const calculateTotalWithdrawnUSD = () => {
    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
    let totalUSD = 0;

    completedWithdrawals.forEach(withdrawal => {
      const currency = withdrawal.currency || 'USD';
      const amount = withdrawal.amount || 0;
      const exchangeRate = withdrawal.exchangeRate || exchangeRates[currency] || 1;

      // Converter para USD se não for USD
      if (currency === 'USD') {
        totalUSD += amount;
      } else {
        // Se a moeda for diferente de USD, divide pela taxa para obter USD
        totalUSD += amount / exchangeRate;
      }
    });

    return totalUSD;
  };

  useEffect(() => {
    // Load withdrawals from localStorage
    const savedWithdrawals = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');

    // Add the predefined withdrawals if not already present
    const predefinedWithdrawals = [
      {
        id: 'WD-120K-BRL',
        phase: 1,
        currency: 'BRL',
        amount: 120000.00,
        fee: 0,
        netAmount: 120000.00,
        method: 'crypto',
        methodDetails: {
          walletAddress: 'TYcDTj5PNTnorhehnkCEcxwRLMzSBLXawD',
          network: 'Tron',
          platform: 'Brasil Bitcoin'
        },
        status: 'completed',
        timestamp: '2026-10-16T10:03:39.000Z',
        exchangeRate: 5.0,
        userEmail: 'eduardo8@fbh.com.br'
      },
      {
        id: 'WD-150K-BRL',
        phase: 1,
        currency: 'BRL',
        amount: 150000.00,
        fee: 0,
        netAmount: 150000.00,
        method: 'crypto',
        methodDetails: {
          walletAddress: 'bc1qttgzghlagrncvhkmu9zqh9jn99f68e6rfn7rzc',
          network: 'BTC'
        },
        status: 'pending_approval',
        timestamp: '2026-10-09T13:18:00.000Z',
        exchangeRate: 5.0,
        userEmail: 'eduardo8@fbh.com.br'
      },
      {
        id: 'WD-50K-BRL',
        phase: 1,
        currency: 'BRL',
        amount: 50000.00,
        fee: 0,
        netAmount: 50000.00,
        method: 'bank',
        methodDetails: {
          bankName: 'BRADESCO',
          accountNumber: 'N/A',
          agency: 'N/A',
          accountHolder: 'N/A'
        },
        status: 'pending_approval',
        timestamp: '2026-10-09T10:30:00.000Z',
        exchangeRate: 5.0,
        userEmail: 'eduardo8@fbh.com.br'
      },
      {
        id: 'WD-70K-BRL',
        phase: 1,
        currency: 'BRL',
        amount: 70000.00,
        fee: 0,
        netAmount: 70000.00,
        method: 'crypto',
        methodDetails: {
          walletAddress: 'TYcDTj5PNTnorhehnkCEcxwRLMzSBLXawD',
          network: 'Tron',
          platform: 'Brasil Bitcoin'
        },
        status: 'pending_approval',
        timestamp: '2026-10-10T14:30:00.000Z',
        exchangeRate: 5.0,
        userEmail: 'eduardo8@fbh.com.br'
      }
    ];

    // Add each predefined withdrawal if not already present
    predefinedWithdrawals.forEach(predefinedWithdrawal => {
      const exists = savedWithdrawals.some((w: any) => w.id === predefinedWithdrawal.id);

      if (!exists) {
        savedWithdrawals.unshift(predefinedWithdrawal);
      } else {
        // If exists, move it to the top
        const filtered = savedWithdrawals.filter((w: any) => w.id !== predefinedWithdrawal.id);
        filtered.unshift(predefinedWithdrawal);
        savedWithdrawals.length = 0;
        savedWithdrawals.push(...filtered);
      }
    });

    localStorage.setItem('withdrawalHistory', JSON.stringify(savedWithdrawals));
    setWithdrawals(savedWithdrawals);
  }, []);

  // Atualizar total levantado no localStorage quando withdrawals mudar
  useEffect(() => {
    const totalWithdrawnUSD = calculateTotalWithdrawnUSD();
    localStorage.setItem('totalWithdrawnUSD', totalWithdrawnUSD.toString());

    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new Event('customStorageUpdate'));
  }, [withdrawals, exchangeRates]);

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
        return <Clock size={16} className={styles.pendingIcon} />;
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
        return 'Aguardando Aprovação';
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

  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    const matchesFilter = filter === 'all' || withdrawal.status === filter;
    const matchesSearch = searchTerm === '' ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.methodDetails?.walletAddress?.toLowerCase().includes(searchTerm.toLowerCase());
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

  // Função para abrir modal de recibo
  const openReceiptModal = (withdrawal: any) => {
    if (withdrawal.status === 'completed') {
      setSelectedWithdrawal(withdrawal);
      setShowReceiptModal(true);
    }
  };

  // Função para exportar como PDF
  const exportToPDF = async () => {
    const receiptElement = document.getElementById('withdrawal-receipt-content');
    if (!receiptElement || !selectedWithdrawal) return;

    try {
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: -window.scrollY
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`recibo-levantamento-${selectedWithdrawal.id}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  // Função para exportar como Excel
  const exportToExcel = () => {
    if (!selectedWithdrawal) return;

    const worksheetData = [
      ['RECIBO GINCANA - LEVANTAMENTO'],
      [],
      ['ID da Transação', selectedWithdrawal.id],
      ['Data', formatDate(selectedWithdrawal.timestamp)],
      ['Status', getStatusText(selectedWithdrawal.status)],
      [],
      ['Detalhes do Levantamento'],
      ['Fase', selectedWithdrawal.phase],
      ['Moeda', selectedWithdrawal.currency],
      ['Montante', selectedWithdrawal.amount],
      ['Taxa', selectedWithdrawal.fee],
      ['Montante Líquido', selectedWithdrawal.netAmount],
      [],
      ['Método de Levantamento'],
      ['Tipo', selectedWithdrawal.method],
      ['Rede', selectedWithdrawal.methodDetails?.network || 'N/A'],
      ['Carteira', selectedWithdrawal.methodDetails?.walletAddress || 'N/A'],
      [],
      ['Informações Adicionais'],
      ['Taxa de Câmbio', selectedWithdrawal.exchangeRate || 1.0],
      ['Email', selectedWithdrawal.userEmail || 'N/A']
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recibo');
    XLSX.writeFile(wb, `recibo-levantamento-${selectedWithdrawal.id}.xlsx`);
  };

  // Função para exportar todos os levantamentos concluídos
  const exportAllCompleted = () => {
    const completedWithdrawals = withdrawals.filter(w => w.status === 'completed');
    if (completedWithdrawals.length === 0) return;

    const worksheetData = [['HISTÓRICO DE LEVANTAMENTOS CONCLUÍDOS - GINCANA'], []];

    completedWithdrawals.forEach((w, index) => {
      worksheetData.push([`Levantamento ${index + 1}`]);
      worksheetData.push(['ID', w.id]);
      worksheetData.push(['Data', formatDate(w.timestamp)]);
      worksheetData.push(['Fase', w.phase]);
      worksheetData.push(['Moeda', w.currency]);
      worksheetData.push(['Montante', w.amount]);
      worksheetData.push(['Taxa', w.fee]);
      worksheetData.push(['Líquido', w.netAmount]);
      worksheetData.push(['Método', w.method]);
      worksheetData.push(['Status', getStatusText(w.status)]);
      worksheetData.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Levantamentos');
    XLSX.writeFile(wb, `levantamentos-concluidos-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className={styles.withdrawalHistory}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.sectionTitle}>Histórico de Levantamentos</h3>
          <p className={styles.sectionSubtitle}>Todos os seus levantamentos em um só lugar</p>
        </div>
        <button className={styles.exportButton} onClick={exportAllCompleted}>
          <Download size={16} />
          <span>Exportar Concluídos</span>
        </button>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar levantamentos..."
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
            Todos
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Concluídos
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pendentes
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'processing' ? styles.active : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processando
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'failed' ? styles.active : ''}`}
            onClick={() => setFilter('failed')}
          >
            Falhados
          </button>
        </div>
      </div>

      <div className={styles.withdrawalList}>
        {filteredWithdrawals.length === 0 ? (
          <div className={styles.emptyState}>
            <Clock size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Nenhum levantamento encontrado</p>
          </div>
        ) : (
          filteredWithdrawals.map((withdrawal, index) => (
            <div
              key={withdrawal.id}
              className={`${styles.withdrawalCard}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.withdrawalHeader}>
                <div className={styles.withdrawalIcon}>
                  <ArrowUpRight size={16} className={styles.withdrawalIconSvg} />
                </div>
                <div className={styles.withdrawalInfo}>
                  <div className={styles.withdrawalId}>
                    <span className={styles.idLabel}>ID:</span>
                    <span className={styles.idValue}>{withdrawal.id}</span>
                  </div>
                  <h4 className={styles.withdrawalDescription}>
                    Levantamento - {withdrawal.phase}ª Fase
                  </h4>
                </div>
                <div className={`${styles.statusBadge} ${styles[withdrawal.status]}`}>
                  {getStatusIcon(withdrawal.status)}
                  <span>{getStatusText(withdrawal.status)}</span>
                </div>
              </div>

              <div className={styles.withdrawalDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Montante:</span>
                  <span className={`${styles.detailValue} ${styles.negative}`}>
                    -{getCurrencySymbol(withdrawal.currency)} {withdrawal.amount.toLocaleString(getLocaleForCurrency(withdrawal.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Data:</span>
                  <span className={styles.detailValue}>{formatDate(withdrawal.timestamp)}</span>
                </div>

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Método:</span>
                  <span className={styles.detailValue}>
                    {withdrawal.method === 'crypto' ? 'Carteira Cripto' :
                     withdrawal.method === 'bank' ? 'Transferência Bancária' :
                     withdrawal.method === 'digital_wallet' ? 'Carteira Digital' :
                     withdrawal.method}
                  </span>
                </div>

                {withdrawal.method === 'crypto' && withdrawal.methodDetails?.walletAddress && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Carteira:</span>
                    <span className={styles.detailValue}>
                      {withdrawal.methodDetails.walletAddress.slice(0, 10)}...{withdrawal.methodDetails.walletAddress.slice(-6)}
                    </span>
                  </div>
                )}

                {withdrawal.method === 'crypto' && withdrawal.methodDetails?.network && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Rede:</span>
                    <span className={styles.detailValue}>{withdrawal.methodDetails.network}</span>
                  </div>
                )}
                {withdrawal.method === 'crypto' && withdrawal.methodDetails?.platform && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Plataforma:</span>
                    <span className={styles.detailValue}>{withdrawal.methodDetails.platform}</span>
                  </div>
                )}

                {withdrawal.method === 'bank' && withdrawal.methodDetails?.bankName && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Banco:</span>
                    <span className={styles.detailValue}>{withdrawal.methodDetails.bankName}</span>
                  </div>
                )}

                {withdrawal.method === 'bank' && withdrawal.methodDetails?.agency && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Agência:</span>
                    <span className={styles.detailValue}>{withdrawal.methodDetails.agency}</span>
                  </div>
                )}

                {withdrawal.method === 'bank' && withdrawal.methodDetails?.accountNumber && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Conta:</span>
                    <span className={styles.detailValue}>{withdrawal.methodDetails.accountNumber}</span>
                  </div>
                )}

                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Taxa:</span>
                  <span className={styles.detailValue}>
                    {getCurrencySymbol(withdrawal.currency)} {withdrawal.fee.toLocaleString(getLocaleForCurrency(withdrawal.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {(withdrawal.status === 'completed' || withdrawal.status === 'Concluído') && (
                <button
                  className={styles.receiptButton}
                  onClick={() => openReceiptModal(withdrawal)}
                >
                  <FileText size={16} />
                  <span>Gerar Recibo</span>
                </button>
              )}
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

      {/* Receipt Modal */}
      {showReceiptModal && selectedWithdrawal && (
        <div className={styles.modalOverlay} onClick={() => setShowReceiptModal(false)}>
          <div className={styles.receiptModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.receiptModalHeader}>
              <h3 className={styles.receiptModalTitle}>Recibo de Levantamento</h3>
              <button className={styles.closeButton} onClick={() => setShowReceiptModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.receiptModalBody}>
              <div id="withdrawal-receipt-content" className={styles.receiptContent} ref={receiptRef}>
                <div className={styles.receiptHeader}>
                  <div className={styles.receiptLogo}>
                    <div className={styles.logoContainer}>
                      <img src="/gincana-logo.png" alt="GINCANA" className={styles.receiptLogoImage} />
                    </div>
                  </div>
                  <div className={styles.receiptTitle}>
                    <h2>RECIBO OFICIAL</h2>
                    <p>Levantamento Concluído</p>
                  </div>
                </div>

                <div className={styles.receiptSection}>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>ID da Transação:</span>
                    <span className={styles.receiptValue}>{selectedWithdrawal.id}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Data:</span>
                    <span className={styles.receiptValue}>{formatDate(selectedWithdrawal.timestamp)}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Status:</span>
                    <span className={styles.receiptValue}>{getStatusText(selectedWithdrawal.status)}</span>
                  </div>
                </div>

                <div className={styles.receiptSection}>
                  <h4 className={styles.receiptSectionTitle}>Detalhes do Levantamento</h4>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Fase:</span>
                    <span className={styles.receiptValue}>{selectedWithdrawal.phase}ª Fase</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Moeda:</span>
                    <span className={styles.receiptValue}>{selectedWithdrawal.currency}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Montante:</span>
                    <span className={styles.receiptValueLarge}>
                      {getCurrencySymbol(selectedWithdrawal.currency)} {selectedWithdrawal.amount.toLocaleString(getLocaleForCurrency(selectedWithdrawal.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Taxa:</span>
                    <span className={styles.receiptValue}>
                      {getCurrencySymbol(selectedWithdrawal.currency)} {selectedWithdrawal.fee.toLocaleString(getLocaleForCurrency(selectedWithdrawal.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Montante Líquido:</span>
                    <span className={styles.receiptValueHighlight}>
                      {getCurrencySymbol(selectedWithdrawal.currency)} {selectedWithdrawal.netAmount.toLocaleString(getLocaleForCurrency(selectedWithdrawal.currency), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className={styles.receiptSection}>
                  <h4 className={styles.receiptSectionTitle}>Método de Levantamento</h4>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Tipo:</span>
                    <span className={styles.receiptValue}>
                      {selectedWithdrawal.method === 'crypto' ? 'Carteira Cripto' :
                       selectedWithdrawal.method === 'bank' ? 'Transferência Bancária' :
                       selectedWithdrawal.method === 'digital_wallet' ? 'Carteira Digital' :
                       selectedWithdrawal.method}
                    </span>
                  </div>
                  {selectedWithdrawal.methodDetails?.network && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Rede:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.network}</span>
                    </div>
                  )}
                  {selectedWithdrawal.methodDetails?.platform && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Plataforma:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.platform}</span>
                    </div>
                  )}
                  {selectedWithdrawal.methodDetails?.walletAddress && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Carteira:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.walletAddress}</span>
                    </div>
                  )}
                  {selectedWithdrawal.methodDetails?.bankName && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Banco:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.bankName}</span>
                    </div>
                  )}
                  {selectedWithdrawal.methodDetails?.agency && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Agência:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.agency}</span>
                    </div>
                  )}
                  {selectedWithdrawal.methodDetails?.accountNumber && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Conta:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.accountNumber}</span>
                    </div>
                  )}
                  {selectedWithdrawal.methodDetails?.accountHolder && (
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Titular:</span>
                      <span className={styles.receiptValue}>{selectedWithdrawal.methodDetails.accountHolder}</span>
                    </div>
                  )}
                </div>

                <div className={styles.receiptFooter}>
                  <div className={styles.receiptWatermark}>
                    GINCANA
                  </div>
                  <div className={styles.receiptNote}>
                    <p>Este é um recibo oficial de levantamento concluído.</p>
                    <p>A transação foi processada com sucesso pela GINCANA.</p>
                  </div>
                  <div className={styles.receiptContact}>
                    <p>support@gincana.net</p>
                    <p>www.gincana.net</p>
                  </div>
                </div>
              </div>

              <div className={styles.receiptActions}>
                <button
                  className={styles.exportBtn}
                  onClick={exportToPDF}
                >
                  <Download size={18} />
                  Exportar PDF
                </button>
                <button
                  className={styles.exportBtn}
                  onClick={exportToExcel}
                >
                  <FileSpreadsheet size={18} />
                  Exportar Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
