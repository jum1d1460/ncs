# 🔧 Solución: Error de Deploy del Webhook Worker

## ❌ Error Encontrado

```
✘ [ERROR] In a non-interactive environment, it's necessary to set a 
CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

## 🎯 Causa del Problema

El workflow de GitHub Actions no puede acceder al secreto `CLOUDFLARE_API_TOKEN` por una de estas razones:

1. ❌ El secreto no está configurado en GitHub
2. ❌ El token de Cloudflare ha expirado
3. ❌ El token no tiene los permisos necesarios
4. ❌ El nombre del secreto es incorrecto

## ✅ Solución Paso a Paso

### Paso 1: Crear un Token de API en Cloudflare

1. **Ir al Dashboard de Cloudflare:**
   - https://dash.cloudflare.com/profile/api-tokens

2. **Crear un nuevo token:**
   - Clic en **"Create Token"**
   - Seleccionar **"Edit Cloudflare Workers"** template
   - O crear un token personalizado con estos permisos:

```
Permisos necesarios:
├─ Account
│  └─ Cloudflare Workers Scripts: Edit
├─ Zone
│  └─ Workers Routes: Edit
└─ User
   └─ User Details: Read
```

3. **Configurar el token:**
   - **Token name:** `GitHub Actions - Workers Deploy`
   - **Permissions:**
     - Account Resources: Include → Tu cuenta
     - Zone Resources: Include → All zones (o específico)
   - **TTL:** Nunca expira (o según tus políticas)

4. **Copiar el token:**
   - ⚠️ Solo se muestra una vez, guárdalo en lugar seguro

### Paso 2: Configurar el Secreto en GitHub

1. **Ir a tu repositorio en GitHub:**
   - https://github.com/TU_USUARIO/ncs

2. **Navegar a Settings:**
   - Clic en **"Settings"** (en la barra superior del repo)

3. **Ir a Secrets and Variables:**
   - En el menú lateral izquierdo: **Secrets and variables** → **Actions**

4. **Añadir el secreto:**
   - Clic en **"New repository secret"**
   - **Name:** `CLOUDFLARE_API_TOKEN`
   - **Secret:** Pegar el token copiado de Cloudflare
   - Clic en **"Add secret"**

### Paso 3: Verificar el Secreto

1. **Comprobar que existe:**
   - En Settings → Secrets and variables → Actions
   - Deberías ver: `CLOUDFLARE_API_TOKEN` (Updated X minutes ago)

2. **Verificar el nombre:**
   - ⚠️ Debe ser exactamente: `CLOUDFLARE_API_TOKEN`
   - No puede tener espacios ni caracteres extra

### Paso 4: Volver a Ejecutar el Workflow

#### Opción A: Push de nuevo (recomendado)
```bash
cd /home/jumidi/Code/Nelly/ncs
git add .
git commit -m "Configurar CLOUDFLARE_API_TOKEN"
git push origin main
```

#### Opción B: Re-run desde GitHub
1. Ir a la pestaña **"Actions"** en GitHub
2. Seleccionar el workflow fallido
3. Clic en **"Re-run all jobs"**

## 🔍 Verificación Adicional

### Verificar el Token Localmente (Opcional)

```bash
cd /home/jumidi/Code/Nelly/ncs/workers

# Exportar el token temporalmente
export CLOUDFLARE_API_TOKEN="tu_token_aquí"

# Probar el deploy
wrangler deploy sanity-webhook-dispatcher.js --compatibility-date 2024-01-15
```

Si funciona localmente, el problema es solo la configuración en GitHub.

### Verificar que el Workflow tiene el Secreto

El archivo `.github/workflows/deploy-webhook-worker.yml` ya está correctamente configurado:

```yaml
- name: 🚀 Deploy Webhook Worker
  working-directory: workers
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
  run: |
    wrangler deploy sanity-webhook-dispatcher.js \
      --compatibility-date 2024-01-15
```

✅ El workflow está bien, solo falta el secreto en GitHub.

## ⚠️ Problema Adicional: Observers en wrangler.toml

El warning indica:
```
▲ [WARNING] Processing wrangler.toml configuration:
  - Unexpected fields found in top-level field: "observers"
```

### Solución:

```bash
# Ver el contenido del wrangler.toml
cat /home/jumidi/Code/Nelly/ncs/workers/wrangler.toml
```

Si hay un campo `observers`, eliminarlo o comentarlo ya que no es válido en la configuración actual de Wrangler.

## 📋 Checklist Final

Antes de hacer push, verifica:

- [ ] Token de Cloudflare creado con permisos correctos
- [ ] Token añadido a GitHub Secrets como `CLOUDFLARE_API_TOKEN`
- [ ] Nombre del secreto es exactamente `CLOUDFLARE_API_TOKEN`
- [ ] El campo `observers` está eliminado o comentado en wrangler.toml
- [ ] El workflow `.github/workflows/deploy-webhook-worker.yml` existe
- [ ] Has hecho commit de tus cambios

## 🚀 Comandos Rápidos

```bash
# Ver el estado actual
cd /home/jumidi/Code/Nelly/ncs
git status

# Hacer commit y push (si hay cambios)
git add .
git commit -m "Fix: Configurar deploy de webhook worker"
git push origin main

# Verificar que el workflow se ejecuta
# Ir a: https://github.com/TU_USUARIO/ncs/actions
```

## 📞 Si el Problema Persiste

1. **Verificar permisos del token:**
   - El token debe tener permisos de **Edit** en Workers Scripts
   
2. **Regenerar el token:**
   - A veces es más rápido crear un token nuevo
   - Eliminar el viejo en Cloudflare
   - Crear uno nuevo y actualizar en GitHub

3. **Verificar la cuenta de Cloudflare:**
   - Asegurarse de que la cuenta tiene acceso a Workers
   - Verificar que no hay límites de rate o billing

4. **Contactar con soporte:**
   - Si todo lo anterior falla, puede ser un problema temporal de Cloudflare
   - Revisar el status: https://www.cloudflarestatus.com/

## 📚 Documentación Relacionada

- **Crear API Token:** https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- **GitHub Secrets:** https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **Wrangler Deploy:** https://developers.cloudflare.com/workers/wrangler/commands/#deploy

---

**Estado:** 🔴 Requiere configuración del CLOUDFLARE_API_TOKEN en GitHub Secrets

**Prioridad:** 🔥 Alta - Bloquea los deploys automáticos

