/**
 * Persistence Worker - Punto de entrada principal
 * 
 * Worker de Cloudflare para persistir datos en Supabase de NCS Psicóloga.
 * Maneja formularios de contacto, citas, leads, tests y otros datos.
 */

import { handleHealth } from './handlers/health.js';
import { handleContact } from './handlers/contact.js';
import { handleAppointment } from './handlers/appointment.js';
import { handleLead } from './handlers/lead.js';
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

      // Endpoints de persistencia
      if (url.pathname === '/api/contact' && method === 'POST') {
        return handleContact(request, env);
      }

      // Endpoint para solicitudes de primera cita
      if (url.pathname === '/api/appointment' && method === 'POST') {
        return handleAppointment(request, env);
      }

      // Endpoint para leads de formularios de tests
      if (url.pathname === '/api/lead' && method === 'POST') {
        return handleLead(request, env);
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

