# Guía de Despliegue - Contact Form Worker

Esta guía te llevará paso a paso por el proceso de desplegar el worker a Cloudflare.

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de haber completado:

- ✅ Configuración de Supabase (tabla creada y verificada)
- ✅ Configuración de Resend (dominio verificado y API key obtenida)
- ✅ Credenciales guardadas de forma segura

Si no has completado estos pasos, consulta: `SETUP_INSTRUCTIONS.md` en la carpeta del spec.

## 🔐 Paso 1: Configurar Secrets

Los secrets son variables de entorno sensibles que se almacenan de forma segura en Cloudflare.

### Para desarrollo/testing:

```bash
cd workers/contact-form

# Resend
wrangler secret put RESEND_API_KEY
# Cuando pregunte, pega tu API key de Resend

# Supabase
wrangler secret put SUPABASE_URL
# Pega tu URL de Supabase (ej: https://xxxxx.supabase.co)

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Pega tu service role key de Supabase

# Emails
wrangler secret put CONTACT_EMAIL_FROM
# Escribe: noreply@ncs-psicologa.com (o tu email configurado)

wrangler secret put CONTACT_EMAIL_TO
# Escribe el email donde quieres recibir las consultas
```

### Para producción:

```bash
# Agregar --env production a cada comando:
wrangler secret put RESEND_API_KEY --env production
wrangler secret put SUPABASE_URL --env production
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
wrangler secret put CONTACT_EMAIL_FROM --env production
wrangler secret put CONTACT_EMAIL_TO --env production
```

💡 **Tip**: Los secrets se configuran una sola vez y persisten entre despliegues.

## 🧪 Paso 2: Probar Localmente (Opcional pero Recomendado)

Antes de desplegar a producción, prueba el worker localmente:

### 2.1 Crear archivo de variables locales

```bash
cp .dev.vars.example .dev.vars
```

Edita `.dev.vars` y completa con tus credenciales reales.

### 2.2 Iniciar servidor local

```bash
npm run dev
```

El worker estará en `http://localhost:8787`

### 2.3 Probar health check

```bash
curl http://localhost:8787/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2025-10-04T..."
}
```

### 2.4 Probar formulario de contacto

```bash
curl -X POST http://localhost:8787/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuario de Prueba",
    "email": "test@example.com",
    "subject": "Consulta de prueba",
    "message": "Este es un mensaje de prueba para verificar que el worker funciona correctamente.",
    "preference": "email"
  }'
```

Deberías ver:
```json
{
  "success": true,
  "message": "Tu mensaje ha sido enviado correctamente..."
}
```

✅ **Verifica**:
- Que recibiste el email en tu bandeja de entrada
- Que el submission aparece en Supabase (Table Editor > contact_submissions)

## 🚀 Paso 3: Desplegar a Production

Una vez que todo funciona localmente, despliega a producción:

```bash
npm run deploy:production
```

Verás una salida similar a:
```
Total Upload: 45.23 KiB / gzip: 12.34 KiB
Uploaded contact-form-worker (2.34 sec)
Published contact-form-worker (0.56 sec)
  https://contact-form-worker.your-account.workers.dev
```

🎉 **¡Tu worker está desplegado!**

## ✅ Paso 4: Verificar Despliegue

### 4.1 Probar health check en producción

```bash
curl https://contact-form-worker.your-account.workers.dev/health
```

### 4.2 Probar formulario en producción

```bash
curl -X POST https://contact-form-worker.your-account.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Production",
    "email": "test@example.com",
    "subject": "Test en producción",
    "message": "Verificando que el worker funciona en producción.",
    "preference": "email"
  }'
```

### 4.3 Verificar en Cloudflare Dashboard

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Selecciona tu cuenta
3. Ve a **Workers & Pages**
4. Click en `contact-form-worker`
5. Verifica que está "Deployed" y funcionando

## 🔧 Paso 5: Configurar Custom Domain (Opcional)

Para usar tu propio dominio en lugar del dominio de Cloudflare:

### 5.1 En Cloudflare Dashboard

1. Ve a tu worker: Workers & Pages > contact-form-worker
2. Click en **Settings** > **Triggers**
3. En "Custom Domains", click **Add Custom Domain**
4. Ingresa: `contact-api.ncs-psicologa.com` (o el subdominio que prefieras)
5. Click **Add Domain**

Cloudflare configurará automáticamente:
- DNS records
- SSL/TLS certificate
- Routing

### 5.2 Actualizar wrangler.toml (opcional)

Puedes agregar la configuración de routes en `wrangler.toml`:

```toml
[env.production]
routes = [
  { pattern = "contact-api.ncs-psicologa.com/*", zone_name = "ncs-psicologa.com" }
]
```

## 📊 Paso 6: Monitoreo

### Ver logs en tiempo real

```bash
npm run tail
```

o para producción:

```bash
wrangler tail --env production
```

### Ver métricas en Dashboard

1. En Cloudflare Dashboard, ve a tu worker
2. Click en **Metrics**
3. Verás:
   - Requests por día
   - Errores
   - Latencia P50/P99
   - CPU time

## 🔄 Actualizaciones Futuras

Cuando hagas cambios al código:

1. Prueba localmente con `npm run dev`
2. Despliega con `npm run deploy:production`
3. Verifica que funciona correctamente

Los secrets NO necesitan ser reconfigurados a menos que cambien las credenciales.

## 🆘 Troubleshooting

### Error: "Unauthorized"

**Causa**: API keys incorrectas o no configuradas.

**Solución**:
```bash
# Verificar secrets existentes (no muestra valores, solo nombres)
wrangler secret list

# Reconfigurar el secret problemático
wrangler secret put RESEND_API_KEY --env production
```

### Error: "CORS policy"

**Causa**: El dominio del frontend no está permitido.

**Solución**: Actualiza `CORS_ORIGIN` en `wrangler.toml` para el entorno apropiado.

### Error: "Rate limit exceeded"

**Causa**: Demasiados requests de prueba desde la misma IP.

**Solución**: Espera 1 hora o ajusta `RATE_LIMIT_WINDOW` en wrangler.toml.

### Emails no llegan

**Causa**: Dominio no verificado en Resend o en spam.

**Solución**:
1. Verifica el dominio en Resend Dashboard
2. Revisa carpeta de spam
3. Verifica logs del worker: `wrangler tail --env production`

### Submissions no se guardan en Supabase

**Causa**: Service role key incorrecta o políticas RLS mal configuradas.

**Solución**:
1. Verifica la service role key en Supabase Dashboard > Settings > API
2. Verifica las políticas RLS en Table Editor > contact_submissions > RLS
3. Prueba insertar manualmente en SQL Editor:
   ```sql
   INSERT INTO contact_submissions (name, email, subject, message, preference)
   VALUES ('Test', 'test@example.com', 'Test', 'Test message', 'email');
   ```

## 📝 Checklist de Despliegue

- [ ] Secrets configurados en Cloudflare
- [ ] Worker probado localmente
- [ ] Worker desplegado a producción
- [ ] Health check verificado
- [ ] Formulario probado (envío de prueba)
- [ ] Email recibido correctamente
- [ ] Submission guardada en Supabase
- [ ] Custom domain configurado (opcional)
- [ ] Monitoreo configurado
- [ ] Frontend actualizado con la URL del worker

## 🎯 Siguiente Paso

Una vez completado el despliegue, continúa con:
- **Tarea 10**: Actualizar el componente de contacto en el frontend para usar el worker

---

¿Problemas? Consulta los logs con `wrangler tail` o revisa la documentación oficial:
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

