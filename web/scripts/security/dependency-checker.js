#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class DependencyChecker {
  constructor() {
    this.projectRoot = path.join(__dirname, '..', '..');
    this.report = {
      timestamp: new Date().toISOString(),
      project: 'web',
      dependencies: {
        outdated: [],
        vulnerable: [],
        licenses: [],
        recommendations: []
      }
    };
  }

  async runCheck() {
    console.log('🔍 Verificando dependencias del Web...\n');

    try {
      await this.checkOutdatedDependencies();
      await this.checkVulnerabilities();
      await this.checkLicenses();
      this.generateRecommendations();
      this.generateReport();
    } catch (error) {
      console.error('❌ Error durante la verificación:', error.message);
      process.exit(1);
    }
  }

  async checkOutdatedDependencies() {
    console.log('🔄 Verificando dependencias obsoletas...');
    
    try {
      const outdatedOutput = execSync('npm outdated --json', { 
        encoding: 'utf8',
        cwd: this.projectRoot
      });
      
      const outdatedData = JSON.parse(outdatedOutput);
      
      Object.entries(outdatedData).forEach(([name, info]) => {
        this.report.dependencies.outdated.push({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          type: info.type,
          location: info.location
        });
      });
      
      console.log(`   Encontradas ${this.report.dependencies.outdated.length} dependencias obsoletas`);
    } catch (error) {
      if (error.status === 1) {
        // Expected when there are outdated packages
        return;
      }
      console.warn('⚠️ No se pudo verificar dependencias obsoletas:', error.message);
    }
  }

  async checkVulnerabilities() {
    console.log('🛡️ Verificando vulnerabilidades...');
    
    try {
      const auditOutput = execSync('npm audit --json', { 
        encoding: 'utf8',
        cwd: this.projectRoot
      });
      
      const auditData = JSON.parse(auditOutput);
      
      if (auditData.vulnerabilities) {
        Object.entries(auditData.vulnerabilities).forEach(([name, vuln]) => {
          this.report.dependencies.vulnerable.push({
            name,
            severity: vuln.severity || 'unknown',
            title: vuln.title || 'Sin título',
            description: vuln.description || 'Sin descripción',
            recommendation: vuln.recommendation || 'Actualizar dependencia',
            via: vuln.via || [],
            range: vuln.range || 'unknown'
          });
        });
      }
      
      console.log(`   Encontradas ${this.report.dependencies.vulnerable.length} vulnerabilidades`);
    } catch (error) {
      console.warn('⚠️ No se pudo ejecutar npm audit:', error.message);
    }
  }

  async checkLicenses() {
    console.log('📄 Verificando licencias...');
    
    try {
      const licenseOutput = execSync('npm list --json --depth=0', { 
        encoding: 'utf8',
        cwd: this.projectRoot
      });
      
      const packageData = JSON.parse(licenseOutput);
      
      if (packageData.dependencies) {
        Object.entries(packageData.dependencies).forEach(([name, info]) => {
          this.report.dependencies.licenses.push({
            name,
            version: info.version,
            license: info.license || 'No especificada',
            repository: info.repository || 'No especificada'
          });
        });
      }
      
      console.log(`   Verificadas ${this.report.dependencies.licenses.length} licencias`);
    } catch (error) {
      console.warn('⚠️ No se pudo verificar licencias:', error.message);
    }
  }

  generateRecommendations() {
    console.log('💡 Generando recomendaciones...');
    
    // Recomendaciones para dependencias obsoletas
    this.report.dependencies.outdated.forEach(dep => {
      this.report.dependencies.recommendations.push({
        type: 'outdated',
        package: dep.name,
        message: `Actualizar ${dep.name} de ${dep.current} a ${dep.latest}`,
        priority: this.getPriority(dep.current, dep.latest)
      });
    });
    
    // Recomendaciones para vulnerabilidades
    this.report.dependencies.vulnerable.forEach(vuln => {
      this.report.dependencies.recommendations.push({
        type: 'vulnerability',
        package: vuln.name,
        message: `Corregir vulnerabilidad ${vuln.severity} en ${vuln.name}: ${vuln.recommendation}`,
        priority: this.getVulnerabilityPriority(vuln.severity)
      });
    });
    
    // Recomendaciones generales
    this.report.dependencies.recommendations.push({
      type: 'general',
      package: 'all',
      message: 'Ejecutar "npm audit fix" para corregir vulnerabilidades automáticamente',
      priority: 'medium'
    });
    
    this.report.dependencies.recommendations.push({
      type: 'general',
      package: 'all',
      message: 'Revisar regularmente las dependencias con "npm outdated"',
      priority: 'low'
    });
    
    console.log(`   Generadas ${this.report.dependencies.recommendations.length} recomendaciones`);
  }

  getPriority(current, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    if (currentParts[0] < latestParts[0]) return 'high';
    if (currentParts[1] < latestParts[1]) return 'medium';
    return 'low';
  }

  getVulnerabilityPriority(severity) {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'moderate': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  generateReport() {
    const outputDir = path.join(this.projectRoot, 'security-reports');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Reporte JSON
    const jsonPath = path.join(outputDir, `dependency-report-${Date.now()}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(this.report, null, 2));
    console.log(`📄 Reporte de dependencias generado: ${jsonPath}`);
    
    // Reporte de texto
    const textPath = path.join(outputDir, `dependency-report-${Date.now()}.txt`);
    const textReport = this.generateTextReport();
    fs.writeFileSync(textPath, textReport);
    console.log(`📄 Reporte de texto generado: ${textPath}`);
    
    this.printSummary();
  }

  generateTextReport() {
    let report = `REPORTE DE DEPENDENCIAS - WEB\n`;
    report += `==============================\n\n`;
    report += `Fecha: ${this.report.timestamp}\n`;
    report += `Proyecto: ${this.report.project}\n\n`;
    
    report += `RESUMEN:\n`;
    report += `- Dependencias obsoletas: ${this.report.dependencies.outdated.length}\n`;
    report += `- Vulnerabilidades: ${this.report.dependencies.vulnerable.length}\n`;
    report += `- Licencias verificadas: ${this.report.dependencies.licenses.length}\n`;
    report += `- Recomendaciones: ${this.report.dependencies.recommendations.length}\n\n`;
    
    if (this.report.dependencies.outdated.length > 0) {
      report += `DEPENDENCIAS OBSOLETAS:\n`;
      this.report.dependencies.outdated.forEach(dep => {
        report += `- ${dep.name}: ${dep.current} → ${dep.latest} (${dep.type})\n`;
      });
      report += `\n`;
    }
    
    if (this.report.dependencies.vulnerable.length > 0) {
      report += `VULNERABILIDADES:\n`;
      this.report.dependencies.vulnerable.forEach(vuln => {
        report += `- ${vuln.name} (${vuln.severity}): ${vuln.title}\n`;
        report += `  Recomendación: ${vuln.recommendation}\n\n`;
      });
    }
    
    if (this.report.dependencies.recommendations.length > 0) {
      report += `RECOMENDACIONES:\n`;
      this.report.dependencies.recommendations
        .sort((a, b) => this.getPriorityOrder(a.priority) - this.getPriorityOrder(b.priority))
        .forEach(rec => {
          report += `- [${rec.priority.toUpperCase()}] ${rec.message}\n`;
        });
    }
    
    return report;
  }

  getPriorityOrder(priority) {
    const order = { critical: 1, high: 2, medium: 3, low: 4 };
    return order[priority] || 5;
  }

  printSummary() {
    console.log('\n📊 RESUMEN DE DEPENDENCIAS:');
    console.log(`   Obsoletas: ${this.report.dependencies.outdated.length}`);
    console.log(`   Vulnerables: ${this.report.dependencies.vulnerable.length}`);
    console.log(`   Licencias: ${this.report.dependencies.licenses.length}`);
    console.log(`   Recomendaciones: ${this.report.dependencies.recommendations.length}`);
  }
}

// Ejecutar verificación
const checker = new DependencyChecker();
checker.runCheck().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
