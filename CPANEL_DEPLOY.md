# Deploy em cPanel (Hosting Tradicional)

## 🎯 Deploy para cPanel

Este guia é específico para fazer deploy do seu projeto em um servidor com cPanel.

## 📋 Pré-requisitos

- Acesso ao cPanel do seu hosting
- Acesso FTP ou File Manager
- PHP habilitado no servidor
- Email SMTP configurado (ou usar mail() do servidor)

## 🚀 Passo a Passo

### 1. Preparar Arquivos para Upload

Primeiro, vamos preparar os arquivos:

```bash
# O build já está pronto na pasta 'out/'
# Precisamos também do serviço PHP de email
```

### 2. Upload via cPanel File Manager

**Opção A: Usando File Manager do cPanel**

1. **Acessar cPanel:**
   - Login no cPanel (geralmente: `seudominio.com/cpanel`)
   - Ir para "File Manager"

2. **Navegar para pasta pública:**
   - Ir para `public_html` (ou a pasta do seu domínio)
   - Apagar arquivos existentes se necessário

3. **Upload dos arquivos estáticos:**
   - Selecionar todos os arquivos da pasta `out/`
   - Upload para `public_html/`
   - Estrutura final:
     ```
     public_html/
     ├── index.html
     ├── 404.html
     ├── _next/
     │   ├── static/
     │   └── ...
     ├── favicon.ico
     └── ...
     ```

4. **Upload do serviço PHP:**
   - Criar pasta `api/` em `public_html/`
   - Upload `send-email.php` para `public_html/api/`
   - Upload pasta `vendor/` para `public_html/api/vendor/`

**Opção B: Usando FTP/SFTP**

```bash
# Usar FileZilla ou outro cliente FTP
# Conectar ao seu servidor FTP
# Upload da pasta 'out/' para 'public_html/'
# Upload de 'send-email.php' e 'vendor/' para 'public_html/api/'
```

### 3. Configurar Serviço PHP de Email

**Atualizar o arquivo `send-email.php` no servidor:**

1. No File Manager, editar `public_html/api/send-email.php`
2. Configurar para usar SMTP do servidor cPanel:

```php
// No arquivo send-email.php, alterar:
$smtpHost = 'mail.seudominio.com'; // Seu domínio
$smtpPort = 465; // SSL/TLS
$smtpSecure = PHPMailer::ENCRYPTION_SMTPS;
$smtpUser = 'noreply@seudominio.com'; // Email criado no cPanel
$smtpPassword = 'sua-senha-email'; // Senha do email
$fromEmail = 'noreply@seudominio.com';
$fromName = 'AUTOTRADE, AI';

// Desativar modo de teste
$testMode = false;
```

### 4. Criar Email no cPanel

1. **Acessar "Email Accounts" no cPanel**
2. **Criar novo email:**
   - Email: `noreply@seudominio.com`
   - Senha: senha forte
   - Anotar a senha

3. **Configurar SMTP:**
   - Usar as credenciais do email criado
   - Host: `mail.seudominio.com`
   - Porta: 465 (SSL) ou 587 (TLS)

### 5. Atualizar URL do Serviço de Email

No código JavaScript, precisamos atualizar a URL do serviço PHP:

**Como o site é estático, precisamos editar o arquivo antes do upload:**

1. Editar `components/WithdrawalModal.tsx`:
```typescript
// Alterar a URL do serviço de email
const emailUrl = '/api/send-email.php'; // Caminho relativo no servidor
```

2. Rebuildar o projeto:
```bash
npm run build
```

3. Upload novamente dos arquivos da pasta `out/`

### 6. Configurar .htaccess (Opcional)

Criar arquivo `.htaccess` em `public_html/` para melhorar o SEO:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Comprimir arquivos
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 7. Configurar SSL (HTTPS)

**No cPanel:**

1. Ir para "SSL/TLS Status"
2. Selecionar seu domínio
3. Clicar em "Run AutoSSL"
4. Aguardar certificado ser gerado

**Forçar HTTPS no .htaccess:**
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 8. Testar Deploy

1. **Acessar seu domínio:** `https://seudominio.com`
2. **Testar funcionalidade:**
   - Abrir modal de levantamento
   - Preencher dados
   - Verificar se email é enviado
3. **Verificar logs:**
   - No File Manager, verificar `api/email-log.txt`
   - Verificar `api/email-error.txt`

## 🔧 Configurações Específicas cPanel

### PHP Configuration

No cPanel, verificar configurações PHP:

1. **Selecionar PHP Version:**
   - Ir para "Select PHP Version"
   - Selecionar PHP 7.4 ou superior
   - Habilitar extensões necessárias:
     - `mbstring`
     - `openssl`
     - `json`
     - `curl`

### Firewall e Portas

Verificar se portas SMTP estão abertas:

- Porta 25 (SMTP)
- Porta 465 (SMTPS)
- Porta 587 (Submission)

Se necessário, solicitar ao suporte do hosting.

### Permissões de Arquivos

No File Manager, configurar permissões:

- Arquivos PHP: 644
- Pasta vendor/: 755
- Arquivos de log: 666 (para permitir escrita)

## 📱 Deploy Final - Resumo

**Arquivos para Upload:**

```
public_html/
├── index.html
├── 404.html
├── _next/
│   ├── static/
│   └── ...
├── favicon.ico
├── .htaccess
└── api/
    ├── send-email.php
    ├── vendor/
    │   └── ...
    ├── email-log.txt
    └── email-error.txt
```

**Configurações Finais:**

1. ✅ Upload dos arquivos estáticos (pasta `out/`)
2. ✅ Upload do serviço PHP (`api/`)
3. ✅ Configurar email no cPanel
4. ✅ Atualizar credenciais SMTP no `send-email.php`
5. ✅ Desativar modo de teste (`$testMode = false`)
6. ✅ Configurar SSL/HTTPS
7. ✅ Testar funcionalidade completa

## 🚨 Solução de Problemas

### Erro 404 ao acessar `/api/send-email.php`

**Solução:**
- Verificar se a pasta `api/` existe
- Verificar permissões da pasta
- Verificar se `send-email.php` está na pasta correta

### Email não é enviado

**Solução:**
- Verificar logs em `api/email-error.txt`
- Testar credenciais SMTP
- Verificar se email foi criado no cPanel
- Tentar usar `mail()` nativa se SMTP falhar

### Erro de permissão

**Solução:**
- No File Manager, clicar com botão direito
- "Change Permissions"
- Configurar: Pastas 755, Arquivos 644

### PHP não funciona

**Solução:**
- Verificar versão do PHP no cPanel
- Habilitar extensões necessárias
- Verificar se PHP está habilitado no domínio

## 📊 Monitoramento no cPanel

### Logs Disponíveis:

1. **Access Logs:** `public_html/access-logs`
2. **Error Logs:** `public_html/error-logs`
3. **Email Logs:** `api/email-log.txt` (nosso customizado)

### Recursos do cPanel:

- **Resource Usage:** Monitorar uso de CPU/memória
- **Bandwidth:** Monitorar tráfego
- **Disk Usage:** Monitorar espaço em disco

## 🎯 Deploy Automatizado (Opcional)

Para deploy automatizado via Git no cPanel:

1. **Instalar Git no servidor** (via SSH)
2. **Clonar repositório** em pasta fora de `public_html`
3. **Script de deploy:**
```bash
#!/bin/bash
cd /home/usuario/web3-wallet-dashboard
git pull origin main
npm run build
cp -r out/* /home/usuario/public_html/
cp send-email.php /home/usuario/public_html/api/
cp -r vendor/ /home/usuario/public_html/api/
```

4. **Configurar webhook** no Git para executar script

## ✅ Checklist Final

- [ ] Upload de todos os arquivos estáticos
- [ ] Upload do serviço PHP
- [ ] Email criado no cPanel
- [ ] Credenciais SMTP configuradas
- [ ] Modo de teste desativado
- [ ] SSL/HTTPS configurado
- [ ] .htaccess configurado
- [ ] Permissões de arquivos configuradas
- [ ] Funcionalidade testada
- [ ] Logs verificados
- [ ] Backup realizado

Seu projeto estará em produção em https://seudominio.com com email automatizado configurado!