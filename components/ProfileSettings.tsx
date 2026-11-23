'use client';

import { useState, useEffect } from 'react';
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
    securityAlerts: true,
    profilePhoto: 'data:image/jpeg;base64,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'
  });

  // Carregar dados do localStorage ao montar
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('profileSettings');
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        setFormData(profileData);
      }
      
      // Carregar email do localStorage para usar no WithdrawalModal
      const savedEmail = localStorage.getItem('userEmail');
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
    }
  }, []);

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
    
    // Salvar email no localStorage para uso no WithdrawalModal
    localStorage.setItem('userEmail', formData.email);
    localStorage.setItem('profileSettings', JSON.stringify(formData));
    
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
            {formData.profilePhoto ? (
              <img 
                src={formData.profilePhoto} 
                alt="Profile" 
                className={styles.avatarImage}
              />
            ) : (
              <div className={styles.avatar}>EO</div>
            )}
          </div>
          <div className={styles.avatarInfo}>
            <h5 className={styles.avatarName}>Eduardo Oliveira</h5>
            <p className={styles.avatarStatus}>Platinum Member</p>
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