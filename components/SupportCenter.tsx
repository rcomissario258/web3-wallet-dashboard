'use client';

import { useState } from 'react';
import { MessageCircle, Search, Plus, Send, Clock, CheckCircle, XCircle, AlertCircle, FileText, Phone, Mail, ChevronRight, Star } from 'lucide-react';
import styles from '@/styles/SupportCenter.module.css';

export default function SupportCenter() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 1,
      subject: 'Problema com levantamento Fase 1',
      status: 'open',
      priority: 'high',
      createdAt: '2024-09-21T10:30:00',
      messages: [
        { sender: 'user', text: 'Não consigo fazer levantamento da Fase 1', time: '2024-09-21T10:30:00' },
        { sender: 'support', text: 'Verificando seu caso agora', time: '2024-09-21T10:35:00' }
      ]
    },
    {
      id: 2,
      subject: 'Dúvida sobre taxa AML',
      status: 'resolved',
      priority: 'medium',
      createdAt: '2024-09-20T15:20:00',
      messages: [
        { sender: 'user', text: 'Qual é a taxa AML?', time: '2024-09-20T15:20:00' },
        { sender: 'support', text: 'A taxa AML é de 0.5% sobre o valor da transação', time: '2024-09-20T15:25:00' }
      ]
    }
  ]);

  const faqs = [
    {
      id: 1,
      category: 'Geral',
      question: 'Como funciona o sistema de levantamento?',
      answer: 'O sistema de levantamento é dividido em 3 fases baseadas no total recuperado de 4 milhões. Cada fase tem um valor específico e só pode ser levantada quando a anterior for concluída.',
      rating: 4.8
    },
    {
      id: 2,
      category: 'Segurança',
      question: 'O que é a taxa AML?',
      answer: 'A taxa AML (Anti-Money Laundering) é uma taxa obrigatória de 0.5% cobrada de acordo com regulamentações internacionais de combate à lavagem de dinheiro.',
      rating: 4.9
    },
    {
      id: 3,
      category: 'Pagamentos',
      question: 'Quais métodos de levantamento são aceitos?',
      answer: 'Aceitamos transferências bancárias, carteiras cripto (TRC20, ERC20, BEP20, BTC), e outros métodos disponíveis conforme sua região.',
      rating: 4.7
    },
    {
      id: 4,
      category: 'Verificação',
      question: 'Como funciona a verificação KYC?',
      answer: 'O processo KYC (Know Your Customer) envia verificação de identidade, screening de sanções e análise de risco para garantir conformidade com regulamentações.',
      rating: 4.6
    },
    {
      id: 5,
      category: 'Taxas',
      question: 'Quais são as taxas aplicadas?',
      answer: 'As taxas variam conforme o método: 1% para cripto, US$ 25 fixo para transferências bancárias, e 0.5% para outros métodos.',
      rating: 4.5
    },
    {
      id: 6,
      category: 'Tempo',
      question: 'Quanto tempo demora o processamento?',
      answer: 'O processamento geralmente leva de 24 a 48 horas úteis, dependendo do método e da verificação de compliance necessária.',
      rating: 4.4
    }
  ];

  const categories = ['Todas', 'Geral', 'Segurança', 'Pagamentos', 'Verificação', 'Taxas', 'Tempo'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const createTicket = () => {
    if (ticketSubject && ticketMessage) {
      const newTicket = {
        id: tickets.length + 1,
        subject: ticketSubject,
        status: 'open',
        priority: 'medium',
        createdAt: new Date().toISOString(),
        messages: [
          { sender: 'user', text: ticketMessage, time: new Date().toISOString() }
        ]
      };
      setTickets([...tickets, newTicket]);
      setTicketSubject('');
      setTicketMessage('');
      setActiveTab('tickets');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock size={16} className={styles.openIcon} />;
      case 'resolved':
        return <CheckCircle size={16} className={styles.resolvedIcon} />;
      case 'closed':
        return <XCircle size={16} className={styles.closedIcon} />;
      default:
        return <AlertCircle size={16} className={styles.pendingIcon} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#94a3b8';
    }
  };

  const renderFAQ = () => (
    <div className={styles.tabContent}>
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar perguntas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${searchQuery === '' && category === 'Todas' ? styles.active : ''}`}
            onClick={() => setSearchQuery(category === 'Todas' ? '' : category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.faqList}>
        {filteredFAQs.map((faq) => (
          <div key={faq.id} className={styles.faqItem}>
            <div className={styles.faqHeader}>
              <div className={styles.faqMeta}>
                <span className={styles.faqCategory}>{faq.category}</span>
                <div className={styles.faqRating}>
                  <Star size={14} className={styles.starIcon} />
                  <span>{faq.rating}</span>
                </div>
              </div>
            </div>
            <h3 className={styles.faqQuestion}>{faq.question}</h3>
            <p className={styles.faqAnswer}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className={styles.tabContent}>
      <div className={styles.ticketsHeader}>
        <h3 className={styles.ticketsTitle}>Meus Tickets</h3>
        <button className={styles.newTicketButton}>
          <Plus size={18} />
          <span>Novo Ticket</span>
        </button>
      </div>

      <div className={styles.ticketsList}>
        {tickets.map((ticket) => (
          <div key={ticket.id} className={styles.ticketCard}>
            <div className={styles.ticketHeader}>
              <div className={styles.ticketInfo}>
                <span className={styles.ticketId}>#{ticket.id}</span>
                <h4 className={styles.ticketSubject}>{ticket.subject}</h4>
              </div>
              <div className={styles.ticketStatus}>
                {getStatusIcon(ticket.status)}
                <span className={styles.statusText}>{ticket.status}</span>
              </div>
            </div>
            <div className={styles.ticketMeta}>
              <span className={styles.ticketPriority} style={{ color: getPriorityColor(ticket.priority) }}>
                {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
              <span className={styles.ticketDate}>
                {new Date(ticket.createdAt).toLocaleDateString('pt-PT')}
              </span>
            </div>
            <div className={styles.ticketPreview}>
              <p className={styles.previewText}>
                {ticket.messages[ticket.messages.length - 1].text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewTicket = () => (
    <div className={styles.tabContent}>
      <div className={styles.newTicketForm}>
        <h3 className={styles.formTitle}>Criar Novo Ticket</h3>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Assunto</label>
          <input
            type="text"
            className={styles.formInput}
            placeholder="Descreva brevemente seu problema"
            value={ticketSubject}
            onChange={(e) => setTicketSubject(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Prioridade</label>
          <select className={styles.formInput}>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mensagem</label>
          <textarea
            className={styles.textarea}
            placeholder="Descreva detalhadamente seu problema ou dúvida"
            value={ticketMessage}
            onChange={(e) => setTicketMessage(e.target.value)}
            rows={6}
          />
        </div>

        <div className={styles.formActions}>
          <button 
            className={styles.cancelButton}
            onClick={() => setActiveTab('tickets')}
          >
            Cancelar
          </button>
          <button 
            className={styles.submitButton}
            onClick={createTicket}
            disabled={!ticketSubject || !ticketMessage}
          >
            <Send size={18} />
            <span>Enviar Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className={styles.tabContent}>
      <div className={styles.contactSection}>
        <h3 className={styles.contactTitle}>Entre em Contato</h3>
        <p className={styles.contactDescription}>
          Não encontrou sua resposta? Entre em contato diretamente com nossa equipe de suporte.
        </p>

        <div className={styles.contactMethods}>
          <div className={styles.contactMethod}>
            <div className={styles.contactIcon}>
              <Mail size={32} />
            </div>
            <div className={styles.contactInfo}>
              <h4 className={styles.contactMethodTitle}>Email</h4>
              <p className={styles.contactMethodValue}>support@autotradeai.net</p>
              <p className={styles.contactMethodTime}>Resposta em 24h</p>
            </div>
          </div>

          <div className={styles.contactMethod}>
            <div className={styles.contactIcon}>
              <Phone size={32} />
            </div>
            <div className={styles.contactInfo}>
              <h4 className={styles.contactMethodTitle}>Telefone</h4>
              <p className={styles.contactMethodValue}>+258 84 123 4567</p>
              <p className={styles.contactMethodTime}>Seg-Sex, 9h-18h</p>
            </div>
          </div>

          <div className={styles.contactMethod}>
            <div className={styles.contactIcon}>
              <MessageCircle size={32} />
            </div>
            <div className={styles.contactInfo}>
              <h4 className={styles.contactMethodTitle}>Chat ao Vivo</h4>
              <p className={styles.contactMethodValue}>Disponível 24/7</p>
              <p className={styles.contactMethodTime}>Tempo médio: 5min</p>
            </div>
          </div>
        </div>

        <div className={styles.documentsSection}>
          <h4 className={styles.documentsTitle}>Documentos Úteis</h4>
          <div className={styles.documentsList}>
            <a href="#" className={styles.documentLink}>
              <FileText size={20} />
              <div>
                <span className={styles.documentTitle}>Guia do Usuário</span>
                <span className={styles.documentDescription}>PDF • 2.5 MB</span>
              </div>
              <ChevronRight size={16} />
            </a>
            <a href="#" className={styles.documentLink}>
              <FileText size={20} />
              <div>
                <span className={styles.documentTitle}>Política de Privacidade</span>
                <span className={styles.documentDescription}>PDF • 1.8 MB</span>
              </div>
              <ChevronRight size={16} />
            </a>
            <a href="#" className={styles.documentLink}>
              <FileText size={20} />
              <div>
                <span className={styles.documentTitle}>Termos de Serviço</span>
                <span className={styles.documentDescription}>PDF • 3.2 MB</span>
              </div>
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.supportCenter}>
      <div className={styles.header}>
        <h2 className={styles.title}>Centro de Suporte</h2>
        <p className={styles.subtitle}>Estamos aqui para ajudar você</p>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'faq' ? styles.active : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          <FileText size={20} />
          <span>FAQ</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'tickets' ? styles.active : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <MessageCircle size={20} />
          <span>Tickets</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'new' ? styles.active : ''}`}
          onClick={() => setActiveTab('new')}
        >
          <Plus size={20} />
          <span>Novo Ticket</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'contact' ? styles.active : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          <Phone size={20} />
          <span>Contato</span>
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'tickets' && renderTickets()}
        {activeTab === 'new' && renderNewTicket()}
        {activeTab === 'contact' && renderContact()}
      </div>
    </div>
  );
}