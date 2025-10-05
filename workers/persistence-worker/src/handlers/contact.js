/**
 * Handler del formulario de contacto
 */

import { validateContactForm, sanitizeContactData } from '../utils/validation.js';
import { checkRateLimit } from '../utils/rateLimiter.js';
import { sendEmail } from '../services/email.js';
import { insertSubmission } from '../services/supabase.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Extrae la IP real del request considerando proxies de Cloudflare
 * @param {Request} request - Request de Cloudflare
 * @returns {string} IP address
 */
function getClientIP(request) {
  // Cloudflare provee la IP real en este header
  return request.headers.get('CF-Connecting-IP') || 
         request.headers.get('X-Forwarded-For')?.split(',')[0] ||
         '0.0.0.0';
}

/**
 * Extrae el User-Agent del request
 * @param {Request} request - Request de Cloudflare
 * @returns {string} User agent string
 */
function getUserAgent(request) {
  return request.headers.get('User-Agent') || 'Unknown';
}

/**
 * Maneja requests del formulario de contacto
 * @param {Request} request - Request de Cloudflare
 * @param {Object} env - Variables de entorno
 * @returns {Response}
 */
export async function handleContact(request, env) {
  try {
    // 1. Extraer IP y User-Agent
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    // 2. Verificar rate limit
    const rateLimitResult = checkRateLimit(ip, env);
    
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${ip}`);
      
      return errorResponse(
        ERROR_MESSAGES[ERROR_CODES.RATE_LIMIT_EXCEEDED],
        429,
        {
          retryAfter: rateLimitResult.retryAfter,
          resetAt: new Date(rateLimitResult.resetAt).toISOString(),
        },
        env
      );
    }

    // 3. Parsear request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      
      return errorResponse(
        ERROR_MESSAGES[ERROR_CODES.INVALID_REQUEST],
        400,
        { message: 'JSON inválido' },
        env
      );
    }

    // 4. Sanitizar inputs
    const sanitizedData = sanitizeContactData(body);

    // 5. Validar datos con Zod
    const validation = validateContactForm(sanitizedData);
    
    if (!validation.success) {
      console.warn('Validation failed:', validation.errors);
      
      return errorResponse(
        ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR],
        400,
        validation.errors,
        env
      );
    }

    const contactData = validation.data;

    // 6. Preparar metadata
    const metadata = {
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    };

    // 7. Procesar en paralelo: enviar email Y guardar en base de datos
    const results = await Promise.allSettled([
      sendEmail(contactData, metadata, env),
      insertSubmission(contactData, metadata, env),
    ]);

    const [emailResult, dbResult] = results;

    // Verificar resultados
    const emailSuccess = emailResult.status === 'fulfilled';
    const dbSuccess = dbResult.status === 'fulfilled';

    // Log de errores
    if (!emailSuccess) {
      console.error('Email failed:', emailResult.reason);
    }
    if (!dbSuccess) {
      console.error('Database failed:', dbResult.reason);
    }

    // Si ambos fallaron, error 500
    if (!emailSuccess && !dbSuccess) {
      return errorResponse(
        ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
        500,
        env.ENVIRONMENT === 'development' ? {
          emailError: emailResult.reason?.message,
          dbError: dbResult.reason?.message,
        } : null,
        env
      );
    }

    // Si solo el email falló, advertencia pero success (se guardó en DB)
    if (!emailSuccess && dbSuccess) {
      console.warn('Email failed but submission saved to database');
      
      return successResponse(
        {
          success: true,
          message: 'Tu mensaje ha sido guardado. Nos pondremos en contacto contigo pronto.',
          warning: 'Email notification failed',
          submissionId: dbResult.value.id,
        },
        200,
        env
      );
    }

    // Si solo la DB falló, advertencia pero success (se envió el email)
    if (emailSuccess && !dbSuccess) {
      console.warn('Database failed but email sent');
      
      return successResponse(
        {
          success: true,
          message: 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.',
          warning: 'Database save failed',
          emailId: emailResult.value.messageId,
        },
        200,
        env
      );
    }

    // 8. Todo exitoso!
    console.log('Contact form submitted successfully:', {
      email: contactData.email,
      submissionId: dbResult.value.id,
      emailId: emailResult.value.messageId,
    });

    return successResponse(
      {
        success: true,
        message: 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.',
      },
      200,
      env
    );

  } catch (error) {
    // Error inesperado
    console.error('Unexpected error in handleContact:', error);
    
    return errorResponse(
      ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
      500,
      env.ENVIRONMENT === 'development' ? {
        message: error.message,
        stack: error.stack,
      } : null,
      env
    );
  }
}

