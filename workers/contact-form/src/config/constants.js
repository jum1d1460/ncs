/**
 * Constantes de configuración para el worker
 */

// Códigos de error
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_REQUEST: 'INVALID_REQUEST',
};

// Mensajes de error (en español)
export const ERROR_MESSAGES = {
  [ERROR_CODES.VALIDATION_ERROR]: 'Los datos del formulario son inválidos',
  [ERROR_CODES.RATE_LIMIT_EXCEEDED]: 'Demasiados envíos. Por favor, intenta más tarde',
  [ERROR_CODES.EMAIL_SEND_FAILED]: 'Error al enviar el email de notificación',
  [ERROR_CODES.DATABASE_ERROR]: 'Error al guardar los datos',
  [ERROR_CODES.INTERNAL_ERROR]: 'Error interno del servidor. Por favor, intenta más tarde',
  [ERROR_CODES.INVALID_REQUEST]: 'Solicitud inválida',
};

// Headers de seguridad
export const SECURITY_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Configuración de rate limiting (valores por defecto)
export const RATE_LIMIT_DEFAULTS = {
  MAX: 10,
  WINDOW: 3600, // 1 hora en segundos
};

// Timeouts
export const TIMEOUTS = {
  EMAIL: 10000, // 10 segundos
  DATABASE: 10000, // 10 segundos
};

// Versión del worker
export const VERSION = '1.0.0';

