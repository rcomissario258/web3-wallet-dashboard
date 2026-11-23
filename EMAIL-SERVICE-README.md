# Serviço de Email em PHP

Este projeto inclui um serviço de envio de email em PHP que pode ser hospedado junto com o build estático no cPanel.

## Arquivos Disponíveis

1. **send-email.php** - Versão simples usando função `mail()` nativa do PHP
2. **send-email-phpmailer.php** - Versão robusta usando PHPMailer (recomendado)

## Configuração cPanel

### Opção 1: Versão Simples (send-email.php)

1. **Upload dos arquivos:**
   - Faça upload do arquivo `send-email.php` para a pasta `public_html`
   - Certifique-se que o arquivo tem permissões 644

2. **Configuração do email remetente:**
   - Edite a linha 28 em `send-email.php`:
   ```php
   $fromEmail = 'noreply@seudominio.com'; // Alterar para seu domínio
   ```

3. **Configuração do PHP no cPanel:**
   - Vá em "Select PHP Version" no cPanel
   - Certifique-se que a função `mail()` está habilitada
   - Geralmente já vem habilitada por padrão

### Opção 2: Versão PHPMailer (Recomendado)

1. **Instalar PHPMailer:**
   ```bash
   # Via SSH no servidor
   cd public_html
   composer require phpmailer/phpmailer
   ```

   Ou faça download manual de:
   https://github.com/PHPMailer/PHPMailer/releases

2. **Configurar SMTP:**
   - Edite o arquivo `send-email-phpmailer.php`
   - Configure as credenciais SMTP (linhas 42-47):

   ```php
   // Exemplo com Gmail
   $mail->Host = 'smtp.gmail.com';
   $mail->SMTPAuth = true;
   $mail->Username = 'seu-email@gmail.com';
   $mail->Password = 'sua-app-password'; // Gerar em Contas Google -> Segurança
   $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
   $mail->Port = 587;
   ```

   **Outros provedores SMTP:**
   - **Outlook:** smtp.office365.com:587
   - **SendGrid:** smtp.sendgrid.net:587
   - **Amazon SES:** email-smtp.us-east-1.amazonaws.com:587
   - **Mailgun:** smtp.mailgun.org:587

3. **Gerar App Password (Gmail):**
   - Vá em Contas Google
   - Segurança
   - Verificação em duas etapas
   - Senhas de app
   - Crie uma nova senha para "Mail"

## Teste do Serviço

### Teste via cURL:
```bash
curl -X POST https://seudominio.com/send-email.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@teste.com",
    "subject": "Teste de Email",
    "message": "Este é um teste",
    "code": "123456"
  }'
```

### Teste via Browser:
Crie um arquivo `test-email.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Teste Email</title>
</head>
<body>
    <button onclick="sendTestEmail()">Enviar Email de Teste</button>
    <div id="result"></div>

    <script>
        async function sendTestEmail() {
            try {
                const response = await fetch('/send-email.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'seu-email@teste.com',
                        subject: 'Teste de Email',
                        message: 'Este é um teste',
                        code: '123456'
                    })
                });
                const data = await response.json();
                document.getElementById('result').innerHTML = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').innerHTML = 'Erro: ' + error;
            }
        }
    </script>
</body>
</html>
```

## Logs de Email

O serviço cria automaticamente um arquivo `email-log.txt` com:
- Data e hora do envio
- Email destinatário
- Código de verificação

**Ver logs:**
```bash
tail -f email-log.txt
```

**Limpar logs:**
```bash
rm email-log.txt
```

## Troubleshooting

### Email não é enviado:

1. **Verificar logs de erro do PHP:**
   - cPanel -> Errors
   - Procure por erros relacionados ao script PHP

2. **Verificar configuração SMTP:**
   - Certifique-se que as credenciais estão corretas
   - Teste conexão SMTP com ferramentas online

3. **Verificar firewall:**
   - Porta 587 deve estar aberta
   - Alguns servidores bloqueiam conexões SMTP externas

4. **Verificar quota de email:**
   - cPanel -> Email Accounts
   - Verifique se não excedeu o limite de envios

### Erro CORS:

Se tiver erro de CORS no frontend:
1. O arquivo PHP já inclui headers CORS
2. Se ainda assim tiver erro, adicione ao `.htaccess`:
```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

## Segurança

1. **Não expor credenciais:**
   - Nunca coloque credenciais SMTP no código frontend
   - Use variáveis de ambiente do servidor quando possível

2. **Rate limiting:**
   - Adicione rate limiting para prevenir abuso
   - Limite emails por IP ou por usuário

3. **Validação:**
   - O script já valida formato de email
   - Adicione validação adicional se necessário

## Integração com Frontend

O frontend já está configurado para usar `/send-email.php`.

Para usar a versão PHPMailer, altere a URL no `WithdrawalModal.tsx`:
```typescript
const response = await fetch('/send-email-phpmailer.php', {
  // ...
});
```

## Suporte

Para problemas específicos do cPanel:
- Contacte o suporte do seu provedor de hospedagem
- Verifique a documentação do cPanel: https://docs.cpanel.net/

Para problemas com PHPMailer:
- Documentação: https://github.com/PHPMailer/PHPMailer
- Fórum: https://github.com/PHPMailer/PHPMailer/issues
