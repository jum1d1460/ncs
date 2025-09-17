
# 🔧 Instrucciones para Reparar el Carrusel de Servicios

## 🔍 Problema Identificado

El carrusel de servicios no muestra imágenes porque:

1. **Los servicios no tienen imágenes** (0 de 5 servicios tienen imágenes)
2. **El carrusel no está conectado con los servicios** (0 servicios asociados)

## ✅ Solución

### Opción 1: Usar el Script Automático (Recomendado)

1. **Obtener token de Sanity:**
   ```bash
   # Ve a https://sanity.io/manage
   # Selecciona tu proyecto (i95g996l)
   # Ve a "API" > "Tokens"
   # Crea un token con permisos de escritura
   ```

2. **Configurar el token:**
   ```bash
   export SANITY_TOKEN="tu-token-aqui"
   ```

3. **Ejecutar el script:**
   ```bash
   cd /home/jumidi/Code/ia/Nelly/ncs/web
   node fix-carousel.js
   ```

### Opción 2: Reparación Manual en Sanity

#### Paso 1: Agregar Imágenes a los Servicios

1. Ve a [Sanity Studio](https://i95g996l.sanity.studio)
2. Navega a **Content** > **Services**
3. Para cada servicio:
   - Haz clic en el servicio
   - En la sección **Image**, haz clic en **Upload**
   - Sube una imagen apropiada para el servicio
   - Guarda los cambios

#### Paso 2: Conectar Servicios al Carrusel

1. Ve a **Content** > **Pages**
2. Abre la página **Inicio**
3. Encuentra el bloque **Service Carousel**
4. En la sección **Services**, haz clic en **Add item**
5. Selecciona todos los servicios disponibles
6. Guarda los cambios

## 🎯 Resultado Esperado

Después de la reparación:

- ✅ Los 5 servicios tendrán imágenes
- ✅ El carrusel mostrará los servicios con imágenes
- ✅ Las imágenes se cargarán correctamente en el sitio web

## 🔍 Verificación

Para verificar que todo funciona:

1. Recarga la página web
2. Ve a la sección "Nuestros servicios"
3. Deberías ver las cards de servicios con imágenes
4. El carrusel debería ser navegable

## 📞 Soporte

Si tienes problemas:

1. Verifica que el token de Sanity tenga permisos de escritura
2. Asegúrate de que las imágenes sean de buena calidad (800x600px recomendado)
3. Revisa la consola del navegador para errores

## 🎨 Imágenes Sugeridas

Para cada servicio, se recomiendan imágenes que representen:

- **TDAH**: Personas concentradas, estudios, atención
- **Ansiedad**: Calma, relajación, bienestar
- **Trastornos de Personalidad**: Terapia, conversación, apoyo
- **Apoyo Familiar**: Familias, niños, comprensión
- **Psicología Forense**: Profesionalismo, evaluación, justicia

Puedes usar [Unsplash](https://unsplash.com) para encontrar imágenes gratuitas y apropiadas.

