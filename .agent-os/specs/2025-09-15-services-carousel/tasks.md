# Spec Tasks

## Tasks

- [x] 1. Modificar esquema de Sanity para agregar campo título al carrusel de servicios
  - [x] 1.1 Escribir tests para validación del nuevo campo título
  - [x] 1.2 Agregar campo `title` al esquema `serviceCarousel` en `blockServiceCarousel.ts`
  - [x] 1.3 Actualizar función de preview para mostrar título
  - [x] 1.4 Crear script de migración para carruseles existentes
  - [x] 1.5 Verificar que todos los tests pasan

- [x] 2. Crear componente WideCard para servicios
  - [x] 2.1 Escribir tests para componente WideCard
  - [x] 2.2 Crear archivo `WideCard.astro` en `web/src/components/cards/`
  - [x] 2.3 Implementar diseño horizontal con imagen y contenido
  - [x] 2.4 Añadir estilos responsivos con TailwindCSS
  - [x] 2.5 Implementar soporte para enlaces externos
  - [x] 2.6 Verificar que todos los tests pasan

- [x] 3. Implementar carrusel avanzado con Motion.dev
  - [x] 3.1 Escribir tests para funcionalidad del carrusel
  - [x] 3.2 Refactorizar `ServiceCarousel.astro` para nuevo diseño
  - [x] 3.3 Implementar layout con primer elemento alineado a la izquierda (3/4 ancho)
  - [x] 3.4 Integrar Motion.dev para animaciones suaves
  - [x] 3.5 Ocultar scrollbar lateral manteniendo funcionalidad
  - [x] 3.6 Verificar que todos los tests pasan

- [ ] 4. Implementar controles de navegación accesibles
  - [ ] 4.1 Escribir tests para controles de navegación
  - [ ] 4.2 Crear componentes de flechas izquierda/derecha con Lucide
  - [ ] 4.3 Posicionar controles en esquina inferior derecha
  - [ ] 4.4 Implementar navegación por teclado (arrow keys)
  - [ ] 4.5 Añadir ARIA labels y estados focus/hover
  - [ ] 4.6 Verificar que todos los tests pasan

- [x] 5. Implementar paginación visual con puntos indicadores
  - [x] 5.1 Escribir tests para paginación visual
  - [x] 5.2 Crear componente de puntos indicadores
  - [x] 5.3 Posicionar paginación en esquina inferior izquierda
  - [x] 5.4 Implementar estados activo/inactivo con transiciones
  - [x] 5.5 Sincronizar paginación con navegación del carrusel
  - [x] 5.6 Verificar que todos los tests pasan

- [x] 6. Optimizar diseño responsive y performance
  - [x] 6.1 Escribir tests para responsive design
  - [x] 6.2 Implementar breakpoints para mobile, tablet y desktop
  - [x] 6.3 Añadir lazy loading para imágenes de servicios
  - [x] 6.4 Implementar debounce en controles de navegación
  - [x] 6.5 Optimizar animaciones para 60fps
  - [x] 6.6 Corregir layout para que esté dentro de la grilla central
  - [x] 6.7 Verificar que todos los tests pasan
