# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-10-sanity-webhook-fix/spec.md

## Technical Requirements

### 1. GitHub Actions Workflows

**Archivo:** `.github/workflows/ci.yml`
- Ejecutar tests en `web/` y `cms/` en PRs y push a `main`
- Configurar Node.js 18+ y cache de dependencias
- Ejecutar `npm run test` en ambos directorios
- Ejecutar `npm run lint` en ambos directorios

**Archivo:** `.github/workflows/deploy.yml`
- Trigger: `push` a `main` y `repository_dispatch` con `event_type: sanity-content-changed`
- Configurar Node.js 18+ y cache de dependencias
- Instalar dependencias en `web/`
- Ejecutar tests en `web/`
- Ejecutar build con variables de entorno de Sanity
- Desplegar a Cloudflare Pages usando `cloudflare/pages-action@v1`

### 2. Cloudflare Worker

**Archivo:** `workers/sanity-webhook-dispatcher.js`
- Endpoint POST que reciba webhooks de Sanity
- Validación HMAC del webhook usando `WEBHOOK_SECRET`
- Llamada a GitHub API `repository_dispatch` con `event_type: sanity-content-changed`
- Manejo de errores y logging
- Headers CORS para debugging

**Variables de entorno requeridas:**
- `GITHUB_TOKEN`: Personal Access Token con scope `repo`
- `GITHUB_REPO`: Formato `owner/repo` (ej. `jumidi/ncs`)
- `WEBHOOK_SECRET`: Secreto compartido con Sanity

### 3. Configuración de Sanity Webhook

**Configuración en Sanity Studio:**
- URL: URL del Cloudflare Worker desplegado
- HTTP Method: POST
- Payload: `application/json`
- Trigger: `Publish` (y opcionalmente `Create`, `Update`, `Delete`)
- Secret: Mismo valor que `WEBHOOK_SECRET` del Worker

### 4. Variables de Entorno

**GitHub Secrets requeridos:**
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` (con permisos de Cloudflare Pages: Edit)
- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`

**Variables de entorno en build:**
- `PUBLIC_SANITY_PROJECT_ID`
- `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_API_VERSION`

### 5. Monitoreo y Logging

**Cloudflare Worker:**
- Logs de requests recibidos
- Logs de validación de webhook
- Logs de llamadas a GitHub API
- Logs de errores con detalles

**GitHub Actions:**
- Logs de ejecución de workflows
- Notificaciones de fallos
- Status checks en PRs

### 6. Testing

**Tests unitarios:**
- Validación de HMAC en Cloudflare Worker
- Validación de payload de Sanity
- Validación de respuesta de GitHub API

**Tests de integración:**
- Flujo completo: Sanity → Worker → GitHub → Deploy
- Validación de variables de entorno
- Validación de permisos de GitHub

## External Dependencies

**GitHub Actions:**
- `actions/checkout@v4` - Checkout del código
- `actions/setup-node@v4` - Setup de Node.js
- `actions/cache@v3` - Cache de dependencias
- `cloudflare/pages-action@v1` - Deploy a Cloudflare Pages

**Cloudflare Worker:**
- No dependencias externas adicionales (usa APIs nativas)

**Testing:**
- `vitest` - Framework de testing (ya instalado)
- `@vitest/ui` - UI para testing (opcional)
