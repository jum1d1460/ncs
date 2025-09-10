/**
 * Cloudflare Worker para probar variables de entorno
 * Muestra todas las variables disponibles en env
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

    try {
      // Obtener el body del request
      const bodyText = await request.text()
      
      // Mostrar todas las variables de entorno disponibles
      const envInfo = {
        // Variables normales (vars)
        GITHUB_REPO: env.GITHUB_REPO,
        
        // Variables secretas (secrets)
        GITHUB_TOKEN: env.GITHUB_TOKEN ? '***CONFIGURADO***' : 'NO CONFIGURADO',
        WEBHOOK_SECRET: env.WEBHOOK_SECRET ? '***CONFIGURADO***' : 'NO CONFIGURADO',
        
        // Información del request
        requestMethod: request.method,
        requestUrl: request.url,
        bodyLength: bodyText.length,
        bodyPreview: bodyText.substring(0, 200) + '...',
        
        // Headers importantes
        contentType: request.headers.get('content-type'),
        sanitySignature: request.headers.get('x-sanity-signature'),
        userAgent: request.headers.get('user-agent'),
        
        // Timestamp
        timestamp: new Date().toISOString()
      }

      console.log('Environment variables test:', envInfo)

      return new Response(JSON.stringify({
        status: 'success',
        message: 'Environment variables test completed',
        envInfo: envInfo
      }, null, 2), {
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
      }, null, 2), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
}
