# Integración de Google Maps en el Bloque de Contacto

Esta guía explica cómo agregar un mapa de Google Maps al bloque de contacto de tu sitio web.

## 📋 Descripción

El bloque de contacto ahora soporta la integración de mapas de Google Maps mediante diferentes formatos de URLs. El sistema procesa automáticamente la URL que proporciones y la convierte en un iframe embebido funcional.

## 🎯 Formatos de URL Soportados

Puedes usar cualquiera de los siguientes formatos de URL de Google Maps:

### 1. URL de Compartir (Recomendado)
La forma más fácil. Simplemente:
1. Abre Google Maps
2. Busca tu ubicación
3. Haz clic en "Compartir"
4. Copia el enlace

**Ejemplo:**
```
https://maps.app.goo.gl/ABC123xyz
```

### 2. URL Completa de Google Maps
La URL que aparece en tu navegador cuando buscas una ubicación.

**Ejemplo:**
```
https://www.google.com/maps/place/Zaragoza/@41.6488226,-0.8890853,13z/data=...
```

### 3. Código de Iframe Embed
El código HTML completo del iframe que proporciona Google Maps.

**Ejemplo:**
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

### 4. URL de Embed Directo
La URL del src del iframe.

**Ejemplo:**
```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3004.8...
```

## 📝 Cómo Usar en el CMS

1. **Accede al CMS de Sanity**
   - Ve a tu Studio de Sanity

2. **Edita o crea una página con el bloque de contacto**
   - Agrega o edita un bloque de tipo "Bloque: Contacto"

3. **Configura el mapa**
   - Desplázate hasta la sección **"Mapa"**
   - En el campo **"URL de Google Maps"**, pega cualquiera de los formatos de URL mencionados arriba
   - En el campo **"Título accesible del mapa"**, escribe una descripción para accesibilidad (ej: "Ubicación de nuestra oficina en Zaragoza")

4. **Guarda los cambios**
   - El sistema automáticamente procesará la URL y mostrará el mapa en tu sitio web

## 🔧 Cómo Obtener una URL de Google Maps

### Método Recomendado: URL de Compartir

1. Abre [Google Maps](https://maps.google.com)
2. Busca tu dirección o ubicación
3. Haz clic en el botón **"Compartir"**
4. Copia el enlace que aparece
5. Pégalo en el CMS

### Método Alternativo: Código de Iframe

1. Abre [Google Maps](https://maps.google.com)
2. Busca tu dirección o ubicación
3. Haz clic en **"Compartir"**
4. Selecciona la pestaña **"Insertar un mapa"**
5. Copia todo el código HTML que aparece
6. Pégalo en el CMS (el sistema extraerá automáticamente la URL)

## ✨ Características

- **Procesamiento automático**: El sistema detecta y convierte automáticamente diferentes formatos de URL
- **Lazy loading**: Los mapas se cargan solo cuando el usuario los ve, mejorando el rendimiento
- **Responsive**: El mapa se adapta automáticamente a diferentes tamaños de pantalla
- **Accesibilidad**: Incluye atributos ARIA para mejorar la accesibilidad
- **Sin API Key necesaria**: Funciona directamente con las URLs públicas de Google Maps

## 🎨 Personalización

El mapa se adapta automáticamente al tema del bloque de contacto (claro, oscuro o marca) y tiene:
- Altura mínima de 300px
- Diseño responsive que se ajusta al ancho del contenedor
- Bordes redondeados que coinciden con el diseño del sitio

## ⚠️ Notas Importantes

1. **URLs seguras**: Asegúrate de usar URLs que comiencen con `https://`
2. **URLs válidas**: Solo se aceptan URLs de Google Maps
3. **Privacidad**: El iframe incluye `referrerpolicy="no-referrer-when-downgrade"` para mejor privacidad

## 🐛 Resolución de Problemas

### El mapa no aparece

1. **Verifica la URL**: Asegúrate de que sea una URL válida de Google Maps
2. **Revisa el formato**: Prueba con el formato de URL de compartir (más simple)
3. **Comprueba HTTPS**: La URL debe usar el protocolo seguro (https://)

### El mapa se ve cortado

- Esto es normal en algunos casos. El mapa tiene una altura mínima de 300px, pero puedes ajustar esto en el código si lo necesitas

## 🔍 Ejemplo Completo

```
Campo: URL de Google Maps
Valor: https://maps.app.goo.gl/ABC123xyz

Campo: Título accesible del mapa
Valor: Ubicación de nuestra consulta en Zaragoza
```

## 📚 Archivos Relacionados

- **CMS Schema**: `/cms/schemaTypes/blockContact.ts`
- **Componente Frontend**: `/web/src/components/blocks/ContactCTA.astro`
- **Utilidad de Procesamiento**: `/web/src/lib/googleMaps.ts`

## 🚀 Próximos Pasos

Si necesitas personalizar aún más el mapa (como el nivel de zoom, modo de visualización, etc.), considera usar el [Google Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) con una API Key.

