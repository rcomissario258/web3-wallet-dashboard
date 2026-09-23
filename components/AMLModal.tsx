'use client';

import { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, XCircle, Info, DollarSign, Clock, ExternalLink } from 'lucide-react';
import styles from '@/styles/AMLModal.module.css';

interface AMLModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  transactionAmount: number;
  currency: string;
}

export default function AMLModal({ isOpen, onClose, onConfirm, onReject, transactionAmount, currency }: AMLModalProps) {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const amlFeePercentage = 0.5;
  const amlFee = transactionAmount * (amlFeePercentage / 100);
  const totalAmount = transactionAmount + amlFee;

  const randomInfo = [
    "Processamento de conformidade KYC nível 3",
    "Verificação de origem de fundos completada",
    "Análise de risco de lavagem de dinheiro realizada",
    "Monitoramento de transações internacionais ativado",
    "Compliance com regulamentações FATF",
    "Verificação de sanções OFAC concluída",
    "Análise de padrões de transação concluída",
    "Validação de beneficiário final realizada"
  ];

  const getRandomInfo = () => {
    return randomInfo[Math.floor(Math.random() * randomInfo.length)];
  };

  const handleYes = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentCompleted(true);
    setShowPaymentInfo(true);
  };

  const handleNo = () => {
    onReject();
    onClose();
  };

  const handleConfirmPayment = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerIcon}>
            <Shield size={32} />
          </div>
          <div className={styles.headerContent}>
            <h2 className={styles.modalTitle}>Anti-Money Laundering (AML)</h2>
            <p className={styles.modalSubtitle}>Taxa de Conformidade Obrigatória</p>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!showPaymentInfo ? (
          <>
            <div className={styles.modalBody}>
              <div className={styles.warningBox}>
                <AlertTriangle className={styles.warningIcon} />
                <div className={styles.warningContent}>
                  <h4 className={styles.warningTitle}>Taxa AML Obrigatória</h4>
                  <p className={styles.warningText}>
                    De acordo com as regulamentações internacionais de combate à lavagem de dinheiro, 
                    é necessário pagar uma taxa de conformidade antes de processar esta transação.
                  </p>
                </div>
              </div>

              <div className={styles.feeDetails}>
                <div className={styles.feeRow}>
                  <span className={styles.feeLabel}>Valor da Transação:</span>
                  <span className={styles.feeValue}>
                    {currency} {transactionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.feeRow}>
                  <span className={styles.feeLabel}>Taxa AML ({amlFeePercentage}%):</span>
                  <span className={styles.feeValue}>
                    {currency} {amlFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.feeRow}>
                  <span className={styles.feeLabel}>Total a Pagar:</span>
                  <span className={styles.feeValue}>
                    {currency} {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className={styles.infoSection}>
                <div className={styles.infoHeader}>
                  <Info className={styles.infoIcon} />
                  <h4 className={styles.infoTitle}>Informações de Compliance</h4>
                </div>
                <ul className={styles.infoList}>
                  <li className={styles.infoItem}>
                    <CheckCircle size={16} className={styles.checkIcon} />
                    <span>Verificação de identidade concluída</span>
                  </li>
                  <li className={styles.infoItem}>
                    <CheckCircle size={16} className={styles.checkIcon} />
                    <span>Screening de sanções aprovado</span>
                  </li>
                  <li className={styles.infoItem}>
                    <CheckCircle size={16} className={styles.checkIcon} />
                    <span>Análise de risco concluída</span>
                  </li>
                  <li className={styles.infoItem}>
                    <Clock size={16} className={styles.pendingIcon} />
                    <span>Aguardando pagamento de taxa AML</span>
                  </li>
                </ul>
              </div>

              <div className={styles.regulatoryInfo}>
                <p className={styles.regulatoryText}>
                  Esta taxa é cobrada de acordo com as regulamentações da Financial Action Task Force (FATF) 
                  e leis locais de combate à lavagem de dinheiro.
                </p>
                <a href="#" className={styles.learnMoreLink}>
                  <ExternalLink size={14} />
                  <span>Saiba mais sobre AML</span>
                </a>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                className={styles.noButton}
                onClick={handleNo}
                disabled={isProcessing}
              >
                <XCircle size={18} />
                <span>Não</span>
              </button>
              <button 
                className={styles.yesButton}
                onClick={handleYes}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <DollarSign size={18} />
                    <span>Sim - Pagar Taxa</span>
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.modalBody}>
              {paymentCompleted ? (
                <div className={styles.successBox}>
                  <CheckCircle size={48} className={styles.successIcon} />
                  <h3 className={styles.successTitle}>Pagamento Concluído</h3>
                  <p className={styles.successText}>
                    {getRandomInfo()}
                  </p>
                  <div className={styles.successDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Taxa AML Paga:</span>
                      <span className={styles.detailValue}>
                        {currency} {amlFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Status da Transação:</span>
                      <span className={styles.detailValue}>
                        Aprovado para processamento
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Próximo Passo:</span>
                      <span className={styles.detailValue}>
                        Liberação de fundos em processamento
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.blockedBox}>
                  <XCircle size={48} className={styles.blockedIcon} />
                  <h3 className={styles.blockedTitle}>Transação Bloqueada</h3>
                  <p className={styles.blockedText}>
                    Sua transação foi bloqueada devido à falta de pagamento das taxas obrigatórias 
                    de conformidade AML/KYC.
                  </p>
                  <div className={styles.blockedDetails}>
                    <div className={styles.blockedReason}>
                      <AlertTriangle size={20} className={styles.reasonIcon} />
                      <div>
                        <h5 className={styles.reasonTitle}>Motivo do Bloqueio</h5>
                        <p className={styles.reasonText}>
                          Não conformidade com regulamentações anti-lavagem de dinheiro
                        </p>
                      </div>
                    </div>
                    <div className={styles.blockedSolution}>
                      <h5 className={styles.solutionTitle}>Como Desbloquear</h5>
                      <ol className={styles.solutionList}>
                        <li>Pague a taxa AML obrigatória</li>
                        <li>Complete a verificação KYC se necessário</li>
                        <li>Aguarde a aprovação do compliance</li>
                        <li>Solicite o desbloqueio da transação</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {paymentCompleted ? (
                <button 
                  className={styles.confirmButton}
                  onClick={handleConfirmPayment}
                >
                  <CheckCircle size={18} />
                  <span>Confirmar e Continuar</span>
                </button>
              ) : (
                <button 
                  className={styles.retryButton}
                  onClick={() => setShowPaymentInfo(false)}
                >
                  <DollarSign size={18} />
                  <span>Tentar Pagar Taxa AML</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}