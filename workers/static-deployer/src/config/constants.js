/**
 * Constantes del Static Deployer Worker
 */

export const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  GITHUB_ERROR: 'GITHUB_ERROR',
  WEBHOOK_ERROR: 'WEBHOOK_ERROR'
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.INTERNAL_ERROR]: 'Error interno del servidor',
  [ERROR_CODES.INVALID_REQUEST]: 'Solicitud inválida',
  [ERROR_CODES.UNAUTHORIZED]: 'No autorizado',
  [ERROR_CODES.NOT_FOUND]: 'Recurso no encontrado',
  [ERROR_CODES.RATE_LIMITED]: 'Demasiadas solicitudes',
  [ERROR_CODES.GITHUB_ERROR]: 'Error al comunicarse con GitHub',
  [ERROR_CODES.WEBHOOK_ERROR]: 'Error al procesar webhook'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

export const WEBHOOK_EVENTS = {
  SANITY_CONTENT_CHANGED: 'sanity-content-changed',
  DEPLOYMENT_TRIGGERED: 'deployment-triggered'
};

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-sanity-signature',
  'Access-Control-Max-Age': '86400'
};
