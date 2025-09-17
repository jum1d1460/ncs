# Spec Requirements Document

> Spec: Carrusel de Servicios Avanzado
> Created: 2025-09-15

## Overview

Implementar un carrusel de servicios avanzado con controles de navegación accesibles, paginación visual y animaciones suaves basadas en Motion.dev. El carrusel mostrará cards de servicios en formato wide-card con el primer elemento alineado a la izquierda de la grilla central, ocupando 3/4 del ancho y permitiendo ver parcialmente el siguiente elemento.

## User Stories

### Navegación Intuitiva del Carrusel

Como usuario, quiero poder navegar por los servicios usando flechas de navegación claramente visibles, para que pueda explorar todos los servicios disponibles de manera intuitiva.

El usuario verá flechas de navegación (izquierda/derecha) en la parte inferior derecha del carrusel, siempre dentro de la grilla central. Al hacer clic, el carrusel se deslizará suavemente al siguiente/anterior servicio con animaciones fluidas.

### Indicador de Posición Visual

Como usuario, quiero ver puntos de paginación que indiquen cuántos servicios hay y en cuál estoy actualmente, para que tenga una referencia visual de mi posición en el carrusel.

Los puntos de paginación estarán ubicados en la parte inferior izquierda del carrusel, mostrando un punto activo para el servicio actual y puntos inactivos para el resto.

### Accesibilidad y Usabilidad

Como usuario con necesidades de accesibilidad, quiero que el carrusel sea completamente navegable con teclado y que los controles tengan etiquetas descriptivas, para que pueda usar la funcionalidad independientemente de mi método de interacción.

## Spec Scope

1. **Campo de Título en Sanity** - Agregar campo de título al bloque de carrusel de servicios en el esquema de Sanity
2. **Componente WideCard** - Crear componente independiente WideCard para mostrar servicios con estilos específicos
3. **Carrusel con Motion.dev** - Implementar carrusel usando librería basada en Motion.dev para animaciones suaves
4. **Controles de Navegación** - Añadir flechas izquierda/derecha en posición inferior derecha dentro de la grilla central
5. **Paginación Visual** - Implementar puntos indicadores en posición inferior izquierda
6. **Ocultación de Scrollbar** - Ocultar la barra de scroll lateral manteniendo funcionalidad
7. **Responsive Design** - Asegurar que el carrusel funcione correctamente en todos los tamaños de pantalla

## Out of Scope

- Autoplay automático del carrusel
- Navegación por gestos táctiles (swipe)
- Integración con otros tipos de contenido que no sean servicios
- Modificación del esquema de datos de servicios individuales

## Expected Deliverable

1. Bloque de carrusel de servicios completamente funcional con título configurable desde Sanity
2. Componente WideCard reutilizable con estilos específicos para servicios
3. Carrusel con animaciones suaves, controles accesibles y paginación visual
4. Interfaz responsive que mantiene la funcionalidad en todos los dispositivos
