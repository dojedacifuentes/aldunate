/* ==========================================================================
   data/knowledge.js — alimenta la sección CONOCIMIENTO (conocimiento.html)

   ⚠ CONTENIDO DE EJEMPLO (PLACEHOLDER)
   Material de relleno para evaluar el diseño. Ninguna de estas publicaciones
   existe. Sustituir antes de publicar.

   Campos propios de esta colección, además del esquema común:
     date    : ISO 'YYYY-MM-DD'  (ordena la sección)
     authors : string[]
     venue   : dónde se publicó
     type    : 'informe' | 'investigación' | 'guía' | 'análisis' | 'recurso'
   ========================================================================== */

DL.data.knowledge = [
  {
    id: 'k-001',
    slug: 'transparencia-algoritmica-sector-publico',
    title: 'Transparencia algorítmica en el sector público',
    type: 'informe',
    category: 'Transparencia',
    summary: 'Qué significa exactamente "explicar" una decisión automatizada frente a quien la recibe.',
    description: 'El informe distingue tres exigencias que suelen confundirse bajo una sola palabra: publicidad del sistema, explicación de la decisión individual y auditabilidad del modelo. Cada una responde a un interés distinto y admite soluciones distintas.\n\nSostiene que la mayor parte de los compromisos de transparencia adoptados hasta ahora satisfacen la primera y dejan intactas las otras dos, que son las que importan para impugnar.',
    status: 'activo',
    year: 2026,
    date: '2026-05-14',
    authors: ['Diógenes Lab'],
    venue: 'Documento de trabajo',
    tags: ['transparencia', 'motivación', 'debido proceso'],
    featured: true
  },
  {
    id: 'k-002',
    slug: 'normatividad-modelos-lenguaje',
    title: 'Normatividad y modelos de lenguaje',
    type: 'investigación',
    category: 'Teoría',
    summary: 'Un sistema que predice texto normativo, ¿sigue una regla o reproduce su forma?',
    description: 'Investigación en curso sobre qué relación guarda un modelo de lenguaje con las reglas cuyo texto reproduce. La pregunta no es si acierta, sino si hay algo en su funcionamiento que corresponda a seguir una regla en el sentido que ese concepto tiene en teoría del derecho.\n\nLa distinción tiene consecuencias prácticas: determina qué se puede exigir como justificación y qué es sólo una reconstrucción posterior.',
    status: 'en curso',
    year: 2026,
    date: '2026-03-02',
    authors: ['Diógenes Lab'],
    venue: 'Línea de investigación',
    tags: ['teoría del derecho', 'seguimiento de reglas', 'lenguaje'],
    featured: true
  },
  {
    id: 'k-003',
    slug: 'guia-evaluacion-riesgos-ia',
    title: 'Guía de evaluación de riesgos de sistemas de IA',
    type: 'guía',
    category: 'Cumplimiento',
    summary: 'Procedimiento de evaluación para instituciones que van a incorporar un sistema automatizado.',
    description: 'Guía operativa con las preguntas que conviene responder antes de adoptar un sistema: qué decide, sobre quién, con qué datos, con qué revisión humana efectiva y con qué vía de reclamo.\n\nEstá escrita para ser usada en una reunión, no para ser citada. Cada sección cabe en una página.',
    status: 'activo',
    year: 2025,
    date: '2025-11-20',
    authors: ['Diógenes Lab'],
    venue: 'Guía práctica',
    tags: ['riesgo', 'cumplimiento', 'procedimiento']
  },
  {
    id: 'k-004',
    slug: 'deber-motivacion-decisiones-automatizadas',
    title: 'El deber de motivación en decisiones automatizadas',
    type: 'análisis',
    category: 'Derecho administrativo',
    summary: 'Motivar no es describir el sistema: es dar las razones de esta decisión concreta.',
    description: 'Análisis del estándar de motivación aplicado a actos administrativos apoyados en sistemas automatizados. Argumenta que describir el funcionamiento general del sistema no satisface el deber de motivar, porque no permite al afectado discutir su caso.',
    status: 'activo',
    year: 2025,
    date: '2025-08-07',
    authors: ['Diógenes Lab'],
    venue: 'Nota de análisis',
    tags: ['motivación', 'acto administrativo', 'impugnación']
  },
  {
    id: 'k-005',
    slug: 'glosario-critico-ia-derecho',
    title: 'Glosario crítico de IA y derecho',
    type: 'recurso',
    category: 'Referencia',
    summary: 'Veinte términos que se usan como si significaran lo mismo en ambos campos, y no.',
    description: 'Cada entrada contrasta el uso técnico y el uso jurídico de un mismo término —sesgo, riesgo, explicación, autonomía, decisión— y señala dónde la equivalencia aparente produce malentendidos con consecuencias.\n\nRecurso vivo: se actualiza cuando aparece un término que empieza a usarse en los dos sentidos a la vez.',
    status: 'activo',
    year: 2025,
    date: '2025-06-18',
    authors: ['Diógenes Lab'],
    venue: 'Recurso abierto',
    tags: ['glosario', 'conceptos', 'referencia'],
    featured: true
  },
  {
    id: 'k-006',
    slug: 'sesgo-prueba-carga-argumentativa',
    title: 'Sesgo, prueba y carga argumentativa',
    type: 'informe',
    category: 'Prueba',
    summary: 'Quién debe probar qué cuando se alega que un sistema discrimina.',
    description: 'El informe examina cómo se distribuye la carga de la prueba en reclamaciones por discriminación algorítmica, y por qué la regla general deja al reclamante en una posición imposible: se le pide acreditar el funcionamiento de un sistema al que no tiene acceso.',
    status: 'activo',
    year: 2024,
    date: '2024-12-03',
    authors: ['Diógenes Lab'],
    venue: 'Documento de trabajo',
    tags: ['prueba', 'discriminación', 'carga probatoria']
  },
  {
    id: 'k-007',
    slug: 'lectura-critica-evaluaciones-modelos',
    title: 'Lectura crítica de evaluaciones de modelos',
    type: 'guía',
    category: 'Método',
    summary: 'Cómo leer una métrica de rendimiento antes de aceptarla como argumento.',
    description: 'Guía breve sobre qué preguntar ante una cifra de desempeño: sobre qué conjunto se midió, quién lo construyó, qué caso cuenta como error y qué pasa con los casos que el conjunto no contiene.',
    status: 'activo',
    year: 2024,
    date: '2024-09-11',
    authors: ['Diógenes Lab'],
    venue: 'Guía práctica',
    tags: ['evaluación', 'métricas', 'método']
  }
];
