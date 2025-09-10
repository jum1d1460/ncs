#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class SecretDetector {
  constructor() {
    this.projectRoot = path.join(__dirname, '..', '..');
    this.secrets = [];
    this.patterns = [
      // API Keys
      { pattern: /api[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'API Key' },
      { pattern: /secret[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Secret Key' },
      { pattern: /private[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Private Key' },
      
      // Tokens
      { pattern: /token\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Token' },
      { pattern: /access[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Access Token' },
      { pattern: /bearer[_-]?token\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Bearer Token' },
      
      // Passwords
      { pattern: /password\s*[:=]\s*['"][^'"]{6,}['"]/gi, type: 'Password' },
      { pattern: /passwd\s*[:=]\s*['"][^'"]{6,}['"]/gi, type: 'Password' },
      { pattern: /pwd\s*[:=]\s*['"][^'"]{6,}['"]/gi, type: 'Password' },
      
      // Database
      { pattern: /database[_-]?url\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Database URL' },
      { pattern: /db[_-]?url\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Database URL' },
      { pattern: /connection[_-]?string\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Connection String' },
      
      // JWT
      { pattern: /jwt[_-]?secret\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'JWT Secret' },
      { pattern: /jwt[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'JWT Key' },
      
      // OAuth
      { pattern: /client[_-]?secret\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'OAuth Client Secret' },
      { pattern: /oauth[_-]?secret\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'OAuth Secret' },
      
      // AWS
      { pattern: /aws[_-]?access[_-]?key[_-]?id\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'AWS Access Key' },
      { pattern: /aws[_-]?secret[_-]?access[_-]?key\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'AWS Secret Key' },
      
      // Generic secrets
      { pattern: /secret\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Secret' },
      { pattern: /key\s*[:=]\s*['"][^'"]{10,}['"]/gi, type: 'Key' }
    ];
  }

  async runDetection() {
    console.log('🔍 Detectando secrets hardcodeados en el código...\n');

    try {
      await this.scanDirectory(this.projectRoot);
      this.generateReport();
    } catch (error) {
      console.error('❌ Error durante la detección:', error.message);
      process.exit(1);
    }
  }

  async scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Saltar directorios que no necesitan ser escaneados
        if (this.shouldSkipDirectory(item)) {
          continue;
        }
        await this.scanDirectory(fullPath);
      } else if (stat.isFile()) {
        if (this.shouldScanFile(item)) {
          await this.scanFile(fullPath);
        }
      }
    }
  }

  shouldSkipDirectory(dirName) {
    const skipDirs = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.nuxt',
      'security-reports'
    ];
    return skipDirs.includes(dirName);
  }

  shouldScanFile(fileName) {
    const extensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.env', '.env.local', '.env.example'];
    return extensions.some(ext => fileName.endsWith(ext));
  }

  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(this.projectRoot, filePath);
      
      this.patterns.forEach(({ pattern, type }) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            this.secrets.push({
              file: relativePath,
              type,
              match: this.maskSecret(match),
              line: this.getLineNumber(content, match),
              severity: this.getSeverity(type)
            });
          });
        }
      });
    } catch (error) {
      console.warn(`⚠️ No se pudo leer el archivo ${filePath}:`, error.message);
    }
  }

  maskSecret(secret) {
    if (secret.length <= 10) return secret;
    return secret.substring(0, 4) + '...' + secret.substring(secret.length - 4);
  }

  getLineNumber(content, match) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        return i + 1;
      }
    }
    return 0;
  }

  getSeverity(type) {
    const highSeverity = ['API Key', 'Secret Key', 'Private Key', 'Password', 'JWT Secret', 'OAuth Client Secret', 'AWS Secret Key'];
    return highSeverity.includes(type) ? 'high' : 'medium';
  }

  generateReport() {
    const outputDir = path.join(this.projectRoot, 'security-reports');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Reporte JSON
    const jsonPath = path.join(outputDir, `secrets-report-${Date.now()}.json`);
    const report = {
      timestamp: new Date().toISOString(),
      project: 'cms',
      secrets: this.secrets,
      summary: {
        total: this.secrets.length,
        high: this.secrets.filter(s => s.severity === 'high').length,
        medium: this.secrets.filter(s => s.severity === 'medium').length
      }
    };
    
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(`📄 Reporte de secrets generado: ${jsonPath}`);
    
    // Reporte de texto
    const textPath = path.join(outputDir, `secrets-report-${Date.now()}.txt`);
    const textReport = this.generateTextReport(report);
    fs.writeFileSync(textPath, textReport);
    console.log(`📄 Reporte de texto generado: ${textPath}`);
    
    this.printSummary(report);
  }

  generateTextReport(report) {
    let text = `REPORTE DE SECRETS - CMS\n`;
    text += `==========================\n\n`;
    text += `Fecha: ${report.timestamp}\n`;
    text += `Proyecto: ${report.project}\n\n`;
    
    text += `RESUMEN:\n`;
    text += `- Total secrets encontrados: ${report.summary.total}\n`;
    text += `- Severidad alta: ${report.summary.high}\n`;
    text += `- Severidad media: ${report.summary.medium}\n\n`;
    
    if (report.secrets.length > 0) {
      text += `SECRETS DETECTADOS:\n`;
      report.secrets.forEach(secret => {
        text += `- ${secret.type} (${secret.severity}): ${secret.file}:${secret.line}\n`;
        text += `  ${secret.match}\n\n`;
      });
      
      text += `RECOMENDACIONES:\n`;
      text += `- Mover secrets a variables de entorno\n`;
      text += `- Usar archivos .env para configuraciones sensibles\n`;
      text += `- Nunca commitear archivos .env\n`;
      text += `- Usar servicios de gestión de secrets en producción\n`;
    } else {
      text += `✅ No se encontraron secrets hardcodeados\n`;
    }
    
    return text;
  }

  printSummary(report) {
    console.log('\n📊 RESUMEN DE SECRETS:');
    console.log(`   Total encontrados: ${report.summary.total}`);
    console.log(`   Severidad alta: ${report.summary.high}`);
    console.log(`   Severidad media: ${report.summary.medium}`);
    
    if (report.summary.total > 0) {
      console.log('\n⚠️ ADVERTENCIA: Se encontraron secrets hardcodeados!');
      console.log('   Revisar el reporte detallado y mover a variables de entorno.');
    } else {
      console.log('\n✅ No se encontraron secrets hardcodeados');
    }
  }
}

// Ejecutar detección
const detector = new SecretDetector();
detector.runDetection().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});
