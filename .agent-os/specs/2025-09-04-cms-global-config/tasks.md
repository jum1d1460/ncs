# Spec Tasks

## Tasks

- [ ] 1. Definir schema `globalSettings` en Sanity (singleton)
  - [ ] 1.1 Escribir tests de validación (campos requeridos, longitudes, URLs)
  - [ ] 1.2 Implementar schema con validaciones y estructura requerida
  - [ ] 1.3 Configurar desk/structure para exponer el singleton
  - [ ] 1.4 Verificar todas las validaciones en Studio

- [ ] 2. Implementar `fetchGlobalSettings()` en `web/src/lib/sanityClient.ts`
  - [ ] 2.1 Escribir tests de la función (casos completos/ausentes/error)
  - [ ] 2.2 Implementar GROQ y tipados TS con fallbacks seguros
  - [ ] 2.3 Manejo de errores y defaults coherentes
  - [ ] 2.4 Verificar que los tests pasan

- [ ] 3. Integrar settings en `web/src/layouts/Layout.astro`
  - [ ] 3.1 Escribir tests/snapshots de head (favicon, og, title/description)
  - [ ] 3.2 Inyectar `<link rel="icon">` y `<meta>` desde settings
  - [ ] 3.3 Añadir fallbacks a `public/favicon.svg` cuando aplique
  - [ ] 3.4 Verificar que los tests pasan

- [ ] 4. Pasar settings desde páginas y `PageRenderer.astro`
  - [ ] 4.1 Escribir test de integración (PageRenderer → Layout props)
  - [ ] 4.2 Pasar props y asegurar datos disponibles en build SSG
  - [ ] 4.3 Verificar render en `dist/` con metadatos correctos

- [ ] 5. Variables de entorno y DX
  - [ ] 5.1 Actualizar `web/.env.example` con claves de Sanity
  - [ ] 5.2 Documentar en README el flujo local de credenciales
  - [ ] 5.3 Verificar build limpia sin hardcodeo de credenciales
