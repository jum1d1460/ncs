# Ejemplo de Configuración del HeroBlock en Sanity

## Estructura del Bloque

```json
{
  "_type": "blockHero",
  "mainTitle": "PSICÓLOGA NELLY CASTRO SÁNCHEZ",
  "subtitle": "Bienvenido a tu espacio de bienestar mental",
  "description": "Acompañamiento psicológico profesional para ayudarte a superar los desafíos de la vida y alcanzar tu máximo potencial. Especializada en terapia humanista e integradora.",
  "primaryButton": {
    "text": "Agenda tu cita",
    "url": "https://calendly.com/nelly-castro",
    "variant": "primary"
  },
  "secondaryButton": {
    "text": "Conoce los servicios",
    "url": "/servicios",
    "variant": "outline"
  },
  "backgroundImage": {
    "_type": "image",
    "asset": {
      "_type": "reference",
      "_ref": "image-1234567890abcdef"
    }
  },
  "silhouetteImage": {
    "_type": "image",
    "asset": {
      "_type": "reference",
      "_ref": "image-0987654321fedcba"
    }
  },
  "silhouettePosition": "right",
  "overlaySettings": {
    "overlayType": "radial",
    "overlayColor": "#1e3a8a",
    "overlayOpacity": 0.8,
    "secondaryColor": "#000000",
    "radialPosition": "top right",
    "shadowIntensity": "medium"
  }
}
```

## Configuraciones de Overlay Recomendadas

### 1. Hero Clásico con Degradado Azul
```json
{
  "overlaySettings": {
    "overlayType": "radial",
    "overlayColor": "#1e3a8a",
    "overlayOpacity": 0.8,
    "secondaryColor": "#000000",
    "radialPosition": "center",
    "shadowIntensity": "medium"
  }
}
```

### 2. Hero Moderno con Degradado Diagonal
```json
{
  "overlaySettings": {
    "overlayType": "linear",
    "overlayColor": "#dc2626",
    "overlayOpacity": 0.7,
    "secondaryColor": "#000000",
    "gradientDirection": "to top right",
    "shadowIntensity": "strong"
  }
}
```

### 3. Hero Minimalista sin Overlay
```json
{
  "overlaySettings": {
    "overlayType": "none",
    "shadowIntensity": "strong"
  }
}
```

### 4. Hero Elegante con Color Sólido
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

## Intensidades de Sombra y su Aplicación

### Sombra Suave (`soft`)
- **Ideal para**: Fondos con buen contraste natural
- **Resultado**: Mejora sutil de la legibilidad
- **Ejemplo de uso**: Imágenes de fondo oscuras o con colores sólidos

### Sombra Media (`medium`) - Recomendada
- **Ideal para**: La mayoría de situaciones
- **Resultado**: Balance perfecto entre legibilidad y estética
- **Ejemplo de uso**: Configuración por defecto para cualquier tipo de fondo

### Sombra Fuerte (`strong`)
- **Ideal para**: Fondos complejos o claros
- **Resultado**: Máxima legibilidad garantizada
- **Ejemplo de uso**: Imágenes de fondo claras o con muchos elementos

### Sin Sombra (`none`)
- **Ideal para**: Fondos que ya proporcionan suficiente contraste
- **Resultado**: Texto limpio y minimalista
- **Ejemplo de uso**: Fondos sólidos muy oscuros o cuando se quiere un look minimalista

## Nota Importante sobre Sombras

**Todas las sombras se aplican uniformemente** a los tres elementos de texto del hero:
- **`mainTitle`**: Título principal
- **`subtitle`**: Subtítulo
- **`description`**: Descripción

Esto garantiza una apariencia visual consistente y profesional en todo el hero.

## Posiciones de Silueta

- **`right`**: Silueta en el lado derecho (por defecto)
- **`left`**: Silueta en el lado izquierdo
- **`center`**: Silueta centrada

## Variantes de Botones

- **`primary`**: Botón principal con color de marca
- **`outline`**: Botón con borde blanco y fondo transparente
- **`secondary`**: Botón secundario (se renderiza como neutral)

## Consejos de Uso

1. **Imagen de Fondo**: Usa imágenes de alta resolución (mínimo 1920x1080)
2. **Silueta**: Imágenes PNG con fondo transparente funcionan mejor
3. **Overlay**: Ajusta la opacidad según el contraste de tu imagen
4. **Sombras**: Usa sombras más fuertes para imágenes claras
5. **Responsive**: El componente se adapta automáticamente a todos los dispositivos

## Integración con Páginas

Para usar el HeroBlock en una página, simplemente inclúyelo en el array de bloques:

```json
{
  "_type": "page",
  "title": "Inicio",
  "slug": "inicio",
  "blocks": [
    {
      "_type": "blockHero",
      // ... configuración del hero
    },
    {
      "_type": "blockText",
      // ... otros bloques
    }
  ]
}
```
