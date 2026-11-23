# Guia de Deploy em Produção

## 📦 Build Atual

O build foi gerado com sucesso na pasta `out/` e está pronto para deploy.

**Status do Build:**
- ✅ Build concluído: 41.9 kB (123 kB First Load JS)
- ✅ Páginas estáticas geradas
- ✅ Otimizado para produção
- ✅ Email configurado: rafaelcomissario111@gmail.com

## 🚀 Opções de Deploy

### Opção 1: Vercel (Recomendado para Next.js)

**Vantagens:**
- Deploy automático com Git
- CDN global
- SSL gratuito
- Suporte nativo Next.js

**Passos:**
1. Instalar Vercel CLI:
```bash
npm install -g vercel
```

2. Login no Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Para deploy automático no Git:
- Conecte seu repositório no Vercel
- Configure as variáveis de ambiente se necessário

### Opção 2: Netlify

**Vantagens:**
- Deploy automático com Git
- CDN global
- SSL gratuito
- Suporte para sites estáticos

**Passos:**
1. Instalar Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod --dir=out
```

### Opção 3: Servidor Próprio (VPS/Hosting)

**Vantagens:**
- Controle total
- Custo fixo
- Pode hospedar o serviço PHP junto

**Passos:**

1. **Transferir arquivos:**
```bash
# Usar SCP ou SFTP para enviar a pasta 'out' para o servidor
scp -r out/ usuario@seu-servidor.com:/var/www/html/
```

2. **Configurar servidor web:**

**Apache:**
```apache
<VirtualHost *:80>
    ServerName seu-dominio.com
    DocumentRoot /var/www/html/out
    
    <Directory /var/www/html/out>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/html/out;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. **Configurar SSL (Let's Encrypt):**
```bash
sudo certbot --apache -d seu-dominio.com
# ou
sudo certbot --nginx -d seu-dominio.com
```

### Opção 4: GitHub Pages

**Vantagens:**
- Gratuito
- Integrado com GitHub
- CDN via Cloudflare

**Passos:**

1. Criar arquivo `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

2. Configurar GitHub Pages:
- Settings → Pages → Source: GitHub Actions

## 🔧 Configurações de Produção

### Serviço PHP de Email

**Importante:** O serviço de email (`send-email.php`) precisa estar hospedado em um servidor com PHP.

**Opções:**

1. **Mesmo servidor que hospeda o frontend:**
```bash
# Copiar send-email.php e vendor/ para o servidor
scp send-email.php usuario@servidor:/var/www/html/
scp -r vendor/ usuario@servidor:/var/www/html/
```

2. **Servidor separado:**
- Hospedar em um servidor com PHP/SMTP
- Atualizar a URL no código:
```typescript
const emailUrl = 'https://seu-servidor-email.com/send-email.php';
```

### Variáveis de Ambiente

Se precisar de configurações diferentes em produção:

1. Criar `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com
NEXT_PUBLIC_EMAIL_SERVICE_URL=https://email.seudominio.com
```

2. Atualizar o código para usar variáveis:
```typescript
const emailUrl = process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || '/send-email.php';
```

### Configuração de Email Real

Para produção, desative o modo de teste no `send-email.php`:

```php
// Alterar no arquivo send-email.php
$testMode = false; // Desativar modo teste

// Configurar credenciais reais
$smtpUser = 'rafaelcomissario111@gmail.com';
$smtpPassword = 'sua-app-password'; // Gerar em: https://myaccount.google.com/apppasswords
```

## 📋 Checklist de Deploy

- [ ] Build de produção gerado
- [ ] Arquivos estáticos testados localmente
- [ ] Serviço PHP de email configurado
- [ ] Credenciais SMTP configuradas (se necessário)
- [ ] SSL/HTTPS configurado
- [ ] CDN configurado (opcional)
- [ ] Monitoramento configurado
- [ ] Backup automatizado configurado
- [ ] Logs de acesso configurados

## 🔒 Segurança em Produção

1. **Nunca commitar credenciais:**
```gitignore
# Adicionar ao .gitignore
.env
.env.local
.env.production
*.key
email-credentials.txt
```

2. **Usar variáveis de ambiente:**
- Armazenar senhas em variáveis de ambiente do servidor
- Nunca incluir credenciais no código

3. **Atualizar dependências:**
```bash
npm audit
npm audit fix
```

4. **Configurar CORS:**
- No `send-email.php`, limitar origens permitidas:
```php
header('Access-Control-Allow-Origin: https://seudominio.com');
```

## 📊 Monitoramento

### Logs importantes:
- `email-log.txt`: Registros de envio de email
- `email-error.txt`: Erros de email
- Logs do servidor web (Apache/Nginx)

### Ferramentas recomendadas:
- Google Analytics
- Sentry (para error tracking)
- Uptime monitoring (UptimeRobot, Pingdom)

## 🆘 Suporte

Para problemas de deploy:
1. Verificar logs do servidor
2. Testar serviço PHP separadamente
3. Verificar configurações de firewall
4. Validar certificados SSL
5. Testar com ferramentas como curl

## 🎯 Deploy Rápido (Vercel)

Para deploy imediato no Vercel:

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy em produção
vercel --prod
```

O Vercel irá:
- Detectar automaticamente que é um projeto Next.js
- Configurar o build
- Fazer deploy global
- Configurar HTTPS
- Fornecer URL de produção