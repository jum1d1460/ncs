/**
 * Utilidades para crear respuestas HTTP
 */

import { SECURITY_HEADERS } from '../config/constants.js';

/**
 * Crea CORS headers basado en el origen configurado
 * @param {Object} env - Variables de entorno
 * @returns {Object} Headers de CORS
 */
export function getCORSHeaders(env) {
  const origin = env.CORS_ORIGIN || '*';
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Crea respuesta de éxito
 * @param {Object} data - Datos a retornar
 * @param {number} status - Código de status HTTP (default: 200)
 * @param {Object} env - Variables de entorno para CORS
 * @returns {Response}
 */
export function successResponse(data, status = 200, env = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...getCORSHeaders(env),
    },
  });
}

/**
 * Crea respuesta de error
 * @param {string} error - Mensaje de error
 * @param {number} status - Código de status HTTP
 * @param {Object} details - Detalles adicionales del error (opcional)
 * @param {Object} env - Variables de entorno para CORS
 * @returns {Response}
 */
export function errorResponse(error, status = 500, details = null, env = {}) {
  const body = {
    success: false,
    error,
  };

  if (details) {
    body.details = details;
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...getCORSHeaders(env),
    },
  });
}

/**
 * Crea respuesta para OPTIONS (preflight CORS)
 * @param {Object} env - Variables de entorno
 * @returns {Response}
 */
export function optionsResponse(env) {
  return new Response(null, {
    status: 204,
    headers: {
      ...getCORSHeaders(env),
    },
  });
}

