'use client';

import { useState } from 'react';
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, X, Clock, Filter, Trash, Archive } from 'lucide-react';
import styles from '@/styles/NotificationCenter.module.css';

export default function NotificationCenter() {
  const [filter, setFilter] = useState('all');
  const [showPanel, setShowPanel] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Pagamento Concluído',
      message: 'Sua taxa AML foi processada com sucesso',
      time: '2 minutos atrás',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Ação Requerida',
      message: 'Complete a verificação KYC para continuar',
      time: '1 hora atrás',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Novo Dispositivo',
      message: 'Login detectado de novo dispositivo',
      time: '3 horas atrás',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Transação Falhou',
      message: 'Transferência bancária recusada pelo banco',
      time: '5 horas atrás',
      read: true
    },
    {
      id: 5,
      type: 'success',
      title: 'Fase 1 Aprovada',
      message: 'Sua primeira fase de levantamento foi aprovada',
      time: '1 dia atrás',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className={styles.successIcon} />;
      case 'warning':
        return <AlertTriangle size={20} className={styles.warningIcon} />;
      case 'error':
        return <XCircle size={20} className={styles.errorIcon} />;
      default:
        return <Info size={20} className={styles.infoIcon} />;
    }
  };

  const markAsRead = (id: number) => {
    // Implementar lógica de marcar como lido
  };

  const markAllAsRead = () => {
    // Implementar lógica de marcar todos como lidos
  };

  const deleteNotification = (id: number) => {
    // Implementar lógica de deletar
  };

  const archiveNotification = (id: number) => {
    // Implementar lógica de arquivar
  };

  return (
    <div className={styles.notificationCenter}>
      <button 
        className={styles.notificationButton}
        onClick={() => setShowPanel(!showPanel)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {showPanel && (
        <div className={styles.notificationPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.headerContent}>
              <h3 className={styles.panelTitle}>Notificações</h3>
              <span className={styles.unreadCount}>{unreadCount} não lidas</span>
            </div>
            <div className={styles.headerActions}>
              <button 
                className={styles.markAllReadButton}
                onClick={markAllAsRead}
                title="Marcar todas como lidas"
              >
                <CheckCircle size={16} />
              </button>
              <button 
                className={styles.closeButton}
                onClick={() => setShowPanel(false)}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className={styles.filterBar}>
            <Filter size={16} className={styles.filterIcon} />
            <select 
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="unread">Não lidas</option>
              <option value="success">Sucesso</option>
              <option value="warning">Avisos</option>
              <option value="error">Erros</option>
            </select>
          </div>

          <div className={styles.notificationList}>
            {notifications
              .filter(n => filter === 'all' || n.type === filter || (filter === 'unread' && !n.read))
              .map((notification) => (
                <div 
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
                >
                  <div className={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationHeader}>
                      <h4 className={styles.notificationTitle}>{notification.title}</h4>
                      <span className={styles.notificationTime}>{notification.time}</span>
                    </div>
                    <p className={styles.notificationMessage}>{notification.message}</p>
                  </div>
                  <div className={styles.notificationActions}>
                    {!notification.read && (
                      <button 
                        className={styles.actionButton}
                        onClick={() => markAsRead(notification.id)}
                        title="Marcar como lido"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      className={styles.actionButton}
                      onClick={() => archiveNotification(notification.id)}
                      title="Arquivar"
                    >
                      <Archive size={16} />
                    </button>
                    <button 
                      className={styles.actionButton}
                      onClick={() => deleteNotification(notification.id)}
                      title="Deletar"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className={styles.panelFooter}>
            <button className={styles.viewAllButton}>
              Ver todas as notificações
            </button>
            <button className={styles.settingsButton}>
              Configurações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}