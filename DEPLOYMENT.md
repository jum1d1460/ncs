## CI/CD y Despliegue en Cloudflare Pages

### Flujos soportados
- Push/Merge a `main`: ejecuta tests y despliega la web en Cloudflare Pages.
- Cambio en Sanity (contenido publicado): Sanity → GitHub `repository_dispatch` → build y deploy.

### Requisitos
- Proyecto Cloudflare Pages para `web` (Astro SSG).
- GitHub Actions habilitado en el repo.
- Proyecto Sanity en `cms/`.

### Secretos requeridos (GitHub → Settings → Secrets and variables → Actions)
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` (permiso Cloudflare Pages: Edit)
- `CLOUDFLARE_PAGES_PROJECT_NAME`
- (Alternativa) `CLOUDFLARE_PAGES_DEPLOY_HOOK_URL` si usas Deploy Hook en vez de token
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION` (ej. `2024-01-01`)

Nota: Mantén config de Sanity en variables de entorno, no en código.

### Cómo obtener los valores

#### Cloudflare
- **CLOUDFLARE_ACCOUNT_ID**:
  - Cloudflare Dashboard → selecciona la cuenta (arriba a la izquierda) → en "Overview" verás el ID de la cuenta.
  - Alternativa (CLI): `wrangler whoami` muestra `account_id` si usas Wrangler.
- **CLOUDFLARE_API_TOKEN**:
  - Cloudflare Dashboard → Mi Perfil → API Tokens → Create Token.
  - Si no ves el permiso "Cloudflare Pages — Edit", puedes:
    - Usar un **Deploy Hook** (ver abajo) y no necesitar token.
    - O crear un token con permisos de Workers y usar el modelo de deploy via Worker/Pages Functions (no recomendado para sitio Astro estático).
  - Copia el token (si lo creas) y guárdalo como secreto en GitHub.
- **CLOUDFLARE_PAGES_PROJECT_NAME**:
  - Cloudflare Pages → abre tu proyecto → "Overview" muestra el nombre del proyecto (por ejemplo, `ncs-web`).
- **CLOUDFLARE_PAGES_DEPLOY_HOOK_URL** (opcional/alternativa):
  - Cloudflare Pages → tu proyecto → Settings → Deploy hooks → Create hook.
  - Copia la URL y guárdala como secreto en GitHub. El workflow la invocará tras el build.

#### Sanity
- **SANITY_PROJECT_ID**:
  - `https://www.sanity.io/manage` → elige tu proyecto → "Project ID".
  - Alternativas: en `cms/sanity.config.ts` suele estar, o por CLI desde `cms/`: `npx sanity projects list`.
- **SANITY_DATASET**:
  - `https://www.sanity.io/manage` → Project → Datasets → nombre del dataset (ej. `production`).
- **SANITY_API_VERSION**:
  - Es una fecha `YYYY-MM-DD` de versión de API. Puedes usar la misma que ya utiliza el proyecto (en el código se ve un valor por defecto) o fijar una fecha estable (ej. `2024-03-18`).
  - Asegúrate de que coincide con la esperada por `web/src/lib/sanityClient.ts`.

### Workflows
- `.github/workflows/ci.yml`: tests en `web/` y `cms/` en PRs y `main`.
- `.github/workflows/deploy.yml`: deploy a Cloudflare Pages en push a `main` y `repository_dispatch` tipo `sanity-content-changed`.

### Deploy: pasos
1. `npm ci` en `web/`
2. `npm run test` en `web/`
3. `npm run build` con `PUBLIC_SANITY_*` expuestas
4. Publicación de `web/dist` vía `cloudflare/pages-action@v1`

### Configurar Cloudflare Pages
1. Crea el proyecto en Cloudflare Pages.
2. Añade en GitHub los secretos `CLOUDFLARE_*` y `CLOUDFLARE_PAGES_PROJECT_NAME`.
3. Usa el build de GitHub Actions (no conectes repo a Pages si quieres control desde CI).

### Webhook Sanity → GitHub `repository_dispatch`
Sanity debe disparar `repository_dispatch` con `event_type = sanity-content-changed`.

Opción servicio intermedio (recomendada): endpoint serverless que reciba webhook de Sanity (valide `WEBHOOK_SECRET`) y llame a:

```
POST https://api.github.com/repos/{owner}/{repo}/dispatches
Authorization: token GITHUB_PERSONAL_TOKEN
Accept: application/vnd.github.everest-preview+json
{
  "event_type": "sanity-content-changed"
}
```

Variables del servicio:
- `GITHUB_REPO` (owner/repo)
- `GITHUB_TOKEN` (PAT con `repo`) o GitHub App con `actions:write`
- `WEBHOOK_SECRET`

### Variables de entorno en build
El cliente (`web/src/lib/sanityClient.ts`) usa `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION`.

### Tests
- `web`: Vitest (`npm run test`)
- `cms`: Vitest (se ejecuta en `ci.yml`)

### Problemas comunes
- 403 en Cloudflare: revisa permisos del token.
- `repository_dispatch` no llega: valida token/`event_type`.
- Faltan variables: confirma secretos y mapeo en el workflow.


