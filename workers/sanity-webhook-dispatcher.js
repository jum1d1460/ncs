/**
 * Cloudflare Worker para recibir webhooks de Sanity y disparar GitHub repository_dispatch
 * 
 * Variables de entorno requeridas:
 * - GITHUB_TOKEN: Personal Access Token con scope 'repo'
 * - GITHUB_REPO: Formato 'owner/repo' (ej. 'jumidi/ncs')
 * - WEBHOOK_SECRET: Secreto compartido con Sanity (opcional)
 */

export default {
  async fetch(request, env, ctx) {
    // Solo aceptar POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { 
        status: 405,
        headers: { 'Allow': 'POST' }
      })
    }

    try {
      // Obtener el body del request
      const bodyText = await request.text()
      const signature = request.headers.get('x-sanity-signature') || ''
      
      // Validar HMAC si está configurado el secreto
      if (env.WEBHOOK_SECRET) {
        const isValid = await validateHMAC(bodyText, signature, env.WEBHOOK_SECRET)
        if (!isValid) {
          console.error('Invalid HMAC signature')
          return new Response('Invalid signature', { status: 401 })
        }
      }

      // Validar variables de entorno
      if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
        console.error('Missing required environment variables')
        return new Response('Server configuration error', { status: 500 })
      }

      // Parsear el payload de Sanity
      let payload
      try {
        payload = JSON.parse(bodyText)
      } catch (e) {
        console.error('Invalid JSON payload:', e)
        return new Response('Invalid JSON payload', { status: 400 })
      }

      // Log del webhook recibido
      console.log('Sanity webhook received:', {
        type: payload.type,
        action: payload.action,
        documentId: payload.document?._id,
        timestamp: new Date().toISOString()
      })

      // Disparar GitHub repository_dispatch
      const githubResponse = await triggerGitHubDispatch(env.GITHUB_TOKEN, env.GITHUB_REPO)
      
      if (!githubResponse.ok) {
        const errorText = await githubResponse.text()
        console.error('GitHub dispatch failed:', githubResponse.status, errorText)
        return new Response(`GitHub dispatch failed: ${githubResponse.status}`, { status: 502 })
      }

      console.log('GitHub dispatch triggered successfully')
      
      return new Response(JSON.stringify({
        status: 'success',
        message: 'Webhook processed and GitHub dispatch triggered',
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
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },

  // Manejar OPTIONS para CORS
  async handleOptions(request) {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-sanity-signature'
      }
    })
  }
}

/**
 * Validar HMAC signature
 */
async function validateHMAC(body, signature, secret) {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
    const digest = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
    
    return signature === digest
  } catch (error) {
    console.error('HMAC validation error:', error)
    return false
  }
}

/**
 * Disparar GitHub repository_dispatch
 */
async function triggerGitHubDispatch(token, repo) {
  const url = `https://api.github.com/repos/${repo}/dispatches`
  
  return fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.everest-preview+json',
      'Content-Type': 'application/json',
      'User-Agent': 'sanity-webhook-dispatcher/1.0'
    },
    body: JSON.stringify({
      event_type: 'sanity-content-changed'
    })
  })
}
