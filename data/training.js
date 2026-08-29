/* ==========================================================================
   data/training.js — alimenta la sección FORMACIÓN (formacion.html)

   ⚠ CONTENIDO DE EJEMPLO (PLACEHOLDER)
   Material de relleno para evaluar el diseño. Revisar y sustituir por la
   oferta real antes de publicar.

   Campos propios de esta colección, además del esquema común:
     audience : a quién va dirigido
     mode     : 'presencial' | 'online' | 'híbrido'
     duration : duración legible
     next     : próxima edición (texto libre)
     type     : 'curso' | 'taller' | 'programa' | 'material'
   ========================================================================== */

DL.data.training = [
  {
    id: 't-001',
    slug: 'derecho-e-inteligencia-artificial',
    title: 'Derecho e inteligencia artificial',
    type: 'curso',
    category: 'Fundamentos',
    summary: 'Curso base sobre decisión automatizada, prueba y garantías.',
    description: 'Recorre las cuestiones que aparecen cuando un sistema automatizado participa en una decisión con efectos jurídicos: qué se puede exigir como justificación, cómo se prueba un funcionamiento defectuoso y qué garantías siguen siendo aplicables.\n\nNo requiere conocimientos técnicos previos. Sí requiere disposición a discutir casos concretos en lugar de principios generales.',
    status: 'activo',
    year: 2026,
    audience: 'Estudiantes de derecho y profesionales del sector público',
    mode: 'híbrido',
    duration: '12 sesiones · 24 horas',
    next: 'Marzo 2026',
    tags: ['fundamentos', 'decisión automatizada', 'garantías'],
    featured: true
  },
  {
    id: 't-002',
    slug: 'hechos-y-opiniones',
    title: 'Hechos y opiniones',
    type: 'taller',
    category: 'Argumentación',
    summary: 'Taller práctico sobre la distinción entre enunciados de hecho y juicios de valor.',
    description: 'La distinción entre hechos y opiniones se enuncia con facilidad y se aplica mal. El taller trabaja sobre material real —resoluciones, notas de prensa, informes— para identificar dónde se cuela una valoración presentada como constatación.\n\nFormato de trabajo: se discute a partir de textos, no de definiciones.',
    status: 'activo',
    year: 2026,
    audience: 'Pregrado y formación continua',
    mode: 'presencial',
    duration: '4 sesiones · 8 horas',
    next: 'Abril 2026',
    tags: ['argumentación', 'prueba', 'análisis de texto'],
    featured: true
  },
  {
    id: 't-003',
    slug: 'teoria-de-la-normatividad',
    title: 'Teoría de la normatividad',
    type: 'programa',
    category: 'Teoría',
    summary: 'Programa sobre qué hace que una norma obligue, y qué cambia cuando la aplica una máquina.',
    description: 'Programa de lectura y discusión sobre el problema de la normatividad: qué distingue seguir una regla de comportarse regularmente, y qué consecuencias tiene esa distinción cuando la aplicación queda delegada en un sistema que no sigue reglas en ese sentido.\n\nEs la línea teórica de la que salen la mayoría de los proyectos del Lab.',
    status: 'en curso',
    year: 2026,
    audience: 'Postgrado e investigación',
    mode: 'presencial',
    duration: 'Semestral',
    next: 'Agosto 2026',
    tags: ['teoría del derecho', 'seguimiento de reglas', 'lectura']
  },
  {
    id: 't-004',
    slug: 'cuaderno-de-casos',
    title: 'Cuaderno de casos: decisiones automatizadas',
    type: 'material',
    category: 'Material docente',
    summary: 'Veinticuatro casos con preguntas de discusión, listos para llevar a clase.',
    description: 'Material docente de uso libre. Cada caso incluye los hechos, el problema jurídico, las preguntas de discusión y una nota para quien enseña con las respuestas que suelen aparecer y por dónde conviene tensionarlas.',
    status: 'activo',
    year: 2025,
    audience: 'Docentes',
    mode: 'online',
    duration: '24 casos',
    next: 'Disponible',
    tags: ['casos', 'material abierto', 'docencia']
  },
  {
    id: 't-005',
    slug: 'diseno-sistemas-informacion-juridica',
    title: 'Diseño de sistemas de información jurídica',
    type: 'taller',
    category: 'Práctica',
    summary: 'Cómo se estructura información normativa para que siga siendo consultable en cinco años.',
    description: 'Taller práctico sobre modelado de información jurídica: identificadores estables, versionado de textos vigentes, relaciones entre normas y por qué casi todas las bases de datos legales envejecen mal.\n\nSe trabaja construyendo un esquema pequeño de principio a fin.',
    status: 'activo',
    year: 2025,
    audience: 'Perfiles mixtos: derecho y tecnología',
    mode: 'online',
    duration: '3 sesiones · 9 horas',
    next: 'Por confirmar',
    tags: ['modelado', 'datos', 'práctica']
  },
  {
    id: 't-006',
    slug: 'clinica-verificacion',
    title: 'Clínica de verificación',
    type: 'programa',
    category: 'Práctica',
    summary: 'Programa práctico: verificar afirmaciones jurídicas contra sus fuentes.',
    description: 'Los participantes trabajan sobre textos reales que contienen citas normativas y jurisprudenciales, y verifican cada una contra la fuente. El resultado se publica como fe de erratas abierta.\n\nEl objetivo formativo es el hábito, no la herramienta: comprobar antes de citar.',
    status: 'próximamente',
    year: 2026,
    audience: 'Estudiantes avanzados',
    mode: 'híbrido',
    duration: 'Semestral',
    next: 'Segundo semestre 2026',
    tags: ['verificación', 'práctica', 'fuentes']
  }
];
