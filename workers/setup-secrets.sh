#!/bin/bash

# Script para configurar secrets en Cloudflare Worker
# Requiere: wrangler CLI instalado y autenticado

set -e

echo "🔐 Configurando secrets para ncs-deploy worker..."

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

echo "📋 Secrets a configurar:"
echo "1. GITHUB_TOKEN - Personal Access Token con scope 'repo'"
echo "2. WEBHOOK_SECRET - Secreto compartido con Sanity (opcional)"
echo ""

# Configurar GITHUB_TOKEN
echo "🔑 Configurando GITHUB_TOKEN..."
echo "   Necesitas un Personal Access Token con permisos 'repo' y 'workflow'"
echo "   Crear token en: https://github.com/settings/tokens"
echo ""
read -p "¿Tienes el GITHUB_TOKEN listo? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wrangler secret put GITHUB_TOKEN --name ncs-deploy
    echo "✅ GITHUB_TOKEN configurado"
else
    echo "⚠️  Saltando GITHUB_TOKEN. Configúralo manualmente con:"
    echo "   wrangler secret put GITHUB_TOKEN --name ncs-deploy"
fi

echo ""

# Configurar WEBHOOK_SECRET (opcional)
echo "🔐 Configurando WEBHOOK_SECRET (opcional)..."
echo "   Este es el secreto que configuraste en Sanity Studio"
echo ""
read -p "¿Quieres configurar WEBHOOK_SECRET? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    wrangler secret put WEBHOOK_SECRET --name ncs-deploy
    echo "✅ WEBHOOK_SECRET configurado"
else
    echo "ℹ️  Saltando WEBHOOK_SECRET. El worker funcionará sin validación HMAC"
fi

echo ""
echo "✅ Configuración de secrets completada!"
echo ""
echo "📋 Resumen de configuración:"
echo "   - GITHUB_REPO: jumidi/ncs (configurado en wrangler.toml)"
echo "   - GITHUB_TOKEN: [configurado como secret]"
echo "   - WEBHOOK_SECRET: [configurado como secret o no]"
echo ""
echo "🚀 Próximo paso: Desplegar el worker con:"
echo "   wrangler deploy --config ncs-deploy-wrangler.toml"
