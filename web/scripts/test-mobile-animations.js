#!/usr/bin/env node

/**
 * Script para probar las animaciones de opacidad en móviles
 * Este script simula el comportamiento de un dispositivo móvil
 */

const puppeteer = require('puppeteer');

async function testMobileAnimations() {
  console.log('🧪 Iniciando pruebas de animaciones en móviles...');
  
  const browser = await puppeteer.launch({
    headless: false, // Mostrar el navegador para debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Simular un dispositivo móvil
    await page.setViewport({
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });
    
    // Navegar a la página de servicios
    console.log('📱 Navegando a la página de servicios...');
    await page.goto('http://localhost:4321/servicios', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Esperar a que se carguen las animaciones
    console.log('⏳ Esperando a que se carguen las animaciones...');
    await page.waitForTimeout(2000);
    
    // Verificar que los elementos de servicios estén presentes
    const serviceElements = await page.$$('.service-block, .testimonial-block, .block-content');
    console.log(`📦 Encontrados ${serviceElements.length} elementos de servicios`);
    
    // Verificar la opacidad inicial de los elementos
    for (let i = 0; i < serviceElements.length; i++) {
      const element = serviceElements[i];
      const opacity = await page.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      }, element);
      
      console.log(`Elemento ${i + 1}: opacity = ${opacity}`);
      
      if (opacity === '0') {
        console.log('✅ Elemento correctamente invisible inicialmente');
      } else {
        console.log('❌ Elemento visible cuando debería estar invisible');
      }
    }
    
    // Hacer scroll para activar las animaciones
    console.log('📜 Haciendo scroll para activar animaciones...');
    await page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    
    await page.waitForTimeout(1000);
    
    // Verificar que las animaciones se hayan activado
    console.log('🎬 Verificando animaciones activadas...');
    for (let i = 0; i < serviceElements.length; i++) {
      const element = serviceElements[i];
      const opacity = await page.evaluate((el) => {
        return window.getComputedStyle(el).opacity;
      }, element);
      
      console.log(`Elemento ${i + 1} después del scroll: opacity = ${opacity}`);
    }
    
    // Tomar screenshot para verificación visual
    console.log('📸 Tomando screenshot...');
    await page.screenshot({ 
      path: 'mobile-animations-test.png',
      fullPage: true 
    });
    
    console.log('✅ Pruebas completadas. Revisa mobile-animations-test.png');
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    await browser.close();
  }
}

// Ejecutar las pruebas
testMobileAnimations().catch(console.error);
