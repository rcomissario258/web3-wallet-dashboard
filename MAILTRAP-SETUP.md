# Configuração do Mailtrap para Testes de Email

## O que é Mailtrap?

Mailtrap é um serviço de teste de email que permite enviar emails reais durante o desenvolvimento sem afetar destinatários reais. Os emails ficam salvos no Mailtrap para inspeção.

## Como Configurar Mailtrap

### 1. Criar Conta no Mailtrap

1. Acesse: https://mailtrap.io/
2. Clique em "Sign Up Free"
3. Crie uma conta (gratuita para testes)
4. Verifique seu email

### 2. Criar Inbox de Teste

1. Após login, clique em "My Inboxes"
2. Clique em "Add Inbox"
3. Dê um nome (ex: "AUTOTRADEAI Test")
4. Anote as credenciais:
   - **Username** (ex: 1a2b3c4d5e6f7g)
   - **Password** (ex: 1a2b3c4d5e6f7g)
   - **Host**: sandbox.smtp.mailtrap.io
   - **Port**: 2525

### 3. Configurar o Arquivo PHP

Abra o arquivo `send-email.php` e substitua as linhas 60-61:

```php
// ANTES:
$mail->Username = 'your-mailtrap-username'; // ALTERAR
$mail->Password = 'your-mailtrap-password'; // ALTERAR

// DEPOIS (com suas credenciais reais):
$mail->Username = '1a2b3c4d5e6f7g'; // Seu username do Mailtrap
$mail->Password = '1a2b3c4d5e6f7g'; // Sua password do Mailtrap
```

### 4. Testar Localmente

1. Certifique-se que o servidor PHP está rodando:
   ```bash
   php -S localhost:8000
   ```

2. Abra a página de teste:
   http://localhost:8000/test-email.html

3. Preencha com seu email real
4. Clique em "Enviar Email"

5. Verifique no Mailtrap:
   - Acesse https://mailtrap.io/
   - Vá em "My Inboxes"
   - Abra o inbox que você criou
   - O email deve aparecer lá

### 5. Verificar Logs

**Log de envio:**
```bash
cat email-log.txt
```

**Log de debug:**
```bash
cat email-debug.txt
```

**Log de erros:**
```bash
cat email-error.txt
```

## Integração com Frontend

O frontend já está configurado para usar o servidor PHP local em desenvolvimento:

```typescript
const emailUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000/send-email.php'
  : '/send-email.php';
```

## Para Produção

Quando estiver pronto para produção:

### Opção 1: Continuar com Mailtrap

Mailtrap também oferece planos pagos para produção:
- https://mailtrap.io/pricing/
- Configurar credenciais de produção no arquivo PHP

### Opção 2: Mudar para SMTP Real

No arquivo `send-email.php`, altere as configurações SMTP:

```php
// Para Gmail:
$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->Username = 'seu-email@gmail.com';
$mail->Password = 'sua-app-password';

// Para SendGrid:
$mail->Host = 'smtp.sendgrid.net';
$mail->Port = 587;
$mail->Username = 'apikey';
$mail->Password = 'sua-api-key';

// Para Mailgun:
$mail->Host = 'smtp.mailgun.org';
$mail->Port = 587;
$mail->Username = 'postmaster@seudominio.com';
$mail->Password = 'sua-api-key';
```

## Troubleshooting

### Erro: "SMTP connect() failed"

1. Verifique as credenciais do Mailtrap
2. Certifique-se que a porta 2525 está aberta
3. Verifique firewall local

### Erro: "Invalid credentials"

1. Verifique username e password do Mailtrap
2. Recrie as credenciais no Mailtrap se necessário

### Email não aparece no Mailtrap

1. Verifique o inbox correto no Mailtrap
2. Verifique os logs de erro
3. Teste com a página de teste isoladamente

### Composer não encontrado

Se não tiver composer instalado:
```bash
# Instalar composer globalmente
brew install composer  # macOS
# ou
curl -sS https://getcomposer.org/installer | php
```

## Benefícios do Mailtrap

✅ Emails reais sem afetar destinatários
✅ Interface web para inspecionar emails
✅ Histórico de emails enviados
✅ Teste de templates HTML
✅ Analytics de entregas
✅ Gratuito para desenvolvimento

## Planos do Mailtrap

**Free:**
- 500 emails/mês
- 1 inbox
- Retenção de 3 dias

**Paid:**
- Mais emails
- Múltiplos inboxes
- Retenção mais longa
- Recursos avançados

## Suporte

- Documentação Mailtrap: https://mailtrap.io/docs/
- PHPMailer: https://github.com/PHPMailer/PHPMailer
- Suporte Mailtrap: support@mailtrap.io
