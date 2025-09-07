# Bloques avanzados de contenido (Sanity + Astro)

## Objetivo
Potenciar `blockContent` con:
- Imagen con layout (izquierda/derecha/centro, 50%/100%).
- Texto en 2 o 3 columnas.
- Imagen divisoria de sección (`blockImage`) contenida o a sangre.
- Bloque de cita (`quoteBlock`) con meta.

## Alcance
- CMS (Sanity): nuevos tipos y validaciones, previews.
- Web (Astro): render mobile-first con Tailwind, SSG.

## Detalles técnicos
- Nuevos tipos Sanity: `imageWithLayout`, `columns`, `blockImage`, `quoteBlock`.
- Integración en `cms/schemaTypes/blockContent.ts` y export en `cms/schemaTypes/index.ts`.
- Astro: ampliar `web/src/components/PageRenderer.astro` y crear componentes.
- Accesibilidad: `alt` requerido, semántica `<blockquote>` y `<footer>`.
- Rendimiento: `ResponsiveImage.astro`, `loading="lazy"`.

## Criterios de aceptación
- Los 4 tipos se pueden crear/validar en Studio.
- Render correcto en web, incluyendo full-bleed para `blockImage`.
- Sin regresiones de Lighthouse básicas.

## Sincronización de progreso
- Actualizar `.agent-os/specs/**/tasks.md` con checkboxes.
- Actualizar `.agent-os/product/roadmap.md` con el ítem relacionado.


