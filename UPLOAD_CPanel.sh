#!/bin/bash

# Script para preparar upload para cPanel
# Este script cria uma estrutura organizada para upload

echo "🚀 Preparando arquivos para upload no cPanel..."

# Limpar pasta anterior
rm -rf cpanel-upload

# Criar pasta temporária para organização
mkdir -p cpanel-upload/public_html
mkdir -p cpanel-upload/api

# Copiar arquivos estáticos da pasta out/
echo "📦 Copiando arquivos estáticos de out/..."
cp -r out/* cpanel-upload/public_html/

# Copiar serviço PHP
echo "📧 Copiando serviço de email..."
cp send-email.php cpanel-upload/api/
cp -r vendor/ cpanel-upload/api/

# Criar arquivos de log vazios
touch cpanel-upload/api/email-log.txt
touch cpanel-upload/api/email-error.txt
touch cpanel-upload/api/email-debug.txt

# Criar .htaccess
echo "⚙️ Criando .htaccess..."
cat > cpanel-upload/public_html/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Forçar HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

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
EOF

# Criar arquivo de instruções
echo "📝 Criando instruções..."
cat > cpanel-upload/INSTRUCOES.txt << 'EOF'
INSTRUÇÕES PARA UPLOAD NO CPANEL

1. ACESSAR CPANEL:
   - Login em: https://seudominio.com/cpanel
   - Ir para "File Manager"

2. UPLOAD DOS ARQUIVOS:
   - Navegar para pasta public_html
   - Upload de todos os arquivos da pasta public_html/
   - Criar pasta api/ em public_html/
   - Upload de todos os arquivos da pasta api/

3. CONFIGURAR PERMISSÕES:
   - Pastas: 755
   - Arquivos PHP: 644
   - Arquivos de log: 666

4. CONFIGURAR EMAIL:
   - Criar email: noreply@seudominio.com
   - Anotar senha
   - Configurar no arquivo api/send-email.php

5. ATUALIZAR SEND-EMAIL.PHP:
   - Editar api/send-email.php
   - Configurar credenciais SMTP
   - Alterar $testMode = false

6. CONFIGURAR SSL:
   - Ir para SSL/TLS Status no cPanel
   - Selecionar domínio
   - Clicar em Run AutoSSL

7. TESTAR:
   - Acessar https://seudominio.com
   - Testar funcionalidade de email
   - Verificar logs em api/email-log.txt

ESTRUTURA FINAL:
public_html/
├── index.html
├── 404.html
├── _next/
├── favicon.ico
├── .htaccess
└── api/
    ├── send-email.php
    ├── vendor/
    ├── email-log.txt
    └── email-error.txt
EOF

echo "✅ Preparação concluída!"
echo "📁 Arquivos organizados em: cpanel-upload/"
echo "📝 Siga as instruções em: cpanel-upload/INSTRUCOES.txt"
echo ""
echo "🚀 Para upload via FTP:"
echo "   - Usar FileZilla ou similar"
echo "   - Conectar ao seu servidor FTP"
echo "   - Upload da pasta cpanel-upload/public_html/ para public_html/"
echo "   - Upload da pasta cpanel-upload/api/ para public_html/api/"