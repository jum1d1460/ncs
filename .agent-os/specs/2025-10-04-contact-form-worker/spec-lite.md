# Spec Summary (Lite)

Desarrollar un worker de Cloudflare que procese el formulario de contacto de NCS Psicóloga, validando datos, enviando notificaciones por email vía Resend, y almacenando submissions en Supabase. El worker incluye validación robusta, rate limiting, seguridad CORS, y se integra con el frontend existente mediante AJAX para proporcionar feedback inmediato al usuario.

