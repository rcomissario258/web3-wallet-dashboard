'use client';

import { useState } from 'react';
import { 
  User, Mail, Phone, Shield, Bell, Globe, CreditCard, 
  Lock, Key, Eye, EyeOff, Save, Camera, Upload, 
  Smartphone, Laptop, AlertTriangle, CheckCircle 
} from 'lucide-react';
import styles from '@/styles/ProfileSettings.module.css';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Eduardo',
    lastName: 'Oliveira',
    email: 'eduardo@example.com',
    phone: '+258 XX XXX XXXX',
    country: 'Mozambique',
    language: 'pt',
    timezone: 'Africa/Maputo',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true
  });

  const tabs = [
    { id: 'personal', label: 'Informações Pessoais', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'preferences', label: 'Preferências', icon: Globe },
    { id: 'payment', label: 'Métodos de Pagamento', icon: CreditCard }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderPersonalInfo = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Informações Pessoais</h4>
        
        <div className={styles.avatarSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>EO</div>
            <button className={styles.avatarButton}>
              <Camera size={20} />
            </button>
          </div>
          <div className={styles.avatarInfo}>
            <h5 className={styles.avatarName}>Eduardo Oliveira</h5>
            <p className={styles.avatarStatus}>Platinum Member</p>
            <button className={styles.uploadButton}>
              <Upload size={16} />
              <span>Carregar Foto</span>
            </button>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nome</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Sobrenome</label>
            <input
              type="text"
              className={styles.formInput}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>
            <div className={styles.inputWithIcon}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                type="email"
                className={styles.formInput}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Telefone</label>
            <div className={styles.inputWithIcon}>
              <Phone size={18} className={styles.inputIcon} />
              <input
                type="tel"
                className={styles.formInput}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>País</label>
            <select
              className={styles.formInput}
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            >
              <option value="Mozambique">Mozambique</option>
              <option value="Portugal">Portugal</option>
              <option value="Brasil">Brasil</option>
              <option value="Angola">Angola</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Idioma</label>
            <select
              className={styles.formInput}
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Endereço</h4>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Rua</label>
            <input type="text" className={styles.formInput} placeholder="Rua principal" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Cidade</label>
            <input type="text" className={styles.formInput} placeholder="Maputo" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Código Postal</label>
            <input type="text" className={styles.formInput} placeholder="1100" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Alterar Senha</h4>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Senha Atual</label>
          <div className={styles.inputWithIcon}>
            <Lock size={18} className={styles.inputIcon} />
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.formInput}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Digite sua senha atual"
            />
            <button
              className={styles.togglePassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Nova Senha</label>
          <div className={styles.inputWithIcon}>
            <Key size={18} className={styles.inputIcon} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className={styles.formInput}
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              className={styles.togglePassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Confirmar Nova Senha</label>
          <input
            type="password"
            className={styles.formInput}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirme a nova senha"
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Autenticação de Dois Fatores</h4>
        
        <div className={styles.twoFactorSection}>
          <div className={styles.twoFactorInfo}>
            <div className={styles.twoFactorIcon}>
              <Smartphone size={32} />
            </div>
            <div className={styles.twoFactorDetails}>
              <h5 className={styles.twoFactorTitle}>2FA Ativado</h5>
              <p className={styles.twoFactorDescription}>
                Sua conta está protegida com autenticação de dois fatores
              </p>
            </div>
          </div>
          
          <div className={styles.twoFactorStatus}>
            <div className={styles.statusBadge}>
              <CheckCircle size={16} />
              <span>Ativo</span>
            </div>
            <button className={styles.manageButton}>
              Gerenciar
            </button>
          </div>
        </div>

        <div className={styles.securityDevices}>
          <h5 className={styles.devicesTitle}>Dispositivos Confiáveis</h5>
          <div className={styles.deviceList}>
            <div className={styles.deviceItem}>
              <Laptop className={styles.deviceIcon} />
              <div className={styles.deviceInfo}>
                <span className={styles.deviceName}>Computador Desktop</span>
                <span className={styles.deviceLocation}>Maputo, Mozambique • Ativo agora</span>
              </div>
              <span className={styles.deviceStatus}>Atual</span>
            </div>
            <div className={styles.deviceItem}>
              <Smartphone className={styles.deviceIcon} />
              <div className={styles.deviceInfo}>
                <span className={styles.deviceName}>Smartphone</span>
                <span className={styles.deviceLocation}>Maputo, Mozambique • Há 2 horas</span>
              </div>
              <span className={styles.deviceStatus}>Anterior</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Preferências de Notificação</h4>
        
        <div className={styles.notificationSettings}>
          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <Bell className={styles.notificationIcon} />
              <div>
                <h5 className={styles.notificationTitle}>Notificações por Email</h5>
                <p className={styles.notificationDescription}>
                  Receba atualizações importantes no seu email
                </p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <Smartphone className={styles.notificationIcon} />
              <div>
                <h5 className={styles.notificationTitle}>Notificações SMS</h5>
                <p className={styles.notificationDescription}>
                  Receba alertas importantes via SMS
                </p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.smsNotifications}
                onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <Bell className={styles.notificationIcon} />
              <div>
                <h5 className={styles.notificationTitle}>Notificações Push</h5>
                <p className={styles.notificationDescription}>
                  Receba notificações em tempo real no navegador
                </p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.pushNotifications}
                onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <AlertTriangle className={styles.notificationIcon} />
              <div>
                <h5 className={styles.notificationTitle}>Alertas de Segurança</h5>
                <p className={styles.notificationDescription}>
                  Notificações sobre atividades suspeitas
                </p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.securityAlerts}
                onChange={(e) => handleInputChange('securityAlerts', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>

          <div className={styles.notificationItem}>
            <div className={styles.notificationInfo}>
              <Mail className={styles.notificationIcon} />
              <div>
                <h5 className={styles.notificationTitle}>Emails de Marketing</h5>
                <p className={styles.notificationDescription}>
                  Receba novidades e promoções
                </p>
              </div>
            </div>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={formData.marketingEmails}
                onChange={(e) => handleInputChange('marketingEmails', e.target.checked)}
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Preferências Regionais</h4>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Fuso Horário</label>
          <select
            className={styles.formInput}
            value={formData.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
          >
            <option value="Africa/Maputo">Africa/Maputo (GMT+2)</option>
            <option value="Europe/Lisbon">Europe/Lisbon (GMT+1)</option>
            <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
            <option value="UTC">UTC (GMT+0)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Moeda Principal</label>
          <select className={styles.formInput}>
            <option value="USD">USD - Dólar Americano</option>
            <option value="EUR">EUR - Euro</option>
            <option value="MZN">MZN - Metical Moçambicano</option>
            <option value="BRL">BRL - Real Brasileiro</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Formato de Data</label>
          <select className={styles.formInput}>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Acessibilidade</h4>
        
        <div className={styles.accessibilityOptions}>
          <div className={styles.accessibilityItem}>
            <label className={styles.toggle}>
              <input type="checkbox" />
              <span className={styles.toggleSlider}></span>
            </label>
            <span>Modo Escuro</span>
          </div>
          <div className={styles.accessibilityItem}>
            <label className={styles.toggle}>
              <input type="checkbox" />
              <span className={styles.toggleSlider}></span>
            </label>
            <span>Reduzir Movimento</span>
          </div>
          <div className={styles.accessibilityItem}>
            <label className={styles.toggle}>
              <input type="checkbox" />
              <span className={styles.toggleSlider}></span>
            </label>
            <span>Alto Contraste</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className={styles.tabContent}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Métodos de Pagamento</h4>
        
        <div className={styles.paymentMethods}>
          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>
              <CreditCard size={24} />
            </div>
            <div className={styles.paymentInfo}>
              <h5 className={styles.paymentTitle}>Cartão de Crédito</h5>
              <p className={styles.paymentDescription}>**** **** **** 4532</p>
            </div>
            <span className={styles.paymentBadge}>Principal</span>
          </div>

          <div className={styles.paymentMethod}>
            <div className={styles.paymentIcon}>
              <Smartphone size={24} />
            </div>
            <div className={styles.paymentInfo}>
              <h5 className={styles.paymentTitle}>Carteira Digital</h5>
              <p className={styles.paymentDescription}>Carteira Móvel</p>
            </div>
            <button className={styles.verifyButton}>Verificar</button>
          </div>
        </div>

        <button className={styles.addPaymentButton}>
          <CreditCard size={20} />
          <span>Adicionar Novo Método</span>
        </button>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Histórico de Pagamentos</h4>
        <div className={styles.paymentHistory}>
          <div className={styles.historyItem}>
            <div className={styles.historyInfo}>
              <span className={styles.historyDate}>21/09/2024</span>
              <span className={styles.historyDescription}>Taxa Operacional - Fase 1</span>
            </div>
            <span className={styles.historyAmount}>US$ 11,500.08</span>
          </div>
          <div className={styles.historyItem}>
            <div className={styles.historyInfo}>
              <span className={styles.historyDate}>21/09/2024</span>
              <span className={styles.historyDescription}>Taxa Abonatória - Fase 2</span>
            </div>
            <span className={styles.historyAmount}>US$ 5,750.00</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.profileSettings}>
      <div className={styles.header}>
        <h2 className={styles.title}>Configurações do Perfil</h2>
        <p className={styles.subtitle}>Gerencie suas informações e preferências</p>
      </div>

      <div className={styles.container}>
        <div className={styles.tabsContainer}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.contentContainer}>
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'preferences' && renderPreferences()}
          {activeTab === 'payment' && renderPayment()}
        </div>

        <div className={styles.footer}>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className={styles.spinner}></span>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
          
          {saveSuccess && (
            <div className={styles.successMessage}>
              <CheckCircle size={16} />
              <span>Alterações salvas com sucesso!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}