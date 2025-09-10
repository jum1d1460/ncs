#!/bin/bash

# Script para probar las variables de entorno del worker
# Despliega la versión de test y hace una petición

set -e

echo "🧪 Probando variables de entorno del worker ncs-deploy..."

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

echo "📦 Desplegando versión de test de variables de entorno..."
wrangler deploy --name ncs-deploy ncs-deploy-env-test.js

echo ""
echo "🔍 Obteniendo URL del worker..."
WORKER_URL=$(wrangler whoami | grep -o 'https://[^/]*\.workers\.dev' | head -1)
if [ -z "$WORKER_URL" ]; then
    echo "❌ No se pudo obtener la URL del worker"
    exit 1
fi

WORKER_URL="${WORKER_URL}/ncs-deploy"
echo "📍 URL del worker: $WORKER_URL"

echo ""
echo "🧪 Probando webhook..."
echo "📦 Payload de prueba:"

# Payload de prueba
cat << 'EOF'
{
  "type": "document",
  "action": "publish",
  "document": {
    "_id": "test-document-123",
    "_type": "post",
    "title": "Test Post"
  }
}
EOF

echo ""
echo "🚀 Enviando petición..."

# Hacer la petición
curl -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -H "User-Agent: test-script/1.0" \
  -d '{
    "type": "document",
    "action": "publish",
    "document": {
      "_id": "test-document-123",
      "_type": "post",
      "title": "Test Post"
    }
  }' \
  -w "\n\n📊 Status Code: %{http_code}\n" \
  -s

echo ""
echo "✅ Prueba completada!"
echo ""
echo "🔍 Para ver logs detallados:"
echo "   wrangler tail --name ncs-deploy"
echo ""
echo "📋 Si las variables no están configuradas, ve a:"
echo "   Cloudflare Dashboard → Workers & Pages → ncs-deploy → Settings → Variables"
echo "   Y configura:"
echo "   - GITHUB_REPO: jumidi/ncs"
echo "   - GITHUB_TOKEN: tu_token_de_github"
echo "   - WEBHOOK_SECRET: tu_secreto_de_sanity (opcional)"
