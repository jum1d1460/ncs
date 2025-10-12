/**
 * Static Files Handler
 * 
 * Maneja el servicio de archivos estáticos como fallback
 * (Normalmente esto se maneja con Cloudflare Pages)
 */

import { errorResponse } from '../utils/response.js';

/**
 * Manejar solicitudes de archivos estáticos
 */
export async function handleStatic(request, env) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Para Workers con assets, el binding se llama ASSETS
    const assets = env.ASSETS || env.assets || env.__STATIC_CONTENT;
    
    if (!assets) {
      console.error('No se encontró binding de assets:', Object.keys(env));
      return errorResponse(
        'Assets binding no encontrado',
        500,
        { availableBindings: Object.keys(env) },
        env
      );
    }

    // Delegar al binding de assets de Cloudflare
    return assets.fetch(request);

  } catch (error) {
    console.error('Static handler error:', error);
    return errorResponse(
      'Error al servir archivo estático',
      500,
      env.ENVIRONMENT === 'development' ? { message: error.message } : null,
      env
    );
  }
}
