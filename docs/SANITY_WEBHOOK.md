## Webhook de Sanity → GitHub Actions (`repository_dispatch`)

Esta guía explica cómo disparar el deploy cuando publicas contenido en Sanity.

### 1) Crear un endpoint intermediario (Cloudflare Worker)
Usa un Worker que reciba el webhook de Sanity, valide un secreto y llame a la API de GitHub `repository_dispatch`.

Código de ejemplo (JS): `examples/cloudflare-worker/sanity-dispatch-worker.js`

Variables del Worker (Environment Variables):
- `GITHUB_TOKEN`: PAT con scope `repo` o GitHub App con `actions:write`
- `GITHUB_REPO`: `owner/repo` (ej. `jumidi/ncs`)
- `WEBHOOK_SECRET`: secreto compartido con Sanity

Despliega el Worker y obtén su URL pública (ej. `https://sanity-dispatch.your-subdomain.workers.dev/`).

### 2) Configurar el Webhook en Sanity
En el proyecto Sanity (Manage → API → Webhooks):
- URL del webhook: la URL del Worker
- HTTP method: POST
- Payload: `application/json`
- Trigger on: `Create`, `Update`, `Delete`, y/o `Publish` (recomendado al menos `Publish`)
- Secret: usa el mismo valor de `WEBHOOK_SECRET` del Worker

Guarda el webhook y realiza una prueba desde Sanity para verificar que el Worker responde 200.

### 3) Qué hace el Worker
Envía a GitHub:

```
POST https://api.github.com/repos/{owner}/{repo}/dispatches
Authorization: token <GITHUB_TOKEN>
Accept: application/vnd.github.everest-preview+json
{
  "event_type": "sanity-content-changed"
}
```

Nuestro workflow `deploy.yml` escucha este `repository_dispatch` y ejecuta build + deploy.

### 4) Probar manualmente
También puedes disparar manualmente el evento con cURL:

```
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.everest-preview+json" \
  https://api.github.com/repos/<owner>/<repo>/dispatches \
  -d '{"event_type": "sanity-content-changed"}'
```

Debe iniciarse el workflow `Deploy` en la pestaña Actions del repo.


