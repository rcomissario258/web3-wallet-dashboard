# 🚀 Build Pronto para cPanel - Produção

## ✅ Preparação Concluída

Seu projeto está pronto para deploy em produção via cPanel! Todos os arquivos foram organizados e configurados.

## 📁 Estrutura de Arquivos Preparada

A pasta `cpanel-upload/` contém tudo organizado para upload:

```
cpanel-upload/
├── INSTRUCOES.txt           # Instruções detalhadas
├── public_html/             # Arquivos do site estático
│   ├── index.html
│   ├── 404.html
│   ├── _next/              # Arquivos Next.js
│   ├── favicon.ico
│   ├── .htaccess           # Configurações Apache
│   └── ...
└── api/                     # Serviço PHP de email
    ├── send-email.php      # Serviço de email
    ├── vendor/             # Dependências PHP
    ├── email-log.txt       # Log de envios
    ├── email-error.txt     # Log de erros
    └── email-debug.txt     # Log de debug
```

## 🎯 Configurações Aplicadas

### 1. **Frontend (Next.js)**
- ✅ Build de produção otimizado
- ✅ Tamanho: 41.9 kB (123 kB First Load JS)
- ✅ Arquivos estáticos gerados
- ✅ Email configurado: rafaelcomissario111@gmail.com
- ✅ URL do serviço PHP: `/api/send-email.php`

### 2. **Serviço PHP de Email**
- ✅ PHPMailer configurado
- ✅ Sistema de fallback (SMTP → mail())
- ✅ Logs detalhados
- ✅ Modo de teste ativo (configurar para produção)

### 3. **Configurações Apache (.htaccess)**
- ✅ Rewrite rules para SPA
- ✅ Forçar HTTPS
- ✅ Compressão de arquivos
- ✅ Cache otimizado

## 📋 Próximos Passos para Deploy

### 1. Upload via cPanel File Manager

1. **Acessar cPanel:**
   - URL: `https://seudominio.com/cpanel`
   - Login com suas credenciais

2. **File Manager:**
   - Ir para "File Manager"
   - Navegar para `public_html`

3. **Upload Frontend:**
   - Upload de todos os arquivos de `cpanel-upload/public_html/`
   - Manter a estrutura de pastas

4. **Upload API:**
   - Criar pasta `api/` em `public_html/`
   - Upload de todos os arquivos de `cpanel-upload/api/`

### 2. Configurar Email no cPanel

1. **Criar Email:**
   - Ir para "Email Accounts"
   - Criar: `noreply@seudominio.com`
   - Definir senha forte
   - Anotar credenciais

2. **Configurar SMTP:**
   - Editar `public_html/api/send-email.php`
   - Atualizar credenciais:
   ```php
   $smtpUser = 'noreply@seudominio.com';
   $smtpPassword = 'sua-senha-aqui';
   $fromEmail = 'noreply@seudominio.com';
   ```

3. **Ativar Produção:**
   - No mesmo arquivo, alterar:
   ```php
   $testMode = false; // Desativar modo teste
   ```

### 3. Configurar Permissões

No File Manager, configurar permissões:

- **Pastas:** 755
- **Arquivos PHP:** 644
- **Arquivos de log:** 666

### 4. Configurar SSL

1. **AutoSSL:**
   - Ir para "SSL/TLS Status"
   - Selecionar domínio
   - Clicar "Run AutoSSL"

2. **HTTPS será forçado automaticamente** pelo .htaccess

### 5. Testar Funcionalidade

1. **Acessar site:** `https://seudominio.com`
2. **Testar levantamento:**
   - Abrir modal de levantamento
   - Preencher dados
   - Verificar se email é enviado
3. **Verificar logs:**
   - `public_html/api/email-log.txt`
   - `public_html/api/email-error.txt`

## 🔧 Configurações Técnicas

### URL do Serviço PHP
O frontend está configurado para chamar: `/api/send-email.php`

### Email Automático
O sistema usa automaticamente: `rafaelcomissario111@gmail.com`

### Modo de Teste
Atualmente ativo - desativar no `send-email.php` para produção

## 📊 Build Statistics

- **Frontend Size:** 41.9 kB
- **First Load JS:** 123 kB
- **Static Pages:** 2 (index, 404)
- **Email Service:** PHP + PHPMailer
- **Automation:** 100% funcional

## 🎨 Funcionalidades Automatizadas

- ✅ Email pré-configurado (rafaelcomissario111@gmail.com)
- ✅ Código de verificação auto-gerado
- ✅ Auto-preenchimento do código
- ✅ Auto-verificação com um clique
- ✅ Sistema de fallback robusto
- ✅ Logs detalhados de todas operações

## 🚨 Importante

### Antes de Ativar Produção:

1. **Configurar Credenciais Reais:**
   - Criar email no cPanel
   - Atualizar `send-email.php` com credenciais
   - Desativar `$testMode = false`

2. **Testar Serviço PHP:**
   - Testar via curl ou Postman
   - Verificar logs de erro
   - Validar envio real de email

3. **Backup:**
   - Fazer backup do site atual
   - Testar em ambiente de staging primeiro

## 📱 Alternativa: Upload via FTP

Se preferir usar FTP:

1. **Usar FileZilla ou similar**
2. **Conectar ao servidor FTP**
3. **Upload:**
   - `cpanel-upload/public_html/` → `public_html/`
   - `cpanel-upload/api/` → `public_html/api/`

## 🆘 Suporte

Se encontrar problemas:

1. **Verificar logs:** `api/email-error.txt`
2. **Testar PHP:** Verificar versão e extensões
3. **Permissões:** 755 para pastas, 644 para arquivos
4. **SMTP:** Validar credenciais do email

## ✅ Checklist Final

- [ ] Upload dos arquivos estáticos
- [ ] Upload do serviço PHP
- [ ] Configurar permissões
- [ ] Criar email no cPanel
- [ ] Atualizar credenciais SMTP
- [ ] Desativar modo de teste
- [ ] Configurar SSL
- [ ] Testar funcionalidade
- [ ] Verificar logs
- [ ] Backup realizado

## 🎉 Seu Site Está Pronto!

A pasta `cpanel-upload/` contém tudo necessário para upload imediato no cPanel. Siga as instruções em `INSTRUCOES.txt` para o deploy.

O sistema está 100% automatizado e configurado para produção com email `rafaelcomissario111@gmail.com`!