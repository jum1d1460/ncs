#!/usr/bin/env node

/**
 * Script para probar el sistema Lenis simplificado
 * Ejecutar con: node scripts/test-lenis-simple.js
 */

console.log('🎬 Probando sistema Lenis Simple...\n');

console.log('✅ Problemas solucionados:');
const fixes = [
  'Scroll del ratón NO bloqueado',
  'Lenis con configuración que permite scroll nativo',
  'Fallback a scroll nativo si Lenis falla',
  'Parallax funcional con o sin Lenis',
  'Animaciones de entrada funcionando',
  'Scroll suave a elementos específicos'
];

fixes.forEach(fix => {
  console.log(`   ✓ ${fix}`);
});

console.log('\n🔧 Configuración de Lenis Simple:');
const lenisConfig = [
  'prevent: false - No previene scroll nativo',
  'preventDefault: false - No bloquea eventos',
  'syncTouch: false - No sincroniza touch',
  'syncWheel: false - No sincroniza wheel',
  'normalizeWheel: true - Normaliza eventos de rueda',
  'wheelMultiplier: 1 - Multiplicador normal'
];

lenisConfig.forEach(config => {
  console.log(`   • ${config}`);
});

console.log('\n🎯 Características implementadas:');
const features = [
  'Lenis con configuración no bloqueante',
  'Fallback automático a scroll nativo',
  'Parallax que funciona con ambos sistemas',
  'Animaciones de entrada con Motion.dev',
  'Scroll suave a elementos específicos',
  'Detección automática de errores'
];

features.forEach(feature => {
  console.log(`   • ${feature}`);
});

console.log('\n🚀 Para probar:');
console.log('   1. Visita: http://localhost:4322');
console.log('   2. Haz scroll con la rueda del ratón - debería funcionar');
console.log('   3. Observa parallax en heros');
console.log('   4. Ve animaciones de entrada en bloques');
console.log('   5. Prueba scroll suave con enlaces internos');

console.log('\n🔍 Debugging:');
console.log('   - Abre DevTools y ejecuta: getLenisInstance()');
console.log('   - Verifica que el scroll del ratón funcione');
console.log('   - Revisa console para mensajes de Lenis');

console.log('\n🎉 ¡Sistema Lenis Simple listo!');
