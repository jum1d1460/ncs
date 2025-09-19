# Componente SEO

## Descripción

El componente SEO es un componente reutilizable que centraliza la gestión de metadatos SEO para todas las páginas y artículos del blog. Permite configurar metadatos específicos por página mientras mantiene una configuración global por defecto.

## Características

- ✅ **Reutilizable**: Se puede usar en cualquier página o artículo
- ✅ **Configuración global**: Usa configuración por defecto del sitio
- ✅ **Personalizable**: Permite sobrescribir metadatos específicos por página
- ✅ **Footer integrado**: Incluye título y descripción del footer
- ✅ **Open Graph**: Metadatos para redes sociales
- ✅ **Twitter Card**: Metadatos para Twitter
- ✅ **JSON-LD**: Datos estructurados para motores de búsqueda
- ✅ **Fallbacks**: Valores por defecto si no se proporcionan

## Estructura de Archivos

```
web/src/
├── components/
│   ├── SEO.astro              # Componente principal
│   └── SEOExample.astro       # Ejemplos de uso
├── lib/
│   └── seo.ts                 # Utilidades y tipos
└── layouts/
    └── Layout.astro           # Layout actualizado
```

## Uso Básico

### Página con SEO básico (usa configuración global)

```astro
---
import Layout from '../layouts/Layout.astro';
import { fetchGlobalSettings } from '../lib/sanityClient';

const settings = await fetchGlobalSettings();
---

<Layout globalSettings={settings}>
  <h1>Mi Página</h1>
  <p>Contenido de la página</p>
</Layout>
```

### Página con SEO personalizado

```astro
---
import Layout from '../layouts/Layout.astro';
import { fetchGlobalSettings } from '../lib/sanityClient';

const settings = await fetchGlobalSettings();
---

<Layout 
  title="Mi Título Personalizado"
  description="Descripción específica para esta página"
  ogImageUrl="https://ejemplo.com/imagen.jpg"
  globalSettings={settings}
>
  <h1>Mi Página</h1>
  <p>Contenido de la página</p>
</Layout>
```

### Página con footer personalizado

```astro
---
import Layout from '../layouts/Layout.astro';
import { fetchGlobalSettings } from '../lib/sanityClient';

const settings = await fetchGlobalSettings();
---

<Layout 
  title="Mi Página"
  footerTitle="Mi Título de Footer"
  seoFooterText="Texto SEO del footer personalizado"
  globalSettings={settings}
>
  <h1>Mi Página</h1>
  <p>Contenido de la página</p>
</Layout>
```

## Propiedades del Componente

### Propiedades de la página (opcionales)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `title` | `string` | Título específico de la página |
| `description` | `string` | Descripción específica de la página |
| `ogImageUrl` | `string \| null` | URL de imagen para Open Graph |
| `siteTitle` | `string` | Título del sitio (sobrescribe el global) |
| `siteDescription` | `string` | Descripción del sitio (sobrescribe la global) |
| `faviconUrl` | `string \| null` | URL del favicon (sobrescribe el global) |
| `footerTitle` | `string` | Título del footer (sobrescribe el global) |
| `seoFooterText` | `string` | Texto SEO del footer (sobrescribe el global) |

### Propiedades globales (obligatorias)

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `globalSettings` | `GlobalSettings` | Configuración global del sitio desde Sanity |

## Configuración Global

La configuración global se obtiene desde Sanity y incluye:

- `siteTitle`: Título por defecto del sitio
- `siteDescription`: Descripción por defecto del sitio
- `favicon`: Favicon del sitio
- `ogImage`: Imagen por defecto para Open Graph
- `footerTitle`: Título por defecto del footer
- `seoFooterText`: Texto SEO por defecto del footer
- `defaultMeta`: Metadatos adicionales (sufijo de título, etc.)

## Metadatos Generados

El componente genera automáticamente:

### Metadatos básicos
- `<title>`: Título de la página
- `<meta name="description">`: Descripción de la página
- `<meta name="keywords">`: Palabras clave
- `<meta name="author">`: Autor
- `<meta name="robots">`: Instrucciones para robots

### Open Graph
- `<meta property="og:title">`: Título para redes sociales
- `<meta property="og:description">`: Descripción para redes sociales
- `<meta property="og:type">`: Tipo de contenido
- `<meta property="og:url">`: URL de la página
- `<meta property="og:image">`: Imagen para redes sociales

### Twitter Card
- `<meta name="twitter:card">`: Tipo de tarjeta
- `<meta name="twitter:title">`: Título para Twitter
- `<meta name="twitter:description">`: Descripción para Twitter
- `<meta name="twitter:image">`: Imagen para Twitter

### Datos estructurados
- JSON-LD con información del autor y contacto

### Metadatos del footer
- `<meta name="footer-title">`: Título del footer
- `<meta name="seo-footer-text">`: Texto SEO del footer

## Jerarquía de Valores

Los valores se resuelven en el siguiente orden:

1. **Propiedad específica de la página** (ej: `title`)
2. **Propiedad específica del sitio** (ej: `siteTitle`)
3. **Configuración global** (ej: `globalSettings.siteTitle`)
4. **Valor por defecto** (ej: "NCS Psicóloga Zaragoza")

## Migración

### Antes (Layout.astro antiguo)

```astro
---
const layoutProps = buildLayoutProps(page, settings);
---

<Layout {...layoutProps}>
  <slot />
</Layout>
```

### Después (Layout.astro nuevo)

```astro
---
const settings = await fetchGlobalSettings();
---

<Layout 
  title={page?.title}
  globalSettings={settings}
>
  <slot />
</Layout>
```

## Ventajas

1. **Centralización**: Todos los metadatos SEO en un solo lugar
2. **Consistencia**: Configuración uniforme en todo el sitio
3. **Flexibilidad**: Permite personalización por página
4. **Mantenibilidad**: Fácil de actualizar y modificar
5. **SEO optimizado**: Incluye todos los metadatos necesarios
6. **Footer integrado**: Título y descripción del footer incluidos

## Notas Importantes

- El componente SEO es obligatorio en todas las páginas
- La configuración global (`globalSettings`) es obligatoria
- Las propiedades específicas de la página son opcionales
- Los valores por defecto se aplican automáticamente si no se proporcionan
- El componente maneja automáticamente la concatenación del sufijo del título si está configurado
