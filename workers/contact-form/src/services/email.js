/**
 * Servicio de email con Resend
 */

import { TIMEOUTS } from '../config/constants.js';

/**
 * Template HTML para el email de notificación
 * @param {Object} data - Datos del formulario
 * @param {Object} metadata - Metadata (timestamp, IP, user agent)
 * @returns {string} HTML del email
 */
function createEmailTemplate(data, metadata) {
  const { name, email, phone, topic, subject, message, preference } = data;
  const { timestamp, ip, userAgent } = metadata;

  // Mapeo de preferencias a texto legible
  const preferenceText = {
    email: 'Email',
    phone: 'Teléfono',
    any: 'Cualquiera',
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva consulta - NCS Psicóloga</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-top: 0;
    }
    h3 {
      color: #2c3e50;
      margin-top: 25px;
      margin-bottom: 10px;
    }
    .info-list {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid #3498db;
    }
    .info-item {
      margin: 8px 0;
    }
    .label {
      font-weight: 600;
      color: #555;
    }
    .message-box {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid #2ecc71;
      margin: 15px 0;
    }
    .metadata {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 0.9em;
      color: #666;
    }
    .highlight {
      background: #fff3cd;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>📬 Nueva consulta recibida</h2>
    
    <h3>Datos del contacto:</h3>
    <div class="info-list">
      <div class="info-item">
        <span class="label">Nombre:</span> ${name}
      </div>
      <div class="info-item">
        <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
      </div>
      ${phone ? `
      <div class="info-item">
        <span class="label">Teléfono:</span> <a href="tel:${phone}">${phone}</a>
      </div>
      ` : ''}
      ${topic ? `
      <div class="info-item">
        <span class="label">Tipo de consulta:</span> ${topic}
      </div>
      ` : ''}
      <div class="info-item">
        <span class="label">Preferencia de contacto:</span> 
        <span class="highlight">${preferenceText[preference] || preference}</span>
      </div>
    </div>
    
    <h3>Mensaje:</h3>
    <div class="info-item">
      <span class="label">Asunto:</span> <strong>${subject}</strong>
    </div>
    <div class="message-box">
      ${message.replace(/\n/g, '<br>')}
    </div>
    
    <div class="metadata">
      <div class="info-item">
        <span class="label">Fecha:</span> ${new Date(timestamp).toLocaleString('es-ES', {
          timeZone: 'Europe/Madrid',
          dateStyle: 'full',
          timeStyle: 'short',
        })}
      </div>
      ${ip ? `
      <div class="info-item">
        <span class="label">IP:</span> ${ip}
      </div>
      ` : ''}
      ${userAgent ? `
      <div class="info-item">
        <span class="label">Navegador:</span> ${userAgent}
      </div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Envía un email de notificación usando Resend
 * @param {Object} contactData - Datos del formulario validados
 * @param {Object} metadata - Metadata (IP, user agent, timestamp)
 * @param {Object} env - Variables de entorno
 * @returns {Promise<Object>} Resultado del envío
 */
export async function sendEmail(contactData, metadata, env) {
  const { RESEND_API_KEY, CONTACT_EMAIL_FROM, CONTACT_EMAIL_TO } = env;

  // Validar que tenemos las credenciales necesarias
  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY no configurado');
  }
  if (!CONTACT_EMAIL_FROM) {
    throw new Error('CONTACT_EMAIL_FROM no configurado');
  }
  if (!CONTACT_EMAIL_TO) {
    throw new Error('CONTACT_EMAIL_TO no configurado');
  }

  // Crear el HTML del email
  const html = createEmailTemplate(contactData, metadata);

  // Preparar payload para Resend
  const payload = {
    from: CONTACT_EMAIL_FROM,
    to: CONTACT_EMAIL_TO,
    reply_to: contactData.email,
    subject: `Nueva consulta: ${contactData.subject}`,
    html,
  };

  try {
    // Llamar a la API de Resend con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUTS.EMAIL);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parsear respuesta
    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Resend:', data);
      throw new Error(data.message || 'Error al enviar email');
    }

    return {
      success: true,
      messageId: data.id,
    };

  } catch (error) {
    console.error('Error enviando email:', error);
    
    // Distinguir entre timeout y otros errores
    if (error.name === 'AbortError') {
      throw new Error('Timeout al enviar email');
    }
    
    throw error;
  }
}

