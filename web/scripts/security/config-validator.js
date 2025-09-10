#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigValidator {
  constructor() {
    this.projectRoot = path.join(__dirname, '..', '..');
    this.report = {
      timestamp: new Date().toISOString(),
      project: 'web',
      config: {
        astro: {
          checks: [],
          recommendations: [],
          score: 0
        }
      }
    };
  }

  async runValidation() {
    console.log('⚙️ Validando configuración de Astro Web...\n');

    try {
      await this.validateAstroConfig();
      await this.validateEnvironmentVariables();
      await this.validateSecuritySettings();
      await this.validateBuildConfiguration();
      this.calculateScore();
      this.generateReport();
    } catch (error) {
      console.error('❌ Error durante la validación:', error.message);
      process.exit(1);
    }
  }

  async validateAstroConfig() {
    console.log('📋 Validando astro.config.mjs...');
    
    const configPath = path.join(this.projectRoot, 'astro.config.mjs');
    
    if (!fs.existsSync(configPath)) {
      this.report.config.astro.checks.push({
        name: 'Config File Exists',
        status: 'fail',
        message: 'Archivo astro.config.mjs no encontrado',
        priority: 'high'
      });
      return;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Verificar configuraciones de seguridad
    const checks = [
      {
        name: 'Security Headers',
        check: () => configContent.includes('security') || configContent.includes('headers'),
        message: 'Configuración de headers de seguridad no encontrada',
        priority: 'high',
        recommendation: 'Configurar headers de seguridad (CSP, HSTS, etc.)'
      },
      {
        name: 'CSP Configuration',
        check: () => configContent.includes('csp') || configContent.includes('CSP'),
        message: 'Configuración de Content Security Policy no encontrada',
        priority: 'high',
        recommendation: 'Implementar Content Security Policy para prevenir XSS'
      },
      {
        name: 'HTTPS Redirect',
        check: () => configContent.includes('https') || configContent.includes('redirect'),
        message: 'Configuración de redirección HTTPS no encontrada',
        priority: 'medium',
        recommendation: 'Configurar redirección automática a HTTPS'
      },
      {
        name: 'Build Output',
        check: () => configContent.includes('output') || configContent.includes('static'),
        message: 'Configuración de output no especificada',
        priority: 'medium',
        recommendation: 'Especificar output como static para mejor seguridad'
      },
      {
        name: 'Site URL',
        check: () => configContent.includes('site') || configContent.includes('url'),
        message: 'URL del sitio no configurada',
        priority: 'medium',
        recommendation: 'Configurar URL del sitio para SEO y seguridad'
      }
    ];

    checks.forEach(check => {
      const status = check.check() ? 'pass' : 'fail';
      this.report.config.astro.checks.push({
        name: check.name,
        status,
        message: status === 'pass' ? 'Configuración encontrada' : check.message,
        priority: check.priority,
        recommendation: status === 'fail' ? check.recommendation : null
      });
    });

    console.log(`   Completadas ${checks.length} verificaciones de configuración`);
  }

  async validateEnvironmentVariables() {
    console.log('🔐 Validando variables de entorno...');
    
    const envPath = path.join(this.projectRoot, '.env');
    const envLocalPath = path.join(this.projectRoot, '.env.local');
    
    const envFiles = [];
    if (fs.existsSync(envPath)) envFiles.push(envPath);
    if (fs.existsSync(envLocalPath)) envFiles.push(envLocalPath);
    
    if (envFiles.length === 0) {
      this.report.config.astro.checks.push({
        name: 'Environment Variables',
        status: 'fail',
        message: 'Archivos de variables de entorno no encontrados',
        priority: 'medium',
        recommendation: 'Crear archivos .env para configuraciones sensibles'
      });
    } else {
      this.report.config.astro.checks.push({
        name: 'Environment Variables',
        status: 'pass',
        message: 'Archivos de variables de entorno encontrados',
        priority: 'medium'
      });
    }

    // Verificar variables críticas para Astro
    const criticalVars = [
      'PUBLIC_SITE_URL',
      'SANITY_PROJECT_ID',
      'SANITY_DATASET'
    ];

    criticalVars.forEach(varName => {
      const found = envFiles.some(file => {
        const content = fs.readFileSync(file, 'utf8');
        return content.includes(varName);
      });

      this.report.config.astro.checks.push({
        name: `Environment Variable: ${varName}`,
        status: found ? 'pass' : 'fail',
        message: found ? 'Variable encontrada' : `Variable ${varName} no encontrada`,
        priority: 'medium',
        recommendation: found ? null : `Agregar ${varName} a los archivos de entorno`
      });
    });

    console.log(`   Verificadas ${criticalVars.length + 1} variables de entorno`);
  }

  async validateSecuritySettings() {
    console.log('🛡️ Validando configuraciones de seguridad...');
    
    const securityChecks = [
      {
        name: 'TailwindCSS Configuration',
        check: () => {
          const tailwindPath = path.join(this.projectRoot, 'tailwind.config.js');
          return fs.existsSync(tailwindPath);
        },
        message: 'Configuración de TailwindCSS no encontrada',
        priority: 'low',
        recommendation: 'Configurar TailwindCSS para estilos seguros'
      },
      {
        name: 'PostCSS Configuration',
        check: () => {
          const postcssPath = path.join(this.projectRoot, 'postcss.config.mjs');
          return fs.existsSync(postcssPath);
        },
        message: 'Configuración de PostCSS no encontrada',
        priority: 'low',
        recommendation: 'Configurar PostCSS para procesamiento de CSS'
      },
      {
        name: 'TypeScript Configuration',
        check: () => {
          const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
          return fs.existsSync(tsconfigPath);
        },
        message: 'Configuración de TypeScript no encontrada',
        priority: 'medium',
        recommendation: 'Configurar TypeScript para mejor seguridad de tipos'
      },
      {
        name: 'Public Directory Security',
        check: () => {
          const publicPath = path.join(this.projectRoot, 'public');
          if (!fs.existsSync(publicPath)) return false;
          const files = fs.readdirSync(publicPath);
          return !files.some(file => file.includes('.env') || file.includes('secret'));
        },
        message: 'Archivos sensibles encontrados en directorio public',
        priority: 'high',
        recommendation: 'Remover archivos sensibles del directorio public'
      }
    ];

    securityChecks.forEach(check => {
      const status = check.check() ? 'pass' : 'fail';
      this.report.config.astro.checks.push({
        name: check.name,
        status,
        message: status === 'pass' ? 'Configuración encontrada' : check.message,
        priority: check.priority,
        recommendation: status === 'fail' ? check.recommendation : null
      });
    });

    console.log(`   Completadas ${securityChecks.length} verificaciones de seguridad`);
  }

  async validateBuildConfiguration() {
    console.log('🏗️ Validando configuración de build...');
    
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const buildChecks = [
      {
        name: 'Build Script',
        check: () => packageJson.scripts && packageJson.scripts.build,
        message: 'Script de build no encontrado',
        priority: 'high',
        recommendation: 'Agregar script de build en package.json'
      },
      {
        name: 'Prebuild Script',
        check: () => packageJson.scripts && packageJson.scripts.prebuild,
        message: 'Script de prebuild no encontrado',
        priority: 'medium',
        recommendation: 'Agregar script de prebuild para validaciones'
      },
      {
        name: 'Security Scripts',
        check: () => packageJson.scripts && (packageJson.scripts['security:audit'] || packageJson.scripts['security:check']),
        message: 'Scripts de seguridad no encontrados',
        priority: 'medium',
        recommendation: 'Agregar scripts de seguridad al package.json'
      }
    ];

    buildChecks.forEach(check => {
      const status = check.check() ? 'pass' : 'fail';
      this.report.config.astro.checks.push({
        name: check.name,
        status,
        message: status === 'pass' ? 'Configuración encontrada' : check.message,
        priority: check.priority,
        recommendation: status === 'fail' ? check.recommendation : null
      });
    });

    console.log(`   Completadas ${buildChecks.length} verificaciones de build`);
  }

  calculateScore() {
    const totalChecks = this.report.config.astro.checks.length;
    const passedChecks = this.report.config.astro.checks.filter(check => check.status === 'pass').length;
    
    this.report.config.astro.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
    
    // Generar recomendaciones basadas en fallos
    this.report.config.astro.checks
      .filter(check => check.status === 'fail' && check.recommendation)
      .forEach(check => {
        this.report.config.astro.recommendations.push({
          priority: check.priority,
          message: check.recommendation,
          check: check.name
        });
      });
  }

  generateReport() {
    const outputDir = path.join(this.projectRoot, 'security-reports');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Reporte JSON
    const jsonPath = path.join(outputDir, `config-report-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(this.report, null, 2));
    console.log(`📄 Reporte de configuración generado: ${jsonPath}`);
    
    // Reporte de texto
    const textPath = path.join(outputDir, `config-report-${Date.now()}.txt`);
    const textReport = this.generateTextReport();
    fs.writeFileSync(textPath, textReport);
    console.log(`📄 Reporte de texto generado: ${textPath}`);
    
    this.printSummary();
  }

  generateTextReport() {
    let report = `REPORTE DE CONFIGURACIÓN - WEB\n`;
    report += `==============================\n\n`;
    report += `Fecha: ${this.report.timestamp}\n`;
    report += `Proyecto: ${this.report.project}\n`;
    report += `Score de Seguridad: ${this.report.config.astro.score}%\n\n`;
    
    report += `VERIFICACIONES:\n`;
    this.report.config.astro.checks.forEach(check => {
      const status = check.status === 'pass' ? '✅' : '❌';
      report += `${status} ${check.name} (${check.priority}): ${check.message}\n`;
    });
    
    if (this.report.config.astro.recommendations.length > 0) {
      report += `\nRECOMENDACIONES:\n`;
      this.report.config.astro.recommendations
        .sort((a, b) => this.getPriorityOrder(a.priority) - this.getPriorityOrder(b.priority))
        .forEach(rec => {
          report += `- [${rec.priority.toUpperCase()}] ${rec.message}\n`;
        });
    }
    
    return report;
  }

  getPriorityOrder(priority) {
    const order = { high: 1, medium: 2, low: 3 };
    return order[priority] || 4;
  }

  printSummary() {
    const passed = this.report.config.astro.checks.filter(c => c.status === 'pass').length;
    const total = this.report.config.astro.checks.length;
    const score = this.report.config.astro.score;
    
    console.log('\n📊 RESUMEN DE CONFIGURACIÓN:');
    console.log(`   Verificaciones pasadas: ${passed}/${total}`);
    console.log(`   Score de seguridad: ${score}%`);
    console.log(`   Recomendaciones: ${this.report.config.astro.recommendations.length}`);
    
    if (score < 70) {
      console.log('\n⚠️ ADVERTENCIA: Score de seguridad bajo. Revisar recomendaciones.');
    } else if (score < 90) {
      console.log('\n✅ Score de seguridad aceptable. Considerar mejoras.');
    } else {
      console.log('\n🎉 Excelente score de seguridad!');
    }
  }
}

// Ejecutar validación
const validator = new ConfigValidator();
validator.runValidation().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
