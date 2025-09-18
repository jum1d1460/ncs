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
    
    // Buscar archivo en el mapeo
    let filePath = STATIC_FILES[pathname];
    
    // Si no se encuentra en el mapeo, intentar servir directamente
    if (!filePath) {
      // Remover barra inicial si existe
      filePath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
      
      // Si es un directorio, agregar index.html
      if (filePath.endsWith('/') || !filePath.includes('.')) {
        filePath = filePath + (filePath.endsWith('/') ? 'index.html' : '/index.html');
      }
    }
    
    // Determinar tipo MIME
    const extension = filePath.substring(filePath.lastIndexOf('.'));
    const mimeType = MIME_TYPES[extension] || 'application/octet-stream';
    
    try {
      // En un Worker real, aquí cargarías el archivo desde KV Storage o R2
      // Por ahora, retornamos una respuesta de ejemplo
      const response = new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>NCS Psicóloga Zaragoza</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          <h1>NCS Psicóloga Zaragoza</h1>
          <p>Worker funcionando correctamente</p>
          <p>Ruta solicitada: ${pathname}</p>
          <p>Archivo mapeado: ${filePath}</p>
          <p>Tipo MIME: ${mimeType}</p>
        </body>
        </html>
      `, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        },
      });
      
      return response;
      
    } catch (error) {
      console.error('Error sirviendo archivo:', error);
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error 404 - NCS Psicóloga Zaragoza</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1>404 - Página no encontrada</h1>
          <p>La página ${pathname} no existe.</p>
          <p><a href="/">Volver al inicio</a></p>
        </body>
        </html>
      `, {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    }
  },
};
