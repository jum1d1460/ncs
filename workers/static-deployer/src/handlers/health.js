/**
 * Health Check Handler
 */

import { successResponse } from '../utils/response.js';

/**
 * Manejar health check
 */
export async function handleHealth(request, env) {
  const healthData = {
    status: 'healthy',
    service: 'ncs-static-deployer',
    version: '1.0.0',
    environment: env.ENVIRONMENT || 'unknown',
    siteName: env.SITE_NAME || 'NCS Psicóloga',
    siteUrl: env.SITE_URL || 'https://ncs-psicologa.com',
    timestamp: new Date().toISOString(),
    uptime: Date.now(),
    features: {
      webhook: !!env.GITHUB_TOKEN && !!env.GITHUB_REPO,
      staticServing: true,
      cors: true
    }
  };

  return successResponse(healthData, 200, env);
}
