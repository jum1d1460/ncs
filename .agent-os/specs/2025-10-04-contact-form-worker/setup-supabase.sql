-- ========================================
-- Supabase Setup Script
-- Contact Form Worker - NCS Psicóloga
-- ========================================
-- Este script configura toda la infraestructura necesaria en Supabase
-- para el worker de formulario de contacto.
--
-- Ejecutar en: Supabase Dashboard > SQL Editor > New Query

-- ========================================
-- 1. Crear tabla contact_submissions
-- ========================================

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

-- Optimizar búsquedas por email
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON contact_submissions(email);

-- Optimizar ordenamiento por fecha (más recientes primero)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);

-- Optimizar filtrado por status
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
  ON contact_submissions(status);

-- Índice compuesto para queries comunes (filtrar por status y ordenar por fecha)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created 
  ON contact_submissions(status, created_at DESC);

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

-- Eliminar trigger si existe (para re-ejecución del script)
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;

-- Crear trigger que ejecuta la función
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 4. Configurar Row Level Security (RLS)
-- ========================================

-- Habilitar RLS en la tabla
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay (para re-ejecución)
DROP POLICY IF EXISTS "Allow worker insert" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON contact_submissions;

-- Política para permitir inserción desde el worker (sin autenticación)
-- El worker usa el service role key que bypassa RLS
CREATE POLICY "Allow worker insert" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Política para lectura (solo para usuarios autenticados del dashboard)
CREATE POLICY "Allow authenticated read" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para actualización (solo usuarios autenticados pueden cambiar status)
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

