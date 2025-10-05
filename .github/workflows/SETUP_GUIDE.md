# Guía Completa de Setup - GitHub Actions

Esta guía te ayudará a configurar todos los workflows de CI/CD para el proyecto NCS Psicóloga.

## 📊 Vista General

Has configurado **4 workflows independientes** con path filters + deploy manual del CMS:

| # | Workflow | Componente | Deploy a |
|---|----------|------------|----------|
| 1 | `deploy-frontend.yml` | Web (Astro) | Cloudflare Pages |
| 2 | **Deploy Manual** | CMS (Sanity) | Sanity Studio |
| 3 | `deploy-contact-worker.yml` | Contact Worker | Cloudflare Workers |
| 4 | `deploy-static-site-worker.yml` | Static Site Worker | Cloudflare Workers |
| 5 | `deploy-webhook-worker.yml` | Webhook Workers | Cloudflare Workers |

## 🔐 Secrets Requeridos

### 1. Cloudflare Secrets

#### CLOUDFLARE_API_TOKEN

**Usado por**: Todos los workflows de Cloudflare

**Cómo obtenerlo**:
1. [Cloudflare Dashboard](https://dash.cloudflare.com) > My Profile > API Tokens
2. Create Token > Use "Edit Cloudflare Workers" template
3. Agregar también permisos de Cloudflare Pages si usas el frontend workflow
4. Copiar el token

**Configurar en GitHub**:
```
Settings > Secrets and variables > Actions > New repository secret
Name: CLOUDFLARE_API_TOKEN
Value: [tu-token]
```

#### CLOUDFLARE_ACCOUNT_ID

**Usado por**: `deploy-frontend.yml`

**Cómo obtenerlo**:
1. [Cloudflare Dashboard](https://dash.cloudflare.com)
2. En la barra lateral, el Account ID está debajo del nombre de tu cuenta
3. O ve a cualquier dominio > Overview > scroll down > Account ID

**Configurar en GitHub**:
```
Settings > Secrets and variables > Actions > New repository secret
Name: CLOUDFLARE_ACCOUNT_ID
Value: [tu-account-id]
```

### 2. Sanity Secrets

#### SANITY_AUTH_TOKEN

**Usado por**: Deploy manual del CMS

**Cómo obtenerlo**:
1. [Sanity Manage](https://www.sanity.io/manage)
2. Selecciona tu proyecto
3. Settings > API > Tokens
4. Create new token con "Deploy Studio" permissions
5. Copiar el token

**Configurar en GitHub**:
```
Settings > Secrets and variables > Actions > New repository secret
Name: SANITY_AUTH_TOKEN
Value: [tu-token]
```

#### SANITY_PROJECT_ID (opcional)

**Usado por**: `deploy-frontend.yml` si necesitas hacer queries en build time

**Cómo obtenerlo**:
1. [Sanity Manage](https://www.sanity.io/manage)
2. Tu Project ID está en la URL o en Settings

**Configurar en GitHub**:
```
Settings > Secrets and variables > Actions > New repository secret
Name: SANITY_PROJECT_ID
Value: [tu-project-id]
```

#### SANITY_DATASET (opcional)

**Usado por**: `deploy-frontend.yml`

**Valor típico**: `production` o `development`

**Configurar en GitHub**:
```
Settings > Secrets and variables > Actions > New repository secret
Name: SANITY_DATASET
Value: production
```

#### SANITY_API_VERSION (opcional)

**Usado por**: `deploy-frontend.yml`

**Valor típico**: `2024-01-01` (o la fecha de tu API)

**Configurar en GitHub**:
```
Settings > Secrets and variables > Actions > New repository secret
Name: SANITY_API_VERSION
Value: 2024-01-01
```

### 3. Resumen de Secrets

| Secret | Workflows que lo usan | Prioridad |
|--------|----------------------|-----------|
| `CLOUDFLARE_API_TOKEN` | Frontend, Workers | ⭐⭐⭐ Crítico |
| `CLOUDFLARE_ACCOUNT_ID` | Frontend | ⭐⭐⭐ Crítico |
| `SANITY_AUTH_TOKEN` | CMS (Manual) | ⭐ Opcional para deploy manual |
| `SANITY_PROJECT_ID` | Frontend | ⭐ Opcional |
| `SANITY_DATASET` | Frontend | ⭐ Opcional |
| `SANITY_API_VERSION` | Frontend | ⭐ Opcional |

## 📝 Configuración Paso a Paso

### Paso 1: Configurar Secrets (15 min)

```bash
# 1. CLOUDFLARE_API_TOKEN
# - Ir a Cloudflare Dashboard > API Tokens
# - Create Token con permisos de Workers + Pages
# - Copiar token
# - GitHub > Settings > Secrets > Add: CLOUDFLARE_API_TOKEN

# 2. CLOUDFLARE_ACCOUNT_ID
# - Cloudflare Dashboard > Account ID (sidebar)
# - Copiar ID
# - GitHub > Settings > Secrets > Add: CLOUDFLARE_ACCOUNT_ID

# 3. SANITY_AUTH_TOKEN (para deploy manual del CMS)
# - Sanity Manage > Project > API > Tokens
# - Create token con "Deploy Studio"
# - Solo necesario si haces deploy manual del CMS
# - GitHub > Settings > Secrets > Add: SANITY_AUTH_TOKEN
```

### Paso 2: Actualizar URLs en los Workflows (5 min)

#### Frontend (`deploy-frontend.yml`)

Buscar y reemplazar en el archivo:

```yaml
# Línea ~73
projectName: ncs-psicologa  # Tu nombre de proyecto en Cloudflare Pages

# Línea ~76
url: https://ncs-psicologa.com  # Tu dominio real

# Línea ~105
url: https://develop.ncs-psicologa.pages.dev  # Tu preview URL

# Línea ~135-145 (smoke tests)
https://ncs-psicologa.com
https://develop.ncs-psicologa.pages.dev
```

#### Contact Worker (`deploy-contact-worker.yml`)

Ya actualizado en la guía anterior. Ver `workers/contact-form/GITHUB_ACTIONS_SETUP.md`

### Paso 3: Verificar Configuración Local

Antes de hacer push, verifica que todo compila localmente:

```bash
# Frontend
cd web
npm install
npm run build
# Debe compilar sin errores

# CMS (Deploy Manual)
cd ../cms
npm install
# Para deploy manual cuando sea necesario:
# npx sanity deploy
npm run build
# Debe compilar sin errores

# Contact Worker
cd ../workers/contact-form
npm install
# Debe instalar sin errores
```

### Paso 4: Primer Deploy (Manual)

Es recomendable hacer el primer deploy manualmente para verificar que todo funciona:

```bash
# 1. Ve a GitHub > Actions
# 2. Selecciona "Deploy Frontend (Astro)"
# 3. Click "Run workflow"
# 4. Branch: main, Environment: production
# 5. Click "Run workflow"
# 6. Observa los logs

# Repite para cada workflow que quieras probar
```

### Paso 5: Probar Path Filters (5 min)

Haz un cambio pequeño para probar:

```bash
# Test 1: Solo frontend
git checkout develop
echo "# Test" >> web/README.md
git add web/README.md
git commit -m "test: verify frontend workflow"
git push origin develop

# Resultado esperado: Solo se ejecuta deploy-frontend.yml

# Test 2: Solo worker
echo "# Test" >> workers/contact-form/README.md
git add workers/contact-form/README.md
git commit -m "test: verify worker workflow"
git push origin develop

# Resultado esperado: Solo se ejecuta deploy-contact-worker.yml
```

## 🎯 Environments en GitHub (Opcional pero Recomendado)

Los environments te permiten:
- Requerir aprobación manual antes de deploy a production
- Proteger secrets específicos por environment
- Limitar deploys a branches específicos

### Configurar Environments

1. **GitHub** > **Settings** > **Environments**
2. Click **New environment**
3. Nombre: `production`
4. Configurar:
   - ✅ **Required reviewers**: Añade tu usuario o equipo
   - ✅ **Deployment branches**: Solo `main`
5. Click **Save protection rules**
6. Repite para crear environment `preview` y `staging`

Con esto, cada deploy a production requerirá tu aprobación manual.

## 🐛 Troubleshooting

### Workflow no se ejecuta

**Problema**: Hiciste push pero el workflow no se triggeró.

**Causa**: Los cambios no están en los paths configurados.

**Solución**: 
- Verifica que modificaste archivos dentro de las carpetas correctas
- Revisa `MATRIX.md` para ver qué paths triggerea cada workflow
- Puedes ejecutar manualmente desde GitHub Actions UI

### "Resource not accessible by integration"

**Problema**: Error de permisos en GitHub Actions.

**Solución**:
```
Settings > Actions > General > Workflow permissions
→ Seleccionar "Read and write permissions"
→ Save
```

### "API token is invalid"

**Problema**: Token de Cloudflare no válido.

**Solución**:
1. Genera nuevo token en Cloudflare
2. Verifica que tenga permisos de Workers + Pages
3. Actualiza el secret en GitHub
4. Re-run el workflow

### Build falla pero funciona localmente

**Problema**: El build pasa local pero falla en CI.

**Solución**:
1. Verifica que `package-lock.json` está committeado
2. Verifica variables de entorno requeridas
3. Revisa los logs del workflow para ver el error específico
4. Prueba con: `npm ci` en lugar de `npm install` localmente

### Deploy exitoso pero sitio no actualiza

**Problema**: El workflow pasa pero los cambios no se ven.

**Solución**:
1. Espera 1-2 minutos (propagación de CDN)
2. Limpia cache del navegador (Ctrl+Shift+R)
3. Verifica en Cloudflare Dashboard que el deploy se completó
4. Verifica que el dominio apunta al proyecto correcto

## 📊 Monitoreo Post-Deploy

### Ver Status de Deploys

**GitHub**:
```
Actions > [workflow name] > Ver runs recientes
```

**Cloudflare Pages**:
```
Dashboard > Workers & Pages > [project] > Deployments
```

**Cloudflare Workers**:
```
Dashboard > Workers & Pages > [worker] > Metrics
```

### Ver Logs en Tiempo Real

**Workers**:
```bash
cd workers/contact-form
npx wrangler tail --env production
```

**Pages** (no tiene tail, pero puedes ver en Analytics):
```
Dashboard > [project] > Analytics
```

## ✅ Checklist Final

Antes de considerar el setup completo:

- [ ] Todos los secrets configurados en GitHub
- [ ] URLs actualizadas en workflows
- [ ] Primer deploy manual exitoso para cada componente
- [ ] Path filters probados con commits de prueba
- [ ] Environments configurados (opcional)
- [ ] Equipo notificado sobre el nuevo flujo
- [ ] Documentación revisada por el equipo

## 🎉 ¡Listo!

Una vez completado:

✅ Push a `develop` despliega automáticamente a preview/staging  
✅ Push a `main` despliega automáticamente a production  
✅ Solo se despliegan los componentes que cambiaron  
✅ Ahorro de ~80% en tiempo y recursos de CI/CD  
✅ Deploys independientes y paralelos  

## 📚 Documentación Adicional

- `README.md` - Overview de todos los workflows
- `MATRIX.md` - Matriz visual de qué triggerea cada workflow
- `workers/contact-form/GITHUB_ACTIONS_SETUP.md` - Setup específico del contact worker

---

**¿Problemas?** Abre un issue o revisa los logs del workflow para debugging.
