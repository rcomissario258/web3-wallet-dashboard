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
      title: '1ª Fase',
      icon: '🔓',
      subtitle: 'Desbloqueio 30%',
      percentage: 30,
      amount: 1380009.00,
      status: 'PENDENTE',
      description: 'Aguardando a conclusão do pagamento total da Fase 1 da operação logística',
      content: {
        type: 'unlock',
        amount: 1380009.00,
        status: 'PENDENTE',
        description: 'Aguardando a conclusão do pagamento total da Fase 1 da operação logística'
      }
    },
    {
      id: 2,
      title: '2ª Fase',
      icon: '🔐',
      subtitle: 'Desbloqueio 50%',
      percentage: 50,
      amount: 2300015.00,
      status: 'PENDENTE',
      description: 'Aguardando a conclusão do pagamento total da Fase 2 da operação logística',
      content: {
        type: 'unlock',
        amount: 2300015.00,
        status: 'PENDENTE',
        description: 'Aguardando a conclusão do pagamento total da Fase 2 da operação logística'
      }
    },
    {
      id: 3,
      title: '3ª Fase',
      icon: '🎯',
      subtitle: 'Desbloqueio 20%',
      percentage: 20,
      amount: 920006.00,
      status: 'PENDENTE',
      description: 'Aguardando a conclusão do pagamento total da Fase 2 da operação logística',
      content: {
        type: 'unlock',
        amount: 920006.00,
        status: 'PENDENTE',
        description: 'Aguardando a conclusão do pagamento total da Fase 2 da operação logística'
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
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>💰</div>
                <div className={styles.detailInfo}>
                  <span className={styles.detailLabel}>Valor Pago</span>
                  <span className={`${styles.detailValue} ${styles.denied}`}>
                    NEGADO
                  </span>
                  <span className={styles.deniedNote}>Negado por conflito de interesse</span>
                </div>
              </div>
              
              <div className={styles.detailItem}>
                <div className={styles.detailIcon}>💵</div>
                <div className={styles.detailInfo}>
                  <span className={styles.detailLabel}>Remanescente</span>
                  <span className={`${styles.detailValue} ${styles.paid}`}>
                    PAGO
                  </span>
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
