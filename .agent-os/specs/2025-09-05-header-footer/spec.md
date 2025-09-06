### Especificación: Cabecera y Footer (Layout principal)

#### Objetivo
Implementar cabecera y footer en el layout principal de la web, con contenido editable desde la configuración global del CMS.

#### Alcance
- Cabecera: logotipo, menú de navegación principal, CTA llamada telefónica, CTA WhatsApp, CTA reservar cita.
- Footer: bloque de texto SEO, menú de navegación principal, acceso de contacto directo, enlaces a textos legales, enlaces a redes sociales.
- Origen de datos: `globalSettings` en Sanity (CMS) para teléfonos, WhatsApp, URL de reserva, redes, navegación y legales.
- Integración: `web/src/layouts/Layout.astro` renderiza `Header` y `Footer`.

#### Requisitos funcionales
- Menú de navegación configurable (lista de items con `label` y `url`).
- CTAs de cabecera leen de `globalSettings`: `phone`, `whatsapp`, `bookingUrl`.
- Footer muestra texto SEO desde `globalSettings.seoFooterText` (portable text simple o string), navegación, enlaces legales y redes.
- Accesibilidad: roles/aria apropiados, foco visible, `aria-label` en CTAs.

#### Requisitos no funcionales
- Mobile-first con TailwindCSS. Diseño responsive.
- SSG en `web`. Sin hardcodear configuración; todo desde `.env` o CMS.

#### Modelo de datos (resumen en CMS)
- `globalSettings`:
  - `brand`: `{ logo (image+alt) }`
  - `navMain[]`: `{ label, url }`
  - `contact`: `{ phone, whatsapp, email }`
  - `bookingUrl`: `string (url)`
  - `seoFooterText`: `text` o `blockContent` simple
  - `legalLinks[]`: `{ label, url }`
  - `socialLinks[]`: `{ network (enum), url }`

#### Render (web)
- `Header.astro`: logo a la izquierda, navegación centrada (colapsable en mobile con menú), CTAs a la derecha (teléfono, WhatsApp, reservar).
- `Footer.astro`: grid con logo/texto SEO, navegación, legales y redes.
- `Layout.astro`: importa y pasa `settings` a `Header` y `Footer`.

#### Sincronización de progreso
- Fuente de verdad: checkboxes en `@.agent-os/specs/2025-09-05-header-footer/tasks.md` y `@.agent-os/product/roadmap.md`.
- Actualizar ambos al completar tareas.


