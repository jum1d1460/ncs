### Especificación técnica

#### CMS (Sanity)
- Archivos: `cms/schemaTypes/blockTestimonials.ts`, `cms/schemaTypes/blockLogos.ts` y registro en `cms/schemaTypes/index.ts`.
- `testimonialsBlock.items[]`: objeto con `image` (hotspot, `alt` requerido), `quote` (string, max 280), `fullName` (string, req).
- `logosBlock`: `title` (string, req, max 120), `logos[]` de `image` (hotspot, `alt` req).
- Previews: para testimonios mostrar primera cita y recuento; para logotipos mostrar título y número de logos.
- Habilitar ambos bloques en el arreglo modular de `page` junto con el resto de bloques.

#### Web (Astro)
- Componentes: `web/src/components/blocks/Testimonials.astro`, `web/src/components/blocks/Logos.astro`.
- Integración: `PageRenderer.astro` mapea `testimonialsBlock` y `logosBlock`.
- Estilos: Tailwind; grids responsivos (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3` para testimonios; logos con `max-h` y `object-contain`).

#### Datos
- GROQ: seleccionar campos mínimos necesarios para ambos bloques, evitando traer campos no usados.
- Mantener cliente Sanity en `web/src/lib/sanityClient.ts` y configuración en `.env`.


