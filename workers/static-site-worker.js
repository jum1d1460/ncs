/**
 * Cloudflare Worker para servir sitio web estático
 * Sirve archivos desde el directorio dist/ del build de Astro
 */

// Mapeo de archivos estáticos (se actualiza en cada deploy)
const STATIC_FILES = {
  // Archivos principales
  '/': 'index.html',
  '/index.html': 'index.html',
  
  // Páginas
  '/inicio/': 'inicio/index.html',
  '/inicio/index.html': 'inicio/index.html',
  '/sobre-mi/': 'sobre-mi/index.html',
  '/sobre-mi/index.html': 'sobre-mi/index.html',
  '/servicios/': 'servicios/index.html',
  '/servicios/index.html': 'servicios/index.html',
  '/contacto/': 'contacto/index.html',
  '/contacto/index.html': 'contacto/index.html',
  '/blog/': 'blog/index.html',
  '/blog/index.html': 'blog/index.html',
  
  // Assets estáticos
  '/favicon.svg': 'favicon.svg',
  '/robots.txt': 'robots.txt',
  
  // Archivos CSS y JS de Astro
  '/_astro/': '_astro/',
};

// Tipos MIME para diferentes extensiones
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Manejar CORS para desarrollo
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }
    
    // Para Workers con assets, el binding se llama ASSETS
    // Si no está disponible, intentamos con el nombre por defecto
    const assets = env.ASSETS || env.assets || env.__STATIC_CONTENT;
    
    if (!assets) {
      console.error('No se encontró binding de assets:', Object.keys(env));
      return new Response('Assets binding no encontrado', { status: 500 });
    }
    
    return assets.fetch(request);
  },
};
