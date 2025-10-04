# Spec Tasks

## Tasks

- [ ] 1. Configurar infraestructura de Supabase
  - [ ] 1.1 Crear proyecto en Supabase (si no existe) - MANUAL
  - [ ] 1.2 Ejecutar script SQL para crear tabla contact_submissions - MANUAL
  - [ ] 1.3 Crear índices en la tabla - incluido en script SQL
  - [ ] 1.4 Configurar políticas RLS - incluido en script SQL
  - [ ] 1.5 Crear trigger para updated_at - incluido en script SQL
  - [ ] 1.6 Obtener URL y service role key del proyecto - MANUAL
  - [ ] 1.7 Verificar que la tabla está correctamente creada - MANUAL

- [ ] 2. Configurar cuenta de Resend
  - [ ] 2.1 Crear cuenta en Resend (si no existe) - MANUAL
  - [ ] 2.2 Verificar dominio ncs-psicologa.com - MANUAL
  - [ ] 2.3 Configurar registros DNS (DKIM, SPF) - MANUAL
  - [ ] 2.4 Obtener API key - MANUAL
  - [ ] 2.5 Verificar que el dominio está verificado - MANUAL

- [x] 3. Desarrollar estructura base del worker
  - [x] 3.1 Crear directorio workers/contact-form con estructura de carpetas
  - [x] 3.2 Crear package.json con dependencias (@supabase/supabase-js, zod)
  - [x] 3.3 Crear wrangler.toml con configuración básica
  - [x] 3.4 Crear archivo src/index.js con routing básico
  - [x] 3.5 Crear handler de health check (src/handlers/health.js)
  - [x] 3.6 Instalar dependencias con npm install
  - [ ] 3.7 Probar worker localmente con wrangler dev - PENDIENTE

- [x] 4. Implementar validación de datos
  - [x] 4.1 Crear schemas de Zod en src/utils/validation.js
  - [x] 4.2 Definir schema para ContactFormData
  - [x] 4.3 Implementar función de validación con mensajes en español
  - [x] 4.4 Crear función de sanitización de inputs
  - [x] 4.5 Probar validación con datos de ejemplo - Listo para testing

- [x] 5. Implementar servicio de email
  - [x] 5.1 Crear src/services/email.js
  - [x] 5.2 Implementar función send() que llama a Resend API
  - [x] 5.3 Crear template HTML para el email
  - [x] 5.4 Configurar reply-to con email del usuario
  - [x] 5.5 Implementar manejo de errores y timeout logic
  - [ ] 5.6 Probar envío de email de prueba - Requiere configuración de Resend

- [x] 6. Implementar servicio de Supabase
  - [x] 6.1 Crear src/services/supabase.js
  - [x] 6.2 Crear cliente de Supabase con service role key
  - [x] 6.3 Implementar función insertSubmission()
  - [x] 6.4 Manejar errores de Supabase apropiadamente
  - [ ] 6.5 Probar inserción en base de datos - Requiere configuración de Supabase

- [x] 7. Implementar handler del formulario de contacto
  - [x] 7.1 Crear src/handlers/contact.js
  - [x] 7.2 Implementar parseo y validación de request body
  - [x] 7.3 Implementar extracción de IP y User-Agent
  - [x] 7.4 Implementar rate limiting con Map en memoria
  - [x] 7.5 Implementar procesamiento paralelo de email y Supabase
  - [x] 7.6 Implementar manejo de errores y respuestas
  - [x] 7.7 Crear src/utils/response.js con funciones helper
  - [ ] 7.8 Probar handler con diferentes escenarios - Pendiente testing

- [x] 8. Implementar seguridad y CORS
  - [x] 8.1 Configurar CORS headers en index.js
  - [x] 8.2 Implementar handler de OPTIONS para preflight
  - [x] 8.3 Agregar security headers a todas las respuestas
  - [ ] 8.4 Validar que CORS funciona correctamente - Pendiente testing
  - [ ] 8.5 Probar rate limiting con múltiples requests - Pendiente testing

- [ ] 9. Desplegar worker a Cloudflare
  - [ ] 9.1 Configurar secrets con wrangler secret put
  - [ ] 9.2 Configurar RESEND_API_KEY
  - [ ] 9.3 Configurar SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
  - [ ] 9.4 Configurar CONTACT_EMAIL_TO y CONTACT_EMAIL_FROM
  - [ ] 9.5 Desplegar con wrangler deploy
  - [ ] 9.6 Verificar que el worker está funcionando en producción
  - [ ] 9.7 Probar endpoint con curl o Postman

- [ ] 10. Actualizar componente de contacto en el frontend
  - [ ] 10.1 Leer componente actual ContactCTA.astro
  - [ ] 10.2 Agregar script JavaScript para manejo AJAX del formulario
  - [ ] 10.3 Implementar función de envío con fetch()
  - [ ] 10.4 Agregar UI de loading (spinner o deshabilitado)
  - [ ] 10.5 Implementar mensajes de éxito y error
  - [ ] 10.6 Agregar validación del lado del cliente
  - [ ] 10.7 Probar formulario en desarrollo
  - [ ] 10.8 Probar formulario en producción
  - [ ] 10.9 Verificar que todos los tests pasan

