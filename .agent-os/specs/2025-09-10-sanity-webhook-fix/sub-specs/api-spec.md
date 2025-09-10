# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-09-10-sanity-webhook-fix/spec.md

## Endpoints

### POST /sanity-webhook

**Purpose:** Recibe webhooks de Sanity y los convierte en `repository_dispatch` de GitHub

**Headers:**
- `Content-Type: application/json`
- `x-sanity-signature: <HMAC_SIGNATURE>` (opcional, para validación)

**Request Body:**
```json
{
  "type": "document",
  "action": "publish",
  "document": {
    "_id": "document-id",
    "_type": "document-type",
    "title": "Document Title"
  }
}
```

**Response:**
- **200 OK:** Webhook procesado exitosamente
- **400 Bad Request:** Payload inválido
- **401 Unauthorized:** Firma HMAC inválida
- **500 Internal Server Error:** Error interno del worker
- **502 Bad Gateway:** Error al llamar a GitHub API

**Response Body (éxito):**
```json
{
  "status": "success",
  "message": "Webhook processed and GitHub dispatch triggered"
}
```

**Response Body (error):**
```json
{
  "status": "error",
  "message": "Error description",
  "details": "Additional error details"
}
```

### GitHub API Integration

**Endpoint:** `POST https://api.github.com/repos/{owner}/{repo}/dispatches`

**Headers:**
- `Authorization: token {GITHUB_TOKEN}`
- `Accept: application/vnd.github.everest-preview+json`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "event_type": "sanity-content-changed"
}
```

**Response:**
- **204 No Content:** Dispatch enviado exitosamente
- **401 Unauthorized:** Token inválido
- **403 Forbidden:** Permisos insuficientes
- **422 Unprocessable Entity:** Payload inválido

## Error Handling

### Cloudflare Worker Errors

1. **Invalid Method:** Solo acepta POST
2. **Invalid Signature:** HMAC no coincide con `WEBHOOK_SECRET`
3. **Missing Environment Variables:** `GITHUB_TOKEN` o `GITHUB_REPO` no configurados
4. **GitHub API Error:** Error al llamar a GitHub API
5. **Invalid Payload:** JSON malformado o campos requeridos faltantes

### GitHub Actions Errors

1. **Missing Secrets:** Variables de entorno no configuradas
2. **Build Failure:** Error en `npm run build`
3. **Test Failure:** Error en `npm run test`
4. **Deploy Failure:** Error al desplegar a Cloudflare Pages
5. **Permission Error:** Token de Cloudflare sin permisos suficientes

## Security Considerations

### Webhook Validation
- Validación HMAC usando `WEBHOOK_SECRET`
- Verificación de headers de Sanity
- Rate limiting (opcional)

### GitHub Token Security
- Personal Access Token con scope mínimo `repo`
- Rotación regular del token
- Monitoreo de uso del token

### Cloudflare Worker Security
- Variables de entorno para secretos
- Logs sin información sensible
- Validación de origen de requests

## Monitoring and Logging

### Cloudflare Worker Logs
- Request recibido con timestamp
- Validación de webhook (éxito/fallo)
- Llamada a GitHub API (éxito/fallo)
- Errores con stack trace

### GitHub Actions Logs
- Ejecución de workflows
- Status de cada step
- Logs de build y deploy
- Notificaciones de fallos
