# Especificación Técnica: Arreglo de Visualización en Bloque de Contenido

## Análisis del Código Actual

### ResponsiveImage.astro
```astro
<img 
  src={imageUrls.tablet} 
  alt={imageAlt}
  title={imageTitle}
  class={className || "w-full h-auto object-cover"}
  loading="lazy"
  decoding="async"
  sizes={sizes}
  style={aspectRatio !== 'auto' ? `aspect-ratio: ${aspectRatio};` : ''}
/>
```

**Problemas identificados**:
- `object-cover` deforma las imágenes al forzar el relleno del contenedor
- `aspect-ratio` fijo no se adapta a la proporción real de la imagen
- No hay control de altura máxima

### BlockContentSection.astro
```astro
{image && content ? (
  <div class={`flex flex-col ${imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-start`}>
    <div class={`${textWidthClass} ${columnsClass}`}>
      <BlockContent content={content} />
    </div>
    <div class={`${imageWidthClass} flex-shrink-0`}>
      <ResponsiveImage 
        image={image} 
        alt={imageAlt || ''} 
        class="rounded-lg shadow-lg"
      />
    </div>
  </div>
) : ...}
```

**Problemas identificados**:
- Título centrado independientemente de la presencia de imagen
- Imagen no ocupa altura completa del contenido
- Falta alineación vertical entre elementos

## Solución Técnica Propuesta

### 1. Modificación de ResponsiveImage.astro

```astro
<img 
  src={imageUrls.tablet} 
  alt={imageAlt}
  title={imageTitle}
  class={className || "w-full h-auto object-contain object-center"}
  loading="lazy"
  decoding="async"
  sizes={sizes}
  style="max-height: 500px; aspect-ratio: auto;"
/>
```

**Cambios**:
- `object-cover` → `object-contain`: Mantiene proporción original
- Añadir `object-center`: Centra la imagen
- `aspect-ratio: auto`: Respeta proporción natural
- `max-height: 500px`: Evita imágenes excesivamente altas

### 2. Refactorización de BlockContentSection.astro

```astro
{image && content ? (
  <div class={`flex flex-col ${imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-stretch`}>
    <div class={`${textWidthClass} ${columnsClass} flex flex-col justify-start`}>
      {title && (
        <Tag class="text-3xl font-bold text-gray-900 mb-4 text-left">{title}</Tag>
      )}
      <BlockContent content={content} />
    </div>
    <div class={`${imageWidthClass} flex-shrink-0 h-full min-h-[300px]`}>
      <ResponsiveImage 
        image={image} 
        alt={imageAlt || ''} 
        class="w-full h-full object-cover object-center rounded-lg shadow-lg"
      />
    </div>
  </div>
) : title ? (
  <div class="text-center">
    <Tag class="text-3xl font-bold text-gray-900 mb-4">{title}</Tag>
  </div>
) : null}
```

**Cambios**:
- `items-start` → `items-stretch`: Permite que la imagen ocupe altura completa
- Título movido dentro del contenedor de texto
- `text-left` para alineación del título con el contenido
- `h-full min-h-[300px]` para altura dinámica de imagen
- `object-cover` con `object-center` para altura completa manteniendo proporción

### 3. Clases de TailwindCSS Utilizadas

**ResponsiveImage**:
- `w-full h-auto`: Ancho completo, altura automática
- `object-contain object-center`: Mantiene proporción y centra
- `max-h-[500px]`: Altura máxima

**BlockContentSection**:
- `flex flex-col lg:flex-row`: Layout responsive
- `items-stretch`: Estira elementos a altura completa
- `h-full min-h-[300px]`: Altura dinámica con mínimo
- `flex-shrink-0`: Evita compresión de imagen
- `text-left`: Alineación del título

## Consideraciones de Performance

### Optimización de Imágenes
- Mantener el sistema de `srcset` existente
- Usar `loading="lazy"` para imágenes fuera del viewport
- Preservar `decoding="async"` para no bloquear renderizado

### CSS
- Usar clases de TailwindCSS para mejor performance
- Evitar CSS inline cuando sea posible
- Mantener especificidad baja

## Compatibilidad

### Navegadores
- Chrome 88+
- Firefox 87+
- Safari 14+
- Edge 88+

### Dispositivos
- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## Testing

### Casos de Prueba
1. **Imagen vertical (portrait)**: Debe mantener proporción sin deformación
2. **Imagen horizontal (landscape)**: Debe ajustarse al ancho disponible
3. **Imagen cuadrada**: Debe mantener forma cuadrada
4. **Contenido corto**: Imagen debe tener altura mínima
5. **Contenido largo**: Imagen debe estirarse a altura completa
6. **Sin imagen**: Título debe estar centrado
7. **Con imagen**: Título debe estar alineado a la izquierda

### Breakpoints
- `sm` (640px): Layout vertical
- `md` (768px): Layout similar a desktop
- `lg` (1024px): Layout horizontal completo

## Migración

### Archivos Afectados
1. `web/src/components/ResponsiveImage.astro`
2. `web/src/components/blocks/BlockContentSection.astro`

### Backward Compatibility
- Mantener props existentes
- No cambiar API pública
- Preservar funcionalidad existente

### Rollback Plan
- Git revert de cambios
- Restaurar versiones anteriores
- Testing de regresión
