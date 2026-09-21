'use client';

import { useState } from 'react';
import styles from '@/styles/UnlockPhases.module.css';

export default function UnlockPhases() {
  const [activeTab, setActiveTab] = useState(0);

  const logisticsFee = {
    percentage: 100,
    paid: 4500.08,
    currency: 'USDT',
    remaining: 7000.00
  };

  const tabs = [
    {
      id: 0,
      title: 'Taxa Logística',
      icon: '📦',
      subtitle: 'Operação Logística',
      percentage: logisticsFee.percentage,
      content: {
        type: 'logistics',
        paid: logisticsFee.paid,
        currency: logisticsFee.currency,
        remaining: logisticsFee.remaining,
        amount: logisticsFee.paid + logisticsFee.remaining,
        status: 'EM ANDAMENTO',
        description: 'Processando pagamento da taxa logística'
      }
    },
    {
      id: 1,
      title: 'Fase 1',
      icon: '🔓',
      subtitle: '50% da Taxa Operacional',
      percentage: 100,
      amount: 11500.08,
      status: 'PAGO',
      description: 'Pagamento em processo pela AUTOTRADE, AI',
      content: {
        type: 'phase',
        amount: 11500.08,
        status: 'PAGO',
        description: 'Pagamento em processo pela AUTOTRADE, AI'
      }
    },
    {
      id: 2,
      title: 'Fase 2',
      icon: '🔐',
      subtitle: '50% da Taxa Operacional',
      percentage: 100,
      amount: 11500.07,
      status: 'PAGO',
      description: 'Pagamento em processo pela AUTOTRADE, AI (Taxa abonatória de 5,750.00$ já paga)',
      content: {
        type: 'phase',
        amount: 11500.07,
        status: 'PAGO',
        description: 'Pagamento em processo pela AUTOTRADE, AI (Taxa abonatória de 5,750.00$ já paga)'
      }
    },
    {
      id: 3,
      title: 'Fase 3',
      icon: '🎯',
      subtitle: 'Taxa de Processamento',
      percentage: 0,
      amount: 0.00,
      status: 'PENDENTE',
      description: 'Aguardando processamento',
      content: {
        type: 'phase',
        amount: 0.00,
        status: 'PENDENTE',
        description: 'Aguardando processamento'
      }
    }
  ];

  return (
    <div className={styles.unlockPhases}>
      <div className={styles.header}>
        <h3 className={styles.sectionTitle}>FASES DE DESBLOQUEIO</h3>
        <p className={styles.sectionSubtitle}>Gerenciamento de liberação de fundos</p>
      </div>
      
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(index)}
            className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <div className={styles.tabContent}>
              <span className={styles.tabTitle}>{tab.title}</span>
              <span className={styles.tabSubtitle}>{tab.subtitle}</span>
            </div>
            <span className={`${styles.tabPercentage} ${activeTab === index ? styles.activePercentage : ''}`}>
              {tab.percentage}%
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContentContainer}>
        {tabs[activeTab].content?.type === 'logistics' ? (
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <div className={styles.contentIcon}>📦</div>
              <div>
                <h4 className={styles.contentTitle}>Taxa da Operação Logística</h4>
                <p className={styles.contentSubtitle}>Depois do total recuperado</p>
              </div>
            </div>
            
            <div className={styles.contentDetails}>
              <div className={`${styles.detailItem} ${styles.paidItem}`}>
                <div className={styles.detailIcon}>💰</div>
                <div className={styles.detailInfo}>
                  <span className={styles.detailLabel}>Valor Pago</span>
                  <span className={styles.detailValue}>
                    {logisticsFee.paid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {logisticsFee.currency}
                  </span>
                  <div className={styles.successBadge}>
                    <span className={styles.successIcon}>✅</span>
                    <span className={styles.successText}>PAGO</span>
                  </div>
                </div>
              </div>
              
              <div className={`${styles.detailItem} ${styles.paidItem}`}>
                <div className={styles.detailIcon}>💵</div>
                <div className={styles.detailInfo}>
                  <span className={styles.detailLabel}>Remanescente</span>
                  <span className={styles.detailValue}>
                    US$ {logisticsFee.remaining.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <div className={styles.successBadge}>
                    <span className={styles.successIcon}>✅</span>
                    <span className={styles.successText}>PAGO</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Progresso do Pagamento</span>
                <span className={styles.progressValue}>{logisticsFee.percentage}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${logisticsFee.percentage}%` }}
                />
              </div>
            </div>
          </div>
        ) : tabs[activeTab].content?.type === 'phase' ? (
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <div className={styles.contentIcon}>{tabs[activeTab].icon}</div>
              <div>
                <h4 className={styles.contentTitle}>{tabs[activeTab].title}</h4>
                <p className={styles.contentSubtitle}>{tabs[activeTab].subtitle}</p>
              </div>
            </div>
            
            <div className={styles.amountDisplay}>
              <span className={styles.amountLabel}>Valor da Fase</span>
              <span className={styles.amountValue}>
                US$ {tabs[activeTab].content?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>

            <div className={styles.statusSection}>
              <div className={`${styles.statusBadge} ${styles.paidStatusBadge}`}>
                <span className={`${styles.statusDot} ${styles.paidStatusDot}`}></span>
                <span className={`${styles.statusText} ${styles.paidStatusText}`}>{tabs[activeTab].content?.status || 'PENDENTE'}</span>
              </div>
              <p className={styles.statusDescription}>{tabs[activeTab].content?.description || 'Aguardando processamento'}</p>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Progresso da Fase</span>
                <span className={styles.progressValue}>{tabs[activeTab].percentage}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${styles.paidFill}`}
                  style={{ width: `${tabs[activeTab].percentage}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.contentCard}>
            <div className={styles.contentHeader}>
              <div className={styles.contentIcon}>{tabs[activeTab].icon}</div>
              <div>
                <h4 className={styles.contentTitle}>Valor a ser desbloqueado na {tabs[activeTab].title}</h4>
                <p className={styles.contentSubtitle}>{tabs[activeTab].subtitle}</p>
              </div>
            </div>
            
            <div className={styles.amountDisplay}>
              <span className={styles.amountLabel}>Valor a desbloquear</span>
              <span className={styles.amountValue}>
                US$ {tabs[activeTab].content?.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
            </div>

            <div className={styles.statusSection}>
              <div className={styles.statusBadge}>
                <span className={styles.statusDot}></span>
                <span className={styles.statusText}>{tabs[activeTab].content?.status || 'PENDENTE'}</span>
              </div>
              <p className={styles.statusDescription}>{tabs[activeTab].content?.description || 'Aguardando processamento'}</p>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Progresso da Fase</span>
                <span className={styles.progressValue}>0%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={`${styles.progressFill} ${styles.pendingFill}`}
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
