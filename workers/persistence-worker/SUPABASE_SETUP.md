# Configuración de Supabase para Persistence Worker

Esta guía te explica paso a paso cómo configurar Supabase para el worker de persistencia de datos.

## 📋 Checklist General

- [ ] Crear proyecto en Supabase (si no existe)
- [ ] Ejecutar scripts SQL para crear tablas
- [ ] Configurar políticas RLS
- [ ] Obtener credenciales (URL y Service Role Key)
- [ ] Verificar configuración

---

## 1️⃣ Crear Proyecto en Supabase

### Paso 1.1: Acceder a Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Click en "New Project"

### Paso 1.2: Configurar Proyecto

```
Name: ncs-psicologa
Database Password: [Genera una contraseña segura y guárdala]
Region: eu-west-1 (Europa) o la más cercana
```

4. Click en "Create new project"
5. Espera 2-3 minutos mientras se aprovisiona

---

## 2️⃣ Ejecutar Scripts SQL

### Paso 2.1: Acceder al SQL Editor

1. En el dashboard de Supabase, ve a **SQL Editor** en el menú lateral
2. Click en "New query"

### Paso 2.2: Crear Tablas

Copia y ejecuta el contenido del archivo `setup-supabase.sql`:

```sql
-- ========================================
-- Supabase Setup Script
-- Persistence Worker - NCS Psicóloga
-- ========================================

-- 1. Tabla para formularios de contacto
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL DEFAULT 'contact',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  topic VARCHAR(100),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  preference VARCHAR(10) NOT NULL CHECK (preference IN ('email', 'phone', 'any')),
  source VARCHAR(50) DEFAULT 'website',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  environment VARCHAR(20)
);

-- 2. Tabla para solicitudes de cita
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL DEFAULT 'appointment',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  preferred_date DATE NOT NULL,
  preferred_time VARCHAR(20) NOT NULL CHECK (preferred_time IN ('morning', 'afternoon', 'evening', 'any')),
  reason TEXT NOT NULL,
  urgency VARCHAR(10) DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high')),
  source VARCHAR(50) DEFAULT 'website',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'cancelled', 'completed')),
  environment VARCHAR(20)
);

-- 3. Tabla para leads de tests
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL DEFAULT 'lead',
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  test_type VARCHAR(100) NOT NULL,
  test_results JSONB,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  recommendations TEXT[],
  source VARCHAR(50) DEFAULT 'test_form',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  environment VARCHAR(20)
);

-- ========================================
-- Índices para optimizar queries
-- ========================================

-- Contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_status_created ON contacts(status, created_at DESC);

-- Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_urgency ON appointments(urgency);

-- Leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_test_type ON leads(test_type);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);

-- ========================================
-- Función y triggers para updated_at
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Configurar Row Level Security (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Políticas para contacts
DROP POLICY IF EXISTS "Allow worker insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated read contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated update contacts" ON contacts;

CREATE POLICY "Allow worker insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas para appointments
DROP POLICY IF EXISTS "Allow worker insert appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated read appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated update appointments" ON appointments;

CREATE POLICY "Allow worker insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas para leads
DROP POLICY IF EXISTS "Allow worker insert leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated read leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated update leads" ON leads;

CREATE POLICY "Allow worker insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Paso 2.3: Ejecutar el Script

1. Copia todo el contenido del script SQL
2. Pégalo en el editor SQL de Supabase
3. Click en "Run" o presiona `Ctrl+Enter`
4. Verifica que aparezca "Success. No rows returned"

---

## 3️⃣ Verificar Configuración

### Paso 3.1: Verificar Tablas

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver las 3 tablas:
   - `contacts`
   - `appointments`
   - `leads`

### Paso 3.2: Verificar Estructura

Click en cada tabla para verificar que tiene todos los campos:

**contacts**: id, type, name, email, phone, topic, subject, message, preference, source, created_at, updated_at, status, environment

**appointments**: id, type, name, email, phone, preferred_date, preferred_time, reason, urgency, source, created_at, updated_at, status, environment

**leads**: id, type, name, email, phone, test_type, test_results, score, recommendations, source, created_at, updated_at, status, environment

---

## 4️⃣ Obtener Credenciales

### Paso 4.1: Acceder a Configuración

1. Ve a **Project Settings** (ícono de engranaje en la parte inferior)
2. Click en **API** en el menú de configuración

### Paso 4.2: Copiar Credenciales

Copia y guarda estos valores:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxx
```

⚠️ **IMPORTANTE**: El `service_role` key tiene permisos completos. NO lo expongas públicamente.

---

## 5️⃣ Configurar Worker

### Paso 5.1: Configurar Secrets

```bash
cd workers/persistence-worker

# Configurar URL de Supabase
wrangler secret put SUPABASE_URL
# Pega tu Project URL

# Configurar Service Role Key
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Pega tu service_role key
```

### Paso 5.2: Verificar Configuración

```bash
# Verificar que los secrets estén configurados
wrangler secret list
```

---

## 6️⃣ Probar Configuración

### Paso 6.1: Test de Conexión

```bash
# Health check del worker
curl https://ncs-persistence.workers.dev/health
```

### Paso 6.2: Test de Inserción

```bash
# Test de formulario de contacto
curl -X POST https://ncs-persistence.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test subject",
    "message": "This is a test message",
    "preference": "email"
  }'
```

### Paso 6.3: Verificar en Supabase

1. Ve a **Table Editor** en Supabase
2. Click en la tabla `contacts`
3. Deberías ver el registro de prueba

---

## 📊 Estructura de Datos

### Tabla: `contacts`
- **Propósito**: Formularios de contacto general
- **Campos clave**: name, email, subject, message, preference

### Tabla: `appointments`
- **Propósito**: Solicitudes de primera cita
- **Campos clave**: name, email, preferred_date, preferred_time, reason, urgency

### Tabla: `leads`
- **Propósito**: Leads de formularios de tests
- **Campos clave**: name, email, test_type, test_results, score, recommendations

---

## 🆘 Troubleshooting

### Error: "relation does not exist"
- Verifica que ejecutaste el script SQL completo
- Ve a Table Editor y comprueba que las tablas existen

### Error: "permission denied"
- Verifica que RLS está habilitado
- Verifica que las políticas se crearon correctamente
- Asegúrate de usar el `service_role` key, no el `anon` key

### Error: "invalid input value"
- Verifica que los datos cumplan con las restricciones CHECK
- Revisa los tipos de datos en el script SQL

### Worker no puede conectar a Supabase
- Verifica que `SUPABASE_URL` esté configurado correctamente
- Verifica que `SUPABASE_SERVICE_ROLE_KEY` esté configurado correctamente
- Revisa los logs del worker con `wrangler tail`

---

## ✅ Checklist Final

- [ ] Proyecto de Supabase creado
- [ ] Script SQL ejecutado exitosamente
- [ ] 3 tablas creadas (contacts, appointments, leads)
- [ ] Índices creados
- [ ] Políticas RLS configuradas
- [ ] Credenciales obtenidas y guardadas
- [ ] Secrets configurados en el worker
- [ ] Test de conexión exitoso
- [ ] Test de inserción exitoso

---

## 📝 Notas Importantes

- **Seguridad**: El `service_role` key bypassa RLS y tiene permisos completos
- **Escalabilidad**: Los índices optimizan las queries más comunes
- **Auditoría**: Los campos `created_at` y `updated_at` permiten seguimiento
- **Flexibilidad**: El campo `type` permite categorizar diferentes tipos de datos
- **Entornos**: El campo `environment` permite separar datos de desarrollo/producción
