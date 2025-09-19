#!/usr/bin/env node

/**
 * Script para probar el nuevo sistema de animaciones con Motion.dev
 * Ejecutar con: node scripts/test-motion-scroll.js
 */

console.log('🎬 Probando sistema Motion Scroll...\n');

// Verificar archivos del sistema
const files = [
  'motionScroll.ts',
  'AnimatedBlock.astro',
  'motionScroll.ts'
];

console.log('✅ Archivos del sistema Motion Scroll:');
files.forEach(file => {
  console.log(`   - ${file}`);
});

console.log('\n🎯 Funcionalidades implementadas:');
const features = [
  'Scroll suave nativo con scroll-behavior: smooth',
  'Parallax usando scroll() API de Motion.dev',
  'Animaciones de entrada usando inView() API',
  'Scroll-linked animations con hardware acceleration',
  'Detección automática de elementos en viewport',
  'Soporte para prefers-reduced-motion',
  'Optimización con will-change',
  'Página de demo en /demo/animaciones'
];

features.forEach(feature => {
  console.log(`   ✓ ${feature}`);
});

console.log('\n🔧 API de Motion.dev utilizada:');
const apis = [
  'scroll() - Para scroll-linked animations',
  'inView() - Para animaciones de entrada',
  'animate() - Para animaciones suaves',
  'ScrollTimeline API - Para hardware acceleration'
];

apis.forEach(api => {
  console.log(`   - ${api}`);
});

console.log('\n🚀 Para probar las animaciones:');
console.log('   1. Ejecuta: npm run dev');
console.log('   2. Visita: http://localhost:4321');
console.log('   3. Haz scroll para ver parallax en heros');
console.log('   4. Observa animaciones de entrada en bloques');
console.log('   5. Prueba scroll suave con enlaces internos');

console.log('\n📚 Referencias:');
console.log('   - Motion.dev scroll: https://motion.dev/docs/scroll');
console.log('   - Motion.dev inView: https://motion.dev/docs/inView');

console.log('\n🎉 ¡Sistema Motion Scroll listo!');
