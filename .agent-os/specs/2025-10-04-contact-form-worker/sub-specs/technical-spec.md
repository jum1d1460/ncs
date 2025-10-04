# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-10-04-contact-form-worker/spec.md

## Technical Requirements

### Worker Structure

- **Ubicación**: `workers/contact-form/`
- **Arquitectura modular**: Separación en handlers, services, utils, y config
- **Punto de entrada**: `src/index.js` que maneja routing y CORS
- **Handlers**: `contact.js` (formulario) y `health.js` (health check)
- **Services**: `email.js` (Resend) y `supabase.js` (base de datos)
- **Utils**: `validation.js` (Zod schemas) y `response.js` (respuestas estandarizadas)

### Data Validation

- **Biblioteca**: Zod v3.22.0 para schemas type-safe
- **Campos requeridos**: name (2-100 chars), email (formato válido), subject (5-200 chars), message (10-2000 chars), preference (enum: email|phone|any)
- **Campos opcionales**: phone (formato internacional), topic (100 chars max)
- **Patrones regex**: Nombres con acentos españoles, emails RFC-compliant, teléfonos internacionales
- **Sanitización**: Limpieza de HTML tags, trim de strings, normalización de emails

### Email Service

- **Proveedor**: Resend (https://resend.com)
- **Configuración**: API key en secrets, from/to emails configurables
- **Template**: HTML responsivo con estilos inline
- **Contenido**: Todos los campos del formulario + metadata (timestamp, IP, user agent)
- **Reply-To**: Email del usuario para respuestas directas
- **Manejo de errores**: Retry logic y logging detallado

### Supabase Integration

- **Cliente**: @supabase/supabase-js v2.38.0
- **Autenticación**: Service role key para inserciones desde worker
- **Operaciones**: INSERT de nuevas submissions con todos los campos
- **Manejo de errores**: Validación de respuesta y logging de fallos
- **Timeout**: 10 segundos máximo para operaciones

### Security & Performance

- **CORS**: Configurado para dominio específico (ncs-psicologa.com)
- **Rate Limiting**: 10 requests por IP por hora usando timestamps
- **Headers de seguridad**: Content-Type, X-Content-Type-Options, etc.
- **HTTPS only**: Todas las conexiones deben ser seguras
- **IP tracking**: CF-Connecting-IP header para identificación
- **User Agent tracking**: Para análisis y prevención de spam

### Response Format

- **Success**: `{ success: true, message: "..." }` con status 200
- **Errors**: `{ success: false, error: "...", details?: {...} }` con status apropiado (400, 429, 500)
- **Status codes**: 200 (OK), 400 (Validation), 429 (Rate Limit), 500 (Server Error)

### Environment Variables

**Required Secrets** (configurados con `wrangler secret put`):
- `RESEND_API_KEY`: API key de Resend
- `SUPABASE_URL`: URL del proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key de Supabase
- `CONTACT_EMAIL_TO`: Email destino (psicóloga)
- `CONTACT_EMAIL_FROM`: Email origen (noreply)

**Optional Variables** (en wrangler.toml):
- `CORS_ORIGIN`: Dominio permitido para CORS
- `RATE_LIMIT_MAX`: Máximo de requests por ventana
- `RATE_LIMIT_WINDOW`: Ventana de tiempo en segundos
- `ENVIRONMENT`: production/staging

### Frontend Integration

- **Componente**: `web/src/components/ContactCTA.astro`
- **Método**: JavaScript fetch() con POST
- **Headers**: Content-Type: application/json
- **Payload**: JSON con todos los campos del formulario
- **UX**: Spinner de carga + mensajes de éxito/error
- **Validación cliente**: HTML5 + JavaScript antes de envío

### Monitoring & Logging

- **Structured logs**: JSON format con timestamp, level, event, data
- **Métricas**: Submissions count, success rate, error types, response time
- **Cloudflare Analytics**: Request counts, errors, latency
- **Supabase logs**: Query performance y connection issues

## External Dependencies

- **@supabase/supabase-js** (v2.38.0) - Cliente oficial de Supabase para operaciones de base de datos desde el worker
- **Justification**: Integración tipo-segura con Supabase, manejo automático de auth headers, y retry logic

- **zod** (v3.22.0) - Validación de schemas con TypeScript
- **Justification**: Validación robusta y type-safe de datos del formulario, mejor que validación manual

- **wrangler** (v3.0.0+) - CLI para desarrollo y despliegue de Cloudflare Workers (devDependency)
- **Justification**: Herramienta oficial para gestionar workers, secrets, y despliegues

