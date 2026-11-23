# Configuração de Envio de Email

## Status Atual: Modo de Teste

O sistema está configurado em **modo de teste**, o que significa que os emails são simulados mas não enviados realmente. Isso é ideal para desenvolvimento e testes.

## Como Habilitar Envio Real de Email

Para enviar emails reais em produção, siga estes passos:

### Opção 1: Usar Gmail (Recomendado)

1. **Gerar App Password do Gmail:**
   - Acesse: https://myaccount.google.com/apppasswords
   - Faça login na sua conta Google
   - Selecione "Mail" e "Outro (nome personalizado)"
   - Dê um nome como "AUTOTRADEAI"
   - Clique em "Gerar"
   - Copie a senha de 16 caracteres (formato: xxxx xxxx xxxx xxxx)

2. **Configurar o arquivo `send-email.php`:**
   ```php
   // Altere estas linhas no arquivo send-email.php:
   $testMode = false; // Desativar modo teste
   
   $smtpUser = 'seu-email@gmail.com'; // Seu email real
   $smtpPassword = 'sua-app-password'; // A senha de app copiada
   $fromEmail = 'seu-email@gmail.com'; // Seu email real
   ```

3. **Verificar configurações de segurança do Gmail:**
   - Certifique-se de que a autenticação de 2 fatores está ativada
   - Verifique se o App Password foi gerado corretamente

### Opção 2: Usar Outro Provedor SMTP

Você pode usar qualquer provedor SMTP como SendGrid, Mailgun, Amazon SES, etc.

**Exemplo com SendGrid:**
```php
$smtpHost = 'smtp.sendgrid.net';
$smtpPort = 587;
$smtpSecure = PHPMailer::ENCRYPTION_STARTTLS;
$smtpUser = 'apikey'; // SendGrid usa 'apikey' como usuário
$smtpPassword = 'SG.sua-chave-api-aqui';
$fromEmail = 'seu-email@dominio.com';
$testMode = false;
```

### Opção 3: Usar SMTP do cPanel/Hosting

Se você tem um servidor com cPanel:

```php
$smtpHost = 'mail.seudominio.com';
$smtpPort = 465; // SSL/TLS
$smtpSecure = PHPMailer::ENCRYPTION_SMTPS;
$smtpUser = 'noreply@seudominio.com';
$smtpPassword = 'sua-senha-email';
$fromEmail = 'noreply@seudominio.com';
$testMode = false;
```

## Logs e Debugging

O sistema mantém logs detalhados de todas as operações de email:

- **email-log.txt**: Registra todos os envios bem-sucedidos
- **email-error.txt**: Registra erros de envio
- **email-debug.txt**: Registra informações de debug

## Testar a Configuração

Após configurar, teste com curl:

```bash
curl -X POST http://localhost:8002/send-email.php \
  -H "Content-Type: application/json" \
  -d '{"email":"seu-email@teste.com","subject":"Teste","message":"Teste","code":"123456"}'
```

## Solução de Problemas

### Erro: "Could not authenticate"
- Verifique se as credenciais SMTP estão corretas
- Para Gmail, certifique-se de usar App Password, não a senha normal

### Erro: "Could not connect to SMTP host"
- Verifique se o host SMTP está correto
- Verifique se a porta está aberta no firewall
- Tente usar porta 587 (TLS) ao invés de 465 (SSL)

### Emails não chegam
- Verifique a pasta de spam
- Verifique se o DNS do domínio está configurado corretamente
- Considere usar serviços profissionais como SendGrid para melhor entrega

## Segurança

⚠️ **Importante:**
- Nunca commit credenciais reais no repositório
- Use variáveis de ambiente para credenciais em produção
- Atualize o `.gitignore` para não incluir arquivos com senhas
- Use App Passwords em vez de senhas normais de conta

## Suporte

Para problemas com configuração de email, verifique:
1. Logs em `email-error.txt`
2. Documentação do seu provedor SMTP
3. Permissões do servidor (porta 587/465 deve estar aberta)