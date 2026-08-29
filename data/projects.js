/* ==========================================================================
   data/projects.js — alimenta la sección LAB (lab.html)

   ⚠ CONTENIDO DE EJEMPLO (PLACEHOLDER)
   Todos los ítems de este fichero son material de relleno escrito en el
   dominio del proyecto para poder evaluar el diseño con densidad realista.
   Sustituir por contenido real antes de publicar. Ninguno describe un
   trabajo existente.

   Esquema completo: docs/ARCHITECTURE.md § 6
     type   : 'proyecto' | 'herramienta' | 'prototipo'
     status : 'activo' | 'en curso' | 'prototipo' | 'archivado' | 'próximamente'
   Los filtros de la sección se derivan solos de los `type` presentes.
   ========================================================================== */

DL.data.projects = [
  {
    id: 'p-001',
    slug: 'observatorio-decisiones-algoritmicas',
    title: 'Observatorio de decisiones algorítmicas',
    type: 'proyecto',
    category: 'Sector público',
    summary: 'Registro abierto de sistemas automatizados usados en decisiones administrativas.',
    description: 'Un catálogo público que documenta qué organismos emplean sistemas automatizados, sobre qué base normativa, con qué grado de revisión humana y con qué vías de impugnación disponibles.\n\nEl objetivo no es acumular casos, sino hacer visible una arquitectura de decisión que hoy está repartida entre resoluciones, bases de licitación y documentación técnica que nadie lee junta.',
    status: 'en curso',
    year: 2026,
    tags: ['transparencia', 'derecho administrativo', 'catálogo'],
    featured: true
  },
  {
    id: 'p-002',
    slug: 'verificador-citas-normativas',
    title: 'Verificador de citas normativas',
    type: 'herramienta',
    category: 'Verificación',
    summary: 'Comprueba que una cita legal exista, esté vigente y diga lo que se afirma.',
    description: 'Toma un texto, extrae las referencias normativas y jurisprudenciales, y contrasta cada una contra la fuente: existencia, vigencia a la fecha indicada y correspondencia entre lo citado y lo que la fuente efectivamente dice.\n\nNació de un problema concreto: los sistemas generativos producen citas con la forma correcta y el contenido equivocado, y el coste de verificarlas a mano recae siempre sobre quien menos tiempo tiene.',
    status: 'activo',
    year: 2026,
    tags: ['verificación', 'citas', 'vigencia'],
    featured: true
  },
  {
    id: 'p-003',
    slug: 'mapa-trazabilidad-regulatoria',
    title: 'Mapa de trazabilidad regulatoria',
    type: 'prototipo',
    category: 'Visualización',
    summary: 'Sigue una obligación concreta desde la ley hasta la circular que la operativiza.',
    description: 'Visualiza la cadena completa que va de una disposición legal a los reglamentos, instrucciones y formularios que la aplican, mostrando dónde se añade contenido que la ley no traía.\n\nEs un prototipo: funciona sobre un corpus acotado y sirve para probar la idea, no para producción.',
    status: 'prototipo',
    year: 2025,
    tags: ['visualización', 'jerarquía normativa', 'grafos']
  },
  {
    id: 'p-004',
    slug: 'analizador-clausulas',
    title: 'Analizador de cláusulas',
    type: 'herramienta',
    category: 'Contratos',
    summary: 'Señala cláusulas potencialmente abusivas en contratos de adhesión y explica por qué.',
    description: 'Revisa contratos de adhesión y marca las cláusulas que encajan en supuestos ya declarados abusivos, indicando siempre el fundamento concreto.\n\nDeliberadamente no emite un veredicto: entrega una lista de puntos a revisar con su razón. La calificación es un juicio jurídico y no se delega en una herramienta.',
    status: 'activo',
    year: 2025,
    tags: ['consumo', 'contratos', 'análisis'],
    featured: true
  },
  {
    id: 'p-005',
    slug: 'corpus-jurisprudencia-anotada',
    title: 'Corpus de jurisprudencia anotada',
    type: 'proyecto',
    category: 'Datos',
    summary: 'Sentencias anotadas por estructura argumental, no sólo por materia.',
    description: 'Un conjunto de sentencias anotadas según cómo argumentan: qué hechos se dan por probados, qué regla se aplica, qué paso justifica el salto entre ambos y dónde queda el punto realmente discutido.\n\nLa anotación por materia ya existe. Lo que falta es poder preguntar por forma de razonamiento.',
    status: 'en curso',
    year: 2026,
    tags: ['corpus', 'anotación', 'argumentación']
  },
  {
    id: 'p-006',
    slug: 'simulador-impacto-normativo',
    title: 'Simulador de impacto normativo',
    type: 'prototipo',
    category: 'Política pública',
    summary: 'Estima a quién alcanza un cambio normativo antes de que se apruebe.',
    description: 'Cruza el texto de una propuesta con datos públicos de registro y actividad para estimar qué universo de sujetos queda alcanzado y qué cargas concretas aparecen.\n\nProduce órdenes de magnitud, no cifras. Su utilidad está en descartar supuestos implausibles temprano.',
    status: 'prototipo',
    year: 2025,
    tags: ['impacto', 'datos abiertos', 'simulación']
  },
  {
    id: 'p-007',
    slug: 'comparador-versiones-legislativas',
    title: 'Comparador de versiones legislativas',
    type: 'herramienta',
    category: 'Verificación',
    summary: 'Diferencias entre dos versiones de un texto legal, con el efecto de cada cambio.',
    description: 'Compara dos versiones de un cuerpo normativo y presenta las diferencias agrupadas por artículo, distinguiendo entre cambios de redacción y cambios de alcance.',
    status: 'activo',
    year: 2024,
    tags: ['diff', 'legislación', 'vigencia']
  },
  {
    id: 'p-008',
    slug: 'archivo-formularios-administrativos',
    title: 'Archivo de formularios administrativos',
    type: 'proyecto',
    category: 'Sector público',
    summary: 'Colección de formularios como evidencia de cómo se interpreta la norma en la práctica.',
    description: 'Los formularios administrativos son donde la norma se vuelve operación concreta: qué se pide, en qué orden y qué se asume. Este archivo los recoge y fecha.\n\nProyecto detenido: el corpus está publicado, la herramienta de consulta no se completó.',
    status: 'archivado',
    year: 2023,
    tags: ['archivo', 'burocracia', 'evidencia']
  }
];
