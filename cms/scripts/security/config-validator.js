#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class ConfigValidator {
  constructor() {
    this.projectRoot = path.join(__dirname, '..', '..');
    this.report = {
      timestamp: new Date().toISOString(),
      project: 'cms',
      config: {
        sanity: {
          checks: [],
          recommendations: [],
          score: 0
        }
      }
    };
  }

  // Función helper para validar rutas de forma segura
  validatePath(filePath) {
    // Normalizar la ruta y verificar que esté dentro del directorio del proyecto
    const normalizedPath = path.normalize(filePath);
    const resolvedPath = path.resolve(normalizedPath);
    const projectRoot = path.resolve(this.projectRoot);
    
    return resolvedPath.startsWith(projectRoot);
  }

  async runValidation() {
    console.log('⚙️ Validando configuración de Sanity CMS...\n');

    try {
      await this.validateSanityConfig();
      await this.validateEnvironmentVariables();
      await this.validateSecuritySettings();
      this.calculateScore();
      this.generateReport();
    } catch (error) {
      console.error('❌ Error durante la validación:', error.message);
      process.exit(1);
    }
  }

  async validateSanityConfig() {
    console.log('📋 Validando sanity.config.ts...');
    
    const configPath = path.join(this.projectRoot, 'sanity.config.ts');
    
    if (!this.validatePath(configPath) || !fs.existsSync(configPath)) {
      this.report.config.sanity.checks.push({
        name: 'Config File Exists',
        status: 'fail',
        message: 'Archivo sanity.config.ts no encontrado',
        priority: 'high'
      });
      return;
    }

    if (!this.validatePath(configPath)) {
      throw new Error('Ruta de archivo no válida');
    }
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Verificar configuraciones de seguridad
    const checks = [
      {
        name: 'CORS Configuration',
        check: () => configContent.includes('cors') || configContent.includes('CORS'),
        message: 'Configuración de CORS no encontrada',
        priority: 'medium',
        recommendation: 'Configurar CORS para restringir acceso desde dominios específicos'
      },
      {
        name: 'Authentication',
        check: () => configContent.includes('auth') || configContent.includes('authentication'),
        message: 'Configuración de autenticación no encontrada',
        priority: 'high',
        recommendation: 'Implementar autenticación adecuada para el CMS'
      },
      {
        name: 'API Version',
        check: () => configContent.includes('apiVersion'),
        message: 'Versión de API no especificada',
        priority: 'medium',
        recommendation: 'Especificar versión de API para compatibilidad'
      },
      {
        name: 'Dataset Configuration',
        check: () => configContent.includes('dataset'),
        message: 'Configuración de dataset no encontrada',
        priority: 'high',
        recommendation: 'Configurar dataset específico para el entorno'
      },
      {
        name: 'Project ID',
        check: () => configContent.includes('projectId'),
        message: 'Project ID no configurado',
        priority: 'high',
        recommendation: 'Configurar Project ID único para el proyecto'
      }
    ];

    checks.forEach(check => {
      const status = check.check() ? 'pass' : 'fail';
      this.report.config.sanity.checks.push({
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
    if (this.validatePath(envPath) && fs.existsSync(envPath)) envFiles.push(envPath);
    if (this.validatePath(envLocalPath) && fs.existsSync(envLocalPath)) envFiles.push(envLocalPath);
    
    if (envFiles.length === 0) {
      this.report.config.sanity.checks.push({
        name: 'Environment Variables',
        status: 'fail',
        message: 'Archivos de variables de entorno no encontrados',
        priority: 'high',
        recommendation: 'Crear archivos .env con configuraciones sensibles'
      });
      return;
    }

    // Verificar variables críticas
    const criticalVars = [
      'SANITY_PROJECT_ID',
      'SANITY_DATASET',
      'SANITY_API_VERSION'
    ];

    criticalVars.forEach(varName => {
      const found = envFiles.some(file => {
        if (!this.validatePath(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        return content.includes(varName);
      });

      this.report.config.sanity.checks.push({
        name: `Environment Variable: ${varName}`,
        status: found ? 'pass' : 'fail',
        message: found ? 'Variable encontrada' : `Variable ${varName} no encontrada`,
        priority: 'high',
        recommendation: found ? null : `Agregar ${varName} a los archivos de entorno`
      });
    });

    console.log(`   Verificadas ${criticalVars.length} variables de entorno`);
  }

  async validateSecuritySettings() {
    console.log('🛡️ Validando configuraciones de seguridad...');
    
    const securityChecks = [
      {
        name: 'HTTPS Configuration',
        check: () => {
          const configPath = path.join(this.projectRoot, 'sanity.config.ts');
          if (!this.validatePath(configPath) || !fs.existsSync(configPath)) return false;
          const content = fs.readFileSync(configPath, 'utf8');
          return content.includes('https') || content.includes('secure');
        },
        message: 'Configuración HTTPS no encontrada',
        priority: 'high',
        recommendation: 'Configurar HTTPS para todas las comunicaciones'
      },
      {
        name: 'API Rate Limiting',
        check: () => {
          const configPath = path.join(this.projectRoot, 'sanity.config.ts');
          if (!this.validatePath(configPath) || !fs.existsSync(configPath)) return false;
          const content = fs.readFileSync(configPath, 'utf8');
          return content.includes('rate') || content.includes('limit');
        },
        message: 'Configuración de rate limiting no encontrada',
        priority: 'medium',
        recommendation: 'Implementar rate limiting para prevenir abuso de API'
      },
      {
        name: 'Input Validation',
        check: () => {
          const schemaPath = path.join(this.projectRoot, 'schemaTypes');
          if (!this.validatePath(schemaPath) || !fs.existsSync(schemaPath)) return false;
          const files = fs.readdirSync(schemaPath);
          return files.some(file => file.includes('validation'));
        },
        message: 'Validación de entrada no configurada',
        priority: 'medium',
        recommendation: 'Implementar validaciones en los esquemas de Sanity'
      }
    ];

    securityChecks.forEach(check => {
      const status = check.check() ? 'pass' : 'fail';
      this.report.config.sanity.checks.push({
        name: check.name,
        status,
        message: status === 'pass' ? 'Configuración encontrada' : check.message,
        priority: check.priority,
        recommendation: status === 'fail' ? check.recommendation : null
      });
    });

    console.log(`   Completadas ${securityChecks.length} verificaciones de seguridad`);
  }

  calculateScore() {
    const totalChecks = this.report.config.sanity.checks.length;
    const passedChecks = this.report.config.sanity.checks.filter(check => check.status === 'pass').length;
    
    this.report.config.sanity.score = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
    
    // Generar recomendaciones basadas en fallos
    this.report.config.sanity.checks
      .filter(check => check.status === 'fail' && check.recommendation)
      .forEach(check => {
        this.report.config.sanity.recommendations.push({
          priority: check.priority,
          message: check.recommendation,
          check: check.name
        });
      });
  }

  generateReport() {
    const outputDir = path.join(this.projectRoot, 'security-reports');
    
    if (!this.validatePath(outputDir) || !fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Reporte JSON
    const jsonPath = path.join(outputDir, `config-report-${Date.now()}.json`);
    if (this.validatePath(jsonPath)) {
      fs.writeFileSync(jsonPath, JSON.stringify(this.report, null, 2));
      console.log(`📄 Reporte de configuración generado: ${jsonPath}`);
    }
    
    // Reporte de texto
    const textPath = path.join(outputDir, `config-report-${Date.now()}.txt`);
    const textReport = this.generateTextReport();
    if (this.validatePath(textPath)) {
      fs.writeFileSync(textPath, textReport);
      console.log(`📄 Reporte de texto generado: ${textPath}`);
    }
    
    this.printSummary();
  }

  generateTextReport() {
    let report = `REPORTE DE CONFIGURACIÓN - CMS\n`;
    report += `================================\n\n`;
    report += `Fecha: ${this.report.timestamp}\n`;
    report += `Proyecto: ${this.report.project}\n`;
    report += `Score de Seguridad: ${this.report.config.sanity.score}%\n\n`;
    
    report += `VERIFICACIONES:\n`;
    this.report.config.sanity.checks.forEach(check => {
      const status = check.status === 'pass' ? '✅' : '❌';
      report += `${status} ${check.name} (${check.priority}): ${check.message}\n`;
    });
    
    if (this.report.config.sanity.recommendations.length > 0) {
      report += `\nRECOMENDACIONES:\n`;
      this.report.config.sanity.recommendations
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
    const passed = this.report.config.sanity.checks.filter(c => c.status === 'pass').length;
    const total = this.report.config.sanity.checks.length;
    const score = this.report.config.sanity.score;
    
    console.log('\n📊 RESUMEN DE CONFIGURACIÓN:');
    console.log(`   Verificaciones pasadas: ${passed}/${total}`);
    console.log(`   Score de seguridad: ${score}%`);
    console.log(`   Recomendaciones: ${this.report.config.sanity.recommendations.length}`);
    
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
