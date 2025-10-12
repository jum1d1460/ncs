/**
 * Static Deployer Worker - Punto de entrada principal
 * 
 * Worker de Cloudflare para:
 * 1. Recibir webhooks de Sanity y disparar despliegues
 * 2. Servir archivos estáticos del sitio web
 * 3. Manejar health checks y monitoreo
 */

import { handleWebhook } from './handlers/webhook.js';
import { handleStatic } from './handlers/static.js';
import { handleHealth } from './handlers/health.js';
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

      // Webhook de Sanity para disparar despliegues
      if (url.pathname === '/webhook/sanity' && method === 'POST') {
        return handleWebhook(request, env);
      }

      // Servir archivos estáticos (fallback)
      if (method === 'GET') {
        return handleStatic(request, env);
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
