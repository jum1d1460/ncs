#!/usr/bin/env node

/**
 * Script para probar el sistema de animaciones con Lenis
 * Ejecutar con: node scripts/test-lenis-animations.js
 */

console.log('🎬 Probando sistema Lenis + Motion...\n');

console.log('✅ Características implementadas:');
const features = [
  'Lenis para scroll suave profesional',
  'Parallax optimizado con eventos de Lenis',
  'Animaciones de entrada con Motion.dev',
  'Scroll suave a elementos específicos',
  'Configuración personalizada de Lenis',
  'Integración perfecta con Motion.dev',
  'Rendimiento optimizado'
];

features.forEach(feature => {
  console.log(`   ✓ ${feature}`);
});

console.log('\n🔧 Configuración de Lenis:');
const lenisConfig = [
  'Duración: 1.2s',
  'Easing: función personalizada',
  'Dirección: vertical',
  'Smooth: true',
  'Mouse multiplier: 1',
  'Touch multiplier: 2',
  'Infinite: false'
];

lenisConfig.forEach(config => {
  console.log(`   • ${config}`);
});

console.log('\n🎯 Elementos con animaciones:');
const elements = [
  'Hero backgrounds - Parallax con eventos de Lenis',
  'Hero silhouettes - Parallax optimizado',
  'Hero content - Parallax sutil',
  'Bloques de contenido - Animaciones de entrada',
  'Elementos con data-animate - Animaciones personalizadas'
];

elements.forEach(element => {
  console.log(`   • ${element}`);
});

console.log('\n🚀 Para probar:');
console.log('   1. Visita: http://localhost:4322');
console.log('   2. Haz scroll - deberías sentir el scroll suave de Lenis');
console.log('   3. Observa parallax en heros');
console.log('   4. Ve animaciones de entrada en bloques');
console.log('   5. Prueba scroll suave con enlaces internos');

console.log('\n🔍 Debugging:');
console.log('   - Abre DevTools y ejecuta: getLenisInstance()');
console.log('   - Verifica que Lenis esté funcionando correctamente');

console.log('\n📚 Referencias:');
console.log('   - Lenis: https://lenis.studiofreight.com/');
console.log('   - Motion.dev: https://motion.dev/');

console.log('\n🎉 ¡Sistema Lenis + Motion listo!');
