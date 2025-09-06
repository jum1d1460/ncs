### Especificación técnica

#### CMS (Sanity)
- Archivos: `cms/schemaTypes/service.ts`, `cms/schemaTypes/blockService.ts`, `cms/schemaTypes/blockServiceCarousel.ts`, registro en `cms/schemaTypes/index.ts`.
- Validaciones condicionales con `validation` y `hidden` basados en `parent`.
- Previews: subtítulo con precio o "A consultar".

#### Web (Astro)
- Componentes: `web/src/components/blocks/Service.astro`, `web/src/components/blocks/ServiceCarousel.astro`.
- Integración: `web/src/components/PageRenderer.astro` mapea `serviceBlock` y `serviceCarousel`.
- Estilos: Tailwind; carrusel con `scroll-snap` y overflow-x.

#### Datos
- Queries GROQ para servicios: seleccionar campos mínimos necesarios por variante.
- Mantener configuración en `.env` y cliente en `web/src/lib/sanityClient.ts`.


