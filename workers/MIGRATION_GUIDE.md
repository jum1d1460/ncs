# Guía de Migración - Nueva Arquitectura de Workers

Esta guía te ayuda a migrar de la configuración actual a la nueva arquitectura de workers separados.

## 📋 Estado Actual vs Nuevo

### Antes (Configuración Actual)
```
workers/
├── contact-form/ (❌ Migrar a persistence-worker)
├── sanity-webhook-dispatcher.js (❌ Migrar)
├── static-site-worker.js (❌ Migrar)
├── ncs-deploy-*.js (❌ Migrar)
└── wrangler.toml (❌ Migrar)
```

### Después (Nueva Arquitectura)
```
workers/
├── static-deployer/ (✅ Nuevo)
│   ├── src/
│   │   ├── handlers/
│   │   ├── services/
│   │   └── utils/
│   ├── wrangler.toml
│   └── package.json
├── persistence-worker/ (✅ Renombrado y mejorado)
│   ├── src/
│   │   ├── handlers/ (contact, appointment, lead)
│   │   ├── services/
│   │   └── utils/
│   ├── wrangler.toml (✅ Actualizado)
│   └── package.json (✅ Actualizado)
└── scripts/
    ├── deploy-static-deployer.sh (✅ Nuevo)
    └── deploy-persistence.sh (✅ Nuevo)
```

## 🔄 Pasos de Migración

### 1. Backup de Configuración Actual

```bash
# Crear backup de la configuración actual
cp workers/wrangler.toml workers/wrangler.toml.backup
cp workers/sanity-webhook-dispatcher.js workers/sanity-webhook-dispatcher.js.backup
```

### 2. Migrar Secrets

```bash
# Migrar secrets del webhook dispatcher al static deployer
cd workers/static-deployer
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_REPO
wrangler secret put WEBHOOK_SECRET
```

### 3. Actualizar Sanity Webhook URL

En tu configuración de Sanity, actualizar la URL del webhook:

**Antes**: `https://sanity-webhook-dispatcher.workers.dev/`

**Después**: `https://ncs-static-deployer.workers.dev/webhook/sanity`

### 4. Desplegar Nuevos Workers

```bash
# Desplegar static deployer
./deploy-static-deployer.sh

# Desplegar persistence worker (si hay cambios)
./deploy-persistence.sh
```

### 5. Verificar Funcionamiento

```bash
# Health checks
curl https://ncs-static-deployer.workers.dev/health
curl https://ncs-contact-form.workers.dev/health

# Test webhook (opcional)
curl -X POST https://ncs-static-deployer.workers.dev/webhook/sanity \
  -H "Content-Type: application/json" \
  -d '{"type":"test","action":"created"}'
```

### 6. Limpiar Archivos Antiguos

```bash
# Solo después de verificar que todo funciona
rm workers/sanity-webhook-dispatcher.js
rm workers/static-site-worker.js
rm workers/ncs-deploy-*.js
rm workers/wrangler.toml
rm workers/static-site-wrangler.toml
```

## ⚠️ Consideraciones Importantes

### URLs de Workers

| Worker | URL de Producción |
|--------|-------------------|
| Static Deployer | `https://ncs-static-deployer.workers.dev` |
| Persistence | `https://ncs-persistence.workers.dev` |

### Variables de Entorno

Asegúrate de actualizar cualquier referencia a las URLs de workers en:
- Configuración de Sanity
- Variables de entorno del frontend
- Scripts de deployment
- Documentación

### Rollback Plan

Si algo sale mal, puedes hacer rollback:

```bash
# Restaurar configuración anterior
cp workers/wrangler.toml.backup workers/wrangler.toml
cp workers/sanity-webhook-dispatcher.js.backup workers/sanity-webhook-dispatcher.js

# Desplegar worker anterior
wrangler deploy
```

## 🧪 Testing

### 1. Test de Webhook

```bash
# Simular webhook de Sanity
curl -X POST https://ncs-static-deployer.workers.dev/webhook/sanity \
  -H "Content-Type: application/json" \
  -H "x-sanity-signature: your-signature" \
  -d '{
    "type": "document",
    "action": "created",
    "document": {
      "_id": "test-doc"
    }
  }'
```

### 2. Test de Formulario

```bash
# Test del formulario de contacto
curl -X POST https://ncs-persistence.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

### 3. Test de Health Checks

```bash
# Verificar que ambos workers respondan
curl https://ncs-static-deployer.workers.dev/health
curl https://ncs-contact-form.workers.dev/health
```

## 📊 Monitoreo Post-Migración

### 1. Verificar Logs

```bash
# Logs del static deployer
wrangler tail --name ncs-static-deployer

# Logs del persistence worker
wrangler tail --name ncs-persistence
```

### 2. Verificar Métricas

- Revisar métricas en Cloudflare Dashboard
- Verificar que no haya errores en los logs
- Confirmar que los webhooks se procesen correctamente

### 3. Test de Funcionalidad Completa

1. **Cambio en Sanity** → Verificar que se dispare el despliegue
2. **Formulario de contacto** → Verificar que se envíe email y se guarde en Supabase
3. **Health checks** → Verificar que ambos workers respondan

## 🎯 Beneficios de la Nueva Arquitectura

- ✅ **Separación de responsabilidades**: Cada worker tiene un propósito específico
- ✅ **Escalabilidad independiente**: Cada worker puede escalar según sus necesidades
- ✅ **Mantenimiento más fácil**: Código organizado y documentado
- ✅ **Mejor monitoreo**: Logs y métricas separadas por función
- ✅ **Desarrollo más eficiente**: Cada worker se puede desarrollar independientemente
