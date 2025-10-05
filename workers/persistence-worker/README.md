# NCS Persistence Worker

Worker de Cloudflare para persistir datos en Supabase de NCS Psicóloga. Maneja múltiples tipos de formularios y datos.

## 📋 Características

- ✅ **Múltiples tipos de datos**: Contacto, citas, leads de tests
- ✅ **Validación robusta** con Zod
- ✅ **Envío de emails** con Resend
- ✅ **Almacenamiento** en Supabase
- ✅ **Rate limiting** por IP
- ✅ **Seguridad CORS** configurada
- ✅ **Health check** endpoint
- ✅ **Templates de email** personalizados por tipo

## 🚀 Endpoints Disponibles

### Health Check
```bash
GET /health
```

### Formulario de Contacto
```bash
POST /api/contact
```

**Payload**:
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+34612345678",
  "topic": "Consulta general",
  "subject": "Necesito información",
  "message": "Hola, me gustaría saber más sobre...",
  "preference": "email"
}
```

### Solicitud de Primera Cita
```bash
POST /api/appointment
```

**Payload**:
```json
{
  "name": "María García",
  "email": "maria@example.com",
  "phone": "+34612345678",
  "preferred_date": "2024-02-15",
  "preferred_time": "morning",
  "reason": "Necesito ayuda con ansiedad y estrés laboral",
  "urgency": "normal",
  "source": "website"
}
```

### Lead de Test
```bash
POST /api/lead
```

**Payload**:
```json
{
  "name": "Carlos López",
  "email": "carlos@example.com",
  "phone": "+34612345678",
  "test_type": "Test de Ansiedad",
  "test_results": {
    "answers": [1, 2, 3, 4, 5],
    "categories": {"anxiety": 75, "depression": 60},
    "duration": 300
  },
  "score": 75,
  "recommendations": [
    "Recomendamos consulta psicológica",
    "Técnicas de relajación pueden ayudar"
  ],
  "source": "test_form"
}
```

## 🔧 Configuración

### Secrets Requeridos

```bash
# Configurar secrets
wrangler secret put RESEND_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put CONTACT_EMAIL_TO
wrangler secret put CONTACT_EMAIL_FROM

# Para staging
wrangler secret put RESEND_API_KEY --env staging
wrangler secret put SUPABASE_URL --env staging
# ... etc

# Para production
wrangler secret put RESEND_API_KEY --env production
wrangler secret put SUPABASE_URL --env production
# ... etc
```

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `ENVIRONMENT` | Entorno actual | `development`, `staging`, `production` |
| `CORS_ORIGIN` | Origen permitido para CORS | `https://ncs-psicologa.com` |
| `RATE_LIMIT_MAX` | Máximo de requests por ventana | `10` |
| `RATE_LIMIT_WINDOW` | Ventana de rate limiting (segundos) | `3600` |

## 📊 Estructura de Datos en Supabase

### Tabla: `contacts`
```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  topic VARCHAR(100),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  preference VARCHAR(10) NOT NULL,
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW(),
  environment VARCHAR(20)
);
```

### Tabla: `appointments`
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL,
  reason TEXT NOT NULL,
  urgency VARCHAR(10) DEFAULT 'normal',
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW(),
  environment VARCHAR(20)
);
```

### Tabla: `leads`
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  test_type VARCHAR(100) NOT NULL,
  test_results JSONB,
  score INTEGER,
  recommendations TEXT[],
  source VARCHAR(50) DEFAULT 'test_form',
  created_at TIMESTAMP DEFAULT NOW(),
  environment VARCHAR(20)
);
```

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Despliegue Manual
```bash
# Development
npm run deploy

# Staging
npm run deploy:staging

# Production
npm run deploy:production
```

### Script de Despliegue
```bash
./deploy-persistence.sh
```

## 📊 Monitoreo

### Health Check
```bash
curl https://ncs-persistence.workers.dev/health
```

### Logs en Tiempo Real
```bash
wrangler tail --env production
```

### Métricas en Cloudflare Dashboard
- Visitas por endpoint
- Tiempo de respuesta
- Errores por tipo
- Rate limiting activado

## 🧪 Testing

### Test de Contacto
```bash
curl -X POST https://ncs-persistence.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test subject",
    "message": "This is a test message",
    "preference": "email"
  }'
```

### Test de Cita
```bash
curl -X POST https://ncs-persistence.workers.dev/api/appointment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "preferred_date": "2024-02-15",
    "preferred_time": "morning",
    "reason": "Test appointment request"
  }'
```

### Test de Lead
```bash
curl -X POST https://ncs-persistence.workers.dev/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "test_type": "Test de Ansiedad",
    "score": 75
  }'
```

## 🔒 Seguridad

- **Rate Limiting**: Máximo 10 requests por hora por IP
- **Validación**: Todos los datos se validan con Zod
- **CORS**: Configurado para dominios específicos
- **Sanitización**: Entradas se sanitizan automáticamente
- **HTTPS**: Todas las comunicaciones son seguras

## 📝 Logs y Debugging

### Ver Logs Detallados
```bash
wrangler tail --env production --format pretty
```

### Verificar Configuración
```bash
wrangler whoami
wrangler list
```

### Debug Mode
En desarrollo, se incluyen más detalles en las respuestas de error.

## 🆘 Troubleshooting

### Problemas Comunes

1. **Error 500**: Verificar que todos los secrets estén configurados
2. **CORS Error**: Verificar configuración de `CORS_ORIGIN`
3. **Rate Limited**: Esperar o ajustar límites
4. **Email no enviado**: Verificar configuración de Resend
5. **Datos no guardados**: Verificar configuración de Supabase

### Verificar Secrets
```bash
# Listar secrets configurados
wrangler secret list
```