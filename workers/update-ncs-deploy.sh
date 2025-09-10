#!/bin/bash

# Script para actualizar el worker ncs-deploy existente
# Requiere: wrangler CLI instalado y autenticado

set -e

echo "🔄 Actualizando worker ncs-deploy con webhook de Sanity..."

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

# Listar workers para confirmar que ncs-deploy existe
echo "📋 Workers disponibles:"
wrangler list

echo ""
echo "⚠️  IMPORTANTE: Asegúrate de que el worker 'ncs-deploy' existe y tiene configuradas las variables:"
echo "   - GITHUB_TOKEN"
echo "   - GITHUB_REPO" 
echo "   - WEBHOOK_SECRET"
echo ""

read -p "¿Continuar con la actualización? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Actualización cancelada"
    exit 1
fi

# Actualizar el worker ncs-deploy
echo "🚀 Actualizando worker ncs-deploy..."
echo "🔧 Fix aplicado: User-Agent header para GitHub API"
echo "📦 Usando versión JavaScript puro compatible con Cloudflare Workers"
echo ""
echo "Selecciona la versión a desplegar:"
echo "1) Versión con debugging HMAC (ncs-deploy-debug.js)"
echo "2) Versión sin validación HMAC (ncs-deploy-no-hmac.js)"
echo "3) Versión normal (ncs-deploy-pure.js)"
echo "4) Versión para probar variables de entorno (ncs-deploy-env-test.js)"
echo "5) Versión para probar GitHub API (ncs-deploy-github-test.js)"
echo ""
read -p "Opción (1-5): " -n 1 -r
echo

case $REPLY in
  1)
    echo "🔍 Desplegando versión con debugging..."
    wrangler deploy --config ncs-deploy-wrangler.toml --name ncs-deploy ncs-deploy-debug.js
    ;;
  2)
    echo "⚠️  Desplegando versión SIN validación HMAC (solo para debugging)..."
    wrangler deploy --config ncs-deploy-wrangler.toml --name ncs-deploy ncs-deploy-no-hmac.js
    ;;
  3)
    echo "📦 Desplegando versión normal..."
    wrangler deploy --config ncs-deploy-wrangler.toml --name ncs-deploy ncs-deploy-pure.js
    ;;
  4)
    echo "🧪 Desplegando versión para probar variables de entorno..."
    wrangler deploy --config ncs-deploy-wrangler.toml --name ncs-deploy ncs-deploy-env-test.js
    ;;
  5)
    echo "🔍 Desplegando versión para probar GitHub API..."
    wrangler deploy --config ncs-deploy-wrangler.toml --name ncs-deploy ncs-deploy-github-test.js
    ;;
  *)
    echo "❌ Opción inválida, desplegando versión normal..."
    wrangler deploy --config ncs-deploy-wrangler.toml --name ncs-deploy ncs-deploy-pure.js
    ;;
esac

echo "✅ Worker ncs-deploy actualizado exitosamente!"
echo ""
echo "🧪 Próximos pasos para probar:"
echo "1. Ve a Sanity Studio y publica algún contenido"
echo "2. Verifica que se ejecute el workflow en GitHub Actions"
echo "3. Revisa los logs con: wrangler tail --name ncs-deploy"
echo ""
echo "🔧 Si hay problemas:"
echo "   - Verifica las variables de entorno en Cloudflare Dashboard"
echo "   - Revisa la configuración del webhook en Sanity"
echo "   - Ejecuta: node scripts/test-webhook-simple.js [URL_DEL_WORKER]"
