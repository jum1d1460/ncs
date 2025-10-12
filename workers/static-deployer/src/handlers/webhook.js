/**
 * Webhook Handler para Sanity
 */

import { errorResponse, unauthorizedResponse } from '../utils/response.js';
import { ERROR_CODES } from '../config/constants.js';
import { validateHMAC } from '../utils/security.js';
import { triggerGitHubDispatch } from '../services/github.js';

/**
 * Manejar webhook de Sanity
 */
export async function handleWebhook(request, env) {
  try {
    // Validar método
    if (request.method !== 'POST') {
      return errorResponse('Método no permitido', 405, { method: request.method }, env);
    }

    // Obtener el body del request
    const bodyText = await request.text();
    const signature = request.headers.get('x-sanity-signature') || '';
    
    // Validar HMAC si está configurado el secreto
    if (env.WEBHOOK_SECRET) {
      const isValid = await validateHMAC(bodyText, signature, env.WEBHOOK_SECRET);
      if (!isValid) {
        console.error('Invalid HMAC signature');
        return unauthorizedResponse('Firma HMAC inválida', env);
      }
    }

    // Validar variables de entorno
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
      console.error('Missing required environment variables');
      return errorResponse(
        'Configuración del servidor incompleta',
        500,
        { missing: ['GITHUB_TOKEN', 'GITHUB_REPO'].filter(key => !env[key]) },
        env
      );
    }

    // Parsear el payload de Sanity
    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch (e) {
      console.error('Invalid JSON payload:', e);
      return errorResponse('Payload JSON inválido', 400, { error: e.message }, env);
    }

    // Log del webhook recibido
    console.log('Sanity webhook received:', {
      type: payload.type,
      action: payload.action,
      documentId: payload.document?._id,
      timestamp: new Date().toISOString(),
      environment: env.ENVIRONMENT
    });

    // Disparar GitHub repository_dispatch
    const githubResponse = await triggerGitHubDispatch(env.GITHUB_TOKEN, env.GITHUB_REPO);
    
    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      console.error('GitHub dispatch failed:', githubResponse.status, errorText);
      return errorResponse(
        'Error al disparar despliegue en GitHub',
        502,
        { 
          status: githubResponse.status,
          error: errorText,
          repo: env.GITHUB_REPO
        },
        env
      );
    }

    console.log('GitHub dispatch triggered successfully', {
      repo: env.GITHUB_REPO,
      environment: env.ENVIRONMENT
    });
    
    return successResponse({
      message: 'Webhook procesado y despliegue disparado exitosamente',
      webhook: {
        type: payload.type,
        action: payload.action,
        documentId: payload.document?._id
      },
      deployment: {
        triggered: true,
        repo: env.GITHUB_REPO,
        timestamp: new Date().toISOString()
      }
    }, 200, env);

  } catch (error) {
    console.error('Webhook handler error:', error);
    return errorResponse(
      'Error interno al procesar webhook',
      500,
      env.ENVIRONMENT === 'development' ? { message: error.message } : null,
      env
    );
  }
}
