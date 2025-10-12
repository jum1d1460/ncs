#!/bin/bash

# Script para desplegar el Persistence Worker
# Requiere: wrangler CLI instalado y autenticado

set -e

echo "🚀 Desplegando Persistence Worker..."

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
cd persistence-worker

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que los secrets estén configurados
echo "🔐 Verificando configuración de secrets..."
echo "⚠️  Asegúrate de que estos secrets estén configurados:"
echo "   - RESEND_API_KEY"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - CONTACT_EMAIL_TO"
echo "   - CONTACT_EMAIL_FROM"
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

echo "✅ Persistence Worker desplegado exitosamente!"
echo ""
echo "🔗 Para ver logs: wrangler tail${ENV:+ --env $ENV}"
echo "🔗 Para desarrollo: wrangler dev${ENV:+ --env $ENV}"
echo ""
echo "📋 Endpoints disponibles:"
echo "   - GET /health - Health check"
echo "   - POST /api/contact - Procesar formulario de contacto"
echo "   - POST /api/appointment - Solicitud de primera cita"
echo "   - POST /api/lead - Leads de formularios de tests"
