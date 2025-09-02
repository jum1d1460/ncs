# Configuración del HeroBlock

## Descripción General

El HeroBlock ha sido refactorizado para ser más simple, configurable y utilizar componentes de Shoelace. Ahora incluye opciones avanzadas de configuración para el overlay y las sombras.

## Nuevas Opciones de Configuración

### Overlay Settings

#### 1. Tipo de Overlay (`overlayType`)
- **`radial`**: Degradado radial (por defecto)
- **`linear`**: Degradado lineal
- **`solid`**: Color sólido
- **`none`**: Sin overlay

#### 2. Color del Overlay (`overlayColor`)
- Color principal del overlay
- Formato: hex (#1e3a8a), rgb (rgb(30, 58, 138)), o nombre de color
- Valor por defecto: `#1e3a8a`

#### 3. Opacidad del Overlay (`overlayOpacity`)
- Rango: 0.0 - 1.0
- Valor por defecto: `0.8`

#### 4. Color Secundario (`secondaryColor`)
- Color secundario para degradados
- Formato: hex (#000000), rgb (rgb(0, 0, 0)), o nombre de color
- Valor por defecto: `#000000`

#### 5. Dirección del Degradado (`gradientDirection`)
- Solo aplicable cuando `overlayType` es `linear`
- Opciones:
  - `to top` - Arriba
  - `to bottom` - Abajo (por defecto)
  - `to left` - Izquierda
  - `to right` - Derecha
  - `to top right` - Diagonal superior derecha
  - `to top left` - Diagonal superior izquierda
  - `to bottom right` - Diagonal inferior derecha
  - `to bottom left` - Diagonal inferior izquierda

#### 6. Posición del Degradado Radial (`radialPosition`)
- Solo aplicable cuando `overlayType` es `radial`
- Opciones:
  - `center` - Centro (por defecto)
  - `top left` - Superior izquierda
  - `top right` - Superior derecha
  - `bottom left` - Inferior izquierda
  - `bottom right` - Inferior derecha

#### 7. Intensidad de la Sombra (`shadowIntensity`)
- **`soft`**: Sombra suave para mejor legibilidad
- **`medium`**: Sombra media (por defecto)
- **`strong`**: Sombra fuerte para máximo contraste
- **`none`**: Sin sombra

## Ejemplos de Configuración

### Degradado Radial Clásico
```json
{
  "overlaySettings": {
    "overlayType": "radial",
    "overlayColor": "#1e3a8a",
    "overlayOpacity": 0.8,
    "secondaryColor": "#000000",
    "secondaryOpacity": 0.6,
    "radialPosition": "center",
    "shadowIntensity": "medium"
  }
}
```

### Degradado Lineal Diagonal
```json
{
  "overlaySettings": {
    "overlayType": "linear",
    "overlayColor": "#dc2626",
    "overlayOpacity": 0.7,
    "secondaryColor": "#000000",
    "secondaryOpacity": 0.5,
    "gradientDirection": "to top right",
    "shadowIntensity": "strong"
  }
}
```

### Color Sólido Simple
```json
{
  "overlaySettings": {
    "overlayType": "solid",
    "overlayColor": "#374151",
    "overlayOpacity": 0.6,
    "shadowIntensity": "soft"
  }
}
```

### Sin Overlay
```json
{
  "overlaySettings": {
    "overlayType": "none",
    "shadowIntensity": "strong"
  }
}
```

## Componentes Shoelace Utilizados

- **`sl-button`**: Reemplaza los botones personalizados con componentes nativos de Shoelace
- **Variantes disponibles**: `primary`, `outline`, `neutral`
- **Tamaños**: `large` para mejor visibilidad

## Beneficios de la Refactorización

1. **Código más limpio**: Eliminación de CSS innecesario y lógica compleja
2. **Mayor flexibilidad**: Configuración completa del overlay desde Sanity
3. **Mejor integración**: Uso de componentes Shoelace para consistencia
4. **Mantenimiento simplificado**: Menos código personalizado, más estándar
5. **Responsive mejorado**: Mejor comportamiento en dispositivos móviles

## Compatibilidad

- ✅ Sanity CMS
- ✅ Astro
- ✅ TailwindCSS
- ✅ Shoelace UI
- ✅ TypeScript
- ✅ Responsive design
