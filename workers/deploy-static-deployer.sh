#!/bin/bash

# Script para desplegar el Static Deployer Worker
# Requiere: wrangler CLI instalado y autenticado

set -e

echo "🚀 Desplegando Static Deployer Worker..."

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

# Cambiar al directorio del worker
cd static-deployer

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que los secrets estén configurados
echo "🔐 Verificando configuración de secrets..."
echo "⚠️  Asegúrate de que estos secrets estén configurados:"
echo "   - GITHUB_TOKEN"
echo "   - GITHUB_REPO"
echo "   - WEBHOOK_SECRET (opcional)"
echo ""

# Seleccionar entorno
echo "Selecciona el entorno a desplegar:"
echo "1) Development"
echo "2) Staging"
echo "3) Production"
read -p "Opción (1-3): " -n 1 -r
echo

case $REPLY in
    1)
        ENV=""
        echo "🚀 Desplegando a Development..."
        wrangler deploy
        ;;
    2)
        ENV="staging"
        echo "🚀 Desplegando a Staging..."
        wrangler deploy --env staging
        ;;
    3)
        ENV="production"
        echo "🚀 Desplegando a Production..."
        wrangler deploy --env production
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo "✅ Static Deployer Worker desplegado exitosamente!"
echo ""
echo "🔗 Para ver logs: wrangler tail${ENV:+ --env $ENV}"
echo "🔗 Para desarrollo: wrangler dev${ENV:+ --env $ENV}"
echo ""
echo "📋 Endpoints disponibles:"
echo "   - GET /health - Health check"
echo "   - POST /webhook/sanity - Webhook de Sanity"
echo "   - GET /* - Servir archivos estáticos (fallback)"
