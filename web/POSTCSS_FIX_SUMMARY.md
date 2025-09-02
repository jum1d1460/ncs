# Solución al Error de PostCSS

## Problema Identificado

```
Error: [postcss] ENOENT: no such file or directory, open '../styles/hero.css'
```

## Causa del Problema

El error se producía porque:

1. **Importación problemática**: PostCSS no podía resolver correctamente la ruta `@import './hero.css';` desde `global.css`
2. **Archivo separado**: Los estilos del hero estaban en un archivo separado que causaba problemas de resolución
3. **Rutas relativas**: Las importaciones CSS pueden ser problemáticas en algunos entornos de build

## Solución Implementada

### 1. Consolidación de Estilos

Se movieron todos los estilos del hero desde `web/src/styles/hero.css` al archivo `web/src/styles/global.css`:

```css
/* Estilos específicos para el Hero */
@layer components {
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

  /* ... más estilos del hero ... */
}
```

### 2. Eliminación de Importación

Se eliminó la línea problemática del componente Hero:

```astro
<!-- Antes -->
<style>
  @import '../styles/hero.css';
  /* ... otros estilos ... */
</style>

<!-- Después -->
<style>
  /* ... estilos locales ... */
</style>
```

### 3. Organización por Capas

Los estilos se organizaron correctamente usando las capas de Tailwind:

- **`@layer base`**: Variables CSS de Shoelace
- **`@layer components`**: Estilos de componentes (incluyendo el hero)
- **`@layer utilities`**: Utilidades personalizadas
- **Media queries**: Reglas responsive específicas

## Archivos Modificados

1. **`web/src/styles/global.css`** - Consolidación de todos los estilos del hero
2. **`web/src/components/blocks/Hero.astro`** - Eliminación de importación CSS
3. **`web/src/styles/hero.css`** - Eliminado (archivo ya no necesario)

## Beneficios de la Solución

✅ **Sin errores de PostCSS**: El proyecto compila correctamente
✅ **Mejor organización**: Todos los estilos relacionados están en un lugar
✅ **Mantenimiento simplificado**: Un solo archivo de estilos para gestionar
✅ **Build más rápido**: Sin dependencias de importación CSS
✅ **Compatibilidad mejorada**: Funciona en todos los entornos de build

## Verificación

El proyecto ahora compila correctamente:

```bash
cd web
npm run build
# ✓ Completed in 1.10s.
# ✓ 4 page(s) built in 1.79s
```

## Estructura Final

```
web/src/styles/
├── global.css          # Todos los estilos (incluyendo hero)
└── (hero.css eliminado)

web/src/components/blocks/
└── Hero.astro         # Sin importaciones CSS
```

## Conclusión

La consolidación de estilos en un solo archivo `global.css` ha resuelto el problema de PostCSS y ha mejorado la organización del código. El HeroBlock ahora funciona correctamente sin errores de compilación.
