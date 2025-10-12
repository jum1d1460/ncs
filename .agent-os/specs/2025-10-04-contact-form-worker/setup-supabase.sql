-- ========================================
-- Supabase Setup Script
-- Persistence Worker - NCS Psicóloga
-- ========================================
-- Este script configura toda la infraestructura necesaria en Supabase
-- para el worker de persistencia de datos (contacto, citas, leads).
--
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query
--
-- NOTA: Este script está actualizado para el nuevo persistence-worker
-- que maneja múltiples tipos de datos.

-- ========================================
-- 1. Crear tablas para diferentes tipos de datos
-- ========================================

-- Tabla para formularios de contacto (mantener compatibilidad)
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

-- Tabla para solicitudes de cita
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

-- Tabla para leads de tests
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

-- Mantener tabla legacy para compatibilidad (opcional)
CREATE TABLE IF NOT EXISTS contact_submissions (
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

-- ========================================
-- 2. Crear índices para optimizar queries
-- ========================================

-- Índices para contacts
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_status_created ON contacts(status, created_at DESC);

-- Índices para appointments
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_urgency ON appointments(urgency);

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_test_type ON leads(test_type);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score);

-- Índices legacy para contact_submissions (compatibilidad)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created ON contact_submissions(status, created_at DESC);

-- ========================================
-- 3. Crear función y trigger para updated_at
-- ========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Eliminar triggers existentes (para re-ejecución del script)
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;

-- Crear triggers que ejecutan la función
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 4. Configurar Row Level Security (RLS)
-- ========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay (para re-ejecución)
-- Contacts
DROP POLICY IF EXISTS "Allow worker insert contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated read contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated update contacts" ON contacts;

-- Appointments
DROP POLICY IF EXISTS "Allow worker insert appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated read appointments" ON appointments;
DROP POLICY IF EXISTS "Allow authenticated update appointments" ON appointments;

-- Leads
DROP POLICY IF EXISTS "Allow worker insert leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated read leads" ON leads;
DROP POLICY IF EXISTS "Allow authenticated update leads" ON leads;

-- Legacy contact_submissions
DROP POLICY IF EXISTS "Allow worker insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON contact_submissions;

-- Políticas para contacts
CREATE POLICY "Allow worker insert contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read contacts" ON contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update contacts" ON contacts
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas para appointments
CREATE POLICY "Allow worker insert appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas para leads
CREATE POLICY "Allow worker insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read leads" ON leads
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update leads" ON leads
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Políticas legacy para contact_submissions
CREATE POLICY "Allow worker insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ========================================
-- 5. Verificación
-- ========================================

-- Ver estructura de la tabla
\d contact_submissions;

-- Ver índices creados
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'contact_submissions';

-- Ver políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'contact_submissions';

-- ========================================
-- 6. Insertar datos de prueba (opcional)
-- ========================================

-- Descomentar para insertar un registro de prueba:
/*
INSERT INTO contact_submissions (name, email, phone, subject, message, preference)
VALUES (
  'Usuario de Prueba',
  'test@example.com',
  '+34 612 345 678',
  'Consulta de prueba',
  'Este es un mensaje de prueba para verificar que la tabla funciona correctamente.',
  'email'
);

-- Ver el registro insertado
SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 1;
*/

-- ========================================
-- Script completado exitosamente
-- ========================================
-- 
-- Próximos pasos:
-- 1. Ve a: Project Settings > API
-- 2. Copia tu "Project URL" (SUPABASE_URL)
-- 3. Copia tu "service_role" key (SUPABASE_SERVICE_ROLE_KEY)
-- 4. Guarda estas credenciales de forma segura para configurar el worker

