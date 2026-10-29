/* EVA en toda la maqueta: el isotipo real (el cuadrado sobre la X) como botón flotante y un panel con sugerencias
   según la sección.
   La geometría es la de eva.proyecto01/src/lib/brand.ts: ocho piezas rígidas (cuatro lados del cuadrado y cuatro
   brazos de la X) que sólo se trasladan y giran; nunca se estiran. Al abrir el panel el cuadrado se desacopla (la pose
   «detach» de la ficha de marca, 450 ms) y al cerrarlo vuelve.
   Importante: el panel no conversa con un modelo de IA. Muestra respuestas preparadas y accesos a contenidos, y lo dice. */
(() => {
  /* ---------- Geometría de la marca (unidades: el lado del cuadrado mide 10) ---------- */
  const STROKE = 0.75, SIDE = 10, CAP = 6, HALF = 4.8, STACK_GAP = 2.7, DETACH = 1.1, SEAM = 0.05;
  const SLOPE = Math.atan2(CAP, HALF);
  const CUT = STROKE / Math.sin(SLOPE), DROP = STROKE / Math.cos(SLOPE), REACH = CAP - DROP / 2;
  const X_CENTER = SIDE + STACK_GAP + REACH;
  const BAR = [[-SIDE / 2, -STROKE / 2], [SIDE / 2, -STROKE / 2], [SIDE / 2, STROKE / 2], [-SIDE / 2, STROKE / 2]];
  const ARM = [[-HALF, -REACH], [CUT - HALF, -REACH], [0, -DROP / 2], [0, DROP / 2]];
  const espejo = (f, sx, sy) => f.map(([x, y]) => [x * sx, y * sy]);
  const FORMAS = { q1: BAR, q2: BAR, q3: BAR, q4: BAR, x1: ARM, x2: espejo(ARM, -1, 1), x3: espejo(ARM, 1, -1), x4: espejo(ARM, -1, -1) };
  const cruz = (cx, cy) => ({ x1: [cx, cy, 0], x2: [cx, cy, 0], x3: [cx, cy, 0], x4: [cx, cy, 0] });
  const POSES = {
    isotype: { q1: [SIDE / 2, STROKE / 2, 0], q2: [SIDE - STROKE / 2, SIDE / 2, 90], q3: [SIDE / 2, SIDE - STROKE / 2, 0], q4: [STROKE / 2, SIDE / 2, 90], ...cruz(SIDE / 2, X_CENTER) },
    detach: { q1: [SIDE / 2, STROKE / 2 - DETACH, 0], q2: [SIDE - STROKE / 2 + DETACH, SIDE / 2, 90], q3: [SIDE / 2, SIDE - STROKE / 2 + DETACH, 0], q4: [STROKE / 2 - DETACH, SIDE / 2, 90], ...cruz(SIDE / 2, X_CENTER) },
  };
  // Colores medidos de la marca: trazo casi blanco (frío a la izquierda, cálido a la derecha), halo de azul eléctrico a
  // violeta (lo pinta .eva-halo detrás) y fondo casi negro.
  const GLOW = ['#2a8cff', '#5a60ff', '#a24dff'], CORE = ['#dcf2ff', '#f4f6ff', '#f5e6ff'], GROUND = '#03050d';
  const ALTO = X_CENTER + REACH, PAD = 1.8;
  let nLogo = 0;
  /** El isotipo de EVA como SVG. Las piezas llevan su pose en `transform` (CSS), así una pose nueva se anima sola. */
  function evaIsotipo() {
    const id = 'eva' + nLogo++;
    const piezas = Object.entries(FORMAS).map(([k, f]) =>
      `<g class="pz" data-p="${k}" style="transform:${trans(POSES.isotype[k])}"><polygon points="${f.map((p) => p.map((n) => +n.toFixed(3)).join(',')).join(' ')}"/></g>`).join('');
    return `<svg class="eva-iso" viewBox="${-PAD} ${-PAD - 0.4} ${SIDE + PAD * 2} ${ALTO + PAD * 2 + 0.4}" aria-hidden="true" focusable="false">
      <defs><linearGradient id="${id}-g" gradientUnits="userSpaceOnUse" x1="0" x2="${SIDE}" y1="0" y2="0">
        <stop offset="0" stop-color="${CORE[0]}"/><stop offset=".5" stop-color="${CORE[1]}"/><stop offset="1" stop-color="${CORE[2]}"/></linearGradient></defs>
      <g fill="url(#${id}-g)" stroke="url(#${id}-g)" stroke-width="${SEAM}">${piezas}</g></svg>`;
  }
  const trans = ([x, y, a]) => `translate(${+x.toFixed(3)}px, ${+y.toFixed(3)}px) rotate(${a}deg)`;
  function pose(svg, nombre) {
    svg.querySelectorAll('.pz').forEach((g) => { g.style.transform = trans(POSES[nombre][g.dataset.p]); });
  }
  window.evaIsotipo = evaIsotipo;
  window.evaPose = pose;

  /* ---------- Qué explica EVA en cada sección ----------
     Cada sección trae: qué es (y dónde estás, si es una pantalla interior), qué puedes hacer ahí (acciones reales) y
     preguntas propias con su respuesta. Además, «Todas las secciones» muestra y explica cada una.
     Destinos: '#hash', 'curso:c-m' o una función. Las respuestas están escritas por el equipo. */
  const curso = () => `curso:${cursoActual}-${moduloActual}`;
  const clic = (sel) => () => document.querySelector(sel)?.click();
  const enfocar = (sel) => () => { const el = document.querySelector(sel); el?.scrollIntoView({ block: 'center', behavior: EF.quieto ? 'auto' : 'smooth' }); el?.focus({ preventScroll: true }); };
  const SECCIONES = {
    inicio: { nombre: 'Inicio', icono: 'inicio', corta: 'Tu tablero: dónde sigues, tu avance y la semana.',
      explica: () => 'Tu tablero. Arriba ves dónde sigues; al medio, tu avance en los ocho cursos; a la derecha, la semana y las novedades. No pide cuenta: todo se guarda en este navegador.',
      acciones: () => { const [c, m] = dondeSigue(); return [[`Seguir en el módulo ${c + 1}.${m + 1}`, `curso:${c}-${m}`], ['Ver las novedades', () => { document.querySelector('.semana .pestanas button:nth-child(2)')?.click(); enfocar('.semana')(); }], ['Recorrido de 4 pasos por esta pantalla', () => recorrido()], ['Ver la bienvenida otra vez', () => bienvenida()]]; },
      preguntas: [['¿Dónde se guarda mi avance?', 'En este navegador. Si cambias de computador o borras los datos del navegador, parte de cero. No hay cuenta ni servidor.'],
        ['¿Qué significa «3 de 7 días»?', 'Los días de esta semana en que entraste. No hay castigo por faltar: no es una racha que se pierde.']] },
    cursos: { nombre: 'Mis cursos', icono: 'cursos', corta: 'Los ocho cursos en tarjetas; entra al que quieras.',
      explica: () => 'Los ocho cursos, en tarjetas. Cada uno tiene cuatro módulos: una videocápsula de cinco minutos, un ejercicio con IA y una autoevaluación. La barra de cada tarjeta muestra cuánto llevas.',
      acciones: () => { const [c, m] = dondeSigue(); return [[`Entrar al curso ${c + 1}, donde voy`, `curso:${c}-${m}`], ['Filtrar los cursos', enfocar('#filtro-cat')], ['Ver recursos para consultar', '#recursos']]; },
      preguntas: [['¿En qué orden los hago?', 'Conviene empezar por los tres primeros: qué es la IA, cómo funciona y cómo estudiar con ella. Después, según lo que te interese.'],
        ['¿Hay nota?', 'No. Las autoevaluaciones son para ti. Al terminar un curso puedes guardar una constancia de avance, que no es un certificado.']] },
    curso: { nombre: 'Un curso por dentro', icono: 'cursos', corta: '',
      donde: () => `Estás en el curso ${cursoActual + 1}, «${CURSOS[cursoActual][0]}», módulo ${cursoActual + 1}.${moduloActual + 1}: «${CURSOS[cursoActual][1][moduloActual]}».`,
      explica: () => 'Cada módulo tiene tres sesiones: mira y anota, hazlo con la IA, comprueba y cierra. A la derecha, «Materiales» y «Tu actividad», donde marcas tus cuatro pasos.',
      acciones: () => [['Ver la videocápsula de este módulo', `#video/${cursoActual}-${moduloActual}`], ['Marcar mis pasos', () => { clic('#pest-lado [data-p="act"]')(); enfocar('.lado')(); }],
        [`Experimento relacionado: ${EXPERIMENTOS.find((x) => x.id === EXP_DE_CURSO[cursoActual]).t}`, `#laboratorio/${EXP_DE_CURSO[cursoActual]}`], ['Volver a Mis cursos', '#cursos']],
      preguntas: [['¿Qué hago en la sesión 2?', () => sesionesDe(cursoActual, moduloActual)[1][2].join(' ')],
        ['¿Cómo termino el módulo?', 'Marca los cuatro pasos en «Tu actividad». Al marcar el cuarto, el módulo queda terminado y suma a tu avance.']] },
    videos: { nombre: 'Videocápsulas', icono: 'videos', corta: 'Treinta y dos videos de cinco minutos, uno por módulo.',
      explica: () => 'Treinta y dos videos de cinco minutos, uno por módulo, con subtítulos. Filtra por curso; los que ya viste dicen «Vista».',
      acciones: () => { const [c, m] = dondeSigue(); return [[`Ver la que me toca (${c + 1}.${m + 1})`, `#video/${c}-${m}`], [`Sólo las del curso ${c + 1}`, clic(`#filtros [data-c="${c}"]`)], ['Ponerme a prueba en EVA Lab', '#laboratorio']]; },
      preguntas: [['¿Cuentan como avance?', 'Sí: marcar una videocápsula como vista completa el paso 1 de su módulo.'],
        ['¿Puedo verlas sin hacer el curso?', 'Sí, son libres. El curso agrega el ejercicio con IA y la autoevaluación.']] },
    video: { nombre: 'Una videocápsula', icono: 'videos', corta: '',
      donde: () => `Estás viendo la videocápsula ${videoSel[0] + 1}.${videoSel[1] + 1}: «${CURSOS[videoSel[0]][1][videoSel[1]]}».`,
      explica: () => 'Usa los capítulos de la derecha para saltar. CC prende o apaga los subtítulos y «1×» cambia la velocidad. Al terminar, se marca como vista.',
      acciones: () => [['Reproducir o pausar', clic('#gran-play:not(.oculto), #play')], ['Marcar como vista', clic('#marcar-vista')], ['Ir al módulo en Mis cursos', `curso:${videoSel[0]}-${videoSel[1]}`]],
      preguntas: [['¿Es un video real?', 'Todavía no: es un reproductor simulado para mostrar cómo funcionará. El guion y los capítulos son de muestra.']] },
    laboratorio: { nombre: 'Laboratorio EVA', icono: 'laboratorio', corta: 'Seis experimentos que se viven antes de explicarse.',
      explica: () => 'Seis experimentos breves que se viven antes de explicarse: patrones oscuros, decisiones automatizadas, citas inventadas. Cada uno termina en una conclusión y enlaces al curso.',
      acciones: () => { const sig = EXPERIMENTOS.find((x) => !labHechos[x.id]) || EXPERIMENTOS[0]; return [[`Empezar: ${sig.t}`, `#laboratorio/${sig.id}`], ['El más rápido (1 min): actualizando tu futuro', '#laboratorio/03'], ['Guía: reconocer patrones oscuros', '#guias/patrones-oscuros']]; },
      preguntas: [['¿Cuánto toma?', 'Entre uno y tres minutos cada uno. Puedes saltar a la conclusión cuando quieras.'],
        ['¿Hay respuestas incorrectas?', 'Casi nunca. En varios la gracia es notar algo, no acertar. Lo que marques no sale de tu navegador.']] },
    experimento: { nombre: 'Un experimento', icono: 'laboratorio', corta: '',
      donde: () => { const x = EXPERIMENTOS.find((e) => e.id === location.hash.split('/')[1]); return `Estás en el experimento ${x.id}: «${x.t}». Tema: ${x.tema.toLowerCase()}.`; },
      explica: () => 'Haz lo que te parezca natural: el experimento reacciona a lo que elijas. Si prefieres ir directo a la explicación, usa «Ir a la conclusión».',
      acciones: () => { const id = location.hash.split('/')[1]; const [t, d] = CONCLUSIONES[id].ir[0]; return [['Ir a la conclusión', clic('.exp-omitir')], [t, d], ['Volver al laboratorio', '#laboratorio']]; },
      preguntas: [['¿Esto es un caso real?', 'No. Los casos, documentos y citas de los experimentos son ficticios y lo dicen en pantalla. Nada de lo que marques tiene efecto.']] },
    recursos: { nombre: 'Recursos', icono: 'recursos', corta: 'Materiales para consultar sin inscribirte.',
      explica: () => 'Materiales para consultar sin inscribirte. «En línea» significa publicado y revisado; «Muestra», un ejemplo de cómo se verá; «Pendiente», que todavía no existe.',
      acciones: () => [['Fuentes oficiales de investigación', clic('#cat-rec [data-c="investigar"]')], ['Para docentes', clic('#cat-rec [data-c="docentes"]')], ['Buscar un recurso', enfocar('#filtro-rec')]],
      preguntas: [['¿Puedo confiar en estos enlaces?', 'Los «En línea» se revisaron el 28-10-2026: son sitios de EVA y fuentes oficiales. Aun así, mira la fecha de lo que leas.'],
        ['¿Puedo sugerir un recurso?', 'En la plataforma habrá un formulario. En esta maqueta, todavía no.']] },
    guias: { nombre: 'Guías y protocolos', icono: 'guias', corta: 'Listas cortas para hacerlo bien cuando hay apuro.',
      explica: () => 'Guías para orientarte, protocolos para no saltarte pasos cuando hay riesgo y tutoriales para hacerlo una vez, paso a paso. Ábrelas y cópialas a tu apunte.',
      acciones: () => [['Protocolo: antes de pegar un documento', '#guias/antes-de-pegar'], ['Protocolo: verificar una cita', '#guias/verificar-cita'], ['Ver sólo los tutoriales', clic('#tipo-guia [data-t="Tutorial"]')]],
      preguntas: [['¿Qué diferencia hay entre guía y protocolo?', 'Una guía orienta. Un protocolo es una lista de pasos que se sigue siempre igual, sobre todo cuando hay riesgo: datos de un cliente, una cita que vas a usar.']] },
    docentes: { nombre: 'Docentes', icono: 'docentes', corta: 'Una guía por módulo para usar el curso en clase.',
      explica: () => 'Para usar los cursos en clase: una guía por módulo con lo que pasa antes, durante y después, y un panel de tu sección (en la maqueta, con datos ficticios).',
      acciones: () => [['Copiar el enlace para mi sección', clic('#copiar-enlace')], ['Guía: preparar una evaluación con IA', '#guias/evaluar-con-ia'], ['Recursos para docentes', '#recursos?docentes']],
      preguntas: [['¿Veo el avance de mis estudiantes?', 'En la plataforma, sí: por sección y sin nombres. En esta maqueta los números son ficticios.']] },
    eva: { nombre: 'Pregunta a EVA', icono: 'eva', corta: 'La conversación completa, con veredicto sí, no o depende.',
      explica: () => 'La conversación completa: pregúntame sobre usar IA en la carrera. Respondo con un veredicto —sí, no o depende— y con lo que tienes que revisar tú.',
      acciones: () => [['Preguntar: ¿basta con citar un fallo?', clic('#conv-lista [data-k="2"]')], ['Protocolo: verificar una cita', '#guias/verificar-cita'], ['Experimento: audiencia contra la IA', '#laboratorio/06']],
      preguntas: [['¿Eres una IA de verdad?', 'En la plataforma, sí. En esta maqueta mis respuestas las escribió el equipo de antemano, y por eso lo aviso abajo.']] },
  };
  const ORDEN = ['inicio', 'cursos', 'videos', 'laboratorio', 'recursos', 'guias', 'docentes', 'eva'];

  /* ---------- Botón y panel ---------- */
  let fab, panel, velo, abierto = false, pestana = 'guia', acciones = [], camino = ['raiz'];
  function iniciarEva() {
    document.body.insertAdjacentHTML('beforeend', `
      <button class="eva-fab" id="eva-fab" aria-label="EVA: qué hay en esta sección" aria-expanded="false" aria-controls="eva-panel">
        <span class="eva-halo" aria-hidden="true"></span>${evaIsotipo()}<span class="eva-tip" aria-hidden="true">Pregunta a EVA</span></button>
      <div class="eva-velo" id="eva-velo" hidden></div>
      <section class="eva-panel" id="eva-panel" role="dialog" aria-modal="true" aria-label="EVA, asistente de aprendizaje" hidden></section>`);
    fab = document.getElementById('eva-fab'); panel = document.getElementById('eva-panel'); velo = document.getElementById('eva-velo');
    fab.addEventListener('click', (e) => { e.stopPropagation(); abierto ? cerrar() : abrir(); });
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
      const b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('eva-cerrar')) return cerrar();
      if (b.dataset.pest) { pestana = b.dataset.pest; EF.sonar('clic'); return pintar(); }
      // Árbol de decisión: elegir una opción, volver a un paso, volver a empezar o ir a un destino.
      if (b.dataset.op) { camino.push(ARBOL_EVA[camino.at(-1)].opciones[+b.dataset.op][1]); EF.sonar(ARBOL_EVA[camino.at(-1)].fin ? 'llega' : 'clic'); return pintarArbol(); }
      if (b.dataset.paso) { camino = camino.slice(0, +b.dataset.paso + 1); EF.sonar('clic'); return pintarArbol(); }
      if (b.classList.contains('arb-reini')) { camino = ['raiz']; EF.sonar('clic'); return pintarArbol(); }
      if (b.dataset.dest) { const d = ARBOL_EVA[camino.at(-1)].ir[+b.dataset.dest][1]; if (d.startsWith('http')) { open(d, '_blank', 'noopener'); return; } cerrar(false); return ir(d); }
      if (b.classList.contains('eva-volver')) return pintar();
      if (b.dataset.a) { const d = acciones[+b.dataset.a][1]; cerrar(false); return typeof d === 'function' ? d() : ir(d); }
      if (b.dataset.q) return responder(+b.dataset.q);
      if (b.dataset.s) return explicarSeccion(b.dataset.s);
    });
    document.addEventListener('click', () => { if (abierto) cerrar(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });
    addEventListener('hashchange', () => { if (abierto && pestana !== 'guia') { pestana = 'aqui'; pintar(); } });
    velo.addEventListener('click', () => cerrar());
  }
  function seccion() {
    const h = location.hash.slice(1), base = h.split(/[/?]/)[0] || 'inicio';
    if (/^cursos\/\d/.test(h)) return 'curso';
    if (/^laboratorio\/\d/.test(h)) return 'experimento';
    return SECCIONES[base] ? base : 'inicio';
  }
  function ir(destino) {
    if (destino.startsWith('curso:')) { const [c, m] = destino.slice(6).split('-').map(Number); window.irACurso(c, m); return; }
    if (location.hash === destino) window.ruta(); else location.hash = destino.slice(1);
  }
  const boton = (t, attr) => `<button ${attr}>${t}<span>›</span></button>`;
  function cabecera() {
    return `<header class="eva-cab"><span class="eva-mini">${evaIsotipo()}</span><div><b>EVA</b><small>Asistente de aprendizaje · IA y Derecho</small></div>
      <button class="eva-cerrar" aria-label="Cerrar">×</button></header>
      <div class="eva-pest" role="tablist"><button role="tab" data-pest="guia" aria-selected="${pestana === 'guia'}">Te guío</button><button role="tab" data-pest="aqui" aria-selected="${pestana === 'aqui'}">Esta sección</button><button role="tab" data-pest="todas" aria-selected="${pestana === 'todas'}">Secciones</button></div>`;
  }
  const PIE = '<p class="eva-pie">Respuestas escritas por el equipo: en esta maqueta EVA no está conectada a un modelo de IA.</p>';
  function pintar() {
    const clave = seccion(), s = SECCIONES[clave], menu = { curso: 'cursos', video: 'videos', experimento: 'laboratorio' }[clave] || clave;
    if (pestana === 'guia') return pintarArbol();
    if (pestana === 'todas') {
      panel.innerHTML = `${cabecera()}<div class="eva-cuerpo"><p class="eva-ctx">Toca una sección y te explico qué hay ahí.</p>
        <div class="eva-mapa">${ORDEN.map((k) => `<button data-s="${k}" ${k === menu ? 'aria-current="true"' : ''}>${I(IC[SECCIONES[k].icono], 20)}<span><b>${SECCIONES[k].nombre}</b><small>${SECCIONES[k].corta}</small></span></button>`).join('')}</div></div>${PIE}`;
      EF.llegar(panel, '.eva-mapa button');
      return;
    }
    acciones = s.acciones();
    panel.innerHTML = `${cabecera()}<div class="eva-cuerpo">
      ${clave === 'inicio' && pasosTotales() === 0 ? '<p class="eva-msj">Hola. Puedo ayudarte a estudiar, encontrar recursos o cuestionar alguna respuesta sospechosamente convincente.</p>' : ''}
      <p class="eva-donde"><span class="mono">ESTÁS EN</span>${I(IC[s.icono], 18)}<b>${SECCIONES[menu].nombre}</b></p>
      ${s.donde ? `<p class="eva-ctx">${s.donde()}</p>` : ''}
      <p class="eva-msj">${s.explica()}</p>
      <p class="eva-sub mono">QUÉ PUEDES HACER AQUÍ</p>
      <div class="eva-acc">${acciones.map(([t], i) => boton(t, `data-a="${i}"`)).join('')}</div>
      <p class="eva-sub mono">PREGUNTAS SOBRE ESTA SECCIÓN</p>
      <div class="eva-preg">${s.preguntas.map(([q], i) => `<button data-q="${i}">${q}</button>`).join('')}</div></div>${PIE}`;
    EF.llegar(panel, '.eva-donde, .eva-ctx, .eva-msj, .eva-acc button, .eva-preg button');
  }
  /* Te guío: una pregunta a la vez. Arriba, el camino recorrido (se puede volver a cualquier paso); al final, el veredicto,
     lo que revisas tú y adónde ir. */
  function pintarArbol() {
    const id = camino.at(-1), n = ARBOL_EVA[id];
    const elegidaEn = (i) => ARBOL_EVA[camino[i - 1]].opciones.find(([, s]) => s === camino[i])[0];
    const migas = camino.length > 1 ? `<nav class="arb-migas" aria-label="Tu camino">${camino.slice(0, -1).map((c, i) => `<button data-paso="${i}">${i === 0 ? 'Inicio' : elegidaEn(i)}</button>`).join('<span>›</span>')}</nav>` : '';
    const elegida = camino.length > 1 ? elegidaEn(camino.length - 1) : '';
    const cuerpo = n.fin
      ? `<div class="arb-fin">${VEREDICTO_EVA[n.fin] ? `<span class="arb-ver ${n.fin}">${VEREDICTO_EVA[n.fin]}</span>` : ''}<h3>${n.titulo}</h3>
          <p class="eva-msj">${n.eva}</p>
          ${n.revisa.length ? `<p class="eva-sub mono">LO QUE REVISAS TÚ</p><ul class="arb-revisa">${n.revisa.map((r) => `<li>${r}</li>`).join('')}</ul>` : ''}
          <div class="eva-acc">${n.ir.map(([t], i) => boton(t, `data-dest="${i}"`)).join('')}</div>
          <button class="arb-reini">${id === 'fin-sitio' ? 'Decidir algo conmigo ›' : '↺ Empezar otra decisión'}</button></div>`
      : `<p class="arb-paso mono">PASO ${camino.length}</p><p class="arb-q">${n.eva}</p>
          <div class="arb-ops">${n.opciones.map(([t], i) => `<button data-op="${i}">${t}<span>›</span></button>`).join('')}</div>`;
    panel.innerHTML = `${cabecera()}<div class="eva-cuerpo arb">${migas}${elegida ? `<p class="eva-yo">${elegida}</p>` : '<p class="eva-ctx">El sitio queda en pausa. Te hago unas preguntas cortas y te digo qué revisar.</p>'}${cuerpo}</div>${PIE}`;
    EF.llegar(panel, '.eva-yo, .arb-q, .arb-ops button, .arb-fin > *');
    (panel.querySelector('.arb-ops button, .eva-acc button') || panel.querySelector('.eva-cerrar')).focus({ preventScroll: true });
  }
  function responder(i) {
    const s = SECCIONES[seccion()], [q, r] = s.preguntas[i];
    panel.innerHTML = `${cabecera()}<div class="eva-cuerpo"><button class="eva-volver">‹ Volver a ${SECCIONES[seccion()].nombre.toLowerCase()}</button>
      <p class="eva-yo">${q}</p><p class="eva-msj">${typeof r === 'function' ? r() : r}</p>
      <div class="eva-preg">${s.preguntas.map(([o], j) => j === i ? '' : `<button data-q="${j}">${o}</button>`).join('')}</div></div>${PIE}`;
    EF.sonar('llega'); EF.llegar(panel, '.eva-yo, .eva-msj, .eva-preg button');
    panel.querySelector('.eva-volver').focus({ preventScroll: true });
  }
  function explicarSeccion(k) {
    const s = SECCIONES[k];
    acciones = [[s.nombre, `#${k}`]];
    panel.innerHTML = `${cabecera()}<div class="eva-cuerpo"><button class="eva-volver" data-pest="todas">‹ Todas las secciones</button>
      <p class="eva-donde">${I(IC[s.icono], 18)}<b>${s.nombre}</b></p><p class="eva-msj">${s.explica()}</p>
      <p class="eva-sub mono">PREGUNTAS FRECUENTES</p><div class="eva-faq">${s.preguntas.map(([q, r]) => `<p><b>${q}</b> ${typeof r === 'function' ? '' : r}</p>`).join('')}</div>
      <div class="eva-acc">${boton(`Ir a ${s.nombre}`, 'data-a="0"')}</div></div>${PIE}`;
    EF.sonar('clic'); EF.llegar(panel, '.eva-donde, .eva-msj, .eva-faq p, .eva-acc button');
    panel.querySelector('.eva-acc button').focus({ preventScroll: true });
  }
  function abrir() {
    abierto = true; pestana = 'guia'; camino = ['raiz']; pintar(); panel.hidden = false; velo.hidden = false;
    document.documentElement.classList.add('eva-pausa');
    fab.setAttribute('aria-expanded', 'true'); fab.classList.add('abierto');
    pose(fab.querySelector('.eva-iso'), 'detach');
    EF.sonar('abre');
    if (!EF.quieto) panel.animate([{ opacity: 0, scale: '.94' }, { opacity: 1, scale: '1' }], { duration: EF.M.normal.ms, easing: EF.M.normal.curva });
    panel.querySelector('.eva-acc button')?.focus({ preventScroll: true });
  }
  function cerrar(devolverFoco = true) {
    if (!abierto) return;
    abierto = false;
    fab.setAttribute('aria-expanded', 'false'); fab.classList.remove('abierto');
    pose(fab.querySelector('.eva-iso'), 'isotype');
    document.documentElement.classList.remove('eva-pausa');
    const fin = () => { if (!abierto) { panel.hidden = true; velo.hidden = true; } };
    if (EF.quieto) fin(); else panel.animate([{ opacity: 1, scale: '1' }, { opacity: 0, scale: '.96' }], { duration: 160, easing: 'ease-in' }).onfinish = fin;
    if (devolverFoco) fab.focus({ preventScroll: true });
  }
  // La primera vez, EVA explica el sitio (la visita «¿Qué es este sitio?»); después abre en «Te guío».
  function abrirVisita() { if (abierto) return; abrir(); camino = ['raiz', 'sitio-1']; pintarArbol(); try { localStorage.setItem('panel:eva-visita', '1'); } catch {} }
  window.iniciarEva = iniciarEva;
  window.evaVisita = abrirVisita;
  window.evaVisitaVista = () => { try { return localStorage.getItem('panel:eva-visita') === '1'; } catch { return true; } };
  window.evaColor = { GLOW, GROUND };
})();
