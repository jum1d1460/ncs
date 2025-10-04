# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-10-04-contact-form-worker/spec.md

## Table: contact_submissions

### Schema Definition

```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  topic VARCHAR(100),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  preference VARCHAR(10) NOT NULL CHECK (preference IN ('email', 'phone', 'any')),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived'))
);
```

### Indexes

```sql
-- Optimizar búsquedas por email
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- Optimizar ordenamiento por fecha
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

-- Optimizar filtrado por status
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

-- Índice compuesto para queries comunes (filtrar por status y ordenar por fecha)
CREATE INDEX idx_contact_submissions_status_created ON contact_submissions(status, created_at DESC);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserción desde el worker (sin autenticación)
CREATE POLICY "Allow worker insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Política para lectura (solo para usuarios autenticados del dashboard)
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para actualización (solo usuarios autenticados pueden cambiar status)
CREATE POLICY "Allow authenticated update" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Trigger para updated_at

```sql
-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger que ejecuta la función
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Rationale

### Field Choices

- **id (UUID)**: Identificador único generado automáticamente, mejor que serial para distribución
- **name, email, subject, message**: Campos core del formulario, todos requeridos excepto phone y topic
- **preference**: Enum que indica preferencia de contacto del usuario
- **ip_address (INET)**: Tipo específico de PostgreSQL para IPs, permite queries eficientes
- **user_agent**: String para análisis de dispositivos y prevención de spam
- **created_at, updated_at**: Timestamps automáticos para auditoría
- **status**: Workflow de gestión de solicitudes (new → read → replied → archived)

### Index Strategy

- Email indexado para búsquedas rápidas de submissions del mismo usuario
- Created_at con índice DESC para listados cronológicos recientes primero
- Status indexado para filtros por estado
- Índice compuesto status+created_at para la query más común: "todas las nuevas, ordenadas por fecha"

### Security Considerations

- RLS habilitado para control granular de acceso
- Inserciones públicas permitidas (con rate limiting en worker layer)
- Lecturas y actualizaciones solo para usuarios autenticados
- Service role key del worker bypassa RLS para inserciones

### Performance

- UUIDs para distribución en clusters
- Índices selectivos para queries frecuentes
- INET type para operaciones IP eficientes
- Trigger en vez de lógica de aplicación para updated_at

