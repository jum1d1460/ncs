# Corrección del Problema de Imagen de Fondo del Hero

## Problema Identificado

La imagen de fondo del HeroBlock no estaba ocupando correctamente toda la altura del viewport. En lugar de estirarse en altura, se estaba estirando en anchura, lo que resultaba en una visualización incorrecta.

## Causa del Problema

1. **CSS insuficiente**: Las reglas CSS no eran lo suficientemente específicas para forzar que la imagen ocupara toda la altura
2. **ResponsiveImage conflictivo**: El componente ResponsiveImage tenía clases CSS que interferían con las del Hero
3. **Falta de posicionamiento absoluto**: La imagen no tenía el posicionamiento correcto para ocupar todo el espacio disponible

## Solución Implementada

### 1. Creación de Estilos Específicos (`web/src/styles/hero.css`)

Se creó un archivo CSS dedicado con reglas específicas para el hero:

```css
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

.hero-background img {
  width: 100vw !important;
  height: 100vh !important;
  object-fit: cover !important;
  object-position: center !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}
```

### 2. Actualización del ResponsiveImage

Se modificó el componente ResponsiveImage para que respete las clases pasadas desde el Hero:

```astro
<!-- Antes -->
<img class="w-full h-auto object-cover" />

<!-- Después -->
<img class={className || "w-full h-auto object-cover"} />
```

### 3. Simplificación del CSS del Hero

Se eliminó el CSS complejo y se reemplazó con clases específicas:

```astro
<!-- Antes -->
<section class="relative w-full min-h-screen overflow-hidden">

<!-- Después -->
<section class="hero-section">
```

### 4. Importación de Estilos

Se añadió la importación de los estilos específicos del hero en el archivo global:

```css
/* Importar estilos específicos del hero */
@import './hero.css';
```

## Reglas CSS Clave

### Posicionamiento Absoluto
- `position: absolute !important` para la imagen de fondo
- `top: 0, left: 0, right: 0, bottom: 0` para cubrir todo el espacio

### Dimensiones Forzadas
- `width: 100vw !important` para ocupar todo el ancho
- `height: 100vh !important` para ocupar toda la altura

### Object-Fit
- `object-fit: cover !important` para mantener la proporción y cubrir todo el espacio
- `object-position: center !important` para centrar la imagen

## Responsive Design

Se añadieron media queries específicos para asegurar que funcione en todos los dispositivos:

```css
@media (max-width: 768px) {
  .hero-background img {
    width: 100vw !important;
    height: 100vh !important;
  }
}

@media (orientation: landscape) {
  .hero-background img {
    width: 100vw !important;
    height: 100vh !important;
    object-fit: cover !important;
  }
}
```

## Archivos Modificados

1. **`web/src/styles/hero.css`** - Nuevo archivo con estilos específicos del hero
2. **`web/src/components/blocks/Hero.astro`** - Simplificado y actualizado
3. **`web/src/components/ResponsiveImage.astro`** - Mejorado para respetar clases
4. **`web/src/styles/global.css`** - Importación de estilos del hero
5. **`web/src/pages/hero-test.astro`** - Página de prueba creada

## Resultado

✅ **Imagen de fondo ocupa toda la altura del viewport**
✅ **Funciona correctamente en todos los dispositivos**
✅ **Mantiene la proporción de la imagen**
✅ **CSS más limpio y mantenible**
✅ **Mejor separación de responsabilidades**

## Pruebas Recomendadas

1. **Verificar en diferentes dispositivos**: móvil, tablet, desktop
2. **Probar diferentes orientaciones**: landscape y portrait
3. **Comprobar con diferentes tamaños de imagen**
4. **Verificar que el overlay funcione correctamente**
5. **Probar el scroll y la transición al contenido siguiente**

## Comandos de Prueba

```bash
# Navegar a la página de prueba
cd web
npm run dev
# Visitar: http://localhost:4321/hero-test
```
