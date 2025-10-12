# Configuración de Variables de Entorno

## 📋 Variables Necesarias

### Para conectar los formularios al worker de persistencia:

```bash
PUBLIC_CONTACT_FORM_ACTION=https://ncs-persistence.jum1d1460.workers.dev/api/contact
```

## 🔧 Cómo configurar

### ✅ **SOLUCIÓN CORRECTA: GitHub Actions (Producción)**
La variable ya está configurada en `.github/workflows/deploy-frontend.yml` (línea 64).

**¿Por qué en GitHub Actions y no en Cloudflare Pages?**
- Astro con `output: 'static'` resuelve las variables `PUBLIC_*` en **build time**
- El valor se "bakea" directamente en el HTML/JS compilado
- **NO** se necesitan variables de entorno en Cloudflare Pages

### Opción 1: Archivo .env local (desarrollo)
1. Crea un archivo `.env` en la carpeta `web/`
2. Añade la variable:
```bash
PUBLIC_CONTACT_FORM_ACTION=https://ncs-persistence.jum1d1460.workers.dev/api/contact
```

### ❌ **NO necesario: Cloudflare Pages**
**NO** configures la variable en Cloudflare Pages porque:
- El sitio es estático (pre-compilado)
- Las variables ya están resueltas en el build
- Cloudflare Pages solo sirve archivos estáticos

## ✅ Verificación

Una vez que hagas push, el workflow de GitHub Actions:
1. Compilará el frontend con la variable configurada
2. Desplegará el sitio estático a Cloudflare Pages
3. Los formularios enviarán datos al worker de persistencia

## 🔍 Cómo funciona

- **Sin variable configurada**: Los formularios usan `mailto:` (comportamiento actual)
- **Con variable configurada**: Los formularios envían POST a `https://ncs-persistence.jum1d1460.workers.dev/api/contact`

El worker de persistencia procesará los datos y los guardará en Supabase, además de enviar el email de notificación.
