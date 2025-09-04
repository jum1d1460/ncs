# Spec Requirements Document

> Spec: cms-global-config
> Created: 2025-09-04

## Overview

Configurar en el CMS (Sanity) una fuente única de verdad para metadatos y ajustes globales del sitio (favicon, título, descripción, redes, OG/SEO), consumida por la web Astro para builds SSG consistentes.

## User Stories

### Como editor, quiero configurar metadatos globales

Como editor de contenido, quiero editar metadatos y assets globales (título del sitio, descripción, favicon, OG image, redes sociales) desde un único documento en Sanity, para que la web los use automáticamente sin tocar código.

Flujo: abrir Studio → documento "Global Settings" → editar campos validados → publicar → web los consume en build o revalidación.

### Como visitante, quiero ver metadatos correctos

Como visitante/robot, quiero que cada página tenga favicon y metadatos coherentes (title/description/OG), para mejorar SEO y apariencia en compartidos.

## Spec Scope

1. **Documento Global Settings en Sanity** - Esquema con campos: siteTitle, siteDescription, favicon, ogImage, socialLinks, defaultMeta.
2. **Cliente de lectura en web** - Función en `web/src/lib/sanityClient.ts` para obtener Global Settings de forma tipada.
3. **Integración en Astro** - Usar settings en `Layout.astro` para `<head>`, favicon y OG por defecto.
4. **Variables de entorno** - Respetar `.env` para credenciales de Sanity, sin hardcode.
5. **Validación y fallback** - Defaults seguros si falta algún campo.

## Out of Scope

- Panel avanzado de SEO por página (se hará en otra spec).
- Regeneración on-demand vía webhooks.
- Editor de imágenes/transformaciones avanzadas.

## Expected Deliverable

1. Sanity Studio con documento `globalSettings` visible y validado.
2. Web Astro construye con favicon y metadatos desde CMS en `index.html` y páginas dinámicas.
3. Sin credenciales hardcode; `.env.example` actualizado.

## Spec Documentation

- Technical Specification: @.agent-os/specs/2025-09-04-cms-global-config/sub-specs/technical-spec.md
- Tests Specification: @.agent-os/specs/2025-09-04-cms-global-config/sub-specs/tests.md

