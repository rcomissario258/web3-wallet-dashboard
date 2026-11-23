'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Wallet, Banknote, ArrowRight, AlertCircle, Download, FileText, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import LoadingOverlay from './LoadingOverlay';
import styles from '@/styles/WithdrawalModal.module.css';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: number;
  amount: number;
  isAvailable: boolean;
}

export default function WithdrawalModal({ isOpen, onClose, phase, amount, isAvailable }: WithdrawalModalProps) {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [network, setNetwork] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [fee, setFee] = useState(0);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    currency: 'USD',
    reference: ''
  });
  const [walletAddress, setWalletAddress] = useState('');
  const [showProcessingError, setShowProcessingError] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loadingRates, setLoadingRates] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeFrom, setExchangeFrom] = useState('USD');
  const [exchangeTo, setExchangeTo] = useState('EUR');
  const [exchangeResult, setExchangeResult] = useState<number | null>(null);
  const [previousRates, setPreviousRates] = useState<Record<string, number>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [rateHistory, setRateHistory] = useState<Record<string, number[]>>({});
  const [favoriteConversions, setFavoriteConversions] = useState<Array<{from: string, to: string, amount: number}>>([]);
  const [showFavoriteAlert, setShowFavoriteAlert] = useState(false);
  const [showRateChart, setShowRateChart] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('ERC20');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');

  // Buscar taxas de câmbio reais com atualização automática
  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoadingRates(true);
      try {
        // Usando API gratuita de taxas de câmbio
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        
        // Salvar taxas anteriores para comparar variação
        setPreviousRates(exchangeRates);
        
        // Atualizar taxas
        setExchangeRates(data.rates);
        setLastUpdate(new Date());
        
        // Atualizar histórico de taxas (últimas 10 atualizações)
        setRateHistory(prev => {
          const newHistory = { ...prev };
          Object.keys(data.rates).forEach(currency => {
            if (!newHistory[currency]) {
              newHistory[currency] = [];
            }
            newHistory[currency] = [...newHistory[currency].slice(-9), data.rates[currency]];
          });
          return newHistory;
        });
      } catch (error) {
        console.error('Erro ao buscar taxas de câmbio:', error);
        // Taxas de fallback caso a API falhe
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
        setPreviousRates(exchangeRates);
        setExchangeRates(fallbackRates);
        setLastUpdate(new Date());
      } finally {
        setLoadingRates(false);
      }
    };

    fetchExchangeRates();
    
    // Atualizar taxas a cada 60 segundos
    const interval = setInterval(fetchExchangeRates, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Função para formatar valores com base na moeda
  const formatCurrency = (value: number, currencyCode: string) => {
    const locales: Record<string, string> = {
      USD: 'en-US',
      EUR: 'de-DE',
      USDT: 'en-US',
      BTC: 'en-US',
      ETH: 'en-US',
      BRL: 'pt-BR',
      GBP: 'en-GB',
      JPY: 'ja-JP',
      CAD: 'en-CA',
      AUD: 'en-AU',
      CHF: 'de-CH',
      SOL: 'es-PE',
      ARS: 'es-AR',
      MXN: 'es-MX',
      COP: 'es-CO'
    };

    const locale = locales[currencyCode] || 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: currencyCode === 'BTC' || currencyCode === 'ETH' ? 8 : 2
    }).format(value);
  };

  // Função para calcular variação percentual
  const getRateChange = (currency: string) => {
    if (!previousRates[currency] || !exchangeRates[currency]) return null;
    const change = ((exchangeRates[currency] - previousRates[currency]) / previousRates[currency]) * 100;
    return change;
  };

  // Função para obter cor baseada na variação
  const getRateChangeColor = (change: number | null) => {
    if (change === null) return '#475569';
    if (change > 0) return '#00a4fa';
    if (change < 0) return '#003fa0';
    return '#475569';
  };

  // Função para salvar conversão como favorita
  const saveAsFavorite = () => {
    const amount = parseFloat(exchangeAmount);
    if (!amount || !exchangeFrom || !exchangeTo) return;
    
    const newFavorite = { from: exchangeFrom, to: exchangeTo, amount };
    setFavoriteConversions(prev => {
      const exists = prev.some(f => f.from === newFavorite.from && f.to === newFavorite.to);
      if (exists) return prev;
      return [...prev.slice(-4), newFavorite];
    });
    setShowFavoriteAlert(true);
    setTimeout(() => setShowFavoriteAlert(false), 3000);
  };

  // Função para renderizar gráfico de histórico de taxas
  const renderRateChart = (currency: string) => {
    const history = rateHistory[currency] || [];
    if (history.length < 2) return null;

    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    
    const points = history.map((rate, index) => {
      const x = (index / (history.length - 1)) * 100;
      const y = 100 - ((rate - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className={styles.rateChart}>
        <h4 className={styles.chartTitle}>Histórico de {currency}</h4>
        <svg viewBox="0 0 100 100" className={styles.chartSvg}>
          <polyline
            points={points}
            fill="none"
            stroke="#fc8a00"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {history.map((rate, index) => {
            const x = (index / (history.length - 1)) * 100;
            const y = 100 - ((rate - min) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="#fc8a00"
                className={styles.chartPoint}
              />
            );
          })}
        </svg>
        <div className={styles.chartLegend}>
          <span className={styles.chartMin}>Mín: {min.toFixed(4)}</span>
          <span className={styles.chartMax}>Máx: {max.toFixed(4)}</span>
        </div>
      </div>
    );
  };

  // Taxas de rede para criptomoedas
  const networkFees: Record<string, Record<string, { fee: number, unit: string }>> = {
    BTC: {
      BTC: { fee: 0.0005, unit: 'BTC' },
      ERC20: { fee: 0.0006, unit: 'BTC' },
      BEP20: { fee: 0.0005, unit: 'BTC' },
      TRC20: { fee: 0.0004, unit: 'BTC' }
    },
    ETH: {
      ERC20: { fee: 0.005, unit: 'ETH' },
      BEP20: { fee: 0.004, unit: 'ETH' },
      ARBITRUM: { fee: 0.002, unit: 'ETH' },
      OPTIMISM: { fee: 0.002, unit: 'ETH' }
    },
    USDT: {
      ERC20: { fee: 5, unit: 'USDT' },
      BEP20: { fee: 1, unit: 'USDT' },
      TRC20: { fee: 1, unit: 'USDT' },
      POLYGON: { fee: 2, unit: 'USDT' }
    }
  };

  // Função para calcular taxa de rede
  const calculateNetworkFee = (currency: string, network: string) => {
    if (networkFees[currency] && networkFees[currency][network]) {
      return networkFees[currency][network];
    }
    return { fee: 0, unit: currency };
  };

  // Função para renderizar calculadora de taxas de rede
  const renderNetworkFeeCalculator = () => {
    const isCrypto = ['BTC', 'ETH', 'USDT'].includes(exchangeTo);
    if (!isCrypto) return null;

    const feeInfo = calculateNetworkFee(exchangeTo, selectedNetwork);
    const amount = parseFloat(exchangeAmount) || 0;
    const feeInUSD = feeInfo.fee * (exchangeRates[feeInfo.unit] || 1);

    return (
      <div className={styles.networkFeeSection}>
        <h4 className={styles.networkFeeTitle}>Calculadora de Taxas de Rede</h4>

        <div className={styles.networkSelector}>
          <label className={styles.formLabel}>Selecione a Rede</label>
          <div className={styles.networkOptionsGrid}>
            {Object.keys(networkFees[exchangeTo] || {}).map((net) => (
              <button
                key={net}
                className={`${styles.networkOptionBtn} ${selectedNetwork === net ? styles.selected : ''}`}
                onClick={() => setSelectedNetwork(net)}
              >
                {net}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.feeBreakdown}>
          <div className={styles.feeRow}>
            <span className={styles.feeLabel}>Taxa de rede:</span>
            <span className={styles.feeValue}>{feeInfo.fee} {feeInfo.unit}</span>
          </div>
          <div className={styles.feeRow}>
            <span className={styles.feeLabel}>Taxa em USD:</span>
            <span className={styles.feeValue}>≈ ${feeInUSD.toFixed(2)}</span>
          </div>
          {amount > 0 && (
            <>
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Valor bruto:</span>
                <span className={styles.feeValue}>{formatCurrency(amount, exchangeTo)}</span>
              </div>
              <div className={styles.feeRow}>
                <span className={styles.feeLabel}>Valor líquido:</span>
                <span className={styles.netAmount}>
                  {formatCurrency(Math.max(0, amount - feeInfo.fee), exchangeTo)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className={styles.networkInfo}>
          <span className={styles.infoIcon}>ℹ️</span>
          <span className={styles.infoText}>
            As taxas de rede variam conforme a congestão da blockchain. Valores aproximados.
          </span>
        </div>
      </div>
    );
  };

  // Função para gerar recibo
  const generateReceipt = () => {
    const amount = parseFloat(exchangeAmount);
    if (!amount || !exchangeFrom || !exchangeTo) return;

    const feeInfo = ['BTC', 'ETH', 'USDT'].includes(exchangeTo)
      ? calculateNetworkFee(exchangeTo, selectedNetwork)
      : { fee: 0, unit: exchangeTo };

    const netAmount = Math.max(0, amount - feeInfo.fee);
    const rate = exchangeRates[exchangeFrom] && exchangeRates[exchangeTo]
      ? (exchangeRates[exchangeTo] / exchangeRates[exchangeFrom])
      : 0;

    setReceiptData({
      id: `REC-${Date.now()}`,
      date: new Date().toLocaleString('pt-BR'),
      from: exchangeFrom,
      to: exchangeTo,
      amount: amount,
      result: exchangeResult || 0,
      rate: rate,
      network: selectedNetwork,
      networkFee: feeInfo.fee,
      netAmount: netAmount,
      currency: exchangeTo
    });
    setShowReceipt(true);
  };

  // Função para exportar como PDF
  const exportToPDF = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) return;

    try {
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`recibo-gincana-${receiptData.id}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  // Função para exportar como Excel
  const exportToExcel = () => {
    if (!receiptData) return;

    const worksheetData = [
      ['RECIBO GINCANA'],
      [],
      ['ID da Transação', receiptData.id],
      ['Data', receiptData.date],
      [],
      ['Detalhes da Conversão'],
      ['De', receiptData.from],
      ['Para', receiptData.to],
      ['Valor Original', receiptData.amount],
      ['Taxa de Câmbio', receiptData.rate.toFixed(6)],
      ['Valor Convertido', receiptData.result.toFixed(2)],
      [],
      ['Taxas e Custos'],
      ['Rede', receiptData.network],
      ['Taxa de Rede', receiptData.networkFee],
      ['Valor Líquido', receiptData.netAmount.toFixed(2)],
      [],
      ['Informações Adicionais'],
      ['Moeda', receiptData.currency],
      ['Atualizado em', lastUpdate?.toLocaleString('pt-BR') || 'N/A']
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Recibo');
    XLSX.writeFile(wb, `recibo-gincana-${receiptData.id}.xlsx`);
  };

  // Referência para o elemento do recibo
  const receiptRef = useRef<HTMLDivElement>(null);

  // Função para converter moedas
  const handleExchange = () => {
    const amount = parseFloat(exchangeAmount);
    if (!amount || !exchangeRates[exchangeFrom] || !exchangeRates[exchangeTo]) {
      setExchangeResult(null);
      return;
    }

    // Converter para USD primeiro (base), depois para a moeda destino
    const amountInUSD = amount / exchangeRates[exchangeFrom];
    const result = amountInUSD * exchangeRates[exchangeTo];
    setExchangeResult(result);
  };

  // Calcular conversão automaticamente quando mudar valores
  useEffect(() => {
    if (exchangeAmount && exchangeRates[exchangeFrom] && exchangeRates[exchangeTo]) {
      handleExchange();
    }
  }, [exchangeAmount, exchangeFrom, exchangeTo, exchangeRates]);

  if (!isOpen) return null;

  const calculateFee = (amount: number) => {
    if (withdrawalMethod === 'crypto') return amount * 0.01; // 1% para cripto
    if (withdrawalMethod === 'bank') return 25; // Taxa fixa para banco
    return amount * 0.005; // 0.5% para outros métodos
  };

  const handleAmountChange = (value: string) => {
    // Remover caracteres não numéricos exceto ponto e vírgula
    const cleanValue = value.replace(/[^0-9.,]/g, '');
    setWithdrawalAmount(cleanValue);
    const numValue = parseFloat(cleanValue) || 0;
    setFee(calculateFee(numValue));
  };

  const getNetAmount = () => {
    const numValue = parseFloat(withdrawalAmount) || 0;
    return Math.max(0, numValue - fee);
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      setShowConfirmDialog(true);
    }
  };

  const handleBackStep = () => {
    if (showConfirmDialog) {
      setShowConfirmDialog(false);
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Fechar diálogo de confirmação e iniciar processamento
    setShowConfirmDialog(false);
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Processando levantamento...');

    // Simular progresso do loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 3.33; // 100% em 30 segundos
      });
    }, 1000);

    // Salvar levantamento no localStorage para aparecer no histórico
    const newWithdrawal = {
      id: `WD-${phase}-${Date.now()}`,
      phase: phase,
      currency: currency,
      amount: parseFloat(withdrawalAmount) || 0,
      fee: fee,
      netAmount: getNetAmount(),
      method: withdrawalMethod,
      methodDetails: {
        walletAddress: withdrawalMethod === 'crypto' ? walletAddress : undefined,
        network: withdrawalMethod === 'crypto' ? network : undefined,
        accountName: withdrawalMethod === 'bank' ? bankDetails.accountName : undefined,
        bankName: withdrawalMethod === 'bank' ? bankDetails.bankName : undefined,
        accountNumber: withdrawalMethod === 'bank' ? bankDetails.accountNumber : undefined
      },
      status: 'pending',
      timestamp: new Date().toISOString(),
      exchangeRate: exchangeRates[currency] || 1.0,
      userEmail: 'eduardo8@fbh.com.br'
    };

    const savedWithdrawals = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
    savedWithdrawals.unshift(newWithdrawal);
    localStorage.setItem('withdrawalHistory', JSON.stringify(savedWithdrawals));

    // 1 minuto de loading
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsLoading(false);
      setShowSuccessMessage(true);

      // Após 30 minutos, atualizar para completed nos históricos
      setTimeout(() => {
        const updatedWithdrawals = JSON.parse(localStorage.getItem('withdrawalHistory') || '[]');
        const withdrawalIndex = updatedWithdrawals.findIndex((w: any) => w.id === newWithdrawal.id);
        if (withdrawalIndex !== -1) {
          updatedWithdrawals[withdrawalIndex].status = 'completed';
          localStorage.setItem('withdrawalHistory', JSON.stringify(updatedWithdrawals));

          // Calcular e atualizar total levantado em USD
          const completedWithdrawals = updatedWithdrawals.filter((w: any) => w.status === 'completed');
          let totalUSD = 0;

          completedWithdrawals.forEach((w: any) => {
            const currency = w.currency || 'USD';
            const amount = w.amount || 0;
            const exchangeRate = w.exchangeRate || exchangeRates[currency] || 1;

            if (currency === 'USD') {
              totalUSD += amount;
            } else {
              totalUSD += amount / exchangeRate;
            }
          });

          localStorage.setItem('totalWithdrawnUSD', totalUSD.toString());

          // Disparar evento customizado para notificar outros componentes
          window.dispatchEvent(new Event('customStorageUpdate'));
        }
      }, 1800000); // 30 minutos
    }, 60000); // 1 minuto
  };

  const handleCloseError = () => {
    setShowProcessingError(false);
    onClose();
  };

  const finalAmount = parseFloat(withdrawalAmount) || 0;

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Selecione a Moeda</h3>
      
      {lastUpdate && (
        <div className={styles.lastUpdateInfo}>
          <span className={styles.updateIndicator}>🔄</span>
          <span className={styles.updateText}>
            Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}
          </span>
        </div>
      )}
      
      <div className={styles.currencyGrid}>
        {['USD', 'EUR', 'USDT', 'BTC', 'ETH', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SOL'].map((curr) => {
          const rateChange = getRateChange(curr);
          return (
            <button
              key={curr}
              className={`${styles.currencyOption} ${currency === curr ? styles.selected : ''}`}
              onClick={() => setCurrency(curr)}
            >
              <span className={styles.currencySymbol}>{curr}</span>
              <span className={styles.currencyName}>
                {curr === 'USD' ? 'Dólar Americano' :
                 curr === 'EUR' ? 'Euro' :
                 curr === 'USDT' ? 'Tether' :
                 curr === 'BTC' ? 'Bitcoin' :
                 curr === 'ETH' ? 'Ethereum' :
                 curr === 'BRL' ? 'Real Brasileiro' :
                 curr === 'GBP' ? 'Libra Esterlina' :
                 curr === 'JPY' ? 'Iene Japonês' :
                 curr === 'CAD' ? 'Dólar Canadense' :
                 curr === 'AUD' ? 'Dólar Australiano' :
                 curr === 'CHF' ? 'Franco Suíço' : 'Sol Peruano'}
              </span>
              {!loadingRates && exchangeRates[curr] && (
                <div className={styles.currencyRateInfo}>
                  <span className={styles.currencyRate}>
                    1 USD = {exchangeRates[curr].toFixed(4)} {curr}
                  </span>
                  {rateChange !== null && (
                    <span 
                      className={styles.rateChange}
                      style={{ color: getRateChangeColor(rateChange) }}
                    >
                      {rateChange > 0 ? '▲' : rateChange < 0 ? '▼' : '●'} {Math.abs(rateChange).toFixed(2)}%
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <button
        className={styles.exchangeSimulationButton}
        onClick={() => setShowExchangeModal(true)}
      >
        <span className={styles.exchangeIcon}>💱</span>
        Simular Conversão de Moeda
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Método de Retirada</h3>
      <div className={styles.methodGrid}>
        <button
          className={`${styles.methodOption} ${withdrawalMethod === 'crypto' ? styles.selected : ''}`}
          onClick={() => setWithdrawalMethod('crypto')}
        >
          <Wallet className={styles.methodIcon} />
          <div>
            <span className={styles.methodTitle}>Carteira Cripto</span>
            <span className={styles.methodDescription}>Transferência para carteira digital</span>
          </div>
        </button>
        <button
          className={`${styles.methodOption} ${withdrawalMethod === 'bank' ? styles.selected : ''}`}
          onClick={() => setWithdrawalMethod('bank')}
        >
          <Banknote className={styles.methodIcon} />
          <div>
            <span className={styles.methodTitle}>Transferência Bancária</span>
            <span className={styles.methodDescription}>Transferência para conta bancária</span>
          </div>
        </button>
        <button
          className={`${styles.methodOption} ${withdrawalMethod === 'other' ? styles.selected : ''}`}
          onClick={() => setWithdrawalMethod('other')}
        >
          <ArrowRight className={styles.methodIcon} />
          <div>
            <span className={styles.methodTitle}>Outros Métodos</span>
            <span className={styles.methodDescription}>Métodos alternativos disponíveis</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>
        {withdrawalMethod === 'crypto' ? 'Detalhes da Carteira' : 'Dados Bancários'}
      </h3>
      
      {withdrawalMethod === 'crypto' ? (
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Endereço da Carteira</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="0x1234...5678"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          
          <label className={styles.formLabel}>Rede</label>
          <div className={styles.networkGrid}>
            {['TRC20', 'ERC20', 'BEP20', 'BTC'].map((net) => (
              <button
                key={net}
                className={`${styles.networkOption} ${network === net ? styles.selected : ''}`}
                onClick={() => setNetwork(net)}
              >
                {net}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nome do Titular</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Nome completo do titular"
            value={bankDetails.accountName}
            onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
          />
          
          <label className={styles.formLabel}>Nome do Banco</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Nome do banco"
            value={bankDetails.bankName}
            onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
          />
          
          <label className={styles.formLabel}>Número da Conta</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Número da conta bancária"
            value={bankDetails.accountNumber}
            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
          />
          
          <label className={styles.formLabel}>IBAN</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="IBAN (quando aplicável)"
            value={bankDetails.iban}
            onChange={(e) => setBankDetails({...bankDetails, iban: e.target.value})}
          />
          
          <label className={styles.formLabel}>SWIFT/BIC</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Código SWIFT/BIC"
            value={bankDetails.swift}
            onChange={(e) => setBankDetails({...bankDetails, swift: e.target.value})}
          />
          
          <label className={styles.formLabel}>Referência (opcional)</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Finalidade ou referência"
            value={bankDetails.reference}
            onChange={(e) => setBankDetails({...bankDetails, reference: e.target.value})}
          />
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Montante a Retirar</h3>
      
      <div className={styles.amountSection}>
        <div className={styles.availableBalance}>
          <span className={styles.balanceLabel}>Disponível:</span>
          <span className={styles.balanceValue}>
            {currency} {amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        
        <label className={styles.formLabel}>Montante a Retirar</label>
        <div className={styles.amountInput}>
          <input
            type="number"
            className={styles.formInput}
            placeholder="0.00"
            value={withdrawalAmount}
            onChange={(e) => handleAmountChange(e.target.value)}
            max={amount}
          />
          <span className={styles.currencyBadge}>{currency}</span>
        </div>
        
        <div className={styles.feeSection}>
          <div className={styles.feeRow}>
            <span className={styles.feeLabel}>Taxa de levantamento:</span>
            <span className={styles.feeValue}>
              {currency} {fee.toFixed(2)}
            </span>
          </div>
          <div className={styles.feeRow}>
            <span className={styles.feeLabel}>Montante líquido a receber:</span>
            <span className={styles.netAmount}>
              {currency} {getNetAmount().toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <h3 className={styles.stepTitle} style={{ marginTop: '24px' }}>Resumo do Levantamento</h3>
      
      <div className={styles.summarySection}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Moeda:</span>
          <span className={styles.summaryValue}>{currency}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Método:</span>
          <span className={styles.summaryValue}>
            {withdrawalMethod === 'crypto' ? 'Carteira Cripto' :
             withdrawalMethod === 'bank' ? 'Transferência Bancária' : 'Outros Métodos'}
          </span>
        </div>
        {withdrawalMethod === 'crypto' && (
          <>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Carteira:</span>
              <span className={styles.summaryValue}>{walletAddress}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Rede:</span>
              <span className={styles.summaryValue}>{network}</span>
            </div>
          </>
        )}
        {withdrawalMethod === 'bank' && (
          <>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Titular:</span>
              <span className={styles.summaryValue}>{bankDetails.accountName}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Banco:</span>
              <span className={styles.summaryValue}>{bankDetails.bankName}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Conta:</span>
              <span className={styles.summaryValue}>{bankDetails.accountNumber}</span>
            </div>
          </>
        )}
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Montante a Retirar:</span>
          <span className={styles.summaryValue}>
            {currency} {parseFloat(withdrawalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Taxa de levantamento:</span>
          <span className={styles.summaryValue}>
            {currency} {fee.toFixed(2)}
          </span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Montante líquido a receber:</span>
          <span className={styles.summaryValue}>
            {currency} {getNetAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      
      {!isAvailable && (
        <div className={styles.warningBox}>
          <AlertCircle className={styles.warningIcon} />
          <span className={styles.warningText}>
            Esta fase está bloqueada. Complete as fases anteriores para desbloquear.
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>
              Levantamento - {phase}ª Fase
            </h2>
            <p className={styles.modalSubtitle}>
              {isAvailable ? 'Disponível para levantamento' : 'Bloqueado'}
            </p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className={styles.stepIndicator}>
          <span className={styles.stepText}>Passo {step} de 4</span>
        </div>

        <div className={styles.modalBody}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>

        <div className={styles.modalFooter}>
          {step > 1 && (
            <button className={styles.backButton} onClick={handleBackStep}>
              Voltar
            </button>
          )}
          <button 
            className={styles.nextButton}
            onClick={handleNextStep}
            disabled={
              (step === 1 && !currency) ||
              (step === 2 && !withdrawalMethod) ||
              (step === 3 && withdrawalMethod === 'crypto' && (!walletAddress || !network)) ||
              (step === 3 && withdrawalMethod === 'bank' && !bankDetails.accountName) ||
              (step === 4 && (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0))
            }
          >
            {step === 4 ? 'Confirmar' : 'Próximo'}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className={styles.modalOverlay} onClick={handleBackStep}>
          <div className={styles.confirmDialog} onClick={(e) => e.stopPropagation()}>
            <div className={styles.confirmContent}>
              <AlertCircle className={styles.confirmIcon} />
              <h3 className={styles.confirmTitle}>Confirmar Levantamento</h3>
              <p className={styles.confirmMessage}>
                Deseja finalizar este levantamento?
              </p>
              <div className={styles.confirmDetails}>
                <div className={styles.confirmDetailRow}>
                  <span className={styles.confirmDetailLabel}>Montante:</span>
                  <span className={styles.confirmDetailValue}>
                    {currency} {parseFloat(withdrawalAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.confirmDetailRow}>
                  <span className={styles.confirmDetailLabel}>Líquido a receber:</span>
                  <span className={styles.confirmDetailValue}>
                    {currency} {getNetAmount().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className={styles.confirmButtons}>
                <button
                  className={styles.confirmCancelButton}
                  onClick={handleBackStep}
                >
                  Não, voltar
                </button>
                <button
                  className={styles.confirmConfirmButton}
                  onClick={handleSubmit}
                >
                  Sim, finalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showProcessingError && (
        <div className={styles.modalOverlay}>
          <div className={styles.errorModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.errorContent}>
              <AlertCircle className={styles.errorIcon} />
              <h3 className={styles.errorTitle}>Pedido Falhou</h3>
              <p className={styles.errorMessage}>
                Ocorreu um erro ao processar sua solicitação de levantamento.
              </p>
              <p className={styles.errorSupport}>
                Por favor, entre em contato com o administrador do sistema:
              </p>
              <a href="mailto:support@gincana.net" className={styles.supportEmail}>
                support@gincana.net
              </a>
              <button
                className={styles.errorButton}
                onClick={handleCloseError}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessMessage && (
        <div className={styles.modalOverlay}>
          <div className={styles.successModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.successContent}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Transação Concluída com Sucesso!</h3>
              <p className={styles.successMessage}>
                Sua transação foi processada com sucesso.
              </p>
              <p className={styles.successNote}>
                Em 30 minutos, a transação será refletida nos históricos de transação.
              </p>
              <button
                className={styles.successButton}
                onClick={() => {
                  setShowSuccessMessage(false);
                  onClose();
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      <LoadingOverlay 
        isVisible={isLoading}
        message={loadingMessage}
        progress={loadingProgress}
      />

      {/* Exchange Modal */}
      {showExchangeModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExchangeModal(false)}>
          <div className={styles.exchangeModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.exchangeModalHeader}>
              <h3 className={styles.exchangeModalTitle}>Conversor de Moeda Avançado</h3>
              <button className={styles.closeButton} onClick={() => setShowExchangeModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.exchangeModalBody}>
              {loadingRates ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Carregando taxas de câmbio...</p>
                </div>
              ) : (
                <>
                  {lastUpdate && (
                    <div className={styles.exchangeRate}>
                      <span className={styles.exchangeLabel}>Última atualização:</span>
                      <span className={styles.exchangeValue}>{lastUpdate.toLocaleTimeString('pt-BR')}</span>
                    </div>
                  )}

                  <div className={styles.converterSection}>
                    <div className={styles.amountInputWrapper}>
                      <label className={styles.formLabel}>De</label>
                      <div className={styles.formGroup}>
                        <input
                          type="number"
                          className={styles.formInput}
                          placeholder="0.00"
                          value={exchangeAmount}
                          onChange={(e) => setExchangeAmount(e.target.value)}
                        />
                        <select
                          className={styles.formInput}
                          value={exchangeFrom}
                          onChange={(e) => setExchangeFrom(e.target.value)}
                        >
                          {['USD', 'EUR', 'USDT', 'BTC', 'ETH', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SOL'].map((curr) => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.exchangeArrow}>⬇️</div>

                    <div className={styles.amountInputWrapper}>
                      <label className={styles.formLabel}>Para</label>
                      <div className={styles.formGroup}>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="0.00"
                          value={exchangeResult ? formatCurrency(exchangeResult, exchangeTo) : ''}
                          readOnly
                        />
                        <select
                          className={styles.formInput}
                          value={exchangeTo}
                          onChange={(e) => setExchangeTo(e.target.value)}
                        >
                          {['USD', 'EUR', 'USDT', 'BTC', 'ETH', 'BRL', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SOL'].map((curr) => (
                            <option key={curr} value={curr}>{curr}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.exchangeRateDetail}>
                      <span className={styles.exchangeLabel}>
                        1 {exchangeFrom} = {exchangeRates[exchangeFrom] && exchangeRates[exchangeTo]
                          ? (exchangeRates[exchangeTo] / exchangeRates[exchangeFrom]).toFixed(6)
                          : '...'} {exchangeTo}
                      </span>
                      {(() => {
                        const change = getRateChange(exchangeTo);
                        return change !== null ? (
                          <span
                            className={styles.rateChange}
                            style={{ color: getRateChangeColor(change) }}
                          >
                            {change > 0 ? '▲' : change < 0 ? '▼' : '●'} {Math.abs(change).toFixed(2)}%
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {exchangeResult && (
                    <div className={styles.exchangeResult}>
                      <span className={styles.exchangeLabel}>Resultado:</span>
                      <span className={styles.exchangeValueLarge}>
                        {formatCurrency(exchangeResult, exchangeTo)}
                      </span>
                    </div>
                  )}

                  <div className={styles.receiptButton}>
                    <button
                      className={styles.receiptBtn}
                      onClick={generateReceipt}
                      disabled={!exchangeAmount || !exchangeResult}
                    >
                      <FileText size={18} />
                      Gerar Recibo
                    </button>
                  </div>

                  <div className={styles.favoriteButton}>
                    <button
                      className={styles.favoriteBtn}
                      onClick={saveAsFavorite}
                      disabled={!exchangeAmount || !exchangeResult}
                    >
                      ⭐ Salvar como Favorito
                    </button>
                  </div>

                  {showFavoriteAlert && (
                    <div className={styles.successAlert}>
                      ✓ Conversão salva nos favoritos!
                    </div>
                  )}

                  {favoriteConversions.length > 0 && (
                    <div className={styles.favoritesSection}>
                      <h4 className={styles.favoritesTitle}>Conversões Favoritas</h4>
                      <div className={styles.favoritesList}>
                        {favoriteConversions.map((fav, index) => (
                          <button
                            key={index}
                            className={styles.favoriteItem}
                            onClick={() => {
                              setExchangeFrom(fav.from);
                              setExchangeTo(fav.to);
                              setExchangeAmount(fav.amount.toString());
                            }}
                          >
                            <span className={styles.favoriteAmount}>{fav.amount} {fav.from}</span>
                            <span className={styles.favoriteArrow}>→</span>
                            <span className={styles.favoriteResult}>{fav.to}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.chartSection}>
                    <button
                      className={styles.chartToggleBtn}
                      onClick={() => setShowRateChart(!showRateChart)}
                    >
                      📊 {showRateChart ? 'Ocultar' : 'Ver'} Histórico de Taxas
                    </button>
                    {showRateChart && (
                      <div className={styles.chartContainer}>
                        {renderRateChart(exchangeTo)}
                      </div>
                    )}
                  </div>

                  {renderNetworkFeeCalculator()}

                  <div className={styles.exchangeNote}>
                    <ArrowRight className={styles.noteIcon} />
                    <span className={styles.noteText}>
                      As taxas de câmbio são atualizadas automaticamente a cada 60 segundos. Os valores são aproximados e podem variar.
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className={styles.modalOverlay} onClick={() => setShowReceipt(false)}>
          <div className={styles.receiptModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.receiptModalHeader}>
              <h3 className={styles.receiptModalTitle}>Recibo da Transação</h3>
              <button className={styles.closeButton} onClick={() => setShowReceipt(false)}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.receiptModalBody}>
              <div id="receipt-content" className={styles.receiptContent} ref={receiptRef}>
                <div className={styles.receiptHeader}>
                  <div className={styles.receiptLogo}>
                    <div className={styles.logoContainer}>
                      <img src="/gincana-logo.png" alt="GINCANA" className={styles.receiptLogoImage} />
                    </div>
                  </div>
                  <div className={styles.receiptTitle}>
                    <h2>RECIBO OFICIAL</h2>
                    <p>Simulação de Câmbio</p>
                  </div>
                </div>

                <div className={styles.receiptSection}>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>ID da Transação:</span>
                    <span className={styles.receiptValue}>{receiptData.id}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Data:</span>
                    <span className={styles.receiptValue}>{receiptData.date}</span>
                  </div>
                </div>

                <div className={styles.receiptSection}>
                  <h4 className={styles.receiptSectionTitle}>Detalhes da Conversão</h4>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>De:</span>
                    <span className={styles.receiptValue}>{receiptData.from}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Para:</span>
                    <span className={styles.receiptValue}>{receiptData.to}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Valor Original:</span>
                    <span className={styles.receiptValue}>{receiptData.amount.toFixed(2)} {receiptData.from}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Taxa de Câmbio:</span>
                    <span className={styles.receiptValue}>1 {receiptData.from} = {receiptData.rate.toFixed(6)} {receiptData.to}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Valor Convertido:</span>
                    <span className={styles.receiptValueLarge}>{formatCurrency(receiptData.result, receiptData.to)}</span>
                  </div>
                </div>

                {receiptData.networkFee > 0 && (
                  <div className={styles.receiptSection}>
                    <h4 className={styles.receiptSectionTitle}>Taxas e Custos</h4>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Rede:</span>
                      <span className={styles.receiptValue}>{receiptData.network}</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Taxa de Rede:</span>
                      <span className={styles.receiptValue}>{receiptData.networkFee.toFixed(6)} {receiptData.currency}</span>
                    </div>
                    <div className={styles.receiptRow}>
                      <span className={styles.receiptLabel}>Valor Líquido:</span>
                      <span className={styles.receiptValueHighlight}>{formatCurrency(receiptData.netAmount, receiptData.to)}</span>
                    </div>
                  </div>
                )}

                <div className={styles.receiptFooter}>
                  <div className={styles.receiptWatermark}>
                    GINCANA
                  </div>
                  <div className={styles.receiptNote}>
                    <p>Este é um recibo de simulação para fins informativos.</p>
                    <p>Os valores podem variar no momento da transação real.</p>
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