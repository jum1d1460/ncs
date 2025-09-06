### Especificación: Bloques "Testimonios" y "Logotipos" (CMS + Web)

#### Objetivo
Crear dos bloques de contenido gestionables desde Sanity y renderizados en la web:
- `testimonialsBlock`: listado de testimonios con imagen, cita y nombre-apellidos.
- `logosBlock`: bloque con título y una colección de logotipos (imágenes).

#### Alcance
- CMS: Definir esquemas, validaciones, previews y registro en `schemaTypes/index.ts`. Habilitarlos en el contenido modular de `page`.
- Web: Implementar componentes `Testimonials.astro` y `Logos.astro` y mapearlos en `PageRenderer.astro`.

#### Requisitos funcionales
- Crear/editar testimonios como elementos embebidos del bloque (no documento aparte) o como array de objetos dentro del bloque.
- Cada testimonio incluye: `image` (con `alt`), `quote` (texto), `fullName` (nombre y apellidos).
- En Logotipos: `title` (texto) y `logos` (array de imágenes con `alt`).

#### Requisitos no funcionales
- SSG en `web` y estilos con Tailwind.
- Accesibilidad: `alt` requerido en todas las imágenes; semántica adecuada (lista/figure/figcaption según corresponda).
- Configuración Sanity vía `.env`, sin hardcodear.

#### Modelo de datos (resumen)
- `testimonialsBlock` (object): `items` (array req, min 1) con `{ image (req+alt), quote (req, <= 280), fullName (req) }`.
- `logosBlock` (object): `title` (req, <= 120), `logos` (array req, min 1) de `{ image (req+alt) }`.

#### Validaciones clave
- `quote` requerido y longitud máxima razonable (p.ej. 280 chars) para mantener diseño.
- `fullName` requerido; `image.alt` requerido en todas las imágenes.
- En `logosBlock`, al menos un logo; título requerido.

#### Render (web)
- `Testimonials.astro`: grid responsiva (mobile-first). Cada item muestra la imagen (redondeada u opcionalmente circle), la cita y el nombre.
- `Logos.astro`: grid de logotipos con tamaño consistente, `alt` visibles para lectores de pantalla.
- `PageRenderer.astro`: mapeo de `testimonialsBlock` y `logosBlock`.

#### Sincronización de progreso
- Fuente de verdad: checkboxes en `@.agent-os/specs/2025-09-05-cms-testimonials-logos/tasks.md` y `@.agent-os/product/roadmap.md`.
- Actualizar ambos al completar tareas.


