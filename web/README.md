# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run test`            | Ejecuta la suite de tests (Vitest)               |

## 🔐 Entorno (.env)

Crea un archivo `.env` en `web/` con estas variables (no commit):

```
PUBLIC_SANITY_PROJECT_ID=tu_project_id
PUBLIC_SANITY_DATASET=production
# Opcional, debe coincidir con el cliente en `src/lib/sanityClient.ts`
PUBLIC_SANITY_API_VERSION=2024-03-18
```

Notas:
- Las variables `PUBLIC_*` son accesibles en cliente con Astro.
- No hardcodees credenciales en código; usa `.env` local y secretos en CI/CD.
- También puedes copiar `web/.env.example` como base: `cp .env.example .env`.

## 🧪 Tests

- Las pruebas se ejecutan con Vitest: `npm run test`
- Cobertura actual:
  - `src/lib/sanityClient.ts` (fetch + fallbacks)
  - `src/lib/head.ts` (`buildHeadMeta` y `buildLayoutProps`)

## 🧩 Servicios y Bloques (NCS)
## 🧭 Cabecera y Footer (Layout)

### Configuración desde CMS (`globalSettings`)
- `brand.logo{asset{url}, alt}`
- `navMain[]: {label, url}`
- `contact: {phone, whatsapp, email}`
- `bookingUrl: string`
- `seoFooterText: string`
- `legalLinks[]: {label, url}`
- `socialLinks[]: {type, url}`

### Componentes
- `src/components/Header.astro`: logo + nav + CTAs (tel, WhatsApp, reservar).
- `src/components/Footer.astro`: texto SEO, nav, legales, redes y contacto.
- `src/layouts/Layout.astro`: integra header/footer y recibe `settings` vía `buildLayoutProps`.


### Componentes
- `src/components/blocks/Service.astro`: renderiza un servicio en variantes `card` y `detailed` con Tailwind.
- `src/components/blocks/ServiceCarousel.astro`: carrusel horizontal con `scroll-snap` y tarjetas `Service`.
- `src/components/blocks/Testimonials.astro`: grid de testimonios (imagen, cita y nombre y apellidos).
- `src/components/blocks/Logos.astro`: grid de logotipos con tamaños consistentes.
- `src/components/PageRenderer.astro`: mapea `_type` de bloques (`blockHero`, `blockText`, `serviceBlock`, `serviceCarousel`, `blockTestimonials`, `blockLogos`, `imageWithLayout`, `columns`, `blockImage`, `quoteBlock`).

### Bloques avanzados de contenido (render)
- `ImageWithLayout.astro`: layout izquierda/derecha/centro; usa `ResponsiveImage`. Respeta `width` y `marginY`.
- `Columns.astro`: grid responsivo de 2/3 columnas.
- `BlockImage.astro`: variante `contained` o `fullBleed` (a sangre). `overlayOpacity` opcional.
- `QuoteBlock.astro`: `<blockquote>` con `footer` para `meta`, alineación izquierda/centrada.

### Datos (GROQ)
Las páginas (`/` e internas `[slug].astro`) consultan GROQ para hidratar los bloques:
- `serviceBlock`: resuelve `service->` con campos `title, durationMinutes, priceType, price, shortDescription, longDescription, cardImage{asset}, blockImage{asset}` y props `variant`, `showPrice`.
- `serviceCarousel`: resuelve `items[]->` con el mismo conjunto de campos, y props `autoplay`, `intervalMs`, `showPrice`.
- `blockTestimonials`: no requiere refs; cada item incluye `image{asset, alt}`, `quote`, `fullName`.
- `blockLogos`: incluye `title` y `logos[]{asset, alt}`.

### Variables de entorno
- `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET`, `PUBLIC_SANITY_API_VERSION` usadas en `src/lib/sanityClient.ts`.

## ✅ QA Web
Checklist rápida:
1. `Service (card)`: muestra imagen, título, duración y precio/"A consultar" según `priceType`.
2. `Service (detailed)`: grid 1/2 en `md+`, imagen 16:9, texto largo como párrafos simples.
3. `ServiceCarousel`: contenedor horizontal con `snap-x` y tarjetas con `auto-cols` responsivo.
4. Responsive: `sm`, `md`, `lg` mantienen legibilidad y espaciados.
5. Lighthouse (local): Performance/Best Practices/SEO > 90 con imágenes optimizadas (usa `ResponsiveImage`).

Notas:
- Diseño mobile-first con Tailwind (`w-full`, `grid`, `gap`, `text-*`).
- No se renderizan rutas de demo/test en producción por regla de build.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
