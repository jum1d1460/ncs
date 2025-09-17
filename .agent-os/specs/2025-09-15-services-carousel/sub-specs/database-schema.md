# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-09-15-services-carousel/spec.md

## Schema Changes

### ServiceCarousel Block Schema Modification

**File:** `cms/schemaTypes/blockServiceCarousel.ts`

**Changes:**
- Add new `title` field to existing `serviceCarousel` schema
- Maintain all existing fields and validation rules
- Update preview function to include title display

**New Field Specification:**
```typescript
defineField({
  name: "title",
  title: "Título del carrusel",
  type: "string",
  validation: r => r.required().max(100),
  description: "Título que aparecerá sobre el carrusel de servicios"
})
```

**Field Position:**
- Insert after line 8 (after `fields: [`)
- Before existing `items` field to maintain logical order

## Schema Specifications

### Field Validation Rules
- **Required:** Yes - título es obligatorio para todos los carruseles
- **Max Length:** 100 caracteres - suficiente para títulos descriptivos pero concisos
- **Type:** String - texto simple sin formateo
- **Localization:** No - título único por idioma/región

### Backward Compatibility
- **Existing Data:** Todos los carruseles existentes requerirán migración para agregar título
- **Default Value:** No se establecerá valor por defecto para forzar entrada manual
- **Migration Strategy:** Script de migración para establecer títulos temporales

### Preview Function Update
**Current Preview:**
```typescript
prepare({ items }) {
  const count = Array.isArray(items) ? items.length : 0;
  return { title: "Carrusel de servicios", subtitle: `${count} elementos` };
}
```

**Updated Preview:**
```typescript
prepare({ title, items }) {
  const count = Array.isArray(items) ? items.length : 0;
  const displayTitle = title || "Carrusel de servicios";
  return { title: displayTitle, subtitle: `${count} elementos` };
}
```

## Migration Strategy

### Data Migration Script
**File:** `cms/scripts/migrate-service-carousel-titles.js`

**Purpose:** Agregar títulos temporales a carruseles existentes sin título

**Logic:**
1. Query all `serviceCarousel` blocks without title
2. Generate temporary title based on context or parent page
3. Update documents with temporary titles
4. Log migration results for manual review

**Temporary Title Generation:**
- Use parent page title + " - Servicios"
- Or use "Carrusel de Servicios" + timestamp for uniqueness
- Flag migrated items for manual review

### Content Editor Workflow
1. **Immediate:** Existing carruseles mostrarán error de validación
2. **Required Action:** Content editors must add titles to all existing carruseles
3. **Future:** New carruseles require title before saving

## Rationale

### Why Title Field is Necessary
- **Content Organization:** Permite identificar carruseles en el CMS
- **SEO Benefits:** Títulos descriptivos mejoran posicionamiento
- **Accessibility:** Screen readers pueden anunciar contexto del carrusel
- **User Experience:** Usuarios pueden entender el propósito del contenido

### Implementation Considerations
- **Performance:** Campo simple no impacta rendimiento
- **Maintenance:** Títulos facilitan gestión de contenido
- **Scalability:** Permite múltiples carruseles con propósitos específicos
