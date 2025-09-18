#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando estado del deploy...\n');

// Verificar si el directorio dist existe
const distPath = path.join(__dirname, '..', 'web', 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ Directorio dist existe');
  const files = fs.readdirSync(distPath);
  console.log(`   Archivos en dist: ${files.length}`);
  console.log(`   Archivos principales: ${files.filter(f => f.endsWith('.html')).join(', ')}`);
} else {
  console.log('❌ Directorio dist no existe - necesitas hacer build primero');
}

// Verificar configuración de Astro
const astroConfigPath = path.join(__dirname, '..', 'web', 'astro.config.mjs');
if (fs.existsSync(astroConfigPath)) {
  console.log('✅ Configuración de Astro encontrada');
  const config = fs.readFileSync(astroConfigPath, 'utf8');
  if (config.includes("output: 'static'")) {
    console.log('✅ Configurado para generación estática (SSG)');
  } else {
    console.log('⚠️ No configurado para generación estática');
  }
} else {
  console.log('❌ Configuración de Astro no encontrada');
}

// Verificar variables de entorno necesarias
console.log('\n🔐 Verificando variables de entorno:');
const requiredEnvVars = [
  'PUBLIC_SANITY_PROJECT_ID',
  'PUBLIC_SANITY_DATASET', 
  'PUBLIC_SANITY_API_VERSION'
];

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: ${process.env[envVar]}`);
  } else {
    console.log(`❌ ${envVar}: No definida`);
  }
});

// Verificar secretos de GitHub (solo mostrar si están definidos)
console.log('\n🔑 Verificando secretos de Cloudflare:');
const cloudflareSecrets = [
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_PAGES_PROJECT_NAME'
];

cloudflareSecrets.forEach(secret => {
  if (process.env[secret]) {
    console.log(`✅ ${secret}: Definido`);
  } else {
    console.log(`❌ ${secret}: No definido (necesario para deploy)`);
  }
});

// Verificar si hay errores en el build
console.log('\n🔨 Verificando build:');
try {
  process.chdir(path.join(__dirname, '..', 'web'));
  console.log('   Ejecutando build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Build exitoso');
} catch (error) {
  console.log('❌ Error en build:');
  console.log(error.message);
}

console.log('\n📋 Resumen:');
console.log('1. Verifica que todos los secretos estén configurados en GitHub');
console.log('2. Asegúrate de que el proyecto de Cloudflare Pages esté creado');
console.log('3. Revisa los logs de GitHub Actions para errores específicos');
console.log('4. Si usas Deploy Hook, actualiza el workflow para usar la URL del hook');
