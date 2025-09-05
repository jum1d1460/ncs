# Spec Tasks

## Tasks

- [ ] 1. Definir schema `globalSettings` en Sanity (singleton)
  - [x] 1.1 Escribir tests de validación (campos requeridos, longitudes, URLs)
  - [x] 1.2 Implementar schema con validaciones y estructura requerida
  - [x] 1.3 Configurar desk/structure para exponer el singleton
  - [x] 1.4 Verificar todas las validaciones en Studio

- [ ] 2. Implementar `fetchGlobalSettings()` en `web/src/lib/sanityClient.ts`
  - [x] 2.1 Escribir tests de la función (casos completos/ausentes/error)
  - [x] 2.2 Implementar GROQ y tipados TS con fallbacks seguros
  - [x] 2.3 Manejo de errores y defaults coherentes
  - [x] 2.4 Verificar que los tests pasan

- [ ] 3. Integrar settings en `web/src/layouts/Layout.astro`
  - [x] 3.1 Escribir tests/snapshots de head (favicon, og, title/description)
  - [x] 3.2 Inyectar `<link rel="icon">` y `<meta>` desde settings
  - [x] 3.3 Añadir fallbacks a `public/favicon.svg` cuando aplique
  - [x] 3.4 Verificar que los tests pasan

- [ ] 4. Pasar settings desde páginas y `PageRenderer.astro`
  - [x] 4.1 Escribir test de integración (PageRenderer → Layout props)
  - [x] 4.2 Pasar props y asegurar datos disponibles en build SSG
  - [x] 4.3 Verificar render en `dist/` con metadatos correctos

- [ ] 5. Variables de entorno y DX
  - [x] 5.1 Actualizar `web/.env.example` con claves de Sanity
  - [x] 5.2 Documentar en README el flujo local de credenciales
  - [x] 5.3 Verificar build limpia sin hardcodeo de credenciales
