# Como Obter API Key do Resend

## Passo a Passo Simples:

### 1. Criar Conta no Resend

1. Acesse: https://resend.com/
2. Clique em "Sign Up"
3. Use seu GitHub, Google ou email para criar conta
4. Verifique seu email

### 2. Criar API Key

1. Após login, vá em: **API Keys**
2. Clique em: **Create API Key**
3. Dê um nome (ex: "AUTOTRADEAI")
4. Clique em: **Add**
5. **Copie** a API key gerada (começa com `re_`)

### 3. Configurar no Código

1. Abra o arquivo `send-email.php`
2. Vá para a linha 47
3. Substitua `<YOUR_RESEND_API_KEY>` pela sua API key

```php
// ANTES:
$apiKey = getenv('RESEND_API_KEY') ?: '<YOUR_RESEND_API_KEY>';

// DEPOIS:
$apiKey = getenv('RESEND_API_KEY') ?: 're_XXXXXXX_XXXXXX_XXXXXX_XXXXXX';
```

### 4. Recarregar Servidor

```bash
# Mate o servidor atual e reinicie
php -S localhost:8001
```

## Benefícios do Resend:

✅ **3.000 emails/mês** grátis (muito generoso)  
✅ **API muito simples** - apenas 3 linhas de código  
✅ **Dashboard moderno** e intuitivo  
✅ **Emails reais** instantâneos  
✅ **Tracking** de opens e clicks  
✅ **Webhooks** para eventos  
✅ **Templates** de email integrados  
✅ **Domínios personalizados** fácil de configurar  

## Plano Gratuito do Resend:

- **3.000 emails/mês**
- **3.000 emails/domínio/mês**
- **100 emails/hora**
- **Analytics completo**
- **Webhooks**
- **Templates**

## Como Testar:

1. **Com API key configurado:**
   - Abra: http://localhost:8001/test-email.html
   - Preencha com seu email real
   - Clique em "Enviar Email"
   - Email deve chegar instantaneamente

2. **Verificar no Resend:**
   - Acesse: https://resend.com/
   - Vá em: **Emails**
   - Veja o email enviado com status

## Documentação Oficial:

- API: https://resend.com/docs
- SDK PHP: https://github.com/resend/resend-php
- Guias: https://resend.com/docs/guides

## Suporte:

- Suporte: https://resend.com/support
- Status: https://status.resend.com/
- Discord: https://discord.gg/resend
