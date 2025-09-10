#!/bin/bash

# Script para desplegar el Cloudflare Worker
# Requiere: wrangler CLI instalado y autenticado

set -e

echo "🚀 Desplegando Sanity Webhook Dispatcher Worker..."

# Verificar que wrangler esté instalado
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI no está instalado. Instálalo con: npm install -g wrangler"
    exit 1
fi

# Verificar autenticación
if ! wrangler whoami &> /dev/null; then
    echo "❌ No estás autenticado en Wrangler. Ejecuta: wrangler login"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Desplegar worker
echo "🚀 Desplegando worker..."
wrangler deploy

echo "✅ Worker desplegado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables de entorno en Cloudflare Dashboard:"
echo "   - GITHUB_TOKEN: Personal Access Token con scope 'repo'"
echo "   - GITHUB_REPO: Formato 'owner/repo' (ej. 'jumidi/ncs')"
echo "   - WEBHOOK_SECRET: Secreto compartido con Sanity (opcional)"
echo ""
echo "2. Obtén la URL del worker y configúrala en Sanity Studio"
echo "3. Configura el webhook en Sanity con la URL del worker"
echo ""
echo "🔗 Para ver logs: wrangler tail"
echo "🔗 Para desarrollo: wrangler dev"
