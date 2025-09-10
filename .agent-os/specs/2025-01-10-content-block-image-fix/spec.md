# Especificación: Arreglo de Visualización en Bloque de Contenido

## Resumen Ejecutivo

Se requiere arreglar los problemas de visualización en el componente `BlockContentSection` para mejorar la experiencia del usuario:

1. **Problema de proporción de imágenes**: Las imágenes se ven deformadas al no respetar su proporción original
2. **Problema de alineación**: El título no está alineado correctamente con la imagen cuando se usa layout de columnas
3. **Problema de altura**: La imagen debe ocupar toda la altura del bloque de contenido

## Contexto del Problema

### Estado Actual
- El componente `BlockContentSection` usa `ResponsiveImage` con `object-cover` que puede deformar las imágenes
- El título se centra independientemente de la posición de la imagen
- No hay alineación vertical entre el contenido de texto y la imagen
- La imagen no se ajusta dinámicamente a la altura del contenido

### Impacto
- Imágenes distorsionadas que afectan la calidad visual
- Layout inconsistente que confunde a los usuarios
- Falta de armonía visual entre elementos

## Especificación Técnica

### 1. Corrección de Proporción de Imágenes

**Objetivo**: Mantener la proporción original de las imágenes sin deformación

**Implementación**:
- Cambiar `object-cover` por `object-contain` en `ResponsiveImage.astro`
- Añadir `object-position: center` para centrar la imagen
- Implementar contenedor con `aspect-ratio` dinámico basado en la imagen original
- Usar `max-height` para evitar que las imágenes sean demasiado altas

**Código de referencia**:
```astro
<img 
  class="w-full h-auto object-contain object-center"
  style="max-height: 500px; aspect-ratio: auto;"
  ...
/>
```

### 2. Alineación de Título con Imagen

**Objetivo**: Alinear el título con el contenido de texto cuando hay imagen en columnas

**Implementación**:
- Mover el título dentro del contenedor de texto cuando hay imagen
- Eliminar el centrado del título cuando se usa layout de columnas
- Mantener el centrado solo cuando no hay imagen

**Estructura propuesta**:
```astro
{image && content ? (
  <div class="flex flex-col lg:flex-row gap-8 items-start">
    <div class="text-content">
      {title && <Tag class="title">{title}</Tag>}
      <BlockContent content={content} />
    </div>
    <div class="image-content">
      <ResponsiveImage ... />
    </div>
  </div>
) : (
  <!-- Layout sin imagen con título centrado -->
)}
```

### 3. Altura Dinámica de Imagen

**Objetivo**: La imagen debe ocupar toda la altura del bloque de contenido

**Implementación**:
- Usar `h-full` en el contenedor de la imagen
- Implementar `min-height` basado en el contenido de texto
- Usar `object-cover` con `object-position: center` para mantener proporción
- Añadir `flex-shrink-0` para evitar que la imagen se comprima

**Código de referencia**:
```astro
<div class="image-container h-full min-h-[300px] flex-shrink-0">
  <ResponsiveImage 
    class="w-full h-full object-cover object-center rounded-lg shadow-lg"
    ...
  />
</div>
```

## Especificación de Diseño

### Layout Responsive

**Desktop (lg+)**:
- Imagen y contenido en columnas horizontales
- Título alineado a la izquierda con el contenido
- Imagen ocupa altura completa del contenido
- Gap de 2rem entre columnas

**Tablet (md)**:
- Layout similar al desktop con ajustes de espaciado
- Imagen mantiene proporción pero con altura mínima

**Mobile (sm)**:
- Layout vertical: imagen arriba, contenido abajo
- Título centrado en móvil
- Imagen con altura fija para mejor UX

### Breakpoints
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px

## Tareas de Implementación

### Fase 1: Corrección de Proporción de Imágenes
- [ ] Modificar `ResponsiveImage.astro` para usar `object-contain`
- [ ] Añadir `max-height` y `aspect-ratio` dinámico
- [ ] Probar con diferentes tipos de imágenes (vertical, horizontal, cuadrada)

### Fase 2: Reestructuración del Layout
- [ ] Refactorizar `BlockContentSection.astro` para separar layouts
- [ ] Mover título dentro del contenedor de texto cuando hay imagen
- [ ] Implementar lógica condicional para centrado del título

### Fase 3: Altura Dinámica de Imagen
- [ ] Implementar contenedor de imagen con altura completa
- [ ] Añadir `min-height` basado en contenido
- [ ] Usar `object-cover` con `object-position` para mantener proporción

### Fase 4: Testing y Refinamiento
- [ ] Probar con diferentes combinaciones de contenido e imagen
- [ ] Verificar responsive design en todos los breakpoints
- [ ] Ajustar espaciados y alineaciones

## Criterios de Aceptación

### Funcionales
- [ ] Las imágenes mantienen su proporción original sin deformación
- [ ] El título se alinea correctamente con el contenido cuando hay imagen
- [ ] La imagen ocupa toda la altura disponible del bloque
- [ ] El layout es responsive en todos los breakpoints

### Visuales
- [ ] Imágenes se ven nítidas y bien proporcionadas
- [ ] Alineación consistente entre elementos
- [ ] Espaciado uniforme y armonioso
- [ ] Transiciones suaves entre breakpoints

### Técnicos
- [ ] Código limpio y mantenible
- [ ] Compatibilidad con TailwindCSS
- [ ] Performance optimizada
- [ ] Accesibilidad mejorada

## Archivos a Modificar

1. `web/src/components/ResponsiveImage.astro`
2. `web/src/components/blocks/BlockContentSection.astro`

## Notas de Implementación

- Usar clases de TailwindCSS existentes cuando sea posible
- Mantener compatibilidad con el sistema de diseño actual
- Considerar casos edge como imágenes muy altas o muy anchas
- Documentar cambios en el código para futuras referencias

## Sincronización de Progreso

El progreso se reflejará en:
- `@.agent-os/specs/2025-01-10-content-block-image-fix/tasks.md` (subtareas con checkboxes)
- `@.agent-os/product/roadmap.md` (ítems impactados)

Usar checkboxes `[ ]` / `[x]` como fuente de verdad y sincronizar al completar tareas.
