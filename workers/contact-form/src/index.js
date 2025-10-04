/**
 * Contact Form Worker - Punto de entrada principal
 * 
 * Worker de Cloudflare para procesar formularios de contacto de NCS Psicóloga.
 * Maneja validación, envío de emails, y almacenamiento en Supabase.
 */

import { handleHealth } from './handlers/health.js';
import { handleContact } from './handlers/contact.js';
import { optionsResponse, errorResponse } from './utils/response.js';
import { ERROR_CODES, ERROR_MESSAGES } from './config/constants.js';

/**
 * Router principal del worker
 */
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const method = request.method;

      // Manejar preflight CORS
      if (method === 'OPTIONS') {
        return optionsResponse(env);
      }

      // Health check
      if (url.pathname === '/health' && method === 'GET') {
        return handleHealth(request, env);
      }

      // Endpoint de contacto
      if (url.pathname === '/api/contact' && method === 'POST') {
        return handleContact(request, env);
      }

      // Ruta no encontrada
      return errorResponse(
        'Ruta no encontrada',
        404,
        { path: url.pathname },
        env
      );

    } catch (error) {
      // Error no manejado
      console.error('Error no manejado:', error);
      
      return errorResponse(
        ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR],
        500,
        env.ENVIRONMENT === 'development' ? { message: error.message } : null,
        env
      );
    }
  },
};

