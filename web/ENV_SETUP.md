# Configuración de Variables de Entorno

## Problema Resuelto
Las imágenes de los servicios en el carrusel no se visualizaban porque faltaban las variables de entorno de Sanity.

## Solución Implementada
Se han añadido valores por defecto en el código para que funcione sin configuración adicional:

- **Project ID**: `i95g996l` (obtenido de `cms/sanity.config.ts`)
- **Dataset**: `production`
- **API Version**: `2024-03-18`

## Configuración Opcional (Recomendada)
Para un entorno de producción, crea un archivo `.env` en el directorio `web/`:

```bash
# Variables de entorno para Sanity CMS
PUBLIC_SANITY_PROJECT_ID=i95g996l
PUBLIC_SANITY_DATASET=production
PUBLIC_SANITY_API_VERSION=2024-03-18
```

## Archivos Modificados
1. `src/components/ResponsiveImage.astro` - Añadidos valores por defecto para projectId y dataset
2. `src/lib/sanityClient.ts` - Añadido valor por defecto para projectId

## Verificación
Las imágenes de los servicios ahora deberían mostrarse correctamente en el carrusel sin necesidad de configuración adicional.
