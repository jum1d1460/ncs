### Especificación técnica

#### CMS (Sanity)
- Extender/usar `cms/schemaTypes/globalSettings.ts` para incluir campos:
  - `brand.logo` (image con `alt`),
  - `navMain[]` (array de `{label, url}`),
  - `contact.phone`, `contact.whatsapp`, `contact.email`,
  - `bookingUrl`,
  - `seoFooterText` (text o `blockContent` simplificado),
  - `legalLinks[]` (array `{label, url}`),
  - `socialLinks[]` (array `{network: enum, url}`) con opciones comunes (Instagram, Facebook, X, LinkedIn, YouTube).

#### Web (Astro)
- Crear `web/src/components/Header.astro` y `web/src/components/Footer.astro` con Tailwind.
- `web/src/layouts/Layout.astro` ya obtiene `settings`; pasar props a Header/Footer.
- Responsive: colapsar nav en mobile (botón toggle). CTAs como enlaces `tel:` y `https://wa.me/` y `bookingUrl`.

#### Datos (GROQ)
- Reutilizar `fetchGlobalSettings` en `web/src/lib/sanityClient.ts`; ampliar selección de campos a los listados.
- Tipado opcional en `web` para `GlobalSettings` si existe.


