/* Vitrinas de la maqueta «Panel»: Mis cursos (tarjetas), Recursos y Guías, protocolos y tutoriales.
   Todo es contenido de MUESTRA, para ver cómo quedaría el sitio. Sólo se enlaza afuera lo que ya está publicado
   (revisado el 28-10-2026: los sitios de EVA y tres fuentes oficiales); lo demás dice «muestra» o «pendiente». */

/* ---------- Portadas: ilustraciones de línea, sin fotos, en el color de cada curso ---------- */
const MOTIVOS = [
  // 1 Qué es la IA: las definiciones (comillas y renglones)
  '<path d="M44 30c-6 2-9 7-9 13h8v10H31V43c0-11 5-18 13-21M66 30c-6 2-9 7-9 13h8v10H53V43c0-11 5-18 13-21"/><path d="M80 34h46M80 44h38M80 54h44M80 64h28"/>',
  // 2 Cómo funciona: la siguiente palabra
  '<rect x="18" y="36" width="26" height="18" rx="3"/><rect x="50" y="36" width="26" height="18" rx="3"/><rect x="82" y="36" width="26" height="18" rx="3"/><rect x="118" y="36" width="26" height="18" rx="3" stroke-dasharray="4 3"/><path d="M110 45h5m-3-3 3 3-3 3"/>',
  // 3 Estudiar sin perder el criterio: una balanza
  '<path d="M80 22v48M58 70h44M50 34h60"/><path d="M50 34 40 54h20zM110 34l-10 20h20z"/><circle cx="80" cy="22" r="3"/>',
  // 4 Investigación jurídica: lupa sobre un documento
  '<path d="M48 18h40l12 12v44H48z"/><path d="M88 18v12h12M58 40h30M58 48h26M58 56h18"/><circle cx="104" cy="58" r="13"/><path d="m113 67 12 12"/>',
  // 5 Crea tus herramientas: código
  '<path d="m56 30-16 15 16 15M104 30l16 15-16 15M88 26 72 64"/>',
  // 6 Ética profesional: candado (secreto profesional)
  '<rect x="58" y="40" width="44" height="34" rx="5"/><path d="M66 40V31a14 14 0 0 1 28 0v9M80 52v10"/>',
  // 7 Prueba digital: un cuadro y su doble punteado
  '<rect x="34" y="24" width="44" height="44" rx="4"/><rect x="84" y="24" width="44" height="44" rx="4" stroke-dasharray="4 3"/><path d="m50 38 14 8-14 8z"/><path d="m100 38 14 8-14 8z" stroke-dasharray="3 3"/>',
  // 8 Regulación: páginas con párrafo
  '<path d="M52 24h40v50H52z"/><path d="M60 18h40v50"/><path d="M68 12h40v50"/><path d="M70 38c0-4 8-4 8 0s-8 4-8 8 8 4 8 0"/>',
];
/* Imágenes de portada, hechas en Google Flow el 28-10-2026 (img/tarjetas/, WebP de 800 y 480 px): un objeto
   tecnológico que cuenta el contenido, sobre fondo grafito y con el color de la tarjeta. Sin personas ni texto.
   Cursos: curso-N · Recursos: rec-NN (posición en RECURSOS) · Laboratorio: lab-NN · Guías: guia-<id> o la del recurso igual. */
const IMG_ALT = {
  'curso-1': 'Un diccionario jurídico abierto del que las líneas se desprenden y forman una red de nodos rojos.',
  'curso-2': 'Fichas de vidrio en fila, como palabras; sobre el hueco final, barras de luz azul que eligen la siguiente.',
  'curso-3': 'Una balanza en equilibrio: un chip en un platillo y un cuaderno con lápiz en el otro, con una burbuja de diálogo.',
  'curso-4': 'Expedientes unidos por hilos de luz; bajo una lupa las conexiones brillan en verde y una lleva a una carpeta vacía.',
  'curso-5': 'Una aplicación pequeña que se arma en el aire con piezas de vidrio, junto a un compás de dibujo.',
  'curso-6': 'Un documento entra en una máquina y barras negras tapan sus datos; en la máquina, un candado de circuitos.',
  'curso-7': 'Un fotograma partido: mitad paisaje real, mitad malla digital, cruzado por una línea de escaneo, y una tarjeta de memoria en una bolsa de evidencia.',
  'curso-8': 'Una pirámide de cuatro losas de vidrio; la de arriba, la de mayor riesgo, brilla en dorado.',
  'rec-01': 'Un mapa de niveles de vidrio unido por un camino de luz azul, con un libro, un matraz y un dado.',
  'rec-02': 'Un cubo de vidrio con un signo de pregunta de luz adentro, reflejado en un espejo redondo.',
  'rec-03': 'Un mazo de tarjetas de vidrio en abanico, con una tarjeta girando en el aire.',
  'rec-04': 'Un cuaderno abierto y, sobre él, un aparato con forma de burbuja de diálogo que le lanza preguntas de luz azul.',
  'rec-05': 'Un archivo de fallos en estanterías que se pierden en la oscuridad, recorrido por un haz verde.',
  'rec-06': 'Una ley como láminas de vidrio en fila, una por versión; la del frente, la vigente, con borde verde.',
  'rec-07': 'Una papeleta de cita que avanza por un riel a través de cinco arcos de vidrio verde.',
  'rec-08': 'Una tesis abierta con marcadores de fibra óptica: algunos verdes, la mayoría blancos.',
  'rec-09': 'Dos vasos de laboratorio con hilos de luz violeta: en uno enredados, en el otro ordenados.',
  'rec-10': 'Un maletín de herramientas con piezas de vidrio y aluminio y un hueco que brilla en violeta.',
  'rec-11': 'Una torre de bloques de vidrio esmerilado; el de arriba brilla en violeta.',
  'rec-12': 'Piezas de juego en miniatura: bloques apilados, un camino de luz en forma de serpiente y fichas de memoria.',
  'rec-13': 'Un tomo legal oficial de pie, rodeado por un anillo de doce puntos de luz roja.',
  'rec-14': 'Haces de luz roja levantan palabras de un documento y dejan barras negras en su lugar.',
  'rec-15': 'Una huella digital hecha de puntos de datos rojos, protegida dentro de un escudo de vidrio.',
  'rec-16': 'Un fichero de biblioteca con cajones abiertos llenos de fichas que brillan en ocre.',
  'rec-17': 'Una prueba con preguntas como bloques de vidrio; un haz de luz las atraviesa todas menos un bloque ocre.',
  'rec-18': 'Un atril de vidrio con una línea de tiempo de tres tramos de luz, junto a un cuaderno.',
  'lab-01': 'Dos botones en un panel: uno grande y luminoso atrae una bola de acero; el otro, chico, casi no se ve.',
  'lab-02': 'Una cuadrícula de nueve fichas de vidrio como las de una verificación, con marcas de visto.',
  'lab-03': 'Una barra de progreso detenida antes del final, sobre libros de Derecho que se vuelven circuitos.',
  'lab-04': 'Una máquina imprime una decisión; al lado, una pluma sobre una línea de firma que espera.',
  'lab-05': 'Un larguísimo rollo de condiciones de uso que cae de la mesa, con una sola línea encendida en el medio.',
  'lab-06': 'Una sala de audiencias en miniatura con un chip en el banquillo, bajo un foco.',
  'guia-verificar-cita': 'Una lupa de inspección escanea con un láser rojo una cita y la une a uno de los tomos oficiales.',
  'guia-declarar-ia': 'Un trabajo encuadernado con una etiqueta de vidrio roja prendida en su última página.',
  'guia-patrones-oscuros': 'Un panel con dos interruptores: uno grande ya encendido y otro chico escondido tras un vidrio.',
  'guia-evaluar-con-ia': 'Una prueba con la maqueta de un expediente y un micrófono; el haz de la IA lo rodea sin atravesarlo.',
  'guia-prueba-con-ia': 'Un aparato de vidrio proyecta cinco tarjetas de preguntas, junto a un cuaderno y un lápiz.',
  'guia-comparar-fuente': 'Tres paneles de vidrio como columnas de una tabla, unidos por hilos de luz verde; uno queda cortado.',
};
function imgPortada(clave) {
  const b = `img/tarjetas/${clave}`;
  return `<img src="${b}-800.webp" srcset="${b}-480.webp 480w, ${b}-800.webp 800w" sizes="(max-width: 860px) 100vw, 340px" width="800" height="450" alt="${IMG_ALT[clave]}" loading="lazy" decoding="async">`;
}
function portada(k, color, num, motivo = MOTIVOS[k], img = '') {
  if (img) return `<div class="portada con-img" style="--c:${color}">${imgPortada(img)}<span class="p-num mono">${num}</span></div>`;
  return `<div class="portada" style="--c:${color}"><svg viewBox="0 0 160 90" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${motivo}</g></svg><span class="p-num mono">${num}</span></div>`;
}
const DESCRIPCIONES = [
  'Antes de usarla, lo que dicen las leyes y la ciencia que es: definiciones, dudas y lo propio de la IA.',
  'Cómo produce sus respuestas, por qué inventa con tanta seguridad y cómo pedirle mejor.',
  'Usar la IA como tutor que pregunta, analizar fallos y saber qué no se delega.',
  'Fuentes chilenas, jurisprudencia real y cómo documentar una investigación hecha con IA.',
  'De la idea a una herramienta jurídica pequeña que funciona, se prueba y se publica con sus límites.',
  'Secreto profesional, diligencia y transparencia con el cliente cuando se trabaja con IA.',
  'Qué es un deepfake, cómo se cuida una prueba digital y cuándo pedir un peritaje.',
  'El modelo europeo, el proyecto chileno, los datos personales y los derechos fundamentales.',
];

/* ---------- Mis cursos: vitrina de tarjetas ---------- */
function vistaCatalogo() {
  return `
  <div class="titulo"><div><h1>Mis cursos</h1><p>Ocho cursos de cuatro módulos. Mira de qué trata cada uno y entra cuando quieras.</p>${evaLinea('Yo los hice los ocho en un segundo. Tú tienes la ventaja de entenderlos.')}</div>
    <div class="acciones"><label class="buscador buscador-cat"><span>${I(IC.buscar, 18)}</span><input id="filtro-cat" placeholder="Filtrar cursos" aria-label="Filtrar cursos"></label></div></div>
  <div class="vitrina" id="vitrina">${CURSOS.map(([t], k) => {
    const pct = Math.round(totalCurso(k) / 16 * 100), listo = modulosListos(k) === 4;
    return `<a class="caja tarjeta" href="#cursos/${k + 1}" data-texto="${sinTildes(t + ' ' + DESCRIPCIONES[k] + ' ' + CURSOS[k][1].join(' '))}">
      ${portada(k, COLORES[k], String(k + 1).padStart(2, '0'), MOTIVOS[k], `curso-${k + 1}`)}
      <div class="t-cuerpo"><span class="t-eti">Curso ${k + 1} · 4 módulos · 20 min</span><h2>${t}</h2><p>${DESCRIPCIONES[k]}</p>
        <div class="t-pie"><span class="pista"><b style="width:${pct}%;background:${COLORES[k]}"></b></span><span class="mono">${listo ? 'Terminado ✓' : pct ? pct + ' %' : 'Sin empezar'}</span></div></div>
    </a>`;
  }).join('')}</div>
  <p class="muestra" style="margin-top:16px">CURSOS DE MUESTRA · CONTENIDO EN PREPARACIÓN</p>`;
}
function alMontarCatalogo() {
  $('#filtro-cat').addEventListener('input', (e) => {
    const q = sinTildes(e.target.value.trim());
    document.querySelectorAll('.vitrina .tarjeta').forEach((t) => { t.hidden = q && !t.dataset.texto.includes(q); });
  });
}

/* ---------- Recursos ---------- */
const CATEGORIAS = [
  ['estudiar', 'Estudiar con IA'], ['investigar', 'Investigación jurídica'], ['herramientas', 'Herramientas digitales'],
  ['etica', 'Ética, datos y regulación'], ['docentes', 'Recursos docentes'],
];
const TIPO_MOTIVO = {
  curso: '<path d="M50 22h50a6 6 0 0 1 6 6v44H56a6 6 0 0 1-6-6zM50 66a6 6 0 0 1 6-6h50"/>',
  herramienta: '<path d="M96 26a14 14 0 0 0-18 18L52 70l8 8 26-26a14 14 0 0 0 18-18l-8 8-8-2-2-8z"/>',
  guia: '<path d="M56 20h36l12 12v46H56z"/><path d="M66 44l6 6 12-12M66 62h26"/>',
  fuente: '<path d="M80 18 48 32h64zM54 36v30M70 36v30M90 36v30M106 36v30M46 72h68"/>',
  juego: '<rect x="44" y="34" width="72" height="34" rx="17"/><path d="M62 44v14M55 51h14"/><circle cx="96" cy="48" r="3"/><circle cx="104" cy="56" r="3"/>',
  video: '<rect x="42" y="24" width="76" height="46" rx="6"/><path d="m74 37 14 10-14 10z"/>',
  protocolo: '<rect x="54" y="20" width="52" height="58" rx="5"/><path d="M68 18h24v8H68zM64 40h4M74 40h22M64 52h4M74 52h22M64 64h4M74 64h16"/>',
};
const COLOR_CAT = { estudiar: '#1f4e9c', investigar: '#2d7d46', herramientas: '#6b3fa0', etica: '#a81916', docentes: '#c98a12' };
// [título, descripción, categoría, tipo, estado, enlace, etiquetas]. estado: 'en línea' (publicado y revisado), 'muestra', 'pendiente'.
const RECURSOS = [
  ['EVA ACADEMY · IA y Derecho', 'Curso gamificado completo: lecciones, laboratorios, casos y juegos. Sin cuenta.', 'estudiar', 'curso', 'en línea', 'https://evaacademyia.vercel.app', ['curso', 'gratis']],
  ['Fundamentos de IA para el Derecho', 'Curso breve con juegos y preguntas para pensar cómo aprendes.', 'estudiar', 'curso', 'en línea', 'https://ia-derecho-curso.vercel.app', ['curso', 'estudiantes']],
  ['Conceptos: tarjetas de repaso', 'Los términos de IA que aparecen en clases, en tarjetas para repasar.', 'estudiar', 'guia', 'en línea', 'https://evaprompts.vercel.app/conceptos', ['repaso']],
  ['Guía: estudiar con IA sin que estudie por ti', 'Usarla como tutor que pregunta, no como resumidor.', 'estudiar', 'guia', 'muestra', '#guias/estudiar-con-ia', ['estudio']],
  ['Buscador de jurisprudencia del Poder Judicial', 'Fuente oficial para abrir un fallo antes de citarlo.', 'investigar', 'fuente', 'en línea', 'https://juris.pjud.cl/busqueda', ['fuente oficial', 'fallos']],
  ['Ley Chile · Biblioteca del Congreso Nacional', 'Fuente oficial de normas chilenas, con sus versiones.', 'investigar', 'fuente', 'en línea', 'https://www.bcn.cl/leychile', ['fuente oficial', 'normas']],
  ['Protocolo: verificar una cita', 'Cinco pasos antes de usar un fallo o una norma que te dio una IA.', 'investigar', 'protocolo', 'muestra', '#guias/verificar-cita', ['verificación']],
  ['Memorias y tesis con IA', 'Qué se puede delegar, qué no y cómo declararlo.', 'investigar', 'guia', 'pendiente', '', ['tesis']],
  ['Prompt Lab', 'Arma y compara encargos para una IA, paso a paso.', 'herramientas', 'herramienta', 'en línea', 'https://evaprompts.vercel.app/prompt-lab', ['prompts']],
  ['Toolkit: qué herramienta usar para cada encargo', 'Comparación práctica, con sus límites.', 'herramientas', 'guia', 'en línea', 'https://evaprompts.vercel.app/toolkit', ['comparación']],
  ['Construye tu prompt', 'Curso corto para escribir encargos claros.', 'herramientas', 'curso', 'en línea', 'https://evaprompts.vercel.app/curso', ['prompts']],
  ['Sala de juegos de EVA ACADEMY', 'Diez juegos breves para practicar conceptos.', 'herramientas', 'juego', 'en línea', 'https://evaacademyia.vercel.app/sala', ['juegos']],
  ['Reglamento europeo de IA (2024/1689)', 'Texto oficial en EUR-Lex.', 'etica', 'fuente', 'en línea', 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', ['fuente oficial', 'Unión Europea']],
  ['Protocolo: antes de pegar un documento en una IA', 'Anonimizar: qué borrar y qué revisar antes de pegar.', 'etica', 'protocolo', 'muestra', '#guias/antes-de-pegar', ['datos personales', 'secreto profesional']],
  ['Marco chileno de IA y datos personales', 'Resumen comentado para clases.', 'etica', 'guia', 'pendiente', '', ['Chile']],
  ['Catálogo abierto de recursos de EVA', 'Todos los materiales reutilizables de EVA, con su licencia.', 'docentes', 'guia', 'en línea', 'https://eva-recursos.vercel.app', ['catálogo', 'CC BY 4.0']],
  ['Guía: preparar una evaluación con IA', 'Preguntas que una IA no responde bien sola.', 'docentes', 'guia', 'muestra', '#guias/evaluar-con-ia', ['evaluación']],
  ['Guía docente del módulo 1.1', 'Antes, durante y después de la clase.', 'docentes', 'guia', 'muestra', '#docentes', ['clase']],
];
let catRecurso = 'todas';
function vistaRecursos() {
  const [, q] = location.hash.split('?');
  if (q && CATEGORIAS.some(([k]) => k === q)) catRecurso = q;
  const destacados = RECURSOS.filter((r) => r[4] === 'en línea').slice(0, 3);
  return `
  <div class="titulo"><div><h1>Recursos</h1><p>Para consultar sin inscribirte en nada. Lo que dice «en línea» está publicado; lo demás es muestra o está pendiente.</p>${evaLinea('Lo que dice «en línea» existe de verdad: lo revisé. Revísalo tú también.')}</div>
    <div class="acciones"><label class="buscador buscador-cat"><span>${I(IC.buscar, 18)}</span><input id="filtro-rec" placeholder="Buscar recursos" aria-label="Buscar recursos"></label></div></div>
  <div class="filtros" id="cat-rec"><button aria-pressed="${catRecurso === 'todas'}" data-c="todas">Todas</button>${CATEGORIAS.map(([k, t]) => `<button aria-pressed="${catRecurso === k}" data-c="${k}">${t}</button>`).join('')}</div>
  <div class="vitrina" id="vitrina-rec">${RECURSOS.map(tarjetaRecurso).join('')}</div>
  <p class="r-nada" id="rec-nada" hidden>Nada con ese filtro. Prueba «fuente», «prompts» o «datos».</p>
  <p class="muestra" style="margin-top:16px">ENLACES EXTERNOS REVISADOS EL 28-10-2026 · LO DEMÁS ES MUESTRA</p>`;
}
function tarjetaRecurso([t, d, cat, tipo, estado, url, etiq], i) {
  const fuera = url.startsWith('http'), tag = url ? 'a' : 'div';
  const attr = url ? `href="${url}"${fuera ? ' target="_blank" rel="noopener"' : ''}` : 'aria-disabled="true"';
  return `<${tag} class="caja tarjeta rec${url ? '' : ' sin-enlace'}" ${attr} data-cat="${cat}" data-texto="${sinTildes([t, d, tipo, ...etiq].join(' '))}">
    ${portada(0, COLOR_CAT[cat], tipo === 'fuente' ? 'FUENTE' : tipo.toUpperCase(), TIPO_MOTIVO[tipo], `rec-${String(i + 1).padStart(2, '0')}`)}
    <div class="t-cuerpo"><span class="t-eti">${CATEGORIAS.find(([k]) => k === cat)[1]}</span><h2>${t}</h2><p>${d}</p>
      <div class="t-pie"><span class="estado-r ${estado.replace(' ', '-')}">${estado === 'en línea' ? 'En línea ↗' : estado === 'muestra' ? 'Muestra' : 'Pendiente'}</span>${etiq.map((e) => `<span class="etq">${e}</span>`).join('')}</div></div>
  </${tag}>`;
}
function alMontarRecursos() {
  const filtrar = () => {
    const q = sinTildes($('#filtro-rec').value.trim());
    let n = 0;
    document.querySelectorAll('#vitrina-rec .tarjeta').forEach((t) => {
      const ok = (catRecurso === 'todas' || t.dataset.cat === catRecurso) && (!q || t.dataset.texto.includes(q));
      t.hidden = !ok; if (ok) n++;
    });
    $('#rec-nada').hidden = n > 0;
  };
  $('#cat-rec').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.dataset.c === catRecurso) return;
    catRecurso = b.dataset.c; EF.sonar('clic');
    $('#cat-rec').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    filtrar(); EF.llegar($('#vitrina-rec'), '.tarjeta:not([hidden])');
  });
  $('#filtro-rec').addEventListener('input', filtrar);
  filtrar();
}

/* ---------- Guías, protocolos y tutoriales ----------
   Textos de muestra escritos para la maqueta. Revisión jurídica pendiente. */
const GUIAS = [
  { id: 'antes-de-pegar', tipo: 'Protocolo', t: 'Antes de pegar un documento en una IA', d: 'Qué borrar y qué revisar para no exponer a un cliente.', min: 3, pub: 'Estudiantes y abogados',
    pasos: ['Pregúntate si de verdad necesitas pegar el documento completo o basta un fragmento.', 'Borra nombres, RUT, domicilios, correos, teléfonos y números de causa. Cámbialos por «Parte A», «Parte B».', 'Revisa los datos que identifican sin nombre: cargos únicos, fechas exactas, lugares pequeños.', 'Lee las condiciones de la herramienta: si guarda lo que pegas o lo usa para entrenar.', 'Si hay duda, no lo pegues. Pide al cliente o a tu supervisor una autorización.'],
    ir: [['Experimento: el contrato que nadie leyó', '#laboratorio/05'], ['Curso 6 · Secreto profesional', 'curso:5-0']] },
  { id: 'verificar-cita', tipo: 'Protocolo', t: 'Verificar una cita antes de usarla', d: 'Cinco pasos para un fallo o una norma que te dio una IA.', min: 5, pub: 'Estudiantes',
    pasos: ['Copia la referencia exacta que te dio la IA: tribunal, rol, fecha o número de ley.', 'Ábrela tú en la fuente oficial: el buscador del Poder Judicial o Ley Chile.', 'Si no aparece, trátala como inventada. No la cites «por si acaso».', 'Si aparece, lee la parte que se cita: comprueba que dice lo que la IA afirma.', 'Anota dónde y cuándo la verificaste. Eso es parte de tu trabajo.'],
    ir: [['Experimento: audiencia contra la IA', '#laboratorio/06'], ['Curso 4 · Investigación jurídica', 'curso:3-0']] },
  { id: 'declarar-ia', tipo: 'Protocolo', t: 'Declarar el uso de IA en un trabajo', d: 'Qué contar, en una nota breve, al final del trabajo.', min: 3, pub: 'Estudiantes',
    pasos: ['Revisa qué permite la asignatura o tu programa: manda lo que diga tu profesor.', 'Nombra la herramienta y para qué la usaste: ordenar ideas, revisar redacción, buscar contraargumentos.', 'Di qué no hizo: el análisis y las conclusiones son tuyos.', 'Guarda tus conversaciones por si te piden ver el proceso.'],
    ir: [['Pregunta a EVA: ¿puedo usar IA en mi tesis?', '#eva']] },
  { id: 'estudiar-con-ia', tipo: 'Guía', t: 'Estudiar con IA sin que estudie por ti', d: 'Que te pregunte ella a ti, no al revés.', min: 6, pub: 'Estudiantes',
    pasos: ['Pídele que te haga preguntas sobre la materia, una a la vez, sin darte la respuesta.', 'Responde tú, por escrito. Después pídele que corrija y explique en qué fallaste.', 'Si te da un dato nuevo, búscalo en tu apunte o en la fuente antes de aprenderlo.', 'Termina escribiendo tú un resumen de cinco líneas, sin mirar la conversación.'],
    ir: [['Curso 3 · Un tutor que pregunta', 'curso:2-0']] },
  { id: 'patrones-oscuros', tipo: 'Guía', t: 'Reconocer patrones oscuros', d: 'Interfaces que te empujan a elegir lo que conviene a otro.', min: 4, pub: 'Todos',
    pasos: ['Botones desiguales: la opción «buena» para la empresa es grande y de color; la otra, chica y gris.', 'Textos que culpan: «No, prefiero seguir perdiendo tiempo».', 'Casillas ya marcadas o condiciones que nadie lee antes de aceptar.', 'Cuando lo notes, detente: busca la opción que la interfaz esconde.'],
    ir: [['Experimento: la interfaz ya decidió por ti', '#laboratorio/01'], ['Experimento: el contrato que nadie leyó', '#laboratorio/05']] },
  { id: 'evaluar-con-ia', tipo: 'Guía', t: 'Preparar una evaluación con IA', d: 'Para docentes: preguntas que una IA no resuelve bien sola.', min: 6, pub: 'Docentes',
    pasos: ['Pide que apliquen la materia a un caso nuevo, con hechos de la clase.', 'Pide el proceso además del resultado: borradores, fuentes revisadas, decisiones.', 'Incluye una parte oral breve para conversar lo escrito.', 'Prueba tu pregunta en una IA antes de usarla y mira qué responde.'],
    ir: [['Docentes', '#docentes']] },
  { id: 'ley-chile', tipo: 'Tutorial', t: 'Buscar una norma en Ley Chile', d: 'Encontrar una ley y revisar qué versión está vigente.', min: 4, pub: 'Estudiantes',
    pasos: ['Entra a Ley Chile, el sitio de la Biblioteca del Congreso Nacional (bcn.cl/leychile).', 'Busca por número de ley o por palabras del título.', 'Abre la norma y mira la fecha de la versión que estás leyendo.', 'Si la IA te citó un artículo, compáralo con el texto oficial, palabra por palabra.'],
    ir: [['Abrir Ley Chile ↗', 'https://www.bcn.cl/leychile']] },
  { id: 'prueba-con-ia', tipo: 'Tutorial', t: 'Pedirle a la IA que te tome una prueba', d: 'Un encargo para repasar antes de un control.', min: 5, pub: 'Estudiantes',
    pasos: ['Pega tu apunte (sin datos personales) y di: «Hazme 5 preguntas, una a la vez, sin respuestas».', 'Pide que mezcle preguntas de memoria con preguntas de aplicación a un caso.', 'Al final, pide que te diga qué tema dominas menos.', 'Vuelve a ese tema en tu apunte, no en la conversación.'],
    ir: [['Prompt Lab ↗', 'https://evaprompts.vercel.app/prompt-lab']] },
  { id: 'comparar-fuente', tipo: 'Tutorial', t: 'Comparar la respuesta de la IA con la fuente', d: 'Una tabla de tres columnas para no tragarse nada.', min: 5, pub: 'Estudiantes',
    pasos: ['Columna 1: cada afirmación de la IA, una por fila.', 'Columna 2: dónde la comprobaste (norma, fallo, libro) o «sin fuente».', 'Columna 3: lo que dice la fuente, con tus palabras.', 'Lo que quede «sin fuente» no entra en tu trabajo.'],
    ir: [['Curso 4 · Verificar antes de firmar', 'curso:3-0']] },
];
// Guías que tratan lo mismo que un recurso usan su imagen.
const IMG_GUIA = { 'antes-de-pegar': 'rec-14', 'estudiar-con-ia': 'rec-04', 'ley-chile': 'rec-06' };
let tipoGuia = 'Todas';
function vistaGuias() {
  const abierta = location.hash.split('/')[1];
  return `
  <div class="titulo"><div><h1>Guías, protocolos y tutoriales</h1><p>Listas cortas para hacer las cosas bien cuando hay apuro. Ábrelas, cópialas, úsalas en clase.</p>${evaLinea('Listas cortas para cuando hay apuro. Las escribí sin apuro.')}</div></div>
  <div class="filtros" id="tipo-guia">${['Todas', 'Guía', 'Protocolo', 'Tutorial'].map((t) => `<button aria-pressed="${tipoGuia === t}" data-t="${t}">${t === 'Todas' ? 'Todas' : t + (t === 'Protocolo' ? 's' : 's')}</button>`).join('')}</div>
  <div class="vitrina" id="vitrina-guias">${GUIAS.map((g) => `
    <article class="caja tarjeta guia-t${abierta === g.id ? ' abierta' : ''}" id="g-${g.id}" data-tipo="${g.tipo}">
      ${portada(0, g.tipo === 'Protocolo' ? '#a81916' : g.tipo === 'Guía' ? '#1f4e9c' : '#2d7d46', g.tipo.toUpperCase(), TIPO_MOTIVO[g.tipo === 'Protocolo' ? 'protocolo' : g.tipo === 'Guía' ? 'guia' : 'video'], IMG_GUIA[g.id] || `guia-${g.id}`)}
      <div class="t-cuerpo"><span class="t-eti">${g.tipo} · ${g.min} min · ${g.pub}</span><h2>${g.t}</h2><p>${g.d}</p>
        <button class="btn suave g-abrir" aria-expanded="${abierta === g.id}">${abierta === g.id ? 'Cerrar' : 'Ver los pasos'}</button>
        <div class="g-pasos"${abierta === g.id ? '' : ' hidden'}><ol>${g.pasos.map((p) => `<li>${p}</li>`).join('')}</ol>
          <div class="g-ir">${g.ir.map(([t, d]) => d.startsWith('http') ? `<a href="${d}" target="_blank" rel="noopener">${t}</a>` : `<a href="${d.startsWith('curso:') ? '#cursos' : d}" ${d.startsWith('curso:') ? `data-ir-curso="${d.slice(6)}"` : ''}>${t}</a>`).join('')}
            <button class="g-copiar" data-g="${g.id}">${I(IC.copiar, 16)}Copiar los pasos</button></div></div></div>
    </article>`).join('')}</div>
  <p class="muestra" style="margin-top:16px">TEXTOS DE MUESTRA · REVISIÓN JURÍDICA PENDIENTE</p>`;
}
function alMontarGuias() {
  const v = $('#vitrina-guias');
  const filtrar = () => v.querySelectorAll('.guia-t').forEach((g) => { g.hidden = tipoGuia !== 'Todas' && g.dataset.tipo !== tipoGuia; });
  $('#tipo-guia').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.dataset.t === tipoGuia) return;
    tipoGuia = b.dataset.t; EF.sonar('clic');
    $('#tipo-guia').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    filtrar(); EF.llegar(v, '.guia-t:not([hidden])');
  });
  v.addEventListener('click', (e) => {
    const b = e.target.closest('.g-abrir');
    if (b) {
      const art = b.closest('.guia-t'), abrir = !art.classList.contains('abierta');
      art.classList.toggle('abierta', abrir); $('.g-pasos', art).hidden = !abrir;
      b.setAttribute('aria-expanded', String(abrir)); b.textContent = abrir ? 'Cerrar' : 'Ver los pasos';
      if (abrir) { EF.sonar('abre'); EF.llegar(art, '.g-pasos li'); }
    }
    const c = e.target.closest('.g-copiar');
    if (c) { const g = GUIAS.find((x) => x.id === c.dataset.g); copiar(`${g.tipo}: ${g.t}\n${g.pasos.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n(Muestra · EVA · Derecho PUCV)`, 'Pasos copiados', 'Pégalos en tu apunte o en el aula virtual.'); }
  });
  filtrar();
  const abierta = location.hash.split('/')[1];
  if (abierta) setTimeout(() => $(`#g-${abierta}`)?.scrollIntoView({ block: 'center', behavior: EF.quieto ? 'auto' : 'smooth' }), 120);
}
