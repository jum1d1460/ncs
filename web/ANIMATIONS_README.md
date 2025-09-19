# Sistema de Animaciones con Lenis + Motion.dev

Este proyecto incluye un sistema completo de animaciones y transiciones usando Lenis para scroll suave profesional y Motion.dev para animaciones, diseñado para crear una experiencia de usuario fluida y atractiva.

## 🎬 Características Principales

### 1. Scroll Suave con Lenis
- Scroll fluido y natural con la librería Lenis
- Configuración personalizable de velocidad y suavidad
- Compatible con dispositivos táctiles
- Rendimiento optimizado con hardware acceleration

### 2. Efectos Parallax
- Diferentes velocidades para backgrounds, siluetas y textos
- Optimizado con eventos de Lenis para mejor rendimiento
- Configuración independiente para cada elemento

### 3. Atractores de Scroll
- Los bloques de contenido ejercen "atracción" suave
- Diferentes intensidades de atracción
- Crean una experiencia de scroll más natural

### 4. Transiciones entre Páginas
- Transiciones suaves al navegar
- Efectos de fade in/out
- Indicador de carga durante transiciones

### 5. Animaciones de Entrada
- Múltiples tipos de animación (fadeInUp, fadeInLeft, fadeInRight, scaleIn)
- Animaciones en secuencia (stagger)
- Detección automática de elementos en viewport con Motion.dev inView()

## 🚀 Uso

### Componente AnimatedBlock

```astro
---
import AnimatedBlock from "../components/AnimatedBlock.astro";
---

<AnimatedBlock animation="fadeInUp" delay={0.2} duration={0.6}>
  <div class="mi-contenido">
    <!-- Tu contenido aquí -->
  </div>
</AnimatedBlock>
```

### Tipos de Animación Disponibles

- `fadeInUp`: Aparece desde abajo
- `fadeInLeft`: Aparece desde la izquierda
- `fadeInRight`: Aparece desde la derecha
- `scaleIn`: Aparece con efecto de escala

### Configuración de Parallax

```typescript
// Añadir parallax a un elemento
addParallax(element, speed, offset);

// Ejemplo
addParallax(document.querySelector('.mi-elemento'), 0.5, 0);
```

### Configuración de Atractores

```typescript
// Añadir atractor a un elemento
addAttractor(element, strength, range);

// Ejemplo
addAttractor(document.querySelector('.mi-bloque'), 0.3, 200);
```

## ⚙️ Configuración

### Archivo de Configuración Centralizada

El archivo `src/lib/animations.ts` contiene toda la configuración:

```typescript
export const ANIMATION_CONFIG = {
  smoothScroll: {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1],
    damping: 0.1
  },
  parallax: {
    background: { speed: 0.5, offset: 0 },
    silhouette: { speed: 0.3, offset: 0 },
    text: { speed: 0.1, offset: 0 }
  },
  // ... más configuración
};
```

### Configuración Responsiva

```typescript
export const RESPONSIVE_ANIMATIONS = {
  mobile: {
    parallax: { speed: 0.3 },
    entrance: { duration: 0.4 }
  },
  tablet: {
    parallax: { speed: 0.4 },
    entrance: { duration: 0.5 }
  },
  desktop: {
    parallax: { speed: 0.5 },
    entrance: { duration: 0.6 }
  }
};
```

## 🎯 Página de Demo

Visita `/demo/animaciones` para ver todas las animaciones en acción:

- Animaciones de entrada
- Scroll suave
- Efectos parallax
- Atractores de scroll
- Transiciones de página

## 🔧 Personalización

### Añadir Nuevas Animaciones

1. Edita `src/lib/animations.ts` para añadir nuevos tipos
2. Actualiza `src/lib/motionClient.ts` para implementar la lógica
3. Añade los estilos CSS correspondientes

### Ajustar Velocidades

```typescript
// En src/lib/animations.ts
export const ANIMATION_CONFIG = {
  smoothScroll: {
    duration: 1.5, // Más lento
    ease: [0.25, 0.1, 0.25, 1]
  }
};
```

### Desactivar Animaciones

El sistema respeta la preferencia del usuario:

```css
@media (prefers-reduced-motion: reduce) {
  /* Las animaciones se desactivan automáticamente */
}
```

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Dispositivos móviles
- ✅ Tablets

## 🚨 Consideraciones de Rendimiento

- Las animaciones usan `will-change` para optimización
- Se utilizan `requestAnimationFrame` para suavidad
- Las animaciones se pausan cuando no son visibles
- Compatible con `prefers-reduced-motion`

## 🎨 Integración con TailwindCSS

Las animaciones se integran perfectamente con TailwindCSS:

```html
<div class="animated-block hover:scale-105 transition-transform duration-300">
  <!-- Contenido animado -->
</div>
```

## 🔍 Debugging

Para debuggear las animaciones:

1. Abre las herramientas de desarrollador
2. Busca mensajes de consola que empiecen con "🎬"
3. Usa `window.$motion` para acceder a las funciones de animación

## 📚 Referencias

- [Lenis Documentation](https://lenis.studiofreight.com/)
- [Motion.dev Documentation](https://motion.dev/)
- [CSS will-change Property](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
