#!/bin/bash

# Script de prueba para el Contact Form Worker
# Ejecuta una serie de tests para verificar que el worker funciona correctamente

set -e

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL del worker (cambiar según entorno)
WORKER_URL="${1:-http://localhost:8787}"

echo "🧪 Testing Contact Form Worker"
echo "URL: $WORKER_URL"
echo ""

# Función para hacer requests y mostrar resultado
test_endpoint() {
  local name=$1
  local method=$2
  local path=$3
  local data=$4
  local expected_status=$5
  
  echo -n "Testing: $name... "
  
  if [ -z "$data" ]; then
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$WORKER_URL$path")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$WORKER_URL$path" \
      -H "Content-Type: application/json" \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | head -n -1)
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    if [ ! -z "$body" ]; then
      echo "  Response: $(echo $body | jq -c '.' 2>/dev/null || echo $body)"
    fi
  else
    echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $http_code)"
    echo "  Response: $body"
  fi
  
  echo ""
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET /health" "GET" "/health" "" 200

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. CORS Preflight"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "OPTIONS /api/contact" "OPTIONS" "/api/contact" "" 204

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Contact Form - Valid Submission"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
valid_data='{
  "name": "Usuario de Prueba",
  "email": "test@example.com",
  "subject": "Consulta de prueba",
  "message": "Este es un mensaje de prueba para verificar que el worker funciona correctamente.",
  "preference": "email"
}'
test_endpoint "Valid submission" "POST" "/api/contact" "$valid_data" 200

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Contact Form - Validation Errors"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Missing required fields
test_endpoint "Missing name" "POST" "/api/contact" '{"email":"test@example.com","subject":"Test","message":"Test message","preference":"email"}' 400

# Invalid email
test_endpoint "Invalid email" "POST" "/api/contact" '{"name":"Test","email":"invalid-email","subject":"Test","message":"Test message","preference":"email"}' 400

# Short message
test_endpoint "Message too short" "POST" "/api/contact" '{"name":"Test","email":"test@example.com","subject":"Test","message":"Short","preference":"email"}' 400

# Invalid preference
test_endpoint "Invalid preference" "POST" "/api/contact" '{"name":"Test","email":"test@example.com","subject":"Test","message":"This is a test message","preference":"invalid"}' 400

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Rate Limiting"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}⚠ Sending 11 requests to trigger rate limit...${NC}"

for i in {1..11}; do
  echo -n "Request $i... "
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WORKER_URL/api/contact" \
    -H "Content-Type: application/json" \
    -d "$valid_data")
  
  if [ $i -le 10 ]; then
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 500 ]; then
      echo -e "${GREEN}✓${NC} (HTTP $http_code)"
    else
      echo -e "${RED}✗${NC} (HTTP $http_code)"
    fi
  else
    if [ "$http_code" -eq 429 ]; then
      echo -e "${GREEN}✓ Rate limited${NC} (HTTP 429)"
    else
      echo -e "${RED}✗ Expected 429, got $http_code${NC}"
    fi
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Invalid Routes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "GET /invalid" "GET" "/invalid" "" 404
test_endpoint "POST /invalid" "POST" "/invalid" "{}" 404

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Testing completed!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Notes:"
echo "  - If email/database tests fail with 500, check your secrets configuration"
echo "  - If rate limiting didn't trigger, check RATE_LIMIT_MAX in wrangler.toml"
echo "  - For production testing, run: ./test-worker.sh https://your-worker-url.workers.dev"

