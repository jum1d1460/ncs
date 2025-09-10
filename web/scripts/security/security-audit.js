#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar configuración
const configPath = path.join(__dirname, 'security-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

class SecurityAuditor {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      project: 'web',
      vulnerabilities: [],
      outdated: [],
      recommendations: [],
      summary: {
        totalVulnerabilities: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      }
    };
  }

  async runAudit() {
    console.log('🔍 Ejecutando auditoría de seguridad para Web...\n');

    try {
      await this.checkVulnerabilities();
      await this.checkOutdatedDependencies();
      await this.validateConfiguration();
      this.generateReport();
      this.checkFailures();
    } catch (error) {
      console.error('❌ Error durante la auditoría:', error.message);
      process.exit(1);
    }
  }

  async checkVulnerabilities() {
    console.log('📦 Verificando vulnerabilidades en dependencias...');
    
    try {
      const auditOutput = execSync('npm audit --json', { 
        encoding: 'utf8',
        cwd: path.join(__dirname, '..', '..')
      });
      
      const auditData = JSON.parse(auditOutput);
      
      if (auditData.vulnerabilities) {
        Object.entries(auditData.vulnerabilities).forEach(([name, vuln]) => {
          const severity = vuln.severity || 'unknown';
          const vulnerability = {
            name,
            severity,
            title: vuln.title || 'Sin título',
            description: vuln.description || 'Sin descripción',
            recommendation: vuln.recommendation || 'Actualizar dependencia'
          };
          
          this.report.vulnerabilities.push(vulnerability);
          this.report.summary.totalVulnerabilities++;
          this.report.summary[severity]++;
        });
      }
    } catch (error) {
      console.warn('⚠️ No se pudo ejecutar npm audit:', error.message);
    }
  }

  async checkOutdatedDependencies() {
    if (!config.dependencies.checkOutdated) return;
    
    console.log('🔄 Verificando dependencias obsoletas...');
    
    try {
      const outdatedOutput = execSync('npm outdated --json', { 
        encoding: 'utf8',
        cwd: path.join(__dirname, '..', '..')
      });
      
      const outdatedData = JSON.parse(outdatedOutput);
      
      Object.entries(outdatedData).forEach(([name, info]) => {
        this.report.outdated.push({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          type: info.type
        });
      });
    } catch (error) {
      // npm outdated exit code 1 when there are outdated packages
      if (error.status === 1) {
        // This is expected when there are outdated packages
        return;
      }
      console.warn('⚠️ No se pudo verificar dependencias obsoletas:', error.message);
    }
  }

  async validateConfiguration() {
    console.log('⚙️ Validando configuración de Astro...');
    
    const astroConfigPath = path.join(__dirname, '..', '..', 'astro.config.mjs');
    
    if (fs.existsSync(astroConfigPath)) {
      const configContent = fs.readFileSync(astroConfigPath, 'utf8');
      
      // Verificar configuraciones de seguridad básicas
      const checks = [
        {
          name: 'Security Headers',
          check: () => configContent.includes('security') || configContent.includes('headers'),
          message: 'Configuración de headers de seguridad no encontrada'
        },
        {
          name: 'CSP Configuration',
          check: () => configContent.includes('csp') || configContent.includes('CSP'),
          message: 'Configuración de Content Security Policy no encontrada'
        },
        {
          name: 'Environment Variables',
          check: () => configContent.includes('env') || configContent.includes('ENV'),
          message: 'Configuración de variables de entorno no encontrada'
        }
      ];
      
      checks.forEach(check => {
        if (!check.check()) {
          this.report.recommendations.push({
            type: 'configuration',
            message: check.message,
            file: 'astro.config.mjs'
          });
        }
      });
    }
    
    // Verificar archivo .env
    const envPath = path.join(__dirname, '..', '..', '.env');
    if (!fs.existsSync(envPath)) {
      this.report.recommendations.push({
        type: 'configuration',
        message: 'Archivo .env no encontrado - considerar usar variables de entorno',
        file: '.env'
      });
    }
  }

  generateReport() {
    const outputDir = path.join(__dirname, '..', '..', config.reporting.outputDir);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Reporte JSON
    if (config.reporting.formats.includes('json')) {
      const jsonPath = path.join(outputDir, `security-report-${Date.now()}.json`);
      fs.writeFileSync(jsonPath, JSON.stringify(this.report, null, 2));
      console.log(`📄 Reporte JSON generado: ${jsonPath}`);
    }
    
    // Reporte de texto
    if (config.reporting.formats.includes('text')) {
      const textPath = path.join(outputDir, `security-report-${Date.now()}.txt`);
      const textReport = this.generateTextReport();
      fs.writeFileSync(textPath, textReport);
      console.log(`📄 Reporte de texto generado: ${textPath}`);
    }
    
    // Mostrar resumen en consola
    this.printSummary();
  }

  generateTextReport() {
    let report = `REPORTE DE SEGURIDAD - WEB\n`;
    report += `==============================\n\n`;
    report += `Fecha: ${this.report.timestamp}\n`;
    report += `Proyecto: ${this.report.project}\n\n`;
    
    report += `RESUMEN:\n`;
    report += `- Total vulnerabilidades: ${this.report.summary.totalVulnerabilities}\n`;
    report += `- Críticas: ${this.report.summary.critical}\n`;
    report += `- Altas: ${this.report.summary.high}\n`;
    report += `- Medias: ${this.report.summary.medium}\n`;
    report += `- Bajas: ${this.report.summary.low}\n\n`;
    
    if (this.report.vulnerabilities.length > 0) {
      report += `VULNERABILIDADES:\n`;
      this.report.vulnerabilities.forEach(vuln => {
        report += `- ${vuln.name} (${vuln.severity}): ${vuln.title}\n`;
        report += `  Recomendación: ${vuln.recommendation}\n\n`;
      });
    }
    
    if (this.report.outdated.length > 0) {
      report += `DEPENDENCIAS OBSOLETAS:\n`;
      this.report.outdated.forEach(dep => {
        report += `- ${dep.name}: ${dep.current} → ${dep.latest}\n`;
      });
      report += `\n`;
    }
    
    if (this.report.recommendations.length > 0) {
      report += `RECOMENDACIONES:\n`;
      this.report.recommendations.forEach(rec => {
        report += `- ${rec.message} (${rec.file})\n`;
      });
    }
    
    return report;
  }

  printSummary() {
    console.log('\n📊 RESUMEN DE SEGURIDAD:');
    console.log(`   Vulnerabilidades totales: ${this.report.summary.totalVulnerabilities}`);
    console.log(`   Críticas: ${this.report.summary.critical}`);
    console.log(`   Altas: ${this.report.summary.high}`);
    console.log(`   Medias: ${this.report.summary.medium}`);
    console.log(`   Bajas: ${this.report.summary.low}`);
    console.log(`   Dependencias obsoletas: ${this.report.outdated.length}`);
    console.log(`   Recomendaciones: ${this.report.recommendations.length}`);
  }

  checkFailures() {
    let shouldFail = false;
    
    if (config.audit.failOnCritical && this.report.summary.critical > 0) {
      console.log('\n❌ FALLO: Se encontraron vulnerabilidades críticas');
      shouldFail = true;
    }
    
    if (config.audit.failOnHigh && this.report.summary.high > 0) {
      console.log('\n❌ FALLO: Se encontraron vulnerabilidades altas');
      shouldFail = true;
    }
    
    if (shouldFail) {
      process.exit(1);
    } else {
      console.log('\n✅ Auditoría completada sin fallos críticos');
    }
  }
}

// Ejecutar auditoría
const auditor = new SecurityAuditor();
auditor.runAudit().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
