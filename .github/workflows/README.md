# GitHub Actions Workflows

Este directorio contiene los workflows de CI/CD para el proyecto NCS Psicóloga.

## 📋 Workflows Disponibles

### 🌐 Frontend

#### `deploy-frontend.yml`
Despliega el sitio web Astro a Cloudflare Pages.

**Trigger**: 
- ✅ Solo cuando hay cambios en `web/`
- ✅ Push a `main` → Deploy a production
- ✅ Push a `develop` → Deploy a preview
- ✅ Ejecución manual desde GitHub UI

**Stages**:
1. **Build** - Compila el sitio Astro y sube artifact
2. **Deploy Production** - Despliega a Cloudflare Pages (main)
3. **Deploy Preview** - Despliega a preview (develop)
4. **Smoke Test** - Verifica que el sitio está accesible

---

### 📝 CMS

**Deploy Manual**: El CMS de Sanity se despliega manualmente cuando es necesario.

**Cuándo hacer deploy**:
- Cambios en configuración del CMS (`sanity.config.ts`)
- Nuevos tipos de contenido (schemas)
- Modificaciones en la estructura del CMS

**Comando**:
```bash
cd cms
npx sanity deploy
```

---

### ⚡ Workers

#### `deploy-contact-worker.yml`
Despliega el Contact Form Worker a Cloudflare.

**Trigger**: 
- ✅ Solo cuando hay cambios en `workers/contact-form/`
- ✅ Push a `main` → Deploy a production
- ✅ Push a `develop` → Deploy a staging
- ✅ Ejecución manual desde GitHub UI

**Stages**:
1. **Validate** - Instala dependencias y valida el código
2. **Deploy Staging** - Despliega a staging (solo branch develop)
3. **Deploy Production** - Despliega a producción (solo branch main)
4. **Notify** - Envía notificaciones de estado

#### `deploy-static-site-worker.yml`
Despliega el Static Site Worker.

**Trigger**: 
- ✅ Solo cuando hay cambios en archivos del static site worker
- ✅ Push a `main` o `develop`
- ✅ Ejecución manual

#### `deploy-webhook-worker.yml`
Despliega los Webhook Workers (Sanity dispatcher y NCS deploy).

**Trigger**: 
- ✅ Solo cuando hay cambios en archivos de webhook workers
- ✅ Push a `main` o `develop`
- ✅ Ejecución manual

---

## 🔧 Configuración Inicial

### 1. Obtener API Token de Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click en tu perfil (arriba derecha) > **API Tokens**
3. Click en **Create Token**
4. Usa la plantilla **Edit Cloudflare Workers**
5. Configura los permisos:
   - **Account** > Workers Scripts > Edit
   - **Zone** (opcional si usas custom domains)
6. Click **Continue to summary**
7. Click **Create Token**
8. **Copia el token** (no podrás verlo después)

### 2. Configurar Secret en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Configura:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: Pega el token de Cloudflare
5. Click **Add secret**

### 3. Actualizar URLs en el Workflow

Edita `.github/workflows/deploy-contact-worker.yml` y reemplaza:

```yaml
# Línea ~54
url: https://contact-form-worker-staging.your-account.workers.dev

# Línea ~76
# Línea ~84 (en el health check)
https://contact-form-worker-staging.your-account.workers.dev/health

# Línea ~104
url: https://contact-form-worker.your-account.workers.dev

# Línea ~126 (en el health check)
https://contact-form-worker.your-account.workers.dev/health
```

Con tus URLs reales del worker.

💡 **Tip**: Puedes obtener la URL real después del primer deploy manual:
```bash
cd workers/contact-form
npx wrangler deploy --dry-run
```

---

## 🚀 Uso

### Deploy Automático

**A Staging**:
```bash
git checkout develop
git add workers/contact-form/
git commit -m "feat: update contact worker"
git push origin develop
```

**A Production**:
```bash
git checkout main
git merge develop
git push origin main
```

### Deploy Manual

Desde GitHub:
1. Ve a **Actions** tab
2. Selecciona **Deploy Contact Form Worker**
3. Click **Run workflow**
4. Selecciona el ambiente (staging/production)
5. Click **Run workflow**

---

## 📊 Monitoreo

### Ver Logs del Workflow

1. Ve a **Actions** tab en GitHub
2. Click en el workflow ejecutado
3. Expande los steps para ver logs detallados

### Ver Logs del Worker

Después del deploy, ver logs en tiempo real:
```bash
cd workers/contact-form
npx wrangler tail --env production
```

---

## 🔍 Cómo Funciona el Path Filter

El workflow solo se ejecuta cuando hay cambios en:

```yaml
paths:
  - 'workers/contact-form/**'
  - '.github/workflows/deploy-contact-worker.yml'
```

**Ejemplos**:

✅ **Triggers el workflow**:
- Cambios en `workers/contact-form/src/index.js`
- Cambios en `workers/contact-form/package.json`
- Cambios en `workers/contact-form/wrangler.toml`
- Cambios en el workflow mismo

❌ **NO triggers el workflow**:
- Cambios en `web/src/components/`
- Cambios en `cms/`
- Cambios en otros workers
- Cambios en README.md del root

---

## 🔐 Secrets Requeridos

| Secret | Descripción | Cómo obtenerlo |
|--------|-------------|----------------|
| `CLOUDFLARE_API_TOKEN` | Token de API de Cloudflare | Dashboard > My Profile > API Tokens |

### Secrets Opcionales

Para notificaciones:

| Secret | Descripción |
|--------|-------------|
| `SLACK_WEBHOOK_URL` | Webhook de Slack para notificaciones |
| `DISCORD_WEBHOOK_URL` | Webhook de Discord para notificaciones |

---

## 🎯 Environments en GitHub

Opcionalmente, puedes configurar **Environments** en GitHub para:
- Requerir aprobación manual antes de deploy a production
- Configurar secrets específicos por ambiente
- Limitar quién puede desplegar

### Configurar Environments

1. **Settings** > **Environments**
2. Click **New environment**
3. Nombre: `production`
4. Configura:
   - ✅ **Required reviewers**: Personas que deben aprobar
   - ✅ **Wait timer**: Tiempo de espera antes de deploy
   - ✅ **Deployment branches**: Solo desde `main`
5. Repite para `staging`

---

## 🐛 Troubleshooting

### Error: "API Token is invalid"

**Solución**: 
1. Verifica que el token en GitHub Secrets sea correcto
2. Verifica que el token tenga permisos de Workers Scripts Edit
3. Genera un nuevo token si es necesario

### Error: "Cannot find module"

**Solución**:
```bash
# Localmente, verifica que las dependencias están en package-lock.json
cd workers/contact-form
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update package-lock"
git push
```

### Deploy se ejecuta cuando no debería

**Solución**: Verifica el path filter. Si hiciste cambios en archivos fuera de `workers/contact-form/`, el workflow no debería ejecutarse.

### Health check falla después de deploy

**Solución**: 
1. El worker puede tardar unos segundos en propagarse globalmente
2. Verifica que la URL en el health check sea correcta
3. Prueba el endpoint manualmente: `curl https://your-worker.workers.dev/health`

---

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Cloudflare Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

---

## 🔄 Próximos Pasos

- [ ] Configurar API token en GitHub Secrets
- [ ] Actualizar URLs en el workflow
- [ ] Hacer primer deploy manual para verificar
- [ ] Probar workflow con un cambio pequeño
- [ ] Configurar environments con aprobaciones (opcional)
- [ ] Agregar notificaciones de Slack/Discord (opcional)
