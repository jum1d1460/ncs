# 🚀 Inicio Rápido: Google Maps

## Para Editores del CMS

### Paso 1: Obtén la URL del mapa
1. Ve a [Google Maps](https://maps.google.com)
2. Busca tu ubicación
3. Haz clic en **"Compartir"**
4. Copia el enlace

### Paso 2: Pégala en el CMS
1. Abre Sanity Studio
2. Edita una página con bloque de contacto
3. Ve a la sección **"Mapa"**
4. Pega la URL en **"URL de Google Maps"**
5. Escribe un título (ej: "Ubicación de nuestra oficina")
6. Guarda

### ¡Listo! 🎉
El mapa aparecerá automáticamente en tu sitio web.

---

## Para Desarrolladores

### Ejecutar Tests
```bash
cd web
npm test
```

### Ver la Implementación
- **Utilidad:** `web/src/lib/googleMaps.ts`
- **Componente:** `web/src/components/blocks/ContactCTA.astro`
- **Schema:** `cms/schemaTypes/blockContact.ts`
- **Tests:** `web/src/lib/googleMaps.test.ts`

### Migrar Datos Existentes
```bash
cd cms
export SANITY_TOKEN="tu-token"
node scripts/migrate-map-field.js
```

---

## Documentación Completa

📖 **Para usuarios del CMS:** [cms/GOOGLE_MAPS_INTEGRATION.md](cms/GOOGLE_MAPS_INTEGRATION.md)  
🔧 **Para desarrolladores:** [GOOGLE_MAPS_FEATURE.md](GOOGLE_MAPS_FEATURE.md)  
📊 **Resumen de implementación:** [IMPLEMENTACION_MAPAS.md](IMPLEMENTACION_MAPAS.md)

---

## Ejemplos de URLs Válidas

✅ `https://maps.app.goo.gl/ABC123`  
✅ `https://www.google.com/maps/place/Zaragoza`  
✅ `https://www.google.com/maps/@41.6488,-0.8890,13z`  
✅ `<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>`

---

## ¿Necesitas Ayuda?

- 📚 Lee la [documentación completa](cms/GOOGLE_MAPS_INTEGRATION.md)
- 🐛 Revisa la [sección de problemas](GOOGLE_MAPS_FEATURE.md#-resolución-de-problemas)
- 💬 Contacta al equipo de desarrollo

