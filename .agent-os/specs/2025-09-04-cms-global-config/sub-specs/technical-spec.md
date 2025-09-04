# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-04-cms-global-config/spec.md

> Created: 2025-09-04
> Version: 1.0.0

## Technical Requirements

- Sanity schema `globalSettings` con campos: `siteTitle` (string, requerido), `siteDescription` (text, max ~300), `favicon` (image), `ogImage` (image), `socialLinks` (array de objetos `{type, url}`), `defaultMeta` (objeto opcional con overrides por defecto).
- Validaciones en schema: `required`, longitudes y formato URL para `socialLinks.url`.
- Visibilidad en Studio: documento singleton (ocultar "create new"), acceso desde raíz del desk.
- Cliente en `web/src/lib/sanityClient.ts`: función `fetchGlobalSettings()` con query GROQ y tipado TS.
- Integración en `web/src/layouts/Layout.astro`: inyectar `<link rel="icon">` para favicon y `<meta>` para title/description/OG por defecto, usando TailwindCSS para no romper estilos.
- Fallbacks: si falta `favicon` usar `web/public/favicon.svg`; si falta `ogImage` usar `web/public/favicon.svg` o asset por defecto.
- `.env` gestionará `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`; actualizar `web/.env.example`.
- Build SSG: asegurar que `PageRenderer.astro` o páginas dinámicas reciban settings en tiempo de build.

## Approach Options

**Opción A:** Cargar settings en cada página vía `getStaticPaths`/`Astro.glob` + import de cliente.
- Pros: Simplicidad, sin plumbing global adicional.
- Cons: Repetición por página; riesgo de inconsistencias si se olvida.

**Opción B (Seleccionada):** Inyección en `Layout.astro` a través de props desde cada página y `PageRenderer.astro`.
- Pros: Punto único de verdad para `<head>`; fácil de testear.
- Cons: Requiere pasar prop adicional en páginas.

**Rationale:** Centralizar head/meta en `Layout.astro` reduce duplicación y errores.

## External Dependencies

- No se requieren librerías nuevas. Se usa stack existente: Astro, TailwindCSS, @sanity/client.
