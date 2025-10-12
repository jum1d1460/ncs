# NCS Workers Architecture

Esta es la nueva arquitectura de Workers de Cloudflare para el proyecto NCS Psicóloga.

## 🏗️ Arquitectura

```
Cloudflare Account (misma cuenta)
├── Cloudflare Pages
│   └── ncs-psicologa.com (sitio web estático)
├── Workers
│   ├── ncs-deploy (despliega estáticos + webhooks) ✅ Existente
│   └── ncs-persistence (persiste datos en Supabase) 🆕 Nuevo
```

## 📁 Estructura de Workers

### 1. Deploy Worker (`ncs-deploy`) ✅ Existente

**Propósito**: Manejar despliegues de sitios estáticos y webhooks de Sanity

**Funcionalidades**:
- ✅ Recibir webhooks de Sanity
- ✅ Disparar despliegues en GitHub via `repository_dispatch`
- ✅ Servir archivos estáticos (fallback)
- ✅ Health checks y monitoreo
- ✅ Validación HMAC para seguridad

**Endpoints**:
- `GET /health` - Health check
- `POST /webhook/sanity` - Webhook de Sanity
- `GET /*` - Servir archivos estáticos

**Secrets requeridos**:
- `GITHUB_TOKEN` - Personal Access Token con scope 'repo'
- `GITHUB_REPO` - Formato 'owner/repo' (ej. 'jumidi/ncs')
- `WEBHOOK_SECRET` - Secreto compartido con Sanity (opcional)

### 2. Persistence Worker (`persistence-worker/`) 🆕 Nuevo

**Propósito**: Persistir datos en Supabase (contacto, citas, leads, tests)

**Funcionalidades**:
- ✅ Validación robusta de datos con Zod
- ✅ Envío de emails con Resend
- ✅ Almacenamiento en Supabase
- ✅ Rate limiting por IP
- ✅ Seguridad CORS configurada
- ✅ Health check endpoint
- ✅ Múltiples tipos de datos (contacto, citas, leads)

**Endpoints**:
- `GET /health` - Health check
- `POST /api/contact` - Procesar formulario de contacto
- `POST /api/appointment` - Solicitud de primera cita
- `POST /api/lead` - Leads de formularios de tests

**Secrets requeridos**:
- `RESEND_API_KEY` - API Key de Resend
- `SUPABASE_URL` - URL de Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service Role Key de Supabase
- `CONTACT_EMAIL_TO` - Email destino
- `CONTACT_EMAIL_FROM` - Email origen

## 🚀 Despliegue

### Despliegue Manual

```bash
# Deploy Worker (ya existe, no necesitas desplegarlo)
# Solo verificar que funcione: curl https://ncs-deploy.workers.dev/health

# Persistence Worker (nuevo)
./deploy-persistence.sh
```

### Configurar Secrets

```bash
# Para Deploy Worker (verificar que existan)
wrangler secret list --name ncs-deploy
# Si faltan, agregarlos:
wrangler secret put GITHUB_TOKEN --name ncs-deploy
wrangler secret put GITHUB_REPO --name ncs-deploy
wrangler secret put WEBHOOK_SECRET --name ncs-deploy

# Para Persistence Worker (nuevo)
cd persistence-worker
wrangler secret put RESEND_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put CONTACT_EMAIL_TO
wrangler secret put CONTACT_EMAIL_FROM
```

### Entornos

Cada worker soporta múltiples entornos:
- **Development**: `wrangler dev`
- **Staging**: `wrangler deploy --env staging`
- **Production**: `wrangler deploy --env production`

## 🔧 Desarrollo Local

```bash
# Deploy Worker (ya existe y funciona)
# Verificar: curl https://ncs-deploy.workers.dev/health

# Persistence Worker (desarrollo local)
cd persistence-worker
npm run dev
```

## 📊 Monitoreo

```bash
# Ver logs en tiempo real
wrangler tail --env production

# Health checks
curl https://ncs-static-deployer.workers.dev/health
curl https://ncs-persistence.workers.dev/health
```

## 🔒 Seguridad

### Deploy Worker (ncs-deploy)
- Validación HMAC para webhooks de Sanity
- Validación de tokens de GitHub
- Sanitización de entradas

### Persistence Worker
- Rate limiting por IP
- Validación robusta con Zod
- CORS configurado correctamente

## 🔄 Flujo de Despliegue

1. **Cambio en Sanity CMS** → Webhook a `ncs-static-deployer`
2. **Static Deployer** → Valida webhook → Dispara GitHub `repository_dispatch`
3. **GitHub Actions** → Build y deploy a Cloudflare Pages
4. **Sitio web actualizado** → `ncs-psicologa.com`

## 📝 Notas Importantes

- **Misma cuenta de Cloudflare**: Todos los workers están en la misma cuenta para facilitar gestión
- **Workers separados**: Responsabilidades claras y escalabilidad independiente
- **Cloudflare Pages**: El sitio web estático se sirve desde Cloudflare Pages, no desde Workers
- **Fallback**: Los Workers pueden servir archivos estáticos como fallback si es necesario

## 🆘 Troubleshooting

### Problemas Comunes

1. **Worker no responde**: Verificar que esté desplegado correctamente
2. **Secrets no funcionan**: Verificar que estén configurados con `wrangler secret put`
3. **CORS errors**: Verificar configuración de CORS en el worker
4. **GitHub dispatch falla**: Verificar token y repo en secrets

### Logs y Debugging

```bash
# Ver logs detallados
wrangler tail --env production --format pretty

# Verificar configuración
wrangler whoami
wrangler list
```
