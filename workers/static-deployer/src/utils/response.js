/**
 * Utilidades de respuesta del Static Deployer Worker
 */

import { HTTP_STATUS, CORS_HEADERS } from '../config/constants.js';

/**
 * Respuesta exitosa con datos
 */
export function successResponse(data, status = HTTP_STATUS.OK, env) {
  return new Response(JSON.stringify({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    environment: env?.ENVIRONMENT || 'unknown'
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS
    }
  });
}

/**
 * Respuesta de error
 */
export function errorResponse(message, status = HTTP_STATUS.INTERNAL_ERROR, details = null, env) {
  const response = {
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    environment: env?.ENVIRONMENT || 'unknown'
  };

  // Solo incluir detalles en desarrollo
  if (details && env?.ENVIRONMENT === 'development') {
    response.details = details;
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS
    }
  });
}

/**
 * Respuesta para OPTIONS (CORS preflight)
 */
export function optionsResponse(env) {
  return new Response(null, {
    status: HTTP_STATUS.OK,
    headers: CORS_HEADERS
  });
}

/**
 * Respuesta de validación HMAC
 */
export function unauthorizedResponse(message = 'No autorizado', env) {
  return errorResponse(message, HTTP_STATUS.UNAUTHORIZED, null, env);
}

/**
 * Respuesta de rate limiting
 */
export function rateLimitResponse(message = 'Demasiadas solicitudes', env) {
  return errorResponse(message, HTTP_STATUS.TOO_MANY_REQUESTS, null, env);
}
