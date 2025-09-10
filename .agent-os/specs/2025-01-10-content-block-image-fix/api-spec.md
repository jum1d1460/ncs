# Especificación de API: Arreglo de Visualización en Bloque de Contenido

## Componentes Afectados

### ResponsiveImage.astro

#### Props Actuales
```typescript
interface Props {
  image: any;
  alt?: string;
  title?: string;
  class?: string;
  sizes?: string;
  aspectRatio?: string;
}
```

#### Props Modificados
```typescript
interface Props {
  image: any;
  alt?: string;
  title?: string;
  class?: string;
  sizes?: string;
  aspectRatio?: string;
  maxHeight?: string; // Nueva prop opcional
  objectFit?: 'contain' | 'cover'; // Nueva prop opcional
}
```

#### Valores por Defecto
```typescript
const defaults = {
  alt: '',
  title: '',
  class: '',
  sizes: '100vw',
  aspectRatio: '16/9',
  maxHeight: '500px', // Nuevo
  objectFit: 'contain' // Nuevo
};
```

#### Comportamiento
- **objectFit: 'contain'**: Mantiene proporción original (nuevo por defecto)
- **objectFit: 'cover'**: Rellena contenedor manteniendo proporción (para altura completa)
- **maxHeight**: Limita altura máxima de la imagen
- **aspectRatio: 'auto'**: Respeta proporción natural de la imagen

### BlockContentSection.astro

#### Props Actuales
```typescript
interface Props {
  title?: string
  headingLevel?: string
  content?: any[]
  image?: any
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  imageWidth?: '25' | '33' | '50'
  columnsCount?: number
}
```

#### Props Sin Cambios
- Mantener todas las props existentes
- No añadir nuevas props
- Preservar backward compatibility

#### Comportamiento Modificado
- **Con imagen**: Título se alinea a la izquierda con el contenido
- **Sin imagen**: Título se mantiene centrado
- **Layout de columnas**: Imagen ocupa altura completa del contenido
- **Layout vertical**: Imagen mantiene proporción con altura máxima

## Estructura de Datos

### Schema de Sanity (Sin Cambios)
```typescript
// cms/schemaTypes/blockContentSection.ts
{
  title?: string
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  content?: any[]
  image?: {
    asset: { _ref: string }
    alt?: string
    caption?: string
  }
  imageAlt?: string
  imagePosition?: 'left' | 'right'
  imageWidth?: '25' | '33' | '50'
  columnsCount?: 1 | 2 | 3
}
```

### Datos de Entrada
```typescript
// Ejemplo de datos de entrada
const blockData = {
  _type: 'blockContentSection',
  title: 'Título de la sección',
  headingLevel: 'h2',
  content: [
    {
      _type: 'block',
      children: [{ text: 'Contenido de la sección...' }]
    }
  ],
  image: {
    asset: { _ref: 'image-abc123-jpg' },
    alt: 'Descripción de la imagen'
  },
  imageAlt: 'Texto alternativo',
  imagePosition: 'right',
  imageWidth: '50',
  columnsCount: 1
};
```

## Clases CSS Generadas

### ResponsiveImage
```css
/* Clases por defecto */
.w-full.h-auto.object-contain.object-center {
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center;
}

/* Con maxHeight personalizado */
.max-h-\[500px\] {
  max-height: 500px;
}

/* Con aspectRatio automático */
.aspect-auto {
  aspect-ratio: auto;
}
```

### BlockContentSection
```css
/* Layout con imagen */
.flex.flex-col.lg\:flex-row {
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .lg\:flex-row {
    flex-direction: row;
  }
}

/* Contenedor de texto */
.flex.flex-col.justify-start {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

/* Contenedor de imagen */
.h-full.min-h-\[300px\] {
  height: 100%;
  min-height: 300px;
}

/* Título alineado */
.text-left {
  text-align: left;
}
```

## Estados del Componente

### Estado 1: Solo Contenido (Sin Imagen)
```typescript
{
  title: 'Título',
  content: [...],
  image: null
}
```
**Renderizado**: Título centrado + contenido centrado

### Estado 2: Solo Imagen (Sin Contenido)
```typescript
{
  title: null,
  content: null,
  image: {...}
}
```
**Renderizado**: Imagen centrada con ancho limitado

### Estado 3: Contenido + Imagen (Layout de Columnas)
```typescript
{
  title: 'Título',
  content: [...],
  image: {...},
  imagePosition: 'right',
  imageWidth: '50'
}
```
**Renderizado**: Título alineado a la izquierda + contenido + imagen a la derecha

## Responsive Behavior

### Mobile (< 640px)
```css
.flex-col {
  flex-direction: column;
}
```
- Layout vertical
- Imagen arriba, contenido abajo
- Título centrado

### Tablet (640px - 1024px)
```css
.flex-col.md\:flex-row {
  flex-direction: column;
}
```
- Layout similar a mobile
- Espaciado optimizado

### Desktop (≥ 1024px)
```css
.lg\:flex-row {
  flex-direction: row;
}
```
- Layout horizontal
- Imagen y contenido en columnas
- Título alineado con contenido

## Validación de Datos

### ResponsiveImage
```typescript
// Validación de props
if (maxHeight && !maxHeight.match(/^\d+px$/)) {
  throw new Error('maxHeight debe ser un número seguido de "px"');
}

if (objectFit && !['contain', 'cover'].includes(objectFit)) {
  throw new Error('objectFit debe ser "contain" o "cover"');
}
```

### BlockContentSection
```typescript
// Validación existente (sin cambios)
if (imageWidth && !['25', '33', '50'].includes(imageWidth)) {
  throw new Error('imageWidth debe ser "25", "33" o "50"');
}

if (imagePosition && !['left', 'right'].includes(imagePosition)) {
  throw new Error('imagePosition debe ser "left" o "right"');
}
```

## Error Handling

### ResponsiveImage
```typescript
// Fallback para imágenes no válidas
if (!image || !image.asset) {
  return <div class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
    <span class="text-gray-500">Imagen no disponible</span>
  </div>;
}
```

### BlockContentSection
```typescript
// Fallback para contenido vacío
if (!content && !image) {
  return null;
}

// Fallback para título sin headingLevel
const Tag = (title && (headingLevel as any)) || 'h2';
```

## Testing API

### Casos de Prueba para ResponsiveImage
```typescript
// Test 1: Props por defecto
<ResponsiveImage image={validImage} />
// Esperado: object-contain, max-height: 500px

// Test 2: Props personalizados
<ResponsiveImage 
  image={validImage} 
  objectFit="cover" 
  maxHeight="300px" 
/>
// Esperado: object-cover, max-height: 300px

// Test 3: Imagen inválida
<ResponsiveImage image={null} />
// Esperado: Fallback con mensaje de error
```

### Casos de Prueba para BlockContentSection
```typescript
// Test 1: Con imagen y contenido
<BlockContentSection 
  title="Título" 
  content={content} 
  image={image} 
  imagePosition="right" 
/>
// Esperado: Título alineado a la izquierda

// Test 2: Solo contenido
<BlockContentSection 
  title="Título" 
  content={content} 
/>
// Esperado: Título centrado

// Test 3: Solo imagen
<BlockContentSection image={image} />
// Esperado: Imagen centrada
```
