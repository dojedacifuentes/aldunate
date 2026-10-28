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

  /* ---------- Lo que EVA ofrece en cada sección ---------- */
  const SALUDOS = {
    inicio: '¿Primera vez aquí? Tengo algunas ideas. Una de ellas es cuestionable, pero pedagógicamente útil.',
    cursos: '¿Necesitas ayuda con este módulo? Puedo orientarte hacia los materiales correspondientes.',
    videos: 'Cinco minutos de video. Luego puedes poner a prueba lo que entendiste.',
    video: 'Cinco minutos de video. Luego puedes poner a prueba lo que entendiste.',
    laboratorio: 'Bienvenido al laboratorio. Algunos experimentos podrían cuestionar tus decisiones.',
    recursos: 'Antes de confiar en una respuesta jurídica, revisemos de dónde salió.',
    guias: 'Un protocolo es una lista corta para no olvidar lo importante cuando hay apuro.',
    docentes: 'Cada módulo trae una guía para la clase: antes, durante y después.',
    eva: 'Ya estás en la conversación completa. Desde aquí te llevo a otras partes del sitio.',
  };
  // Respuestas preparadas por el equipo (no generadas): texto breve y adónde ir.
  const RESPUESTAS = {
    empezar: ['¿Por dónde empiezo?', () => {
      const [c, m] = window.dondeSigue ? dondeSigue() : [0, 0];
      return { texto: pasosTotales() ? `Sigues en el módulo ${c + 1}.${m + 1}: «${CURSOS[c][1][m]}». Te faltan ${4 - hechas(c, m)} pasos.` : 'Por el curso 1, «Qué es la IA». La primera videocápsula dura cinco minutos y no pide nada antes.',
        ir: [[`Ir al módulo ${c + 1}.${m + 1}`, `curso:${c}-${m}`], ['Ver la videocápsula', `#video/${c}-${m}`]] };
    }],
    investigar: ['Ayúdame a investigar.', () => ({ texto: 'Primero la fuente, después la IA. Una cita que no abriste tú no está verificada, aunque suene perfecta.',
      ir: [['Protocolo: verificar una cita', '#guias/verificar-cita'], ['Curso 4 · Investigación jurídica', 'curso:3-0'], ['Experimento: Audiencia contra la IA', '#laboratorio/06']] })],
    aprender: ['Quiero aprender a usar IA.', () => ({ texto: 'Empieza por entender cómo produce sus respuestas: predice la siguiente palabra. Con eso, pedirle bien es más fácil.',
      ir: [['Curso 2 · Cómo funciona', 'curso:1-0'], ['Guía: estudiar con IA', '#guias/estudiar-con-ia'], ['Recursos para empezar', '#recursos']] })],
    riesgos: ['¿Qué puede salir mal con la IA?', () => ({ texto: 'Tres cosas, sobre todo: que invente (fallos y normas que no existen), que se filtren datos de un cliente y que una decisión automática pase sin revisión.',
      ir: [['Experimento: La máquina ha decidido', '#laboratorio/04'], ['Protocolo: antes de pegar un documento', '#guias/antes-de-pegar'], ['Pregúntale a EVA', '#eva']] })],
    lab: ['Explorar EVA Lab.', null, '#laboratorio'],
    pregunta: ['Abrir Pregunta a EVA.', null, '#eva'],
  };
  const EXTRA = {
    cursos: () => ({ t: 'Materiales de este módulo', fn: () => { const b = document.querySelector('#pest-lado [data-p="mat"]'); b?.click(); document.querySelector('.lado')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); } }),
    videos: () => ({ t: 'Ponte a prueba en EVA Lab', ir: '#laboratorio' }),
    video: () => ({ t: 'Ponte a prueba en EVA Lab', ir: '#laboratorio' }),
    recursos: () => ({ t: 'Protocolo: verificar una cita', ir: '#guias/verificar-cita' }),
    docentes: () => ({ t: 'Recursos para docentes', ir: '#recursos?docentes' }),
  };

  /* ---------- Botón y panel ---------- */
  let fab, panel, abierto = false;
  function iniciarEva() {
    document.body.insertAdjacentHTML('beforeend', `
      <button class="eva-fab" id="eva-fab" aria-label="Pregunta a EVA" aria-expanded="false" aria-controls="eva-panel">
        <span class="eva-halo" aria-hidden="true"></span>${evaIsotipo()}<span class="eva-tip" aria-hidden="true">Pregunta a EVA</span></button>
      <section class="eva-panel" id="eva-panel" role="dialog" aria-label="EVA, asistente de aprendizaje" hidden></section>`);
    fab = document.getElementById('eva-fab'); panel = document.getElementById('eva-panel');
    fab.addEventListener('click', (e) => { e.stopPropagation(); abierto ? cerrar() : abrir(); });
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
      const b = e.target.closest('[data-r], [data-ir], [data-extra], .eva-volver, .eva-cerrar'); if (!b) return;
      if (b.classList.contains('eva-cerrar')) { cerrar(); return; }
      if (b.classList.contains('eva-volver')) { pintarInicio(); return; }
      if (b.dataset.extra) { const x = EXTRA[seccion()]?.(); cerrar(false); x?.fn ? x.fn() : ir(x.ir); return; }
      if (b.dataset.ir) { cerrar(false); ir(b.dataset.ir); return; }
      const [, fn, destino] = RESPUESTAS[b.dataset.r];
      if (destino) { cerrar(false); ir(destino); return; }
      responder(b.dataset.r, fn());
    });
    document.addEventListener('click', () => { if (abierto) cerrar(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) cerrar(); });
    addEventListener('hashchange', () => { if (abierto) pintarInicio(); });
  }
  function seccion() { return (location.hash.slice(1).split(/[/?]/)[0]) || 'inicio'; }
  function ir(destino) {
    if (destino.startsWith('curso:')) { const [c, m] = destino.slice(6).split('-').map(Number); window.irACurso(c, m); return; }
    if (location.hash === destino) window.ruta(); else location.hash = destino.slice(1);
  }
  function cabecera() {
    return `<header class="eva-cab"><span class="eva-mini">${evaIsotipo()}</span><div><b>EVA</b><small>Asistente de aprendizaje · IA y Derecho</small></div>
      <button class="eva-cerrar" aria-label="Cerrar">×</button></header>`;
  }
  const PIE = '<p class="eva-pie">Respuestas preparadas por el equipo: en esta maqueta EVA no está conectada a un modelo de IA.</p>';
  function pintarInicio() {
    const s = seccion(), x = EXTRA[s]?.();
    panel.innerHTML = `${cabecera()}
      <div class="eva-cuerpo"><p class="eva-msj">Hola. Puedo ayudarte a estudiar, encontrar recursos o cuestionar alguna respuesta sospechosamente convincente.</p>
      <p class="eva-ctx">${SALUDOS[s] || SALUDOS.inicio}</p>
      <div class="eva-acc">${x ? `<button data-extra="1" class="eva-destacada">${x.t}<span>›</span></button>` : ''}${Object.entries(RESPUESTAS).map(([k, [t]]) => `<button data-r="${k}">${t}<span>›</span></button>`).join('')}</div></div>${PIE}`;
    EF.llegar(panel, '.eva-msj, .eva-ctx, .eva-acc button');
  }
  function responder(clave, { texto, ir: destinos }) {
    panel.innerHTML = `${cabecera()}<div class="eva-cuerpo"><button class="eva-volver">‹ Otras preguntas</button>
      <p class="eva-yo">${RESPUESTAS[clave][0]}</p><p class="eva-msj">${texto}</p>
      <div class="eva-acc">${destinos.map(([t, d]) => `<button data-ir="${d}">${t}<span>›</span></button>`).join('')}</div></div>${PIE}`;
    EF.sonar('llega');
    EF.llegar(panel, '.eva-yo, .eva-msj, .eva-acc button');
    panel.querySelector('.eva-acc button')?.focus({ preventScroll: true });
  }
  function abrir() {
    abierto = true; pintarInicio(); panel.hidden = false;
    fab.setAttribute('aria-expanded', 'true'); fab.classList.add('abierto');
    pose(fab.querySelector('.eva-iso'), 'detach');
    EF.sonar('abre');
    if (!EF.quieto) panel.animate([{ opacity: 0, transform: 'translateY(10px) scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: EF.M.normal.ms, easing: EF.M.normal.curva });
    panel.querySelector('.eva-acc button')?.focus({ preventScroll: true });
  }
  function cerrar(devolverFoco = true) {
    if (!abierto) return;
    abierto = false;
    fab.setAttribute('aria-expanded', 'false'); fab.classList.remove('abierto');
    pose(fab.querySelector('.eva-iso'), 'isotype');
    const fin = () => { if (!abierto) panel.hidden = true; };
    if (EF.quieto) fin(); else panel.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px) scale(.96)' }], { duration: 160, easing: 'ease-in' }).onfinish = fin;
    if (devolverFoco) fab.focus({ preventScroll: true });
  }
  window.iniciarEva = iniciarEva;
  window.evaColor = { GLOW, GROUND };
})();
