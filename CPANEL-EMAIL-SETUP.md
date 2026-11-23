# Configuração de Email SMTP do cPanel

## Passo 1: Criar Conta de Email no cPanel

1. **Acesse o cPanel:**
   - URL: https://cp85fe4.palosrv.com:2083
   - Usuário: autotrad
   - Senha: y(3-Ppu42B4aTH

2. **Criar conta de email:**
   - No cPanel, procure por "Email Accounts"
   - Clique em "Create"
   - Email: `noreply@autotradeia.net`
   - Senha: crie uma senha forte (guarde-a!)
   - Mailbox Quota: 250 MB (ou o padrão)
   - Clique em "Create"

3. **Copiar a senha:**
   - Após criar, você verá a senha criptografada
   - **Importante:** Anote a senha que você definiu

## Passo 2: Configurar no Código

### Opção 1: Editar arquivo diretamente

1. Abra `send-email.php`
2. Vá para a linha 50
3. Substitua `<YOUR_EMAIL_PASSWORD>` pela senha da conta de email

```php
// ANTES:
$smtpPassword = getenv('SMTP_PASSWORD') ?: '<YOUR_EMAIL_PASSWORD>';

// DEPOIS:
$smtpPassword = getenv('SMTP_PASSWORD') ?: 'SUA_SENHA_AQUI';
```

### Opção 2: Usar variáveis de ambiente (Recomendado)

1. Crie arquivo `.env` no diretório do projeto
2. Adicione:

```env
SMTP_USERNAME=noreply@autotradeia.net
SMTP_PASSWORD=SUA_SENHA_AQUI
```

## Passo 3: Atualizar Frontend para Produção

No arquivo `components/WithdrawalModal.tsx`, altere a URL do email:

```typescript
// Para produção (cPanel):
const emailUrl = '/send-email.php';
```

## Passo 4: Upload para cPanel

### Arquivos necessários:

1. **Build do Next.js:**
   - Execute: `npm run build`
   - Copie todo o conteúdo da pasta `out/` para `public_html/`

2. **Arquivos PHP:**
   - `send-email.php` → `public_html/send-email.php`
   - `vendor/` → `public_html/vendor/` (toda a pasta)
   - `composer.json` → `public_html/composer.json`
   - `composer.lock` → `public_html/composer.lock`

3. **Opcional - Variáveis de ambiente:**
   - `.env` → `public_html/.env`
   - Certifique-se que o arquivo `.env` não seja acessível via web

## Configurações SMTP do cPanel

### Detalhes do seu servidor:

- **SMTP Host:** mail.autotradeia.net
- **SMTP Port:** 465 (SSL/TLS)
- **SMTP Port:** 587 (TLS alternativo)
- **SMTP User:** noreply@autotradeia.net
- **SMTP Password:** (senha da conta de email criada)
- **From Email:** noreply@autotradeia.net
- **From Name:** AUTOTRADE, AI

### Configurações SSL/TLS (Recomendado):

- **Protocolo:** SMTP
- **Host:** mail.autotradeia.net
- **Port:** 465
- **Encryption:** SSL/TLS
- **Authentication:** Normal password

## Teste Local vs Produção

### Desenvolvimento (Local):

Para testar localmente, você pode usar:
- mail() nativa (já configurado como fallback)
- Ou configurar SMTP local se tiver

### Produção (cPanel):

- Usa SMTP do cPanel
- Envia emails reais
- Domain: autotradeia.net
- Servidor: cp85fe4.palosrv.com

## Troubleshooting

### Erro: "SMTP Error: Could not authenticate"

- Verifique se a senha está correta
- Verifique se a conta de email existe no cPanel
- Verifique se o usuário está correto (email completo)

### Erro: "Connection refused"

- Verifique se a porta 465 está aberta
- Tente usar porta 587 com TLS
- Verifique se o firewall não está bloqueando

### Email não chega

- Verifique a pasta "Spam" do destinatário
- Verifique os logs no cPanel: "Email Trace"
- Verifique se o domínio está propagado

## Verificação no cPanel

### Como verificar emails enviados:

1. Acesse cPanel
2. Vá em "Email Trace"
3. Você pode ver o status de cada email enviado

### Como ver logs de erro:

1. Acesse cPanel
2. Vá em "Errors"
3. Verifique logs do PHP

## Sistema de Fallback

O sistema tem 2 camadas:

1. **SMTP cPanel** (principal) - se configurado
2. **mail() nativa** (fallback) - sempre disponível

Se o SMTP falhar, o sistema usa mail() automaticamente.

## Benefícios

✅ **Emails reais** via SMTP do cPanel  
✅ **Domain próprio** (autotradeia.net)  
✅ **Confiável** - servidor dedicado  
✅ **Sem custos adicionais** - incluído no plano  
✅ **Tracking** via cPanel  
✅ **Logs detalhados** no cPanel  

## Suporte

- **cPanel:** https://cp85fe4.palosrv.com:2083
- **Webmail:** https://cp85fe4.palosrv.com:2096
- **Documentação:** https://cliente.mozdomains.co.mz/knowledgebase
