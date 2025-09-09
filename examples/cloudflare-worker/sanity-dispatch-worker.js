export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 })
    }

    const signature = request.headers.get('x-sanity-signature') || ''
    const bodyText = await request.text()
    const encoder = new TextEncoder()

    // Validación simple HMAC (si configuras secret en Sanity)
    if (env.WEBHOOK_SECRET) {
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(env.WEBHOOK_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(bodyText))
      const digest = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('')
      if (signature && signature !== digest) {
        return new Response('Invalid signature', { status: 401 })
      }
    }

    const repo = env.GITHUB_REPO
    const token = env.GITHUB_TOKEN
    if (!repo || !token) {
      return new Response('Missing env vars', { status: 500 })
    }

    const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.everest-preview+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_type: 'sanity-content-changed' })
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(`GitHub dispatch failed: ${res.status} ${text}`, { status: 502 })
    }

    return new Response('OK', { status: 200 })
  }
}


