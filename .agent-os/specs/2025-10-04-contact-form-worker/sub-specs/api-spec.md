# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-10-04-contact-form-worker/spec.md

## Endpoints

### POST /api/contact

**Purpose:** Procesar submissions del formulario de contacto, validar datos, enviar notificación por email, y almacenar en base de datos.

**URL:** `https://contact-form.ncs-psicologa.workers.dev/api/contact`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
Origin: https://ncs-psicologa.com (o dominio configurado)
```

**Request Body:**
```json
{
  "name": "María García López",
  "email": "maria@example.com",
  "phone": "+34 612 345 678",
  "topic": "Terapia individual",
  "subject": "Consulta sobre terapia cognitivo-conductual",
  "message": "Hola, me gustaría información sobre sesiones de terapia...",
  "preference": "email"
}
```

**Field Validations:**
- `name` (required): 2-100 caracteres, solo letras y espacios (incluye acentos españoles)
- `email` (required): Formato email válido
- `phone` (optional): 9-15 caracteres, formato internacional
- `topic` (optional): Máximo 100 caracteres
- `subject` (required): 5-200 caracteres
- `message` (required): 10-2000 caracteres
- `preference` (required): Uno de: "email", "phone", "any"

**Success Response:**
```json
{
  "success": true,
  "message": "Tu mensaje ha sido enviado correctamente. Te contactaremos pronto."
}
```
**Status Code:** `200 OK`

**Error Responses:**

*Validation Error:*
```json
{
  "success": false,
  "error": "Datos del formulario inválidos",
  "details": {
    "name": "El nombre debe tener al menos 2 caracteres",
    "email": "Formato de email inválido"
  }
}
```
**Status Code:** `400 Bad Request`

*Rate Limit Exceeded:*
```json
{
  "success": false,
  "error": "Demasiados envíos. Por favor, intenta más tarde."
}
```
**Status Code:** `429 Too Many Requests`

*Server Error:*
```json
{
  "success": false,
  "error": "Error interno del servidor. Por favor, intenta más tarde."
}
```
**Status Code:** `500 Internal Server Error`

**CORS Headers:**
```
Access-Control-Allow-Origin: https://ncs-psicologa.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

---

### OPTIONS /api/contact

**Purpose:** Manejar preflight requests de CORS.

**Method:** `OPTIONS`

**Response:**
- Status: `204 No Content`
- Headers: CORS headers (ver arriba)

---

### GET /health

**Purpose:** Health check endpoint para monitoreo del worker.

**Method:** `GET`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T12:34:56.789Z",
  "version": "1.0.0"
}
```
**Status Code:** `200 OK`

## Controller Logic

### ContactHandler (`handlers/contact.js`)

**Responsibilities:**
1. Parsear y validar JSON del request body
2. Validar datos con Zod schema
3. Extraer IP y User-Agent de headers
4. Aplicar rate limiting por IP
5. Llamar a servicios de email y Supabase en paralelo (Promise.all)
6. Manejar errores y retornar respuesta apropiada

**Flow:**
```javascript
1. Parse request body
2. Validate with Zod schema
3. Check rate limit for IP
4. If rate limited → return 429
5. If validation fails → return 400
6. Call emailService.send() and supabaseService.insert() in parallel
7. If both succeed → return 200
8. If either fails → log error and return 500
```

**Error Handling:**
- Catch ZodError para validación
- Catch rate limit errors (429)
- Catch email/database errors (log + return 500)
- Always return structured JSON response

### HealthHandler (`handlers/health.js`)

**Responsibilities:**
1. Retornar status del worker
2. Incluir timestamp y versión
3. Potencialmente verificar conexiones a servicios externos (futuro)

---

## Service Interfaces

### EmailService (`services/email.js`)

**Method:** `send(contactData, metadata)`

**Purpose:** Enviar email con los datos del formulario a la psicóloga.

**Parameters:**
- `contactData`: Objeto con campos del formulario
- `metadata`: { ip, userAgent, timestamp }

**Returns:** `Promise<{ success: boolean, messageId?: string }>`

**Implementation:**
- Construir HTML template con datos
- Llamar a Resend API con fetch
- Incluir reply-to con email del usuario
- Retornar success/failure

---

### SupabaseService (`services/supabase.js`)

**Method:** `insertSubmission(contactData, metadata)`

**Purpose:** Insertar submission en tabla contact_submissions.

**Parameters:**
- `contactData`: Objeto con campos del formulario
- `metadata`: { ip, userAgent }

**Returns:** `Promise<{ success: boolean, id?: string }>`

**Implementation:**
- Crear cliente Supabase con service role key
- Insertar en contact_submissions table
- Manejar errores de Supabase
- Retornar success con ID generado

---

## Rate Limiting Strategy

**Implementation:** In-memory Map con cleanup periódico

**Logic:**
1. Key: IP address
2. Value: Array of timestamps
3. On each request:
   - Filter timestamps older than RATE_LIMIT_WINDOW
   - Check if array length >= RATE_LIMIT_MAX
   - If exceeded → return 429
   - If allowed → add current timestamp
4. Cleanup: Remove old entries every 5 minutes

**Configuration:**
- `RATE_LIMIT_MAX`: 10 requests
- `RATE_LIMIT_WINDOW`: 3600 seconds (1 hour)

---

## Security Headers

All responses include:
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

