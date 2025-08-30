# Componente Hero para Nelly Castro

Este componente Hero ha sido diseñado para replicar el diseño de la imagen de referencia, con un sistema de capas que incluye imagen de fondo, superposición y silueta posicionada.

## Características

- **Sistema de capas**: Imagen de fondo a sangre completa + superposición + silueta posicionada
- **Rejilla central**: El contenido se alinea a una rejilla central de 1200px
- **Responsive**: Adaptable a todos los dispositivos
- **Tipografía Poppins**: Fuente moderna y profesional
- **Integración con Shoelace**: Componentes UI adicionales disponibles
- **Animaciones**: Efectos de entrada suaves y profesionales
- **TailwindCSS**: Estilos completamente basados en TailwindCSS

## Estructura del Schema de Sanity

El componente Hero requiere los siguientes campos en Sanity:

```typescript
{
  mainTitle: string,           // Título principal (ej: "PSICÓLOGA NELLY CASTRO SÁNCHEZ")
  subtitle: string,            // Subtítulo (ej: "Bienvenido a tu espacio de bienestar mental")
  description: string,         // Descripción detallada
  primaryButton: {             // Botón principal
    text: string,
    url: string,
    variant: 'primary' | 'secondary' | 'outline'
  },
  secondaryButton: {           // Botón secundario
    text: string,
    url: string,
    variant: 'primary' | 'secondary' | 'outline'
  },
  backgroundImage: image,      // Imagen de fondo (se extiende a toda la pantalla)
  silhouetteImage: image,     // Imagen de silueta (se posiciona en la rejilla)
  silhouettePosition: 'right' | 'left' | 'center', // Posición de la silueta
  overlayColor: string,        // Color de superposición (opcional)
  overlayOpacity: number       // Opacidad de superposición 0-1 (opcional)
}
```

## Uso del Componente

```astro
---
import Hero from '../components/blocks/Hero.astro';

const heroData = {
  mainTitle: "PSICÓLOGA NELLY CASTRO SÁNCHEZ",
  subtitle: "Bienvenido a tu espacio de bienestar mental",
  description: "Acompañamiento psicológico profesional para ayudarte a superar los desafíos de la vida y alcanzar tu máximo potencial.",
  primaryButton: {
    text: "Agenda tu cita",
    url: "#contacto",
    variant: "primary"
  },
  secondaryButton: {
    text: "Conoce los servicios",
    url: "#servicios",
    variant: "secondary"
  },
  backgroundImage: backgroundImageFromSanity,
  silhouetteImage: silhouetteImageFromSanity,
  silhouettePosition: "right",
  overlayColor: "rgba(30, 58, 138, 0.8)",
  overlayOpacity: 0.8
};
---

<Hero {...heroData} />
```

## Posicionamiento de la Silueta

La silueta se puede posicionar de tres formas:

- **`right`**: Alineada al límite derecho de la rejilla central (por defecto)
- **`left`**: Alineada al límite izquierdo de la rejilla central
- **`center`**: Centrada en la rejilla central

## Sistema de Capas

1. **Capa de fondo** (z-index: 0): Imagen que se extiende a toda la pantalla
2. **Capa de superposición** (z-index: 10): Overlay con color y opacidad configurable
3. **Capa de contenido** (z-index: 20): Texto, botones y silueta

## Responsive

- **Desktop**: Layout de dos columnas con silueta a la derecha
- **Tablet**: Layout de una columna con silueta arriba
- **Mobile**: Botones apilados verticalmente para mejor usabilidad

## Personalización con TailwindCSS

### Colores
Los colores se pueden personalizar editando `tailwind.config.js`:

- **Primary**: Paleta de azules (#0ea5e9, #0284c7, etc.)
- **Secondary**: Paleta de grises (#64748b, #475569, etc.)
- **Overlay**: Gradiente azul oscuro por defecto

### Tipografía
- Fuente principal: Poppins (configurada en Tailwind)
- Tamaños responsivos usando breakpoints de Tailwind
- Pesos de fuente: 300, 400, 500, 600, 700, 800

### Animaciones
- **`animate-fade-in-up`**: Entrada escalonada de elementos de texto
- **`animate-fade-in-up-delayed`**: Entrada retrasada para la silueta
- Hover en botones y silueta con transiciones suaves

### Componentes CSS
Los estilos de botones y elementos del Hero están definidos en `src/styles/global.css` usando `@apply` de Tailwind:

```css
.btn-primary {
  @apply bg-gradient-to-br from-primary-500 to-primary-700 text-white border-none px-8 py-4 rounded-xl font-semibold text-base no-underline inline-block transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 uppercase tracking-wide min-w-[180px] hover:from-primary-600 hover:to-primary-800;
}
```

## Dependencias

- **TailwindCSS**: Framework de CSS utility-first
- **@tailwindcss/typography**: Plugin para tipografía mejorada
- **Shoelace**: Para componentes UI adicionales
- **Poppins**: Fuente de Google Fonts
- **ResponsiveImage**: Componente interno para manejo de imágenes

## Ejemplo de Página de Demo

Se ha creado una página de demostración en `/hero-demo` que muestra el componente funcionando con datos de ejemplo.

## Notas de Implementación

- El componente usa **TailwindCSS** para todos los estilos
- **CSS Grid** para el layout principal con clases de Tailwind
- Las imágenes se manejan a través del componente ResponsiveImage
- Los estilos están organizados en `src/styles/global.css` usando `@apply`
- Las animaciones están definidas en `tailwind.config.js`
- El overlay usa CSS custom properties para máxima flexibilidad
- **Mobile-first** responsive design con breakpoints de Tailwind

## Ventajas de usar TailwindCSS

- **Consistencia**: Sistema de diseño unificado
- **Mantenibilidad**: Fácil de modificar y extender
- **Performance**: Solo se incluyen las clases utilizadas
- **Responsive**: Breakpoints predefinidos y consistentes
- **Componentes**: Uso de `@apply` para crear componentes reutilizables
