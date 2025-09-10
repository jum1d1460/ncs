#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SecurityMaster {
  constructor() {
    this.projects = ['cms', 'web'];
    this.results = {
      timestamp: new Date().toISOString(),
      projects: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async runAllChecks() {
    console.log('🔒 Ejecutando validaciones de seguridad completas...\n');

    for (const project of this.projects) {
      console.log(`\n📁 Procesando proyecto: ${project.toUpperCase()}`);
      console.log('='.repeat(50));
      
      this.results.projects[project] = {
        checks: [],
        status: 'running'
      };

      try {
        await this.runProjectChecks(project);
        this.results.projects[project].status = 'completed';
        this.results.summary.passed++;
      } catch (error) {
        this.results.projects[project].status = 'failed';
        this.results.projects[project].error = error.message;
        this.results.summary.failed++;
      }
      
      this.results.summary.total++;
    }

    this.generateMasterReport();
    this.printSummary();
  }

  async runProjectChecks(project) {
    const projectPath = path.join(__dirname, '..', project);
    
    const checks = [
      {
        name: 'Security Audit',
        command: 'npm run security:audit',
        critical: true
      },
      {
        name: 'Dependency Check',
        command: 'npm run security:dependencies',
        critical: false
      },
      {
        name: 'Configuration Validation',
        command: 'npm run security:config',
        critical: false
      },
      {
        name: 'Secrets Detection',
        command: 'npm run security:secrets',
        critical: true
      },
      {
        name: 'ESLint Security Rules',
        command: 'npm run lint',
        critical: false
      }
    ];

    for (const check of checks) {
      try {
        console.log(`  🔍 ${check.name}...`);
        execSync(check.command, { 
          cwd: projectPath,
          stdio: 'pipe'
        });
        
        this.results.projects[project].checks.push({
          name: check.name,
          status: 'passed',
          critical: check.critical
        });
        
        console.log(`    ✅ ${check.name} - PASSED`);
      } catch (error) {
        const status = check.critical ? 'failed' : 'warning';
        this.results.projects[project].checks.push({
          name: check.name,
          status,
          critical: check.critical,
          error: error.message
        });
        
        if (check.critical) {
          console.log(`    ❌ ${check.name} - FAILED`);
          throw new Error(`${check.name} failed: ${error.message}`);
        } else {
          console.log(`    ⚠️ ${check.name} - WARNING`);
          this.results.summary.warnings++;
        }
      }
    }
  }

  generateMasterReport() {
    const outputDir = path.join(__dirname, '..', 'security-reports');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Reporte JSON
    const jsonPath = path.join(outputDir, `master-security-report-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Reporte maestro generado: ${jsonPath}`);
    
    // Reporte de texto
    const textPath = path.join(outputDir, `master-security-report-${Date.now()}.txt`);
    const textReport = this.generateTextReport();
    fs.writeFileSync(textPath, textReport);
    console.log(`📄 Reporte de texto generado: ${textPath}`);
  }

  generateTextReport() {
    let report = `REPORTE MAESTRO DE SEGURIDAD\n`;
    report += `============================\n\n`;
    report += `Fecha: ${this.results.timestamp}\n`;
    report += `Proyectos procesados: ${this.results.summary.total}\n`;
    report += `Exitosos: ${this.results.summary.passed}\n`;
    report += `Fallidos: ${this.results.summary.failed}\n`;
    report += `Advertencias: ${this.results.summary.warnings}\n\n`;
    
    Object.entries(this.results.projects).forEach(([project, data]) => {
      report += `PROYECTO: ${project.toUpperCase()}\n`;
      report += `Estado: ${data.status}\n`;
      report += `Verificaciones:\n`;
      
      data.checks.forEach(check => {
        const status = check.status === 'passed' ? '✅' : 
                     check.status === 'failed' ? '❌' : '⚠️';
        report += `  ${status} ${check.name} (${check.critical ? 'CRÍTICO' : 'OPCIONAL'})\n`;
        if (check.error) {
          report += `    Error: ${check.error}\n`;
        }
      });
      
      if (data.error) {
        report += `\nError general: ${data.error}\n`;
      }
      
      report += `\n`;
    });
    
    report += `RECOMENDACIONES:\n`;
    report += `- Revisar todos los reportes individuales\n`;
    report += `- Corregir vulnerabilidades críticas inmediatamente\n`;
    report += `- Actualizar dependencias obsoletas\n`;
    report += `- Configurar variables de entorno para secrets\n`;
    report += `- Revisar configuraciones de seguridad\n`;
    
    return report;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RESUMEN MAESTRO DE SEGURIDAD');
    console.log('='.repeat(60));
    console.log(`Proyectos procesados: ${this.results.summary.total}`);
    console.log(`✅ Exitosos: ${this.results.summary.passed}`);
    console.log(`❌ Fallidos: ${this.results.summary.failed}`);
    console.log(`⚠️ Advertencias: ${this.results.summary.warnings}`);
    
    if (this.results.summary.failed > 0) {
      console.log('\n🚨 ADVERTENCIA: Se encontraron fallos críticos!');
      console.log('   Revisar los reportes detallados y corregir inmediatamente.');
    } else if (this.results.summary.warnings > 0) {
      console.log('\n⚠️ Se encontraron advertencias de seguridad.');
      console.log('   Considerar revisar y corregir para mejorar la seguridad.');
    } else {
      console.log('\n🎉 ¡Excelente! Todas las validaciones de seguridad pasaron.');
    }
    
    console.log('\n📁 Reportes generados en: ./security-reports/');
  }
}

// Ejecutar validaciones maestras
const master = new SecurityMaster();
master.runAllChecks().catch(error => {
  console.error('Error fatal en validaciones maestras:', error);
  process.exit(1);
});
