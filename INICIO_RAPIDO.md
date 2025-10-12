# 🚀 Inicio Rápido - Sistema de Herramientas TDAH

## ✅ Lo que tienes ahora

Un sistema completo de herramientas de evaluación con:
- 📄 Página índice de herramientas (`/herramientas`)
- 🧠 Cuestionario TDAH completo (`/herramientas/tdah-adultos`)
- 💾 Integración con base de datos (Supabase)
- 📧 Captura de emails y ubicación
- 📊 Sistema de scoring inteligente con 3 niveles

## 🏃 Prueba Rápida (3 minutos)

```bash
# 1. Iniciar servidor de desarrollo
cd /home/jumidi/Code/Nelly/ncs/web
npm run dev

# 2. Abrir en el navegador
# → http://localhost:4321/herramientas
# → http://localhost:4321/herramientas/tdah-adultos

# 3. Completar el cuestionario y verificar resultados
```

## 📋 Checklist Antes de Producción

- ✅ Variables de entorno configuradas (`web/.env`)
- ⏳ Probar localmente y completar un test
- ⏳ Verificar en Supabase que se guardó el test
- ⏳ Configurar variable en Cloudflare Pages:
  - Variable: `PUBLIC_PERSISTENCE_WORKER_URL`
  - Valor: `https://ncs-persistence.workers.dev`
- ⏳ Hacer commit y push
- ⏳ Probar en producción

## 🔍 Verificar en Supabase

```sql
-- Ver últimos tests completados
SELECT 
  email,
  test_type,
  score,
  created_at
FROM leads
WHERE test_type = 'TDAH Adultos'
ORDER BY created_at DESC
LIMIT 10;
```

## 📚 Documentación Completa

- **Inicio Rápido:** `INICIO_RAPIDO.md` (este archivo)
- **Instrucciones Paso a Paso:** `INSTRUCCIONES_FINALES.md`
- **Documentación Técnica:** `web/HERRAMIENTAS_README.md`
- **Configuración y Troubleshooting:** `CONFIGURACION_HERRAMIENTAS.md`
- **Resumen Ejecutivo:** `RESUMEN_HERRAMIENTAS.md`

## 🎯 URLs del Sistema

**Desarrollo:**
- http://localhost:4321/herramientas
- http://localhost:4321/herramientas/tdah-adultos

**Producción (después de desplegar):**
- https://ncs-psicologa.com/herramientas
- https://ncs-psicologa.com/herramientas/tdah-adultos

## 💡 Tip: Añadir Más Herramientas

Para añadir un nuevo test (ej: ansiedad):

1. Editar `web/src/pages/herramientas/index.astro`:
   ```javascript
   const herramientas = [
     // ... test TDAH existente
     {
       slug: 'test-ansiedad',
       titulo: 'Test de Ansiedad',
       descripcion: 'Evaluación...',
       icono: '😰',
       duracion: '5 minutos',
       color: 'green'
     }
   ];
   ```

2. Copiar y adaptar el componente:
   ```bash
   cp web/src/components/TDAHQuestionnaire.astro \
      web/src/components/AnsiedadQuestionnaire.astro
   # Editar preguntas
   ```

3. Crear la página:
   ```bash
   cp web/src/pages/herramientas/tdah-adultos.astro \
      web/src/pages/herramientas/test-ansiedad.astro
   # Cambiar import y título
   ```

4. ¡Listo! (30-60 minutos)

## 🆘 Problemas Comunes

**Los datos no se guardan:**
```bash
# Verificar worker
curl https://ncs-persistence.workers.dev/health
# Debe retornar: {"status":"ok",...}
```

**Error de CORS:**
- Verificar que el dominio esté permitido en el worker
- Revisar configuración en `workers/persistence-worker/src/utils/response.js`

**Build falla:**
```bash
cd /home/jumidi/Code/Nelly/ncs/web
npm install
npm run build
```

## 📞 ¿Necesitas Ayuda?

Lee la documentación completa en:
- `INSTRUCCIONES_FINALES.md` - Pasos detallados
- `CONFIGURACION_HERRAMIENTAS.md` - Troubleshooting
- `web/HERRAMIENTAS_README.md` - Documentación técnica

---

**🎉 ¡Todo listo! El sistema está completo y funcional.**

