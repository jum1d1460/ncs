# Instrucciones de Setup - Contact Form Worker

Este documento contiene las instrucciones paso a paso para configurar toda la infraestructura necesaria para el worker de formulario de contacto.

## 📋 Checklist General

- [ ] Configurar Supabase
- [ ] Configurar Resend
- [ ] Desarrollar worker
- [ ] Desplegar worker
- [ ] Actualizar frontend

---

## 1️⃣ Configurar Supabase

### Paso 1.1: Crear proyecto (si no existe)

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Click en "New Project"
4. Configura:
   - **Name**: `ncs-psicologa` (o el nombre que prefieras)
   - **Database Password**: Genera una contraseña segura y guárdala
   - **Region**: Elige la más cercana (ej: `eu-west-1` para Europa)
5. Click en "Create new project"
6. Espera unos 2 minutos mientras se aprovisiona el proyecto

### Paso 1.2: Ejecutar script SQL

1. En el dashboard de Supabase, ve a **SQL Editor** en el menú lateral
2. Click en "New query"
3. Copia todo el contenido del archivo `setup-supabase.sql`
4. Pégalo en el editor SQL
5. Click en "Run" o presiona `Ctrl+Enter`
6. Verifica que aparezca el mensaje "Success. No rows returned"

### Paso 1.3: Verificar configuración

1. Ve a **Table Editor** en el menú lateral
2. Deberías ver la tabla `contact_submissions`
3. Click en la tabla para ver su estructura
4. Verifica que tiene todos los campos:
   - id, name, email, phone, topic, subject, message, preference
   - ip_address, user_agent, created_at, updated_at, status

### Paso 1.4: Obtener credenciales

1. Ve a **Project Settings** (ícono de engranaje en la parte inferior)
2. Click en **API** en el menú de configuración
3. Copia y guarda estos valores:
   - **Project URL** → Esto es tu `SUPABASE_URL`
   - **anon public** key → No lo necesitamos para el worker
   - **service_role** key → Esto es tu `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **¡SECRETO!**

⚠️ **IMPORTANTE**: El `service_role` key tiene permisos completos. NO lo expongas públicamente.

---

## 2️⃣ Configurar Resend

### Paso 2.1: Crear cuenta

1. Ve a [https://resend.com](https://resend.com)
2. Click en "Sign Up" o "Get Started"
3. Crea una cuenta con tu email
4. Verifica tu email

### Paso 2.2: Agregar dominio

1. En el dashboard, ve a **Domains**
2. Click en "Add Domain"
3. Ingresa: `ncs-psicologa.com`
4. Click en "Add"

### Paso 2.3: Configurar DNS

Resend te mostrará varios registros DNS que debes agregar. En tu proveedor de DNS (ej: Cloudflare), agrega estos registros:

**DKIM Records** (generalmente 3 registros TXT):
```
Tipo: TXT
Nombre: resend._domainkey
Valor: [valor proporcionado por Resend]
```

**SPF Record**:
```
Tipo: TXT
Nombre: @
Valor: v=spf1 include:_spf.resend.com ~all
```

**DMARC Record** (opcional pero recomendado):
```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:nelly@ncs-psicologa.com
```

### Paso 2.4: Verificar dominio

1. Después de agregar los registros DNS, espera 5-10 minutos
2. En Resend, click en "Verify DNS Records"
3. Si todo está correcto, verás un check verde ✅
4. Si hay errores, revisa los registros y vuelve a intentar

💡 **Tip**: La propagación de DNS puede tomar hasta 24 horas, pero generalmente es rápido.

### Paso 2.5: Obtener API Key

1. En Resend, ve a **API Keys**
2. Click en "Create API Key"
3. Configura:
   - **Name**: `NCS Contact Form Worker`
   - **Permission**: `Sending access` (o `Full access` si prefieres)
   - **Domain**: Selecciona `ncs-psicologa.com`
4. Click en "Add"
5. **COPIA LA API KEY AHORA** → No podrás verla después
6. Guárdala de forma segura → Esto es tu `RESEND_API_KEY`

---

## 3️⃣ Configurar emails

Define los emails que se usarán:

- **Email FROM** (quien envía): `noreply@ncs-psicologa.com`
- **Email TO** (quien recibe): `nelly@ncs-psicologa.com` (o el email de la psicóloga)

Guarda estos valores para configurar el worker:
- `CONTACT_EMAIL_FROM=noreply@ncs-psicologa.com`
- `CONTACT_EMAIL_TO=nelly@ncs-psicologa.com`

---

## 4️⃣ Resumen de credenciales

Al completar los pasos anteriores, deberías tener estas credenciales:

```bash
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxx

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Emails
CONTACT_EMAIL_FROM=noreply@ncs-psicologa.com
CONTACT_EMAIL_TO=nelly@ncs-psicologa.com

# Configuración (opcional)
CORS_ORIGIN=https://ncs-psicologa.com
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW=3600
```

⚠️ **SEGURIDAD**: Guarda estas credenciales en un lugar seguro (ej: 1Password, LastPass). NO las subas a Git.

---

## 5️⃣ Probar Resend (opcional)

Puedes probar que Resend funciona enviando un email de prueba:

1. Ve a **Emails** en el dashboard de Resend
2. Click en "Send Test Email"
3. Configura:
   - **From**: `noreply@ncs-psicologa.com`
   - **To**: Tu email personal
   - **Subject**: `Test desde Resend`
   - **Body**: Cualquier mensaje
4. Click en "Send"
5. Verifica que recibiste el email en tu bandeja de entrada

Si no lo recibes, revisa:
- Carpeta de spam
- Configuración DNS
- Estado de verificación del dominio

---

## ✅ Siguiente paso

Una vez completados todos estos pasos, estás listo para:
- Desarrollar el worker (Tarea 3)
- O si ya está desarrollado, configurar los secrets y desplegarlo (Tarea 9)

---

## 🆘 Solución de problemas

### Supabase

**Error: relation "contact_submissions" does not exist**
- Verifica que ejecutaste el script SQL completo
- Ve a Table Editor y comprueba que la tabla existe

**Error: permission denied for table contact_submissions**
- Verifica que RLS está habilitado
- Verifica que las políticas se crearon correctamente
- Asegúrate de usar el `service_role` key, no el `anon` key

### Resend

**Error: Domain not verified**
- Espera 10-30 minutos después de agregar los registros DNS
- Verifica que los registros están correctamente configurados en tu DNS provider
- Usa herramientas como [MXToolbox](https://mxtoolbox.com/) para verificar registros

**Error: API key invalid**
- Verifica que copiaste la API key completa
- Asegúrate de que la key tiene permisos de envío
- Crea una nueva API key si la perdiste

**Emails van a spam**
- Configura DMARC correctamente
- Envía algunos emails de prueba para "calentar" el dominio
- Considera configurar un `Return-Path`

