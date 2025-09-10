# 🔒 Validadores de Seguridad

Sistema completo de validación de seguridad para los proyectos CMS (Sanity) y Web (Astro) de NCS Psicóloga Zaragoza.

## 📋 Características

### ✅ Validaciones Implementadas

- **Auditoría de Dependencias**: Detección de vulnerabilidades y dependencias obsoletas
- **Validación de Configuraciones**: Verificación de configuraciones de seguridad en Sanity y Astro
- **Análisis de Código**: ESLint con reglas de seguridad y detección de patrones inseguros
- **Detección de Secrets**: Identificación de credenciales y secrets hardcodeados
- **Pre-commit Hooks**: Validaciones automáticas antes de cada commit
- **CI/CD Integration**: Workflow de GitHub Actions para validación continua

### 🛠️ Herramientas Utilizadas

- `npm audit` - Auditoría nativa de vulnerabilidades
- `eslint-plugin-security` - Reglas de seguridad para ESLint
- `husky` - Pre-commit hooks
- `GitHub Actions` - Integración CI/CD

## 🚀 Uso

### Scripts Disponibles

#### Por Proyecto

```bash
# CMS (Sanity)
cd cms
npm run security:audit          # Auditoría de seguridad
npm run security:dependencies   # Verificación de dependencias
npm run security:config         # Validación de configuración
npm run security:secrets        # Detección de secrets
npm run lint                    # ESLint con reglas de seguridad

# Web (Astro)
cd web
npm run security:audit          # Auditoría de seguridad
npm run security:dependencies   # Verificación de dependencias
npm run security:config         # Validación de configuración
npm run security:secrets        # Detección de secrets
npm run lint                    # ESLint con reglas de seguridad
```

#### Scripts Maestros

```bash
# Desde la raíz del proyecto
npm run security:all            # Ejecutar todas las validaciones
npm run security:cms            # Validaciones solo del CMS
npm run security:web            # Validaciones solo del Web
npm run test:security           # Alias para security:all
```

### 🔧 Configuración

#### Archivos de Configuración

- `cms/scripts/security/security-config.json` - Configuración del CMS
- `web/scripts/security/security-config.json` - Configuración del Web

#### Configuración de Umbrales

```json
{
  "audit": {
    "level": "moderate",
    "failOnCritical": true,
    "failOnHigh": false,
    "failOnMedium": false
  }
}
```

## 📊 Reportes

### Tipos de Reportes

1. **Security Audit**: Vulnerabilidades de dependencias
2. **Dependency Check**: Dependencias obsoletas y licencias
3. **Configuration Validation**: Configuraciones de seguridad
4. **Secrets Detection**: Secrets hardcodeados
5. **Master Report**: Resumen completo de todas las validaciones

### Ubicación de Reportes

```
security-reports/
├── security-report-*.json      # Auditoría de seguridad
├── dependency-report-*.json    # Verificación de dependencias
├── config-report-*.json        # Validación de configuración
├── secrets-report-*.json       # Detección de secrets
└── master-security-report-*.json # Reporte maestro
```

## 🔄 Integración CI/CD

### GitHub Actions Workflow

El workflow `.github/workflows/security-check.yml` se ejecuta:

- **Push** a ramas `main` y `develop`
- **Pull Requests** hacia `main` y `develop`
- **Diariamente** a las 2:00 AM UTC (cron)

### Características del Workflow

- ✅ Ejecución paralela para CMS y Web
- ✅ Generación de reportes como artefactos
- ✅ Comentarios automáticos en PRs
- ✅ Creación de issues para vulnerabilidades críticas
- ✅ Reporte de resumen consolidado

## 🛡️ Reglas de Seguridad

### ESLint Security Rules

- `security/detect-buffer-noassert`
- `security/detect-child-process`
- `security/detect-eval-with-expression`
- `security/detect-non-literal-fs-filename`
- `security/detect-object-injection`
- `security/detect-possible-timing-attacks`
- `security/detect-unsafe-regex`

### Patrones de Secrets Detectados

- API Keys
- Secret Keys
- Private Keys
- Tokens (Access, Bearer, JWT)
- Passwords
- Database URLs
- OAuth Client Secrets
- AWS Keys

## 📈 Métricas de Seguridad

### Scores y Umbrales

- **Score de Configuración**: 0-100%
  - < 70%: Advertencia
  - 70-90%: Aceptable
  - > 90%: Excelente

- **Severidad de Vulnerabilidades**:
  - Critical: Falla el build
  - High: Configurable (por defecto: warning)
  - Medium: Warning
  - Low: Info

## 🔧 Mantenimiento

### Actualización de Dependencias

```bash
# Actualizar dependencias de seguridad
npm audit fix

# Verificar dependencias obsoletas
npm outdated

# Actualizar a versiones más recientes
npm update
```

### Configuración de Variables de Entorno

1. Crear archivos `.env` para configuraciones sensibles
2. Nunca commitear archivos `.env`
3. Usar `.env.example` como plantilla
4. Configurar variables en el entorno de producción

### Resolución de Vulnerabilidades

1. Revisar reportes de seguridad
2. Priorizar vulnerabilidades críticas y altas
3. Actualizar dependencias afectadas
4. Revisar configuraciones inseguras
5. Mover secrets a variables de entorno

## 🚨 Alertas y Notificaciones

### Pre-commit Hooks

Los hooks de Husky ejecutan automáticamente:
- ESLint con reglas de seguridad
- Auditoría de seguridad
- Verificación de dependencias
- Detección de secrets

### CI/CD Notifications

- Comentarios automáticos en PRs con reportes
- Issues automáticos para vulnerabilidades críticas
- Artefactos con reportes detallados
- Notificaciones de fallos de build

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)

---

**Desarrollado para NCS Psicóloga Zaragoza**  
*Mantén tu código seguro y actualizado* 🔒
