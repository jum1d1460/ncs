# Sistema de Herramientas de Evaluación

Sistema completo de herramientas de evaluación psicológica para NCS Psicóloga, comenzando con el cuestionario de TDAH en adultos.

## 📋 Estructura

```
web/src/
├── pages/
│   └── herramientas/
│       ├── index.astro           # Página índice de herramientas
│       └── tdah-adultos.astro    # Cuestionario TDAH
└── components/
    └── TDAHQuestionnaire.astro   # Componente del cuestionario
```

## 🎯 Características

### Página Índice de Herramientas (`/herramientas`)

- **Diseño responsivo** con TailwindCSS
- **Cards interactivas** para cada herramienta
- **Sistema escalable** para añadir nuevas herramientas fácilmente
- **Información clara** sobre cada evaluación
- **Avisos importantes** sobre el uso de las herramientas

### Cuestionario TDAH en Adultos (`/herramientas/tdah-adultos`)

#### 1. Sistema de Pasos

El cuestionario está dividido en 6 pasos:

1. **Paso 0**: Información personal (email, localidad, provincia, país)
2. **Pasos 1-4**: Preguntas por categoría
   - Atención y Concentración (6 preguntas)
   - Distracción y Memoria (3 preguntas)
   - Hiperactividad (4 preguntas)
   - Impulsividad (5 preguntas)
3. **Paso 5**: Resultados y recomendaciones

#### 2. Características del Cuestionario

- ✅ **18 preguntas** basadas en criterios diagnósticos estandarizados
- ✅ **Escala de frecuencia** de 5 niveles con colores intuitivos
- ✅ **Barra de progreso** animada
- ✅ **Validación** de campos obligatorios
- ✅ **Navegación** entre pasos con botones Anterior/Siguiente
- ✅ **Animaciones suaves** para mejorar la experiencia
- ✅ **Diseño mobile-first** completamente responsivo

#### 3. Sistema de Scoring

El sistema calcula:
- **Puntuación total**: Suma de todas las respuestas (0-72 puntos)
- **Puntuaciones por categoría**: Para identificar áreas específicas
- **Porcentaje**: Relación entre puntuación obtenida y máxima

**Niveles de resultado:**

| Porcentaje | Nivel | Descripción |
|------------|-------|-------------|
| 0-29% | Bajo | Pocos síntomas compatibles con TDAH |
| 30-54% | Moderado | Algunos síntomas que requieren evaluación |
| 55-100% | Alto | Varios síntomas compatibles con TDAH |

#### 4. Resultados Personalizados

Según el nivel obtenido, se muestran:

**Nivel Bajo:**
- Mensaje tranquilizador
- Oferta de ayuda en otras áreas
- Enlace de contacto

**Nivel Moderado:**
- Recomendación de evaluación profesional
- Explicación de posibles causas alternativas
- Opciones de contacto y cita

**Nivel Alto:**
- Recomendación enérgica de evaluación completa
- Información sobre tratabilidad del TDAH
- Llamada a la acción clara (cita + contacto)

## 💾 Integración con Base de Datos

### Endpoint de Persistencia

El cuestionario envía los datos al servicio de persistencia:

```javascript
POST /api/lead
```

**Payload enviado:**

```json
{
  "name": "Ciudad del usuario",
  "email": "usuario@email.com",
  "test_type": "TDAH Adultos",
  "test_results": {
    "answers": {
      "q1": 2,
      "q2": 3,
      ...
    },
    "category_scores": {
      "atencion": 12,
      "distraccion": 8,
      "hiperactividad": 10,
      "impulsividad": 15
    },
    "location": {
      "localidad": "Madrid",
      "provincia": "Madrid",
      "pais": "España"
    }
  },
  "score": 45,
  "recommendations": [
    "Nivel: Moderado",
    "Porcentaje: 63%"
  ],
  "source": "tdah_questionnaire"
}
```

### Tabla en Supabase

Los datos se guardan en la tabla `leads`:

```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  test_type VARCHAR(100) NOT NULL,
  test_results JSONB,
  score INTEGER,
  recommendations TEXT[],
  source VARCHAR(50) DEFAULT 'test_form',
  created_at TIMESTAMP DEFAULT NOW(),
  environment VARCHAR(20)
);
```

## ⚙️ Configuración

### Variables de Entorno

Añade en `/web/.env`:

```bash
# URL del servicio de persistencia
PUBLIC_PERSISTENCE_WORKER_URL=https://ncs-persistence.workers.dev
```

En desarrollo:
```bash
PUBLIC_PERSISTENCE_WORKER_URL=http://localhost:8787
```

### Despliegue

Las páginas usan `export const prerender = true` para generación estática (SSG).

## 🎨 Diseño y UX

### Principios de Diseño

1. **Claridad**: Lenguaje simple y directo
2. **Progreso visible**: Barra de progreso siempre visible
3. **Feedback inmediato**: Las respuestas se marcan visualmente
4. **No intimidante**: División en pasos para no abrumar
5. **Código de colores**: Escala intuitiva de verde (nunca) a rojo (muy frecuentemente)
6. **Accesibilidad**: Texto legible, contraste adecuado, diseño responsivo

### Componentes Visuales

- **Iconos**: Emojis grandes para mejor comprensión visual
- **Cards**: Sombras y elevación para jerarquía visual
- **Colores**: Gradientes sutiles para un aspecto moderno
- **Animaciones**: Transiciones suaves (fade-in, scale, etc.)
- **CTAs**: Botones destacados con hover states

## 🔐 Privacidad y Seguridad

- ✅ Email obligatorio para resultados
- ✅ Mensaje claro sobre confidencialidad
- ✅ Aviso de que los resultados son orientativos
- ✅ Datos guardados de forma segura en Supabase
- ✅ No se comparten datos con terceros
- ✅ Cumplimiento con RGPD

## 📱 Responsive Design

El sistema es completamente responsivo:

- **Mobile**: 1 columna, navegación vertical
- **Tablet**: 2 columnas en grid de herramientas
- **Desktop**: 3 columnas, diseño amplio

Breakpoints de TailwindCSS:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px

## 🚀 Añadir Nuevas Herramientas

Para añadir una nueva herramienta:

1. **Añadir a la lista en `/herramientas/index.astro`:**

```typescript
const herramientas = [
  // ... herramientas existentes
  {
    slug: 'test-ansiedad',
    titulo: 'Test de Ansiedad',
    descripcion: 'Evaluación de niveles de ansiedad y estrés.',
    icono: '😰',
    duracion: '5 minutos',
    color: 'green'
  }
];
```

2. **Crear el componente del cuestionario:**

```astro
// web/src/components/AnsiedadQuestionnaire.astro
```

3. **Crear la página:**

```astro
// web/src/pages/herramientas/test-ansiedad.astro
---
import Layout from '../../layouts/Layout.astro';
import AnsiedadQuestionnaire from '../../components/AnsiedadQuestionnaire.astro';
import { fetchGlobalSettings } from '../../lib/sanityClient';

export const prerender = true;

const settings = await fetchGlobalSettings();
---

<Layout title="Test de Ansiedad - NCS Psicóloga" globalSettings={settings}>
  <!-- Contenido -->
  <AnsiedadQuestionnaire />
</Layout>
```

## 📊 Métricas y Analytics

Datos que se pueden analizar:

- Número de tests completados por tipo
- Distribución de resultados (bajo/moderado/alto)
- Puntuaciones promedio por categoría
- Ubicación geográfica de los usuarios
- Tasa de conversión (test → contacto/cita)
- Tiempo promedio de completación

## 🔄 Actualizaciones Futuras

Ideas para mejoras:

- [ ] Envío de email con resultados al usuario
- [ ] Comparación con población general
- [ ] Gráficos visuales de resultados
- [ ] Exportar resultados en PDF
- [ ] Recordatorios de seguimiento
- [ ] Tests adicionales (ansiedad, depresión, estrés)
- [ ] Versión para profesionales (más detallada)
- [ ] Historial de tests del usuario

## 🐛 Debugging

### Verificar envío de datos

Abrir consola del navegador y buscar:

```javascript
// Si hay error
console.error('Error al guardar resultados:', error);

// Si es exitoso, verás el POST en Network
POST /api/lead 201 Created
```

### Verificar en Supabase

```sql
SELECT * FROM leads 
WHERE test_type = 'TDAH Adultos' 
ORDER BY created_at DESC 
LIMIT 10;
```

## 📚 Referencias

- [ASRS (Adult ADHD Self-Report Scale)](https://add.org/wp-content/uploads/2015/03/adhd-questionnaire-ASRS111.pdf)
- [DSM-5 Criteria for ADHD](https://www.cdc.gov/adhd/diagnosis/index.html)
- [NICE Guidelines for ADHD](https://www.nice.org.uk/guidance/ng87)

## 👥 Soporte

Para preguntas o problemas:
- Email: info@ncs-psicologa.com
- Documentación del servicio de persistencia: `/workers/persistence-worker/README.md`

