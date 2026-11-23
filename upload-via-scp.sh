#!/bin/bash

# Script para upload via SCP
# Servidor: cp85fe4.palosrv.com
# Usuário: autotrad
# Pasta destino: public_html

SERVER="cp85fe4.palosrv.com"
USER="autotrad"
REMOTE_PATH="public_html"
LOCAL_PATH="/Users/rafaelcomissario/Repositorio/web3-wallet-dashboard/out"

echo "🚀 Iniciando upload via SCP..."
echo "📁 Origem: $LOCAL_PATH"
echo "📁 Destino: $USER@$SERVER:$REMOTE_PATH"
echo ""

# Upload dos arquivos
scp -r "$LOCAL_PATH"/* "$USER@$SERVER:$REMOTE_PATH/"

if [ $? -eq 0 ]; then
    echo "✅ Upload concluído com sucesso!"
else
    echo "❌ Erro no upload"
fi
