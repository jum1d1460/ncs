# Guía de Configuración en Cloudflare

Esta guía te explica paso a paso qué hacer en Cloudflare para configurar los workers de NCS.

## 🎯 Resumen de lo que Necesitas Hacer

1. **Crear/Configurar Workers** en Cloudflare Dashboard
2. **Configurar Secrets** para cada worker
3. **Configurar Dominios** (opcional)
4. **Verificar Despliegues**

## 📋 Pasos Detallados

### 1. Acceder a Cloudflare Dashboard

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Inicia sesión con tu cuenta
3. Selecciona la cuenta correcta (si tienes varias)

### 2. Crear/Configurar Workers

#### Opción A: Crear Workers desde Dashboard (Recomendado)

1. **Ve a Workers & Pages**
   - En el menú lateral izquierdo, haz clic en "Workers & Pages"

2. **Verificar Worker Existente**
   - El worker `ncs-deploy` ya existe (para webhooks y despliegues)
   - No necesitas crear uno nuevo

3. **Crear Persistence Worker**
   - Haz clic en "Create application" nuevamente
   - Selecciona "Create Worker"
   - Nombre: `ncs-persistence`
   - Haz clic en "Deploy"

#### Opción B: Usar Wrangler CLI (Automático)

Si prefieres usar la línea de comandos:

```bash
# El worker ncs-deploy ya existe, solo crear el nuevo
cd workers/persistence-worker
wrangler deploy
```

### 3. Configurar Secrets

**IMPORTANTE**: Los secrets se configuran por worker individualmente.

#### Para Worker Existente (ncs-deploy)

1. **Ve al worker `ncs-deploy`** (ya existe)
2. **Verifica que tenga configurados**:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO` 
   - `WEBHOOK_SECRET` (opcional)
3. **Si faltan, agrégalos en "Settings" → "Variables"**

#### Para Persistence Worker

1. **Ve al worker `ncs-persistence`**
2. **Ve a la pestaña "Settings"**
3. **Haz clic en "Variables"**
4. **Agregar cada secret**:

```
RESEND_API_KEY = tu_api_key_de_resend
SUPABASE_URL = tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY = tu_service_role_key
CONTACT_EMAIL_TO = email@destino.com
CONTACT_EMAIL_FROM = email@origen.com
```

### 4. Verificar URLs de los Workers

Después del despliegue, tus workers estarán disponibles en:

- **Deploy Worker** (existente): `https://ncs-deploy.workers.dev`
- **Persistence**: `https://ncs-persistence.workers.dev`

### 5. Configurar Dominios Personalizados (Opcional)

Si quieres usar dominios personalizados:

1. **Ve al worker que quieres configurar**
2. **Pestaña "Settings" → "Triggers"**
3. **Haz clic en "Add Custom Domain"**
4. **Configura el dominio** (ej: `api.ncs-psicologa.com`)

### 6. Configurar CORS (Si es Necesario)

Los workers ya tienen CORS configurado, pero si necesitas ajustar:

1. **Ve al worker**
2. **Pestaña "Settings" → "Variables"**
3. **Ajusta `CORS_ORIGIN`** según tu dominio

## 🔧 Configuración con Wrangler CLI

### Instalar Wrangler (si no lo tienes)

```bash
npm install -g wrangler
```

### Autenticarse

```bash
wrangler login
```

### Configurar Secrets via CLI

```bash
# Para worker existente (ncs-deploy) - solo si faltan secrets
wrangler secret put GITHUB_TOKEN --name ncs-deploy
wrangler secret put GITHUB_REPO --name ncs-deploy
wrangler secret put WEBHOOK_SECRET --name ncs-deploy

# Para nuevo worker (persistence)
cd workers/persistence-worker
wrangler secret put RESEND_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put CONTACT_EMAIL_TO
wrangler secret put CONTACT_EMAIL_FROM
```

### Desplegar

```bash
# Solo necesitas desplegar el nuevo worker
cd workers/persistence-worker
wrangler deploy

# El worker ncs-deploy ya está desplegado y funcionando
```

## 📊 Verificar Configuración

### Health Checks

```bash
# Verificar que ambos workers funcionen
curl https://ncs-deploy.workers.dev/health
curl https://ncs-persistence.workers.dev/health
```

### Ver Logs

```bash
# Logs en tiempo real
wrangler tail --name ncs-deploy
wrangler tail --name ncs-persistence
```

## 🔗 URLs Importantes en Cloudflare

- **Dashboard Principal**: [dash.cloudflare.com](https://dash.cloudflare.com)
- **Workers & Pages**: [dash.cloudflare.com/workers](https://dash.cloudflare.com/workers)
- **Analytics**: [dash.cloudflare.com/analytics](https://dash.cloudflare.com/analytics)

## ⚠️ Consideraciones Importantes

### Límites de Cloudflare Workers

- **Requests**: 100,000 requests/día (plan gratuito)
- **CPU Time**: 10ms por request (plan gratuito)
- **Memory**: 128MB por worker
- **Secrets**: Hasta 32 secrets por worker

### Costos

- **Plan Gratuito**: Incluye 100,000 requests/día
- **Plan Pro**: $5/mes por worker + $0.50 por millón de requests

### Seguridad

- Todos los secrets están encriptados
- HTTPS obligatorio
- CORS configurado por defecto
- Rate limiting incluido

## 🆘 Troubleshooting

### Worker no se despliega

1. Verificar que `wrangler login` funcione
2. Verificar que el nombre del worker sea único
3. Revisar logs en Cloudflare Dashboard

### Secrets no funcionan

1. Verificar que estén configurados correctamente
2. Verificar que no tengan espacios extra
3. Usar `wrangler secret list` para verificar

### CORS Errors

1. Verificar configuración de `CORS_ORIGIN`
2. Verificar que el dominio esté en la lista blanca
3. Revisar headers en el navegador

### Rate Limiting

1. Verificar configuración de rate limiting
2. Ajustar límites si es necesario
3. Considerar upgrade de plan si se necesita más

## 📞 Soporte

Si tienes problemas:

1. **Documentación oficial**: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
2. **Community**: [community.cloudflare.com](https://community.cloudflare.com)
3. **Status**: [cloudflarestatus.com](https://cloudflarestatus.com)

## ✅ Checklist Final

- [ ] Worker existente verificado (`ncs-deploy`)
- [ ] Nuevo worker creado (`ncs-persistence`)
- [ ] Secrets configurados para ambos workers
- [ ] Workers desplegados correctamente
- [ ] Health checks funcionando
- [ ] URLs accesibles
- [ ] Logs verificados
- [ ] CORS configurado (si necesario)
- [ ] Dominios personalizados (si necesario)
