# Configuración del Webhook de Sanity

Esta guía te ayudará a configurar el webhook de Sanity para que dispare automáticamente el despliegue cuando publiques contenido.

## 🚀 Pasos de Configuración

### 1. Desplegar Cloudflare Worker

```bash
cd workers
./deploy.sh
```

O manualmente:
```bash
cd workers
npm install
wrangler deploy
```

### 2. Configurar Variables de Entorno en Cloudflare

En el Cloudflare Dashboard → Workers & Pages → Tu Worker → Settings → Variables:

- **GITHUB_TOKEN**: Personal Access Token con scope `repo`
- **GITHUB_REPO**: Formato `owner/repo` (ej. `jumidi/ncs`)
- **WEBHOOK_SECRET**: Secreto compartido con Sanity (opcional pero recomendado)

### 3. Obtener URL del Worker

Después del despliegue, obtén la URL del worker (ej. `https://sanity-webhook-dispatcher.your-subdomain.workers.dev`)

### 4. Configurar Webhook en Sanity

En Sanity Studio → Manage → API → Webhooks:

- **URL**: URL del Cloudflare Worker
- **HTTP Method**: POST
- **Payload**: `application/json`
- **Trigger**: `Publish` (y opcionalmente `Create`, `Update`, `Delete`)
- **Secret**: Mismo valor que `WEBHOOK_SECRET` del Worker

### 5. Configurar Secretos en GitHub

En GitHub → Settings → Secrets and variables → Actions:

- **CLOUDFLARE_ACCOUNT_ID**
- **CLOUDFLARE_API_TOKEN** (con permisos de Cloudflare Pages: Edit)
- **CLOUDFLARE_PAGES_PROJECT_NAME**
- **SANITY_PROJECT_ID**
- **SANITY_DATASET**
- **SANITY_API_VERSION**

## 🧪 Probar la Configuración

### 1. Probar Worker Manualmente

```bash
curl -X POST https://tu-worker-url.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"type":"test","action":"publish"}'
```

### 2. Probar Webhook de Sanity

1. Ve a Sanity Studio
2. Edita cualquier contenido
3. Publica los cambios
4. Verifica que se ejecute el workflow en GitHub Actions

### 3. Ver Logs

```bash
cd workers
wrangler tail
```

## 🔧 Troubleshooting

### Worker no responde
- Verifica que el worker esté desplegado correctamente
- Revisa los logs con `wrangler tail`
- Verifica las variables de entorno

### GitHub Actions no se ejecuta
- Verifica que el `GITHUB_TOKEN` tenga permisos `repo`
- Verifica que el `GITHUB_REPO` esté en el formato correcto
- Revisa los logs del worker

### Sanity webhook falla
- Verifica la URL del webhook en Sanity
- Verifica que el `WEBHOOK_SECRET` coincida
- Revisa los logs del worker

### Deploy falla
- Verifica que todos los secretos de GitHub estén configurados
- Verifica que el token de Cloudflare tenga permisos correctos
- Revisa los logs de GitHub Actions

## 📊 Monitoreo

### Cloudflare Worker
- Logs en tiempo real: `wrangler tail`
- Métricas en Cloudflare Dashboard

### GitHub Actions
- Logs en la pestaña Actions del repositorio
- Status checks en PRs

### Sanity
- Logs de webhook en Sanity Studio → Manage → API → Webhooks

## 🔄 Flujo Completo

1. **Editor actualiza contenido** en Sanity Studio
2. **Sanity envía webhook** al Cloudflare Worker
3. **Worker valida webhook** y dispara `repository_dispatch` en GitHub
4. **GitHub Actions ejecuta** build y deploy automáticamente
5. **Sitio web se actualiza** con el nuevo contenido

## 📝 Notas Importantes

- El worker maneja CORS para debugging
- Se incluye validación HMAC opcional para seguridad
- Los logs incluyen timestamps y detalles de errores
- El worker es stateless y escalable
