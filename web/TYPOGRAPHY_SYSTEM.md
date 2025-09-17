# Sistema de Tipografía Responsiva

## Descripción

Se ha implementado un sistema de tipografía responsiva general que permite que todos los componentes del sitio web tengan un comportamiento consistente en diferentes tamaños de pantalla, similar al que ya existía en el Hero Banner.

## Características

### 1. Clases de Tipografía Responsiva

El sistema incluye las siguientes clases que se adaptan automáticamente entre móvil y desktop:

- `.text-responsive-h1` - Títulos principales (32px móvil → 48px desktop)
- `.text-responsive-h2` - Títulos secundarios (28px móvil → 40px desktop)  
- `.text-responsive-h3` - Títulos terciarios (24px móvil → 32px desktop)
- `.text-responsive-h4` - Títulos cuaternarios (20px móvil → 24px desktop)
- `.text-responsive-body-large` - Texto grande (16px móvil → 18px desktop)
- `.text-responsive-body` - Texto normal (14px móvil → 16px desktop)
- `.text-responsive-small` - Texto pequeño (12px móvil → 14px desktop)

### 2. Configuración en TailwindCSS

Se han añadido tamaños de fuente personalizados en `tailwind.config.js`:

```javascript
fontSize: {
  'heading-1': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
  'heading-1-mobile': ['2rem', { lineHeight: '1.1', fontWeight: '800' }],
  // ... más configuraciones
}
```

### 3. Implementación en CSS

Las clases responsivas están definidas en `src/styles/global.css`:

```css
.text-responsive-h1 {
  @apply text-heading-1-mobile sm:text-heading-1;
}
```

## Componentes Actualizados

Los siguientes componentes han sido actualizados para usar el nuevo sistema:

- ✅ `Hero.astro` - Actualizado para usar el sistema general
- ✅ `BlockContentSection.astro` - Títulos de sección
- ✅ `ContactCTA.astro` - Formularios y etiquetas
- ✅ `BlogPosts.astro` - Títulos de artículos y fechas
- ✅ `ServiceCarousel.astro` - Texto de información
- ✅ `Service.astro` - Títulos y descripciones de servicios
- ✅ `QuoteBlock.astro` - Citas y metadatos
- ✅ `ImageWithLayout.astro` - Captiones de imágenes
- ✅ `Testimonials.astro` - Citas y nombres
- ✅ `Logos.astro` - Títulos de sección

## Beneficios

1. **Consistencia**: Todos los componentes ahora tienen un comportamiento de tipografía consistente
2. **Mantenibilidad**: Un solo lugar para gestionar los tamaños de fuente responsivos
3. **Escalabilidad**: Fácil añadir nuevos tamaños o modificar existentes
4. **Mobile-first**: Diseño optimizado para móviles con mejoras progresivas en desktop

## Uso

Para usar el sistema en nuevos componentes, simplemente aplica las clases correspondientes:

```html
<h1 class="text-responsive-h1">Título Principal</h1>
<h2 class="text-responsive-h2">Título Secundario</h2>
<p class="text-responsive-body">Texto normal</p>
<span class="text-responsive-small">Texto pequeño</span>
```

## Breakpoints

El sistema utiliza el breakpoint `sm:` (640px) de TailwindCSS para la transición entre móvil y desktop.
