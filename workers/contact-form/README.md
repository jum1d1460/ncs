# Contact Form Worker

Worker de Cloudflare para procesar el formulario de contacto de NCS Psicóloga.

## 📋 Características

- ✅ Validación robusta de datos con Zod
- ✅ Envío de emails con Resend
- ✅ Almacenamiento en Supabase
- ✅ Rate limiting por IP
- ✅ Seguridad CORS configurada
- ✅ Health check endpoint

## 🚀 Quick Start

### Instalación

```bash
npm install
```

### Desarrollo local

```bash
npm run dev
```

El worker estará disponible en `http://localhost:8787`

### Configurar secrets

Antes de desplegar, configura los secrets necesarios:

```bash
# Development
wrangler secret put RESEND_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put CONTACT_EMAIL_TO
wrangler secret put CONTACT_EMAIL_FROM

# Production
wrangler secret put RESEND_API_KEY --env production
wrangler secret put SUPABASE_URL --env production
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
wrangler secret put CONTACT_EMAIL_TO --env production
wrangler secret put CONTACT_EMAIL_FROM --env production
```

### Despliegue

```bash
# Staging
npm run deploy:staging

# Production
npm run deploy:production
```

## 📁 Estructura del proyecto

```
workers/contact-form/
├── src/
│   ├── index.js              # Punto de entrada y router
│   ├── handlers/
│   │   ├── contact.js        # Handler del formulario (TODO)
│   │   └── health.js         # Health check
│   ├── services/
│   │   ├── email.js          # Servicio de Resend (TODO)
│   │   └── supabase.js       # Servicio de Supabase (TODO)
│   ├── utils/
│   │   ├── validation.js     # Validación con Zod (TODO)
│   │   └── response.js       # Utilidades de respuesta
│   └── config/
│       └── constants.js      # Constantes
├── package.json
├── wrangler.toml
└── README.md
```

## 🔌 API Endpoints

### `GET /health`

Health check del worker.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2025-10-04T12:34:56.789Z"
}
```

### `POST /api/contact` (TODO)

Procesar formulario de contacto.

**Request:**
```json
{
  "name": "María García",
  "email": "maria@example.com",
  "phone": "+34 612 345 678",
  "topic": "Terapia individual",
  "subject": "Consulta",
  "message": "Hola...",
  "preference": "email"
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Tu mensaje ha sido enviado correctamente"
}
```

**Response (error):**
```json
{
  "success": false,
  "error": "Mensaje de error"
}
```

## ⚙️ Variables de entorno

### Variables públicas (wrangler.toml)

- `ENVIRONMENT`: `development` | `staging` | `production`
- `CORS_ORIGIN`: Dominio permitido para CORS
- `RATE_LIMIT_MAX`: Máximo de requests por ventana
- `RATE_LIMIT_WINDOW`: Ventana de tiempo en segundos

### Secrets (wrangler secret put)

- `RESEND_API_KEY`: API key de Resend
- `SUPABASE_URL`: URL del proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key de Supabase
- `CONTACT_EMAIL_TO`: Email destino (psicóloga)
- `CONTACT_EMAIL_FROM`: Email origen (noreply)

## 🧪 Testing

### Test manual con curl

```bash
# Health check
curl http://localhost:8787/health

# Formulario de contacto (cuando esté implementado)
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Este es un mensaje de prueba",
    "preference": "email"
  }'
```

## 📊 Monitoreo

### Ver logs en tiempo real

```bash
npm run tail
```

### Ver logs en Cloudflare Dashboard

1. Ve al [Dashboard de Cloudflare](https://dash.cloudflare.com)
2. Selecciona tu cuenta
3. Ve a **Workers & Pages**
4. Click en tu worker
5. Ve a la pestaña **Logs**

## 🔒 Seguridad

- CORS configurado para dominio específico
- Rate limiting: 10 requests por IP por hora
- Validación estricta de todos los inputs
- Headers de seguridad en todas las respuestas
- Secrets manejados por Wrangler (nunca en código)

## 📝 TODO

- [ ] Implementar validación con Zod
- [ ] Implementar servicio de email
- [ ] Implementar servicio de Supabase
- [ ] Implementar handler de contacto
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios

## 📚 Documentación adicional

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [Resend API](https://resend.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript)

## 📄 Licencia

MIT

