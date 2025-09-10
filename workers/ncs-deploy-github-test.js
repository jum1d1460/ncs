/**
 * Cloudflare Worker para probar específicamente GitHub API
 * Muestra información detallada del token y la petición a GitHub
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
      
      // Mostrar información detallada del entorno
      const envInfo = {
        // Variables de entorno
        GITHUB_REPO: env.GITHUB_REPO,
        GITHUB_TOKEN: env.GITHUB_TOKEN ? {
          present: true,
          length: env.GITHUB_TOKEN.length,
          prefix: env.GITHUB_TOKEN.substring(0, 8),
          suffix: env.GITHUB_TOKEN.substring(env.GITHUB_TOKEN.length - 4)
        } : { present: false },
        WEBHOOK_SECRET: env.WEBHOOK_SECRET ? '***CONFIGURADO***' : 'NO CONFIGURADO',
        
        // Información del request
        requestMethod: request.method,
        requestUrl: request.url,
        bodyLength: bodyText.length,
        
        // Headers
        headers: {
          contentType: request.headers.get('content-type'),
          sanitySignature: request.headers.get('x-sanity-signature'),
          userAgent: request.headers.get('user-agent')
        },
        
        timestamp: new Date().toISOString()
      }

      console.log('GitHub API Test - Environment Info:', envInfo)

      // Verificar variables de entorno
      if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) {
        return new Response(JSON.stringify({
          status: 'error',
          message: 'Missing environment variables',
          envInfo: envInfo
        }, null, 2), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Probar autenticación con GitHub
      console.log('Testing GitHub authentication...')
      const authResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'User-Agent': 'ncs-deploy-github-test/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      const authResult = {
        status: authResponse.status,
        ok: authResponse.ok,
        statusText: authResponse.statusText
      }

      if (authResponse.ok) {
        const userData = await authResponse.json()
        authResult.user = {
          login: userData.login,
          name: userData.name,
          email: userData.email
        }
      } else {
        const errorText = await authResponse.text()
        authResult.error = errorText
      }

      console.log('GitHub auth result:', authResult)

      // Probar acceso al repositorio
      console.log('Testing repository access...')
      const repoResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}`, {
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'User-Agent': 'ncs-deploy-github-test/1.0',
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      const repoResult = {
        status: repoResponse.status,
        ok: repoResponse.ok,
        statusText: repoResponse.statusText
      }

      if (repoResponse.ok) {
        const repoData = await repoResponse.json()
        repoResult.repo = {
          full_name: repoData.full_name,
          private: repoData.private,
          permissions: repoData.permissions
        }
      } else {
        const errorText = await repoResponse.text()
        repoResult.error = errorText
      }

      console.log('Repository access result:', repoResult)

      // Probar repository_dispatch
      console.log('Testing repository_dispatch...')
      const dispatchResponse = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${env.GITHUB_TOKEN}`,
          'User-Agent': 'ncs-deploy-github-test/1.0',
          'Accept': 'application/vnd.github.everest-preview+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_type: 'sanity-content-changed'
        })
      })

      const dispatchResult = {
        status: dispatchResponse.status,
        ok: dispatchResponse.ok,
        statusText: dispatchResponse.statusText
      }

      if (!dispatchResponse.ok) {
        const errorText = await dispatchResponse.text()
        dispatchResult.error = errorText
      }

      console.log('Repository dispatch result:', dispatchResult)

      // Respuesta completa
      const response = {
        status: 'success',
        message: 'GitHub API test completed',
        envInfo: envInfo,
        tests: {
          authentication: authResult,
          repositoryAccess: repoResult,
          repositoryDispatch: dispatchResult
        },
        timestamp: new Date().toISOString()
      }

      return new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })

    } catch (error) {
      console.error('Worker error:', error)
      return new Response(JSON.stringify({
        status: 'error',
        message: 'Internal server error',
        error: error.message,
        stack: error.stack
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
