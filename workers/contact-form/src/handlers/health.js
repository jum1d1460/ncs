/**
 * Health check handler
 */

import { VERSION } from '../config/constants.js';
import { successResponse } from '../utils/response.js';

/**
 * Maneja requests de health check
 * @param {Request} request - Request de Cloudflare
 * @param {Object} env - Variables de entorno
 * @returns {Response}
 */
export async function handleHealth(request, env) {
  const healthData = {
    status: 'healthy',
    version: VERSION,
    environment: env.ENVIRONMENT || 'unknown',
    timestamp: new Date().toISOString(),
  };

  return successResponse(healthData);
}

