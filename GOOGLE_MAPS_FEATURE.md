# 🗺️ Feature: Integración de Google Maps en Bloque de Contacto

## 📋 Resumen

Se ha implementado una funcionalidad completa para integrar mapas de Google Maps en el bloque de contacto del sitio web. Esta feature permite a los editores del CMS agregar mapas fácilmente usando cualquier formato de URL de Google Maps.

## ✨ Características Principales

### 1. **Múltiples Formatos de URL Soportados**
- ✅ URL de compartir (https://maps.app.goo.gl/...)
- ✅ URL completa de Google Maps (https://www.google.com/maps/place/...)
- ✅ URL de embed directo (https://www.google.com/maps/embed?pb=...)
- ✅ Código iframe completo
- ✅ URLs con coordenadas
- ✅ URLs con parámetros de búsqueda

### 2. **Procesamiento Automático**
- El sistema detecta automáticamente el tipo de URL
- Convierte la URL al formato embed correcto
- Extrae el src de códigos iframe
- Maneja URLs cortas de goo.gl

### 3. **Optimización y Buenas Prácticas**
- Lazy loading de mapas para mejor rendimiento
- Atributos de accesibilidad (ARIA)
- Diseño responsive
- Referrer policy para privacidad
- Altura mínima para mejor visualización

## 📁 Archivos Modificados/Creados

### CMS (Sanity)
```
cms/
├── schemaTypes/blockContact.ts          [MODIFICADO]
│   └── Actualizado el campo map con soporte para mapUrl
├── scripts/migrate-map-field.js         [NUEVO]
│   └── Script de migración para datos existentes
└── GOOGLE_MAPS_INTEGRATION.md          [NUEVO]
    └── Guía de usuario para el CMS
```

### Frontend (Astro)
```
web/
├── src/
│   ├── components/blocks/ContactCTA.astro  [MODIFICADO]
│   │   └── Integración de la utilidad de mapas
│   └── lib/
│       ├── googleMaps.ts                    [NUEVO]
│       │   └── Funciones de procesamiento de URLs
│       ├── googleMaps.test.ts               [NUEVO]
│       │   └── Tests unitarios
│       └── sanityClient.ts                  [MODIFICADO]
│           └── Actualizado tipo BlockContact
└── GOOGLE_MAPS_FEATURE.md                   [NUEVO]
    └── Documentación técnica de la feature
```

## 🚀 Uso en el CMS

### Para Editores de Contenido

1. **Obtener la URL del mapa:**
   - Ve a [Google Maps](https://maps.google.com)
   - Busca tu ubicación
   - Haz clic en "Compartir"
   - Copia el enlace

2. **Agregar el mapa en Sanity:**
   - Edita o crea una página
   - Agrega o edita un bloque "Bloque: Contacto"
   - En la sección "Mapa":
     - Pega la URL de Google Maps en el campo "URL de Google Maps"
     - Escribe un título descriptivo en "Título accesible del mapa"
   - Guarda los cambios

3. **Publicar:**
   - Los cambios se reflejarán automáticamente en el sitio web

📖 **Guía completa:** Ver [cms/GOOGLE_MAPS_INTEGRATION.md](cms/GOOGLE_MAPS_INTEGRATION.md)

## 🔧 Implementación Técnica

### Cambios en el Schema de Sanity

```typescript
// cms/schemaTypes/blockContact.ts
defineField({
    name: "map",
    title: "Mapa",
    type: "object",
    description: "Configuración del mapa de ubicación",
    fields: [
        defineField({ 
            name: "mapUrl",  // Anteriormente: embedUrl
            title: "URL de Google Maps", 
            type: "url", 
            description: "Pega cualquier URL de Google Maps...",
            validation: (Rule) => Rule.uri({ scheme: ["https", "http"] })
        }),
        defineField({ 
            name: "title", 
            title: "Título accesible del mapa", 
            type: "string",
            initialValue: "Mapa de ubicación"
        })
    ]
})
```

### Utilidad de Procesamiento

```typescript
// web/src/lib/googleMaps.ts

/**
 * Extrae o convierte una URL de Google Maps a formato embed
 */
export function extractGoogleMapsEmbedUrl(mapUrl: string | undefined): string | null {
    // Lógica de conversión...
}

/**
 * Verifica si una URL es válida de Google Maps
 */
export function isValidGoogleMapsUrl(mapUrl: string | undefined): boolean {
    // Lógica de validación...
}

/**
 * Genera props para el iframe del mapa
 */
export function getGoogleMapsIframeProps(mapUrl: string | undefined, title: string): object | null {
    // Genera atributos del iframe...
}
```

### Integración en el Componente

```astro
---
// web/src/components/blocks/ContactCTA.astro
import { extractGoogleMapsEmbedUrl } from "../../lib/googleMaps";

const mapEmbedUrl = extractGoogleMapsEmbedUrl(block?.map?.mapUrl);
const mapTitle = block?.map?.title || 'Mapa de ubicación';
---

{mapEmbedUrl && (
  <div class="map-container">
    <iframe 
      src={mapEmbedUrl} 
      title={mapTitle} 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>
)}
```

## 🧪 Testing

Se incluyen tests unitarios completos:

```bash
# Ejecutar tests
cd web
npm test

# Ejecutar tests en modo watch
npm run test:watch
```

### Tests Incluidos

- ✅ Procesamiento de URLs de embed
- ✅ Extracción de src de iframes
- ✅ Conversión de URLs con coordenadas
- ✅ Conversión de URLs con place
- ✅ Conversión de URLs con query
- ✅ Manejo de URLs cortas goo.gl
- ✅ Validación de URLs
- ✅ Generación de props para iframe

## 🔄 Migración de Datos Existentes

Si ya tienes bloques de contacto con el campo antiguo `embedUrl`, usa el script de migración:

### Preparación

1. **Obtener un token de Sanity:**
   - Ve a [manage.sanity.io](https://manage.sanity.io)
   - Selecciona tu proyecto
   - Ve a API → Tokens
   - Crea un token con permisos de **Editor** o **Admin**

2. **Configurar variables de entorno:**
   ```bash
   export SANITY_PROJECT_ID="tu-project-id"
   export SANITY_DATASET="production"
   export SANITY_TOKEN="tu-token-aqui"
   ```

### Ejecutar Migración

```bash
# Verificar qué se va a migrar (dry-run)
cd cms
node scripts/migrate-map-field.js --dry-run

# Ejecutar la migración real
node scripts/migrate-map-field.js
```

⚠️ **IMPORTANTE:** Haz un backup de tus datos antes de ejecutar la migración.

### Qué Hace el Script

1. Busca todas las páginas con bloques de contacto
2. Identifica bloques con el campo antiguo `map.embedUrl`
3. Copia el valor a `map.mapUrl`
4. Elimina el campo antiguo `map.embedUrl`
5. Reporta estadísticas de la migración

## 📊 Tipos TypeScript

```typescript
export type BlockContact = {
    _type: 'blockContact';
    title?: string;
    subtitle?: string;
    theme?: 'light' | 'dark' | 'brand';
    form?: {
        subjectPlaceholder?: string;
        topicOptions?: string[];
        submitLabel?: string;
        disclaimer?: string;
    };
    contact?: {
        phone?: string;
        email?: string;
        address?: string;
        schedule?: string;
    };
    map?: {
        mapUrl?: string;    // Nuevo campo
        title?: string;
    };
}
```

## 🎨 Diseño y UX

### Responsive

- **Mobile:** El mapa aparece debajo de la información de contacto
- **Desktop:** El mapa aparece al lado del formulario de contacto

### Altura Mínima

- Se establece una altura mínima de 300px para asegurar que el mapa sea visible

### Temas

El mapa se adapta automáticamente al tema del bloque:
- 🌞 Claro (light)
- 🌙 Oscuro (dark)
- 🎨 Marca (brand)

## 🔐 Consideraciones de Seguridad

- ✅ Solo acepta URLs HTTPS
- ✅ Validación de dominios de Google Maps
- ✅ `referrerpolicy="no-referrer-when-downgrade"` para privacidad
- ✅ Sanitización de URLs
- ✅ No requiere API keys (sin exposición de secretos)

## 📈 Rendimiento

- **Lazy Loading:** Los mapas se cargan solo cuando están en viewport
- **Sin dependencias adicionales:** No se agregan librerías externas
- **Procesamiento del lado del servidor:** La conversión de URLs se hace en build time

## 🐛 Resolución de Problemas

### El mapa no aparece

1. **Verifica la URL:**
   - Debe ser una URL válida de Google Maps
   - Debe empezar con `https://`

2. **Revisa la consola del navegador:**
   - Puede haber errores de CORS o CSP

3. **Prueba con formato simple:**
   - Usa la URL de compartir (https://maps.app.goo.gl/...)

### El mapa se ve cortado

- Ajusta la altura mínima en `ContactCTA.astro`:
  ```astro
  <div class="h-full min-h-[400px]"> <!-- Aumenta de 300px a 400px -->
  ```

### La URL no se procesa correctamente

- Verifica que sea una URL de Google Maps válida
- Prueba con el formato de embed directo
- Revisa los logs de la función `extractGoogleMapsEmbedUrl`

## 🚀 Mejoras Futuras

### Posibles Extensiones

1. **Soporte para API Key de Google Maps:**
   - Permitiría más opciones de personalización
   - Zoom level, map type, markers personalizados

2. **Múltiples marcadores:**
   - Agregar varios puntos de interés en el mismo mapa

3. **Estilos personalizados:**
   - Mapas con colores de la marca

4. **Modo oscuro del mapa:**
   - Sincronizar el estilo del mapa con el tema del sitio

5. **Direcciones desde la ubicación actual:**
   - Botón "Cómo llegar" integrado

## 📚 Referencias

### Documentación Externa

- [Google Maps Embed API](https://developers.google.com/maps/documentation/embed)
- [Google Maps URLs](https://developers.google.com/maps/documentation/urls)
- [Sanity Field Types](https://www.sanity.io/docs/schema-types)

### Documentación Interna

- [cms/GOOGLE_MAPS_INTEGRATION.md](cms/GOOGLE_MAPS_INTEGRATION.md) - Guía de usuario
- [web/src/lib/googleMaps.ts](web/src/lib/googleMaps.ts) - Código fuente con documentación
- [web/src/lib/googleMaps.test.ts](web/src/lib/googleMaps.test.ts) - Tests

## 👥 Soporte

Para preguntas o problemas:
1. Revisa esta documentación
2. Consulta los tests para ver ejemplos de uso
3. Revisa la consola del navegador para errores
4. Contacta al equipo de desarrollo

## 📝 Changelog

### v1.0.0 (2025-10-12)

**✨ Nuevas Características:**
- Soporte para múltiples formatos de URL de Google Maps
- Procesamiento automático de URLs
- Función utilitaria `extractGoogleMapsEmbedUrl()`
- Tests unitarios completos
- Script de migración de datos
- Documentación completa

**🔧 Cambios Técnicos:**
- Renombrado de campo `map.embedUrl` a `map.mapUrl`
- Actualización de tipo TypeScript `BlockContact`
- Mejoras en validación de URLs
- Optimizaciones de rendimiento (lazy loading)

**📖 Documentación:**
- Guía de usuario para editores (GOOGLE_MAPS_INTEGRATION.md)
- Documentación técnica (GOOGLE_MAPS_FEATURE.md)
- Comentarios inline en el código

---

**Implementado por:** AI Assistant
**Fecha:** 12 de octubre de 2025
**Estado:** ✅ Completado y Testeado

