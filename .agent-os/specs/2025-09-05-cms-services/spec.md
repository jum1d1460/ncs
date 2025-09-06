### Especificación: Contenido "Servicio" y bloques asociados (CMS + Web)

#### Objetivo
Crear el tipo de contenido `service` en Sanity (CMS) y dos bloques reusables:
- `serviceBlock`: pieza que referencia un `service` y se inserta en páginas.
- `serviceCarousel`: carrusel que referencia múltiples `service`.

Impacta `cms/` (esquemas, validaciones, previews) y `web/` (render en Astro con Tailwind, mapeo en `PageRenderer.astro`).

#### Alcance
- Documento `service` con campos: título, duración (min), tipo de precio (fijo | a consultar), precio (si fijo), descripción corta, descripción larga (portable text), imagen card, imagen bloque, slug.
- Bloque `serviceBlock` con: referencia a servicio, variante (`card` | `detailed`), `showPrice`.
- Bloque `serviceCarousel` con: array de referencias a servicios, `autoplay`, `intervalMs`, `showPrice`.
- Registro en `schemaTypes/index.ts` y habilitar ambos bloques en el contenido modular de `page`.
- Render en `web`: componentes `Service.astro` y `ServiceCarousel.astro`, integrados en `PageRenderer.astro`.

#### Requisitos funcionales
- Crear, editar y validar servicios desde Sanity Studio.
- Insertar bloques `serviceBlock` y `serviceCarousel` en páginas.
- Mostrar precio como "X €" o "A consultar" según `priceType`.
- Carrusel usable sin JS (scroll-snap); si se activa `autoplay`, respetar `intervalMs` progresivamente.

#### Requisitos no funcionales
- SSG en `web` y estilos con Tailwind.
- Accesibilidad básica: `alt` requerido en imágenes, controles accesibles.
- Configuración Sanity vía `.env`, sin hardcodear.

#### Modelo de datos (resumen)
- `service` (document): `title` (req), `slug`, `durationMinutes` (req, int>0), `priceType` (req: `fixed|consult`), `price` (req si `fixed`), `shortDescription` (req, <200), `longDescription` (req), `cardImage` (req+alt), `blockImage` (req+alt). Preview: título + precio/consultar.
- `serviceBlock` (object): `service` (ref req), `variant` (`card|detailed`, default `card`), `showPrice` (bool true). Preview: título servicio + variante.
- `serviceCarousel` (object): `items` (refs req min 1), `autoplay` (bool), `intervalMs` (num>0 si autoplay), `showPrice` (bool). Preview: "N elementos".

#### Validaciones clave
- Condicionales: `price` requerido si `priceType=fixed`; oculto y prohibido si `consult`.
- Longitudes y enteros positivos donde aplica; `alt` requerido en imágenes.

#### Render (web)
- `Service.astro`: variante `card` (usa `cardImage`, `shortDescription`) y `detailed` (usa `blockImage`, `longDescription`). Muestra duración y precio/"A consultar" según `showPrice`.
- `ServiceCarousel.astro`: lista horizontal con scroll-snap, controles prev/next, y soporte opcional de autoplay.
- `PageRenderer.astro`: mapear tipos `serviceBlock` y `serviceCarousel`.

#### Sincronización de progreso
- Fuente de verdad: checkboxes en `@.agent-os/specs/2025-09-05-cms-services/tasks.md` y `@.agent-os/product/roadmap.md`.
- Actualizar ambos al completar tareas.


