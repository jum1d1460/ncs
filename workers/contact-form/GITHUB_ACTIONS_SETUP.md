# Setup de GitHub Actions para Contact Form Worker

Esta guía te ayudará a configurar el despliegue automatizado del worker usando GitHub Actions.

## 🎯 Qué se Automatiza

Con GitHub Actions configurado:

✅ **Deploy automático a staging** cuando pusheas a `develop`  
✅ **Deploy automático a production** cuando pusheas a `main`  
✅ **Solo se ejecuta** cuando hay cambios en `workers/contact-form/`  
✅ **Validación automática** antes de cada deploy  
✅ **Health checks** después del deploy  
✅ **Deploy manual** desde GitHub UI cuando lo necesites  

---

## 📋 Checklist de Configuración

### ✅ Paso 1: Verificar que el workflow existe

El archivo ya está creado en:
```
.github/workflows/deploy-contact-worker.yml
```

### ✅ Paso 2: Obtener API Token de Cloudflare

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click en tu avatar (arriba derecha) > **My Profile**
3. En el menú lateral, click en **API Tokens**
4. Click en **Create Token**
5. Busca la plantilla **Edit Cloudflare Workers** y click en **Use template**
6. Configura:
   - **Token name**: `GitHub Actions - NCS Contact Worker`
   - **Permissions**:
     - Account > Workers Scripts > Edit
     - Account > Workers KV Storage > Edit (si usas KV)
   - **Account Resources**: Include > Tu cuenta específica
   - **Zone Resources**: No es necesario (a menos que uses custom domain)
7. Click **Continue to summary**
8. Revisa los permisos
9. Click **Create Token**
10. **⚠️ IMPORTANTE**: Copia el token AHORA (no podrás verlo después)

### ✅ Paso 3: Configurar Secret en GitHub

1. Ve a tu repositorio: `https://github.com/YOUR-USERNAME/YOUR-REPO`
2. Click en **Settings** (tab arriba)
3. En el menú lateral, click en **Secrets and variables** > **Actions**
4. Click en **New repository secret**
5. Configura:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Secret**: Pega el token que copiaste
6. Click **Add secret**

✅ El secret está configurado cuando aparezca en la lista.

### ✅ Paso 4: Configurar Secrets del Worker en Cloudflare

Estos son los secrets que el worker necesita en runtime:

```bash
cd workers/contact-form

# Production
wrangler secret put RESEND_API_KEY --env production
wrangler secret put SUPABASE_URL --env production
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env production
wrangler secret put CONTACT_EMAIL_FROM --env production
wrangler secret put CONTACT_EMAIL_TO --env production

# Staging (opcional)
wrangler secret put RESEND_API_KEY --env staging
wrangler secret put SUPABASE_URL --env staging
wrangler secret put SUPABASE_SERVICE_ROLE_KEY --env staging
wrangler secret put CONTACT_EMAIL_FROM --env staging
wrangler secret put CONTACT_EMAIL_TO --env staging
```

💡 **Nota**: Estos secrets se configuran una vez y persisten en Cloudflare.

### ✅ Paso 5: Actualizar URLs en el Workflow

1. Haz el primer deploy manual para obtener las URLs:
   ```bash
   cd workers/contact-form
   npx wrangler deploy --env production
   ```

2. Copia la URL que aparece (ej: `https://contact-form-worker.tu-cuenta.workers.dev`)

3. Edita `.github/workflows/deploy-contact-worker.yml`:
   
   Busca y reemplaza `your-account` con tu cuenta real:
   ```yaml
   # Línea ~54 (staging environment)
   url: https://contact-form-worker-staging.TU-CUENTA.workers.dev
   
   # Línea ~104 (production environment)
   url: https://contact-form-worker.TU-CUENTA.workers.dev
   ```

4. También actualiza las URLs en los health checks:
   ```yaml
   # Línea ~76 y ~126
   https://contact-form-worker-staging.TU-CUENTA.workers.dev/health
   https://contact-form-worker.TU-CUENTA.workers.dev/health
   ```

5. Commit los cambios:
   ```bash
   git add .github/workflows/deploy-contact-worker.yml
   git commit -m "chore: configure worker URLs in GitHub Actions"
   git push
   ```

---

## 🧪 Probar el Workflow

### Opción 1: Hacer un cambio pequeño

```bash
# En branch develop
git checkout develop

# Hacer un cambio trivial
cd workers/contact-form
echo "# Test" >> README.md

# Commit y push
git add README.md
git commit -m "test: verify GitHub Actions deployment"
git push origin develop
```

Luego:
1. Ve a GitHub > Actions tab
2. Deberías ver el workflow ejecutándose
3. Click en él para ver el progreso en tiempo real

### Opción 2: Deploy manual desde GitHub

1. Ve a GitHub > **Actions** tab
2. En el sidebar izquierdo, click en **Deploy Contact Form Worker**
3. Click en **Run workflow** (botón a la derecha)
4. Selecciona:
   - **Branch**: main o develop
   - **Environment**: production o staging
5. Click **Run workflow**
6. Observa la ejecución en tiempo real

---

## 📊 Monitorear Deploys

### Ver Logs del Workflow

1. GitHub > Actions tab
2. Click en el workflow específico
3. Click en los jobs para expandir
4. Click en los steps para ver logs detallados

### Ver Logs del Worker Desplegado

```bash
# Production
npx wrangler tail --env production

# Staging
npx wrangler tail --env staging
```

### Ver Status en Cloudflare Dashboard

1. [Cloudflare Dashboard](https://dash.cloudflare.com)
2. **Workers & Pages**
3. Click en tu worker
4. Pestaña **Metrics** para ver:
   - Requests por segundo
   - Errores
   - Latencia
   - CPU time

---

## 🔄 Flujo de Trabajo Recomendado

### Para nuevas features

```bash
# 1. Crear feature branch
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios en el worker
cd workers/contact-form
# ... editar archivos ...

# 3. Commit
git add .
git commit -m "feat: add nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request a develop en GitHub
# - El workflow NO se ejecuta en feature branches
# - Revisión de código manual

# 5. Merge a develop
# - Esto despliega automáticamente a staging
# - Probar en staging

# 6. Si todo OK, merge develop a main
git checkout main
git pull origin main
git merge develop
git push origin main
# - Esto despliega automáticamente a production
```

---

## 🎭 Ambientes

| Branch | Ambiente | URL | Deploy |
|--------|----------|-----|--------|
| `develop` | Staging | `*-staging.workers.dev` | Automático |
| `main` | Production | `*.workers.dev` | Automático |
| `feature/*` | - | - | Manual (si necesario) |

---

## ⚡ Ventajas del Path Filter

El workflow está configurado con:

```yaml
paths:
  - 'workers/contact-form/**'
  - '.github/workflows/deploy-contact-worker.yml'
```

**Esto significa**:

✅ **SE ejecuta** cuando cambias:
- Código del worker
- Configuración (wrangler.toml, package.json)
- Documentación del worker
- El workflow mismo

❌ **NO se ejecuta** cuando cambias:
- Frontend (web/)
- CMS (cms/)
- Otros workers
- Documentación general del proyecto

**Beneficios**:
- ⚡ Deploys más rápidos
- 💰 Ahorro en minutos de GitHub Actions
- 🎯 Solo se despliega lo que cambió
- 🔒 Menos riesgo de errores

---

## 🐛 Troubleshooting

### "Resource not accessible by integration"

**Causa**: El workflow no tiene permisos para leer/escribir.

**Solución**:
1. Settings > Actions > General
2. En "Workflow permissions", selecciona "Read and write permissions"
3. Click Save

### "Invalid API token"

**Causa**: Token expirado o sin permisos.

**Solución**:
1. Genera nuevo token en Cloudflare
2. Actualiza el secret en GitHub
3. Re-run el workflow

### El workflow no se ejecuta

**Causa**: Cambios fuera de la carpeta `workers/contact-form/`.

**Solución**: Esto es esperado. El workflow solo se ejecuta con cambios en el worker.

### Deploy exitoso pero el worker no funciona

**Causa**: Secrets del worker no configurados en Cloudflare.

**Solución**:
```bash
# Verificar secrets existentes
wrangler secret list --env production

# Agregar los que falten
wrangler secret put NOMBRE_SECRET --env production
```

---

## 🎯 Próximos Pasos

Después de configurar GitHub Actions:

- [ ] Configurar API token en GitHub Secrets ⭐ Crítico
- [ ] Actualizar URLs en el workflow
- [ ] Configurar secrets del worker en Cloudflare ⭐ Crítico
- [ ] Hacer deploy manual inicial
- [ ] Probar workflow con un cambio pequeño
- [ ] Documentar la URL final del worker
- [ ] Actualizar frontend con la URL del worker

---

## 📚 Referencias

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cloudflare Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/)
- [Path Filters](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)

---

**¿Necesitas ayuda?** Revisa los logs del workflow o crea un issue en el repositorio.
