#!/usr/bin/env node

/**
 * Script para probar el token de GitHub directamente
 * Uso: node test-github-token.js [GITHUB_TOKEN] [GITHUB_REPO]
 */

// Obtener argumentos de línea de comandos
const GITHUB_TOKEN = process.argv[2] || process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.argv[3] || process.env.GITHUB_REPO || 'jumidi/ncs';

if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN requerido');
  console.log('Uso: node test-github-token.js [GITHUB_TOKEN] [GITHUB_REPO]');
  process.exit(1);
}

console.log('🧪 Probando token de GitHub...');
console.log(`📍 Repositorio: ${GITHUB_REPO}`);
console.log(`🔑 Token: ${GITHUB_TOKEN.substring(0, 8)}...`);
console.log('');

// Función para probar el token
async function testGitHubToken(token, repo) {
  try {
    console.log('1️⃣ Probando autenticación básica...');
    
    // Probar autenticación básica
    const authResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'ncs-deploy-test/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!authResponse.ok) {
      console.error(`❌ Error de autenticación: ${authResponse.status} ${authResponse.statusText}`);
      const errorText = await authResponse.text();
      console.error('Respuesta:', errorText);
      return false;
    }

    const userData = await authResponse.json();
    console.log(`✅ Autenticación exitosa como: ${userData.login}`);
    console.log(`   Nombre: ${userData.name || 'No especificado'}`);
    console.log(`   Email: ${userData.email || 'No público'}`);

    console.log('');
    console.log('2️⃣ Probando permisos del repositorio...');
    
    // Probar acceso al repositorio
    const repoResponse = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'ncs-deploy-test/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!repoResponse.ok) {
      console.error(`❌ Error de acceso al repositorio: ${repoResponse.status} ${repoResponse.statusText}`);
      const errorText = await repoResponse.text();
      console.error('Respuesta:', errorText);
      return false;
    }

    const repoData = await repoResponse.json();
    console.log(`✅ Acceso al repositorio exitoso: ${repoData.full_name}`);
    console.log(`   Privado: ${repoData.private ? 'Sí' : 'No'}`);
    console.log(`   Permisos: ${JSON.stringify(repoData.permissions || {})}`);

    console.log('');
    console.log('3️⃣ Probando repository_dispatch...');
    
    // Probar repository_dispatch
    const dispatchResponse = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'ncs-deploy-test/1.0',
        'Accept': 'application/vnd.github.everest-preview+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_type: 'sanity-content-changed'
      })
    });

    if (!dispatchResponse.ok) {
      console.error(`❌ Error en repository_dispatch: ${dispatchResponse.status} ${dispatchResponse.statusText}`);
      const errorText = await dispatchResponse.text();
      console.error('Respuesta:', errorText);
      return false;
    }

    console.log('✅ repository_dispatch exitoso!');
    console.log('   El token tiene permisos para disparar workflows');

    return true;

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    return false;
  }
}

// Ejecutar la prueba
testGitHubToken(GITHUB_TOKEN, GITHUB_REPO)
  .then(success => {
    if (success) {
      console.log('');
      console.log('🎉 ¡Todas las pruebas pasaron! El token está configurado correctamente.');
      console.log('');
      console.log('🔧 Si el webhook sigue fallando, el problema puede ser:');
      console.log('   1. Variables de entorno no configuradas en Cloudflare');
      console.log('   2. Token diferente en Cloudflare vs el que probamos');
      console.log('   3. Formato del repositorio incorrecto en Cloudflare');
    } else {
      console.log('');
      console.log('❌ Las pruebas fallaron. Revisa:');
      console.log('   1. Que el token tenga permisos "repo" y "workflow"');
      console.log('   2. Que el repositorio exista y sea accesible');
      console.log('   3. Que el formato del repositorio sea "owner/repo"');
    }
  })
  .catch(console.error);
