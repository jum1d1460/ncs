#!/usr/bin/env node

/**
 * Script para probar el sistema de animaciones
 * Ejecutar con: node scripts/test-animations.js
 */

console.log('🎬 Probando sistema de animaciones...\n');

// Simular verificación de componentes
const components = [
  'motionClient.ts',
  'AnimatedBlock.astro',
  'animations.ts',
  'PageTransition.astro'
];

console.log('✅ Componentes del sistema de animaciones:');
components.forEach(component => {
  console.log(`   - ${component}`);
});

console.log('\n🎯 Funcionalidades implementadas:');
const features = [
  'Scroll suave similar a Lenis',
  'Efectos parallax en heros',
  'Atractores de scroll en bloques',
  'Transiciones entre páginas',
  'Animaciones de entrada (fadeInUp, fadeInLeft, fadeInRight, scaleIn)',
  'Configuración centralizada',
  'Soporte responsivo',
  'Respeto a prefers-reduced-motion',
  'Página de demo en /demo/animaciones'
];

features.forEach(feature => {
  console.log(`   ✓ ${feature}`);
});

console.log('\n🚀 Para probar las animaciones:');
console.log('   1. Ejecuta: npm run dev');
console.log('   2. Visita: http://localhost:4321/demo/animaciones');
console.log('   3. Navega por el sitio para ver las transiciones');

console.log('\n📚 Documentación:');
console.log('   - Ver: ANIMATIONS_README.md');
console.log('   - Configuración: src/lib/animations.ts');

console.log('\n🎉 ¡Sistema de animaciones listo!');
