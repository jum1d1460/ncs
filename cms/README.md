# Sanity Blogging Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- Check out the example frontend: [React/Next.js](https://github.com/sanity-io/tutorial-sanity-blog-react-next)
- [Read the blog post about this template](https://www.sanity.io/blog/build-your-own-blog-with-sanity-and-next-js?utm_source=readme)
- [Join the Sanity community](https://www.sanity.io/community/join?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## Servicios y Bloques (NCS)
## Configuración global: Header/Footer

Campos en `globalSettings` para cabecera y pie:
- `brand.logo` (imagen con `alt`)
- `navMain[]` (`label`, `url`)
- `contact` (`phone`, `whatsapp`, `email`)
- `bookingUrl` (URL externa)
- `seoFooterText` (texto)
- `legalLinks[]` (`label`, `url`)
- `socialLinks[]` (`type`, `url`)

### Bloques: Testimonios y Logotipos

- `blockTestimonials`: lista de testimonios, cada uno con `image` (con `alt` requerido), `quote` (máx. 280) y `fullName`.
- `blockLogos`: bloque con `title` y un array de imágenes de logotipos (todas con `alt` requerido).

Uso: en el documento `Página`, dentro de `Bloques`, añade "Bloque: Testimonios" o "Bloque: Logotipos".


### Documento `service`
- Campos: `title` (req), `slug` (auto desde `title`), `durationMinutes` (número entero > 0), `priceType` ("fixed" | "consult"), `price` (req si `fixed`), `shortDescription` (<=200 chars), `longDescription` (portable text), `cardImage` (con `alt`), `blockImage` (con `alt`).
- Preview: muestra `title` y precio o "A consultar" según `priceType`.

### Bloque `serviceBlock`
- Campos: `service` (ref a `service`, req), `variant` ("card" | "detailed", por defecto `card`), `showPrice` (boolean, por defecto `true`).
- Preview: título del servicio y variante.

### Bloque `serviceCarousel`
- Campos: `items` (array de refs a `service`, req, >=1), `autoplay` (boolean), `intervalMs` (número > 0, visible si `autoplay`), `showPrice` (boolean).
- Preview: cuenta de elementos.

### Registro en esquema
Se encuentran registrados en `schemaTypes/index.ts` y disponibles en el documento `page` bajo `fields.blocks`.

## QA Studio

Sigue estos pasos en Sanity Studio para validar:
1. Crear un `service` con `priceType = fixed` y `price > 0` y verificar que el preview muestre "XX €".
2. Cambiar `priceType = consult` y confirmar que `price` queda oculto y el preview muestre "A consultar".
3. Validar errores cuando faltan: `title`, `durationMinutes`, `shortDescription`, `cardImage.alt`, `blockImage.alt`.
4. Crear un `page` y añadir:
   - Un `serviceBlock` con `variant = card` y otro con `variant = detailed`.
   - Un `serviceCarousel` con al menos 3 `services`.
5. Confirmar en el editor que los previews de bloques muestran la información esperada.

Notas:
- Todos los textos y títulos están en español para el equipo editorial.
- Las reglas de validación impiden estados inconsistentes (e.g., `price` con `consult`).
