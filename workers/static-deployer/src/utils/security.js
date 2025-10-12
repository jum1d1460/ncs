/**
 * Utilidades de seguridad del Static Deployer Worker
 */

/**
 * Validar HMAC signature
 */
export async function validateHMAC(body, signature, secret) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
    const digest = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
    
    return signature === digest;
  } catch (error) {
    console.error('HMAC validation error:', error);
    return false;
  }
}

/**
 * Validar token de GitHub
 */
export function validateGitHubToken(token) {
  // Validación básica del formato del token
  return token && token.length > 20 && token.startsWith('ghp_');
}

/**
 * Sanitizar entrada de usuario
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover < y >
    .substring(0, 1000); // Limitar longitud
}

/**
 * Validar formato de repo GitHub
 */
export function validateGitHubRepo(repo) {
  const repoPattern = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
  return repoPattern.test(repo);
}
