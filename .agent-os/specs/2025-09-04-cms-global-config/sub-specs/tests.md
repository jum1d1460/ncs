# Tests Specification

This is the tests coverage details for the spec detailed in @.agent-os/specs/2025-09-04-cms-global-config/spec.md

> Created: 2025-09-04
> Version: 1.0.0

## Test Coverage

### Unit Tests

**sanity schema: globalSettings**
- Valida `siteTitle` requerido.
- Valida longitud de `siteDescription`.
- Valida `socialLinks.url` formato URL.

**web lib: fetchGlobalSettings()**
- Retorna estructura tipada con defaults cuando faltan campos.
- Maneja errores de red devolviendo fallback seguro.

### Integration Tests

**Layout.astro head meta**
- Inyecta `<link rel="icon">` con `favicon` del CMS.
- Inyecta `<meta property="og:image">` con `ogImage` o fallback.
- Title/description por defecto desde settings.

**PageRenderer + pages**
- Reciben settings y los pasan a `Layout.astro`.

### Mocking Requirements

- **@sanity/client:** mock de `client.fetch` para casos: completo, campos ausentes, error.
- **Astro build context:** pruebas en entorno de build para validar head generado (snapshots HTML).
