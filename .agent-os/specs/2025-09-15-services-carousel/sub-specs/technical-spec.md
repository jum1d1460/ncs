# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-15-services-carousel/spec.md

## Technical Requirements

### Sanity Schema Modifications
- Agregar campo `title` de tipo `string` al esquema `serviceCarousel` en `cms/schemaTypes/blockServiceCarousel.ts`
- Mantener compatibilidad con campos existentes: `items`, `autoplay`, `intervalMs`, `showPrice`
- Validación requerida para el campo título

### Componente WideCard
- Crear nuevo componente `WideCard.astro` en `web/src/components/cards/`
- Diseño específico para mostrar servicios en formato horizontal
- Estructura: imagen + contenido (título, descripción, precio, duración)
- Estilos responsivos con TailwindCSS
- Soporte para enlaces externos

### Carrusel Implementation
- Reemplazar implementación actual de `ServiceCarousel.astro`
- Usar Motion.dev para animaciones suaves entre transiciones
- Layout específico: primer elemento alineado a izquierda, ocupa 3/4 del ancho
- Indicador visual del siguiente elemento (1/4 visible)
- Ocultación de scrollbar lateral con CSS

### Controles de Navegación
- Flechas izquierda/derecha posicionadas en esquina inferior derecha
- Iconos usando Lucide (ya disponible en el proyecto)
- Estados hover y focus para accesibilidad
- Navegación por teclado (arrow keys)
- ARIA labels para lectores de pantalla

### Paginación Visual
- Puntos indicadores en esquina inferior izquierda
- Punto activo destacado visualmente
- Puntos inactivos en color más tenue
- Transición suave entre estados activos

### Responsive Design
- Breakpoints: mobile (320px+), tablet (768px+), desktop (1024px+)
- Ajuste automático del número de elementos visibles
- Controles siempre accesibles en todos los tamaños
- Paginación adaptativa según cantidad de elementos

### Performance
- Lazy loading de imágenes de servicios
- Debounce en controles de navegación (300ms)
- Optimización de animaciones para 60fps
- Carga progresiva de elementos fuera del viewport

## External Dependencies

- **Motion.dev** - Ya disponible en el proyecto (v12.23.12)
  - **Justification:** Librería de animaciones moderna y ligera, perfecta para transiciones suaves del carrusel
  - **Usage:** Animaciones de transición entre slides, efectos hover en controles

- **Lucide Astro** - Ya disponible en el proyecto (v0.543.0)
  - **Justification:** Iconos consistentes y accesibles para controles de navegación
  - **Usage:** Flechas izquierda/derecha para navegación del carrusel

## Integration Points

### Sanity CMS
- Modificar esquema `serviceCarousel` para incluir campo título
- Mantener estructura de datos existente para `items` (array de referencias a servicios)
- Actualizar preview del bloque para mostrar título

### Astro Components
- Integrar WideCard en ServiceCarousel
- Mantener compatibilidad con props existentes
- Añadir prop `title` al componente ServiceCarousel

### Styling System
- Utilizar TailwindCSS para todos los estilos (ya configurado)
- Seguir sistema de design tokens existente
- Mantener consistencia con otros componentes del proyecto
