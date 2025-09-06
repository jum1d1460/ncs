# Product Roadmap

## Phase 1: Core MVP

**Goal:** Sentar la base del sitio y del CMS con contenido global y estructura.
**Success Criteria:** Sitio build SSG exitoso con header/footer, páginas principales y módulos iniciales.

### Features
- [x] Config global del sitio en CMS (metadatos, favicon) `[S]`
- [x] Definir el documento con la arquitectura principal de páginas y secciones `[S]`
- [ ] Definir módulos/bloques para páginas (Hero, Text, CTA, FAQ, Services) `[M]`
- [ ] Implementar cabecera (header) en web con navegación `[S]`
- [ ] Implementar footer en web `[S]`
- [x] Montar páginas base: inicio, servicios, acerca, contacto `[M]`
- [x] Renderizado dinámico desde Sanity (PageRenderer) `[M]`

### Dependencies
- Sanity Studio operativo
- TailwindCSS configurado

## Phase 2: Conversión y Contenido

**Goal:** Mejorar SEO local y conversión con contenidos y pruebas sociales.
**Success Criteria:** Páginas optimizadas con metadatos, testimonios y formularios funcionales.

### Features
- [ ] SEO local: metadatos, schema, Open Graph, sitemap `[S]`
- [x] Testimonios/casos con evidencia y métricas `[S]`
- [ ] Formularios de contacto con validación y envío `[S]`
- [ ] Páginas de servicios detalladas (clínica, TDAH, forense) `[M]`
- [ ] Contenidos base de blog/noticias (opcional) `[M]`

### Dependencies
- Config global de SEO

## Phase 3: Escala y Pulido

**Goal:** Medición, rendimiento, accesibilidad y despliegue sólido.
**Success Criteria:** Métricas activas, AA de accesibilidad, >90 Lighthouse en performance.

### Features
- [ ] Analytics y eventos clave `[S]`
- [ ] A/B testing básico de hero/CTA `[M]`
- [ ] Accesibilidad (aria, contraste, foco) `[S]`
- [ ] Optimización rendimiento (imágenes, prefetch, lazy) `[S]`
- [ ] CI/CD GitHub Actions a Cloudflare Pages `[S]`

### Dependencies
- Cuenta Cloudflare y secretos en repositorio
