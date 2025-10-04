# Contact Form Worker - NCS Psicóloga

**Status**: ✅ Desarrollo completado - Listo para configuración y despliegue  
**Fecha**: 2025-10-04  
**Versión**: 1.0.0

---

## 📖 Descripción

Worker de Cloudflare que procesa el formulario de contacto de la web de NCS Psicóloga. Valida datos, envía notificaciones por email vía Resend, y almacena las solicitudes en Supabase con rate limiting y seguridad completa.

## 🎯 Características

- ✅ **Validación robusta** con Zod y mensajes en español
- ✅ **Email HTML profesional** con Resend
- ✅ **Almacenamiento en Supabase** con RLS y auditoría
- ✅ **Rate limiting** por IP (10 req/hora)
- ✅ **CORS y seguridad** configurados
- ✅ **Multi-entorno** (dev, staging, production)
- ✅ **Graceful degradation** (funciona si email o DB fallan)

## 📁 Documentación

| Archivo | Descripción |
|---------|-------------|
| **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** | 📋 Guía completa de configuración de Supabase y Resend |
| **[DEPLOYMENT_GUIDE.md](../../workers/contact-form/DEPLOYMENT_GUIDE.md)** | 🚀 Guía paso a paso de despliegue del worker |
| **[PROGRESS_REPORT.md](./PROGRESS_REPORT.md)** | 📊 Reporte detallado de progreso y estado |
| **[tasks.md](./tasks.md)** | ✅ Lista de tareas con progreso |
| **[spec.md](./spec.md)** | 📝 Especificación completa de requirements |

### Sub-especificaciones

- **[technical-spec.md](./sub-specs/technical-spec.md)** - Detalles técnicos de implementación
- **[database-schema.md](./sub-specs/database-schema.md)** - Schema de Supabase
- **[api-spec.md](./sub-specs/api-spec.md)** - Especificación de endpoints

### Scripts y Recursos

- **[setup-supabase.sql](./setup-supabase.sql)** - Script SQL para crear la tabla en Supabase
- **[test-worker.sh](../../workers/contact-form/test-worker.sh)** - Script de pruebas automatizadas

## 🚀 Quick Start

### 1. Configurar infraestructura

```bash
# Seguir instrucciones en SETUP_INSTRUCTIONS.md
# - Crear proyecto Supabase y ejecutar script SQL
# - Configurar cuenta Resend y verificar dominio
```

### 2. Instalar dependencias

```bash
cd workers/contact-form
npm install
```

### 3. Configurar variables locales

```bash
cp .dev.vars.example .dev.vars
# Editar .dev.vars con tus credenciales
```

### 4. Probar localmente

```bash
npm run dev
# En otra terminal:
./test-worker.sh http://localhost:8787
```

### 5. Desplegar a producción

```bash
# Configurar secrets
wrangler secret put RESEND_API_KEY --env production
wrangler secret put SUPABASE_URL --env production
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
wrangler secret put CONTACT_EMAIL_FROM --env production
wrangler secret put CONTACT_EMAIL_TO --env production

# Desplegar
npm run deploy:production
```

## 📊 Estado del Proyecto

| Componente | Progreso | Estado |
|------------|----------|--------|
| Especificación | 100% | ✅ Completado |
| Código | 100% | ✅ Completado |
| Documentación | 100% | ✅ Completado |
| Infraestructura | 0% | ⏳ Pendiente configuración manual |
| Testing | 0% | ⏳ Pendiente configuración manual |
| Despliegue | 0% | ⏳ Pendiente configuración manual |
| Integración Frontend | 0% | ⏳ Siguiente fase |

**Progreso General**: 80%

## 🔧 Tecnologías

- **Cloudflare Workers** - Plataforma serverless
- **Zod** - Validación de schemas
- **Supabase** - Base de datos PostgreSQL
- **Resend** - Servicio de email
- **Wrangler** - CLI de Cloudflare

## 📂 Estructura del Código

```
workers/contact-form/
├── src/
│   ├── index.js              # Router principal
│   ├── handlers/
│   │   ├── contact.js        # Handler del formulario
│   │   └── health.js         # Health check
│   ├── services/
│   │   ├── email.js          # Integración Resend
│   │   └── supabase.js       # Integración Supabase
│   ├── utils/
│   │   ├── validation.js     # Validación Zod
│   │   ├── response.js       # Respuestas HTTP
│   │   └── rateLimiter.js    # Rate limiting
│   └── config/
│       └── constants.js      # Constantes
├── package.json
├── wrangler.toml
└── README.md
```

## 🔌 API Endpoints

### `GET /health`
Health check del worker.

### `POST /api/contact`
Procesar formulario de contacto.

**Body**:
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

**Response**:
```json
{
  "success": true,
  "message": "Tu mensaje ha sido enviado correctamente..."
}
```

## ⏭️ Próximos Pasos

1. **Configurar Supabase** (15 min) - Ver `SETUP_INSTRUCTIONS.md`
2. **Configurar Resend** (30 min) - Ver `SETUP_INSTRUCTIONS.md`
3. **Probar localmente** (30 min) - Ver `DEPLOYMENT_GUIDE.md`
4. **Desplegar a producción** (20 min) - Ver `DEPLOYMENT_GUIDE.md`
5. **Actualizar frontend** (2 horas) - Integrar con ContactCTA.astro

**Tiempo estimado total**: 3-4 horas

## 💡 Notas Importantes

- ⚠️ Nunca commitear archivos `.dev.vars` o con credenciales
- 🔒 El `service_role` key de Supabase tiene permisos completos
- 🚦 Rate limit por defecto: 10 requests por IP por hora
- 📧 Verificar que el dominio está verificado en Resend antes de probar
- 🌍 El worker soporta caracteres españoles (á, é, í, ó, ú, ñ)

## 🆘 Soporte

- **Documentación**: Lee los archivos MD en esta carpeta
- **Logs**: `wrangler tail --env production`
- **Troubleshooting**: Ver sección en `DEPLOYMENT_GUIDE.md`

## 📄 Licencia

MIT

---

**Desarrollado para**: NCS Psicóloga  
**Fecha de creación**: 2025-10-04  
**Última actualización**: 2025-10-04

