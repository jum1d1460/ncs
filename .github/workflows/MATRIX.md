# Matriz de Workflows

Esta matriz muestra qué workflow se ejecuta cuando cambias archivos en cada directorio.

## 🎯 Path Filters Matrix

| Cambios en | Workflow que se ejecuta | Deploy a |
|------------|-------------------------|----------|
| `web/**` | `deploy-frontend.yml` | Cloudflare Pages |
| `cms/**` | `deploy-cms.yml` | Sanity Studio |
| `workers/contact-form/**` | `deploy-contact-worker.yml` | Cloudflare Workers |
| `workers/static-site-worker.js` | `deploy-static-site-worker.yml` | Cloudflare Workers |
| `workers/sanity-webhook-dispatcher.js` | `deploy-webhook-worker.yml` | Cloudflare Workers |
| `workers/ncs-deploy-*.js` | `deploy-webhook-worker.yml` | Cloudflare Workers |

## 📊 Escenarios de Deploy

### Escenario 1: Cambiar solo el frontend
```bash
# Editas: web/src/components/Hero.astro
git add web/
git commit -m "feat: update hero"
git push origin main
```
**Resultado**: ✅ Solo se ejecuta `deploy-frontend.yml`

### Escenario 2: Cambiar solo el CMS
```bash
# Editas: cms/schemaTypes/page.ts
git add cms/
git commit -m "feat: add new schema"
git push origin main
```
**Resultado**: ✅ Solo se ejecuta `deploy-cms.yml`

### Escenario 3: Cambiar solo el Contact Worker
```bash
# Editas: workers/contact-form/src/handlers/contact.js
git add workers/contact-form/
git commit -m "fix: improve validation"
git push origin main
```
**Resultado**: ✅ Solo se ejecuta `deploy-contact-worker.yml`

### Escenario 4: Cambiar múltiples componentes
```bash
# Editas:
# - web/src/components/ContactForm.astro
# - workers/contact-form/src/index.js
git add web/ workers/contact-form/
git commit -m "feat: update contact form"
git push origin main
```
**Resultado**: ✅ Se ejecutan **ambos workflows** en paralelo:
- `deploy-frontend.yml`
- `deploy-contact-worker.yml`

### Escenario 5: Cambiar documentación o config raíz
```bash
# Editas: README.md, .gitignore, etc.
git add README.md
git commit -m "docs: update readme"
git push origin main
```
**Resultado**: ❌ **Ningún workflow se ejecuta** (ahorro de recursos)

## 🔄 Branch Strategy

### Branch `main` → Production
| Workflow | Deploy a |
|----------|----------|
| `deploy-frontend.yml` | https://ncs-psicologa.com |
| `deploy-cms.yml` | Sanity Studio (production) |
| `deploy-contact-worker.yml` | Production worker |
| `deploy-static-site-worker.yml` | Production worker |
| `deploy-webhook-worker.yml` | Production workers |

### Branch `develop` → Preview/Staging
| Workflow | Deploy a |
|----------|----------|
| `deploy-frontend.yml` | https://develop.ncs-psicologa.pages.dev |
| `deploy-cms.yml` | No se ejecuta (solo main) |
| `deploy-contact-worker.yml` | Staging worker |
| `deploy-static-site-worker.yml` | Staging worker |
| `deploy-webhook-worker.yml` | Staging workers |

## 💡 Ventajas

| Ventaja | Descripción |
|---------|-------------|
| ⚡ **Velocidad** | Solo se ejecuta lo que cambió |
| 💰 **Eficiencia** | Ahorra minutos de GitHub Actions |
| 🎯 **Precisión** | Deploys independientes por componente |
| 🔒 **Seguridad** | Menos ejecuciones = menos superficie de error |
| 🔄 **Paralelismo** | Múltiples componentes se despliegan simultáneamente |
| 📊 **Claridad** | Fácil identificar qué causó el deploy |

## 📈 Métricas de Optimización

### Sin Path Filters (Antes)
```
Cambio en web/src/components/Hero.astro
  ↓
Se ejecutan TODOS los workflows (5)
  ↓
Tiempo: ~15 minutos
Costo: 5 workflows × 3 minutos = 15 minutos
```

### Con Path Filters (Ahora)
```
Cambio en web/src/components/Hero.astro
  ↓
Se ejecuta SOLO deploy-frontend.yml (1)
  ↓
Tiempo: ~3 minutos
Costo: 1 workflow × 3 minutos = 3 minutos
```

**Ahorro**: 80% de tiempo y recursos 🎉

## 🔍 Debugging

### Ver qué workflow se triggeró

1. Ve a GitHub > **Actions** tab
2. Busca el commit en el historial
3. Solo verás los workflows que se ejecutaron

### Forzar ejecución de un workflow

Si necesitas ejecutar un workflow sin hacer cambios:

1. GitHub > **Actions** tab
2. Selecciona el workflow
3. Click **Run workflow**
4. Selecciona branch y opciones
5. Click **Run workflow**

## 🎨 Diagrama Visual

```
📁 Proyecto NCS Psicóloga
│
├── 🌐 web/                    → deploy-frontend.yml
│   ├── src/
│   ├── public/
│   └── package.json
│
├── 📝 cms/                    → deploy-cms.yml
│   ├── schemaTypes/
│   ├── sanity.config.ts
│   └── package.json
│
├── ⚡ workers/
│   ├── contact-form/         → deploy-contact-worker.yml
│   │   ├── src/
│   │   └── wrangler.toml
│   ├── static-site-worker.js → deploy-static-site-worker.yml
│   ├── sanity-webhook-*.js   → deploy-webhook-worker.yml
│   └── ncs-deploy-*.js       → deploy-webhook-worker.yml
│
└── 📄 Otros archivos          → No triggerea workflows
    ├── README.md
    ├── .gitignore
    └── docs/
```

## 🎓 Best Practices

1. **Un componente = Un commit**: Facilita el tracking de deploys
2. **Branch develop primero**: Prueba en preview antes de production
3. **Pull Requests**: Para cambios importantes, abre PR para review
4. **Cambios múltiples**: Si tocas varios componentes, OK que se ejecuten varios workflows
5. **Logs**: Revisa los logs si algo falla para debugging rápido

## 📚 Referencias

- [GitHub Actions - Path Filters](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore)
- [Cloudflare Pages Deployment](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/)
