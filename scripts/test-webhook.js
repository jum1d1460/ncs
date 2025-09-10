#!/usr/bin/env node

/**
 * Script para probar el webhook de Sanity
 * Uso: node scripts/test-webhook.js [worker-url]
 */

// Usar fetch nativo de Node.js 18+ o importar node-fetch para versiones anteriores
const fetch = globalThis.fetch || require('node-fetch');

// Obtener URL del worker de los argumentos de línea de comandos
const WORKER_URL = (typeof process !== 'undefined' && process.argv && process.argv[2]) 
  ? process.argv[2] 
  : 'https://sanity-webhook-dispatcher.your-subdomain.workers.dev';

// Payload de prueba que simula un webhook de Sanity
const testPayload = {
  type: 'document',
  action: 'publish',
  document: {
    _id: 'test-document-123',
    _type: 'post',
    title: 'Test Post',
    slug: { current: 'test-post' }
  }
};

// Headers de prueba
const headers = {
  'Content-Type': 'application/json',
  'User-Agent': 'sanity-webhook-test/1.0'
};

// Función para hacer la petición usando fetch
async function testWebhook(url, payload, headers) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const body = await response.text();
    
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: body
    };
  } catch (error) {
    throw error;
  }
}

// Función principal
async function main() {
  console.log('🧪 Probando webhook de Sanity...');
  console.log(`📍 URL: ${WORKER_URL}`);
  console.log(`📦 Payload:`, JSON.stringify(testPayload, null, 2));
  console.log('');

  try {
    const response = await testWebhook(WORKER_URL, testPayload, headers);
    
    console.log('📊 Respuesta del Worker:');
    console.log(`   Status: ${response.statusCode}`);
    console.log(`   Headers:`, response.headers);
    console.log(`   Body:`, response.body);
    console.log('');

    if (response.statusCode === 200) {
      console.log('✅ Webhook funcionando correctamente!');
      console.log('🔍 Verifica en GitHub Actions que se haya ejecutado el workflow de deploy');
    } else {
      console.log('❌ Webhook falló. Revisa la configuración del worker');
    }

  } catch (error) {
    console.error('❌ Error al probar webhook:', error.message);
    console.log('');
    console.log('🔧 Posibles soluciones:');
    console.log('   1. Verifica que el worker esté desplegado');
    console.log('   2. Verifica que la URL sea correcta');
    console.log('   3. Verifica las variables de entorno del worker');
    console.log('   4. Revisa los logs con: wrangler tail');
  }
}

// Ejecutar si es llamado directamente
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

module.exports = { testWebhook, testPayload };
