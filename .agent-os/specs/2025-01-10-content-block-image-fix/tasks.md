# Tareas: Arreglo de Visualización en Bloque de Contenido

## Fase 1: Corrección de Proporción de Imágenes
- [ ] Modificar `ResponsiveImage.astro` para usar `object-contain` en lugar de `object-cover`
- [ ] Añadir `max-height: 500px` para evitar imágenes demasiado altas
- [ ] Implementar `aspect-ratio: auto` para mantener proporción original
- [ ] Añadir `object-position: center` para centrar la imagen
- [ ] Probar con imágenes verticales (portrait)
- [ ] Probar con imágenes horizontales (landscape)
- [ ] Probar con imágenes cuadradas

## Fase 2: Reestructuración del Layout
- [ ] Refactorizar `BlockContentSection.astro` para separar layouts con y sin imagen
- [ ] Mover el título dentro del contenedor de texto cuando hay imagen
- [ ] Eliminar el centrado del título en layout de columnas
- [ ] Mantener el centrado del título solo cuando no hay imagen
- [ ] Implementar lógica condicional para diferentes layouts
- [ ] Ajustar clases de TailwindCSS para el nuevo layout

## Fase 3: Altura Dinámica de Imagen
- [ ] Implementar contenedor de imagen con `h-full`
- [ ] Añadir `min-height: 300px` para altura mínima
- [ ] Usar `flex-shrink-0` para evitar compresión de imagen
- [ ] Cambiar a `object-cover` con `object-position: center` para altura completa
- [ ] Ajustar `aspect-ratio` dinámico basado en contenido
- [ ] Probar con contenido de diferentes alturas

## Fase 4: Testing y Refinamiento
- [ ] Probar layout con imagen a la izquierda
- [ ] Probar layout con imagen a la derecha
- [ ] Verificar responsive design en breakpoint `sm` (640px)
- [ ] Verificar responsive design en breakpoint `md` (768px)
- [ ] Verificar responsive design en breakpoint `lg` (1024px)
- [ ] Probar con diferentes anchos de imagen (25%, 33%, 50%)
- [ ] Probar con diferentes números de columnas de texto (1, 2, 3)
- [ ] Ajustar espaciados y alineaciones finales
- [ ] Verificar accesibilidad y contraste

## Criterios de Aceptación
- [ ] Las imágenes mantienen su proporción original sin deformación
- [ ] El título se alinea correctamente con el contenido cuando hay imagen
- [ ] La imagen ocupa toda la altura disponible del bloque
- [ ] El layout es responsive en todos los breakpoints
- [ ] Imágenes se ven nítidas y bien proporcionadas
- [ ] Alineación consistente entre elementos
- [ ] Espaciado uniforme y armonioso
- [ ] Transiciones suaves entre breakpoints
- [ ] Código limpio y mantenible
- [ ] Performance optimizada
