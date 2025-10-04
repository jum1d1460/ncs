/**
 * Rate Limiter simple basado en memoria
 * Limita requests por IP address
 */

import { RATE_LIMIT_DEFAULTS } from '../config/constants.js';

// Map para almacenar timestamps de requests por IP
// Estructura: { ip: [timestamp1, timestamp2, ...] }
const requestMap = new Map();

// Último cleanup
let lastCleanup = Date.now();

/**
 * Limpia entradas antiguas del Map (para evitar memory leaks)
 */
function cleanup() {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;

  // Solo hacer cleanup cada 5 minutos
  if (now - lastCleanup < fiveMinutes) {
    return;
  }

  lastCleanup = now;

  // Remover IPs sin requests recientes
  for (const [ip, timestamps] of requestMap.entries()) {
    if (timestamps.length === 0) {
      requestMap.delete(ip);
    }
  }
}

/**
 * Verifica si una IP ha excedido el rate limit
 * @param {string} ip - IP address
 * @param {Object} env - Variables de entorno con configuración de rate limit
 * @returns {Object} Resultado de la verificación
 * @returns {boolean} result.allowed - Si el request está permitido
 * @returns {number} result.remaining - Requests restantes en la ventana actual
 * @returns {number} result.resetAt - Timestamp cuando se resetea el límite
 */
export function checkRateLimit(ip, env) {
  // Obtener configuración
  const maxRequests = parseInt(env.RATE_LIMIT_MAX) || RATE_LIMIT_DEFAULTS.MAX;
  const windowSeconds = parseInt(env.RATE_LIMIT_WINDOW) || RATE_LIMIT_DEFAULTS.WINDOW;
  const windowMs = windowSeconds * 1000;

  const now = Date.now();
  const windowStart = now - windowMs;

  // Obtener timestamps de esta IP
  let timestamps = requestMap.get(ip) || [];

  // Filtrar solo timestamps dentro de la ventana actual
  timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

  // Verificar si excedió el límite
  if (timestamps.length >= maxRequests) {
    // Calcular cuándo se resetea (timestamp más antiguo + ventana)
    const oldestTimestamp = Math.min(...timestamps);
    const resetAt = oldestTimestamp + windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfter: Math.ceil((resetAt - now) / 1000), // segundos
    };
  }

  // Request permitido
  timestamps.push(now);
  requestMap.set(ip, timestamps);

  // Hacer cleanup periódico
  cleanup();

  return {
    allowed: true,
    remaining: maxRequests - timestamps.length,
    resetAt: now + windowMs,
  };
}

/**
 * Resetea el rate limit para una IP específica (útil para testing)
 * @param {string} ip - IP address
 */
export function resetRateLimit(ip) {
  requestMap.delete(ip);
}

/**
 * Obtiene estadísticas del rate limiter (útil para debugging)
 * @returns {Object} Estadísticas
 */
export function getRateLimitStats() {
  return {
    totalIPs: requestMap.size,
    lastCleanup: new Date(lastCleanup).toISOString(),
  };
}

