/**
 * Cloudflare Worker SIN validación HMAC para ncs-deploy
 * Recibe webhooks de Sanity y dispara GitHub repository_dispatch
 * 
 * Variables de entorno requeridas:
 * - GITHUB_TOKEN: Personal Access Token con scope 'repo'
 * - GITHUB_REPO: Formato 'owner/repo' (ej. 'jumidi/ncs')
 * - WEBHOOK_SECRET: Secreto compartido con Sanity (NO se usa para validación)
 */

export default {
  async fetch(request, env) {
    // Manejar CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-sanity-signature'
        }
      })
    }

    // Solo aceptar POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { 
        status: 405,
        headers: { 
          'Allow': 'POST',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }

    try {
      // Obtener el body del request
      const bodyText = await request.text()
      const signature = request.headers.get('x-sanity-signature') || ''
      
      // Log de información del request (sin validación HMAC)
      console.log('Request info:', {
        hasWebhookSecret: !!env.WEBHOOK_SECRET,
        signatureLength: signature.length,
        bodyLength: bodyText.length,
        signature: signature.substring(0, 10) + '...',
        bodyPreview: bodyText.substring(0, 100) + '...'
      })

      // NO validar HMAC - solo log
      console.log('Skipping HMAC validation for debugging')

      // Validar variables de entorno
      console.log('Environment check:', {
        hasGithubToken: !!env.GITHUB_TOKEN,
        hasGithubRepo: !!env.GITHUB_REPO,
        githubRepo: env.GITHUB_REPO,
        tokenLength: env.GITHUB_TOKEN ? env.GITHUB_TOKEN.length : 0
      })

      if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
        console.error('Missing required environment variables:', {
          GITHUB_TOKEN: env.GITHUB_TOKEN ? 'present' : 'missing',
          GITHUB_REPO: env.GITHUB_REPO ? 'present' : 'missing'
        })
        return new Response('Server configuration error - missing environment variables', { 
          status: 500,
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
      }

      // Parsear el payload de Sanity
      let payload
      try {
        payload = JSON.parse(bodyText)
      } catch (e) {
        console.error('Invalid JSON payload:', e)
        return new Response('Invalid JSON payload', { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
      }

      // Log del webhook recibido
      console.log('Sanity webhook received:', {
        type: payload.type,
        action: payload.action,
        documentId: payload.document?._id,
        timestamp: new Date().toISOString()
      })

      // Disparar GitHub repository_dispatch
      const githubResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.everest-preview+json',
          'Content-Type': 'application/json',
          'User-Agent': 'ncs-deploy-webhook/1.0 (https://github.com/jumidi/ncs)'
        },
        body: JSON.stringify({
          event_type: 'sanity-content-changed'
        })
      })
      
      if (!githubResponse.ok) {
        const errorText = await githubResponse.text()
        console.error('GitHub dispatch failed:', githubResponse.status, errorText)
        return new Response(`GitHub dispatch failed: ${githubResponse.status}`, { 
          status: 502,
          headers: { 'Access-Control-Allow-Origin': '*' }
        })
      }

      console.log('GitHub dispatch triggered successfully')
      
      return new Response(JSON.stringify({
        status: 'success',
        message: 'Webhook processed and GitHub dispatch triggered (no HMAC validation)',
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-sanity-signature'
        }
      })

    } catch (error) {
      console.error('Worker error:', error)
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
}
