# Configuración del Sistema de Herramientas

## 📋 Variables de Entorno Requeridas

Para que el sistema de herramientas funcione correctamente, necesitas añadir la siguiente variable de entorno al archivo `/web/.env`:

### Archivo: `/web/.env`

```bash
# Configuración existente de Sanity
PUBLIC_SANITY_PROJECT_ID=i95g996l
PUBLIC_SANITY_DATASET=production

# AÑADIR: URL del servicio de persistencia
PUBLIC_PERSISTENCE_WORKER_URL=https://ncs-persistence.workers.dev
```

### Para Desarrollo Local

Si estás desarrollando localmente y quieres probar con el worker local:

```bash
PUBLIC_PERSISTENCE_WORKER_URL=http://localhost:8787
```

## 🚀 Despliegue del Worker de Persistencia

El sistema de herramientas requiere que el worker de persistencia esté desplegado y funcionando.

### Verificar que el Worker está Desplegado

```bash
curl https://ncs-persistence.workers.dev/health
```

Deberías recibir:
```json
{
  "status": "ok",
  "message": "NCS Persistence Worker is running",
  "environment": "production"
}
```

### Si el Worker No Está Desplegado

1. Ir a la carpeta del worker:
```bash
cd /home/jumidi/Code/Nelly/ncs/workers/persistence-worker
```

2. Desplegar a producción:
```bash
npm run deploy:production
```

O usar el script de despliegue:
```bash
cd /home/jumidi/Code/Nelly/ncs/workers
./deploy-persistence.sh
```

## 🧪 Probar el Sistema

### 1. Iniciar el Servidor de Desarrollo

```bash
cd /home/jumidi/Code/Nelly/ncs/web
npm run dev
```

### 2. Abrir en el Navegador

- Página de herramientas: http://localhost:4321/herramientas
- Cuestionario TDAH: http://localhost:4321/herramientas/tdah-adultos

### 3. Completar el Cuestionario

1. Ingresa tu información personal (email, ubicación)
2. Responde todas las preguntas
3. Al finalizar, verifica en la consola del navegador que no haya errores
4. Los resultados deberían mostrarse correctamente

### 4. Verificar en la Base de Datos

Conectar a Supabase y ejecutar:

```sql
SELECT 
  id,
  email,
  test_type,
  score,
  test_results->>'location' as location,
  created_at
FROM leads
WHERE test_type = 'TDAH Adultos'
ORDER BY created_at DESC
LIMIT 5;
```

## 🔍 Debugging

### El cuestionario no guarda los datos

1. **Verificar la variable de entorno:**
```bash
cd /home/jumidi/Code/Nelly/ncs/web
cat .env | grep PERSISTENCE
```

2. **Verificar en la consola del navegador:**
   - Abrir DevTools (F12)
   - Ir a la pestaña Network
   - Completar el cuestionario
   - Buscar la petición POST a `/api/lead`
   - Verificar el status code (debería ser 201)

3. **Verificar que el worker está funcionando:**
```bash
curl https://ncs-persistence.workers.dev/health
```

### Error CORS

Si ves un error de CORS en la consola:

1. Verificar que el dominio está permitido en el worker
2. Revisar la configuración CORS en `/workers/persistence-worker/src/utils/response.js`

### Error 500 del Worker

Si el worker devuelve error 500:

1. Ver los logs del worker:
```bash
cd /home/jumidi/Code/Nelly/ncs/workers/persistence-worker
wrangler tail --env production
```

2. Verificar que todos los secrets estén configurados:
```bash
wrangler secret list --env production
```

Secrets requeridos:
- RESEND_API_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- CONTACT_EMAIL_TO
- CONTACT_EMAIL_FROM

## 📦 Build para Producción

### 1. Build del Sitio Web

```bash
cd /home/jumidi/Code/Nelly/ncs/web
npm run build
```

### 2. Preview del Build

```bash
npm run preview
```

### 3. Verificar Rutas Generadas

El build debe generar:
- `/herramientas/index.html`
- `/herramientas/tdah-adultos/index.html`

Verificar:
```bash
ls -la dist/herramientas/
```

## 🌐 Despliegue

Las páginas de herramientas usan `prerender = true`, por lo que se generan estáticamente durante el build.

### Cloudflare Pages

El sitio se despliega automáticamente a Cloudflare Pages. Asegúrate de que la variable de entorno esté configurada:

1. Ir al dashboard de Cloudflare Pages
2. Seleccionar el proyecto
3. Ir a Settings → Environment Variables
4. Añadir:
   - Variable: `PUBLIC_PERSISTENCE_WORKER_URL`
   - Valor: `https://ncs-persistence.workers.dev`
   - Entorno: Production

### Verificar en Producción

Una vez desplegado, verificar:

1. https://ncs-psicologa.com/herramientas
2. https://ncs-psicologa.com/herramientas/tdah-adultos
3. Completar un test y verificar que se guarde

## 📊 Monitoreo

### Métricas a Revisar

1. **En Cloudflare Workers:**
   - Número de requests a `/api/lead`
   - Tasa de error
   - Tiempo de respuesta

2. **En Supabase:**
   - Número de registros en la tabla `leads`
   - Tests completados por día
   - Distribución de resultados

### Queries Útiles

**Tests completados hoy:**
```sql
SELECT COUNT(*) as total
FROM leads
WHERE test_type = 'TDAH Adultos'
  AND created_at::date = CURRENT_DATE;
```

**Distribución de resultados:**
```sql
SELECT 
  CASE 
    WHEN score < 22 THEN 'Bajo'
    WHEN score < 40 THEN 'Moderado'
    ELSE 'Alto'
  END as nivel,
  COUNT(*) as cantidad
FROM leads
WHERE test_type = 'TDAH Adultos'
GROUP BY nivel;
```

**Tests por ubicación:**
```sql
SELECT 
  test_results->'location'->>'provincia' as provincia,
  COUNT(*) as total
FROM leads
WHERE test_type = 'TDAH Adultos'
GROUP BY provincia
ORDER BY total DESC;
```

## 🎯 Próximos Pasos

1. **Configurar la variable de entorno** en `/web/.env`
2. **Verificar el worker de persistencia** está desplegado
3. **Probar localmente** el cuestionario
4. **Verificar en Supabase** que los datos se guardan
5. **Desplegar a producción** y probar en el sitio real

## 📞 Soporte

Si tienes problemas:

1. Revisar los logs del worker: `wrangler tail`
2. Revisar la consola del navegador
3. Verificar la documentación del worker: `/workers/persistence-worker/README.md`
4. Revisar la documentación de herramientas: `/web/HERRAMIENTAS_README.md`

