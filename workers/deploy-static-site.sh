#!/bin/bash

# Script para desplegar el sitio web estático en Cloudflare Workers
# Requiere: wrangler CLI instalado y autenticado

set -e

echo "🚀 Desplegando sitio web estático en Cloudflare Workers..."

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

# Verificar que el directorio dist existe
if [ ! -d "../web/dist" ]; then
    echo "❌ El directorio dist no existe. Ejecuta el build de Astro primero:"
    echo "   cd ../web && npm run build"
    exit 1
fi

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Desplegar worker con configuración específica
echo "🚀 Desplegando worker con sitio estático..."
wrangler deploy --config static-site-wrangler.toml

echo "✅ Sitio web desplegado exitosamente!"
echo ""
echo "🔗 Para ver logs: wrangler tail --config static-site-wrangler.toml"
echo "🔗 Para desarrollo: wrangler dev --config static-site-wrangler.toml"
echo ""
echo "📋 El sitio estará disponible en: https://ncs.jum1d1460.com"
