/* Maqueta «Panel»: estructura de dashboard (menú lateral, tarjetas, pestañas de módulos, sesiones desplegables,
   panel de materiales, chat) con la identidad de Derecho PUCV. Sin cuentas: el avance se guarda en el navegador. */
const $ = (s, r = document) => r.querySelector(s);
const captura = location.search.includes('captura');
const quieto = captura || matchMedia('(prefers-reduced-motion: reduce)').matches;
if (captura) document.documentElement.classList.add('quieto');

/* ---------- Tema ---------- */
const raiz = document.documentElement;
try { const t = localStorage.getItem('panel:tema'); if (t) raiz.dataset.tema = t; } catch {}
if (location.search.includes('oscuro')) raiz.dataset.tema = 'oscuro';

/* ---------- Íconos de línea ---------- */
const I = (d, w = 20) => `<svg class="icono" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC = {
  inicio: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  cursos: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/><path d="M9 7h6"/>',
  videos: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  docentes: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 4h5v6h-5"/><path d="M18 10v3"/>',
  eva: '<path d="M4 5h16v11H9l-5 4z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
  ajustes: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  letra: '<path d="M4 19 9 5l5 14"/><path d="M6 14h6"/><path d="M15 19l3-8 3 8"/><path d="M16 16.5h4"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  ayuda: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
  luna: '<path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  flecha: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  izq: '<path d="m15 6-6 6 6 6"/>', der: '<path d="m9 6 6 6-6 6"/>',
  abajo: '<path d="m6 9 6 6 6-6"/>',
  pdf: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h4"/>',
  carpeta: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  play: '<path d="m8 5 11 7-11 7z" fill="currentColor"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  racha: '<path d="M12 3c1 3 4 4.5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-8z"/>',
  ok: '<path d="m5 12 5 5 9-10"/>',
  enviar: '<path d="M4 12 20 4l-6 16-3-7z"/>',
  enlace: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};

/* ---------- Escudo ---------- */
const E = window.ESCUDO;
function cruz(x, y) {
  const a = 9, l = 34, r = 13, e = 6;
  return `M${x - a} ${y - l + e} H${x - r} V${y - l - e} H${x + r} V${y - l + e} H${x + a} V${y - a} H${x + l - e} V${y - r} H${x + l + e} V${y + r} H${x + l - e} V${y + a} H${x + a} V${y + l - e} H${x + r} V${y + l + e} H${x - r} V${y + l - e} H${x - a} V${y + a} H${x - l + e} V${y + r} H${x - l - e} V${y - r} H${x - l + e} V${y - a} H${x - a} Z`;
}
// El escudo se dibuja al abrir, brotan las tres cruces y un «tren» rojo recorre el contorno; se inclina hacia el puntero.
function escudo(color, acento, tren = true) {
  return `<svg viewBox="-20 -20 870 1130" aria-hidden="true">
    <g fill="none" stroke="${color}" stroke-linejoin="round">
      <path class="trazo" pathLength="1" d="${E.exterior}" stroke-width="44"/>
      <path class="trazo" pathLength="1" d="${E.escudete}" stroke-width="30" style="animation-delay:.5s"/>
    </g>
    ${tren ? `<path class="tren" pathLength="1" d="${E.exterior}" fill="none" stroke="${acento}" stroke-width="44" stroke-linecap="round" style="animation-delay:1.8s"/>` : ''}
    <g fill="${color}">${[270, 415, 560].map((x, k) => `<path class="cruz-l" style="transform-origin:${x}px 212px;animation-delay:${1.1 + k * 0.15}s" d="${cruz(x, 212)}"/>`).join('')}</g>
  </svg>`;
}
const escLat = $('#esc-lat');
escLat.innerHTML = escudo('currentColor', raiz.dataset.tema === 'oscuro' ? '#e5594e' : 'rgba(255,255,255,.45)');
$('.marca').addEventListener('pointermove', (e) => {
  const r = escLat.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  escLat.firstElementChild.style.transform = `rotateY(${x * 40}deg) rotateX(${-y * 30}deg)`;
});
$('.marca').addEventListener('pointerleave', () => { escLat.firstElementChild.style.transform = ''; });
$('#marca-tel').innerHTML = `${escudo('var(--rojo)', 'var(--rojo)', false)}<span>Derecho PUCV<small>con EVA</small></span>`;

/* ---------- Datos ---------- */
const COLORES = ['#a81916', '#1f4e9c', '#c98a12', '#2d7d46', '#6b3fa0', '#d9661f', '#2b8ec0', '#8a6d3b'];
// Títulos del catálogo de eva.derecho (src/content/catalogo.ts).
const CURSOS = [
  ['Qué es la IA', ['Las definiciones de las leyes', 'Las dudas recientes', 'Lo propio de la IA', 'De dónde viene «inteligencia»']],
  ['Cómo funciona y por qué se equivoca', ['¿Qué es una IA?', 'La siguiente palabra', 'Por qué inventa', 'Cómo pedirle bien']],
  ['Estudiar y trabajar sin perder el criterio', ['Un tutor que pregunta', 'Analizar un fallo', 'Antes de subir', 'Lo que no se delega']],
  ['Investigación jurídica con IA', ['Verificar antes de firmar', 'Fuentes chilenas', 'Jurisprudencia real', 'Documentar la investigación']],
  ['Crea tus herramientas jurídicas', ['De la idea a la herramienta', 'Tu primera herramienta', 'Pruébala antes de confiar', 'Publica con sus límites']],
  ['Ética profesional y responsabilidad', ['Secreto profesional', 'Diligencia', 'Transparencia con el cliente', 'Quién responde']],
  ['Prueba digital y deepfakes', ['Qué es un deepfake', 'Autenticidad y custodia', 'Cuándo pedir un peritaje', 'Valorar la prueba']],
  ['Regulación de la IA', ['El modelo europeo', 'El proyecto chileno', 'Datos personales e IA', 'Derechos fundamentales']],
];
// Avance simulado (en la plataforma real se cuenta en el navegador de cada estudiante).
const AVANCE_INICIAL = { '0': [4, 4, 4, 4], '1': [4, 4, 2, 0], '2': [1, 0, 0, 0] };
const TAREAS = ['Mirar la videocápsula (5 min)', 'Hacer el ejercicio con la IA', 'Comprobar en la fuente', 'Responder la autoevaluación'];
let avance;
try { avance = JSON.parse(localStorage.getItem('panel:avance')) || AVANCE_INICIAL; } catch { avance = AVANCE_INICIAL; }
const guardar = () => { try { localStorage.setItem('panel:avance', JSON.stringify(avance)); } catch {} };
const hechas = (c, m) => (avance[c] || [])[m] || 0;
const totalCurso = (c) => [0, 1, 2, 3].reduce((s, m) => s + hechas(c, m), 0);
const modulosListos = (c) => [0, 1, 2, 3].filter((m) => hechas(c, m) === 4).length;
let cursoActual = 1, moduloActual = 2;

/* ---------- Menú ---------- */
const VISTAS = [['inicio', 'Inicio'], ['cursos', 'Cursos'], ['videos', 'Videocápsulas'], ['docentes', 'Docentes'], ['eva', 'Pregunta a EVA']];
$('#menu').innerHTML = VISTAS.map(([id, t]) => `<li><a href="#${id}" data-v="${id}">${I(IC[id])}${t}</a></li>`).join('');
$('#menu-abajo').innerHTML = `<li><a href="#ajustes" data-accion="letra">${I(IC.letra)}Letra y contraste</a></li>`;
$('#menu-tel').innerHTML = VISTAS.map(([id, t]) => `<a href="#${id}" data-v="${id}">${I(IC[id], 22)}${id === 'eva' ? 'EVA' : id === 'videos' ? 'Videos' : t}</a>`).join('');
$('#ic-buscar').innerHTML = I(IC.buscar);
$('#ayuda').innerHTML = I(IC.ayuda);
const pintarTema = () => {
  const osc = raiz.dataset.tema === 'oscuro';
  $('#tema').innerHTML = I(osc ? IC.sol : IC.luna);
  $('#tema').setAttribute('aria-label', osc ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
};
pintarTema();
$('#tema').addEventListener('click', () => {
  raiz.dataset.tema = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
  try { localStorage.setItem('panel:tema', raiz.dataset.tema); } catch {}
  pintarTema();
});
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#buscar').focus(); }
});

/* ---------- Utilidades ---------- */
function contar(el, hasta, sufijo = '') {
  if (quieto) { el.textContent = hasta + sufijo; return; }
  const t0 = performance.now();
  (function paso(t) {
    const v = Math.min(1, (t - t0) / 900);
    el.textContent = Math.round(hasta * (1 - Math.pow(1 - v, 3))) + sufijo;
    if (v < 1) requestAnimationFrame(paso);
  })(t0);
}
function rayaPestanas(caja) {
  const b = $('[aria-selected="true"]', caja), raya = $('.raya', caja);
  if (b && raya) { raya.style.left = b.offsetLeft + 'px'; raya.style.width = b.offsetWidth + 'px'; }
}
const chip = (k) => `<span class="chip-n" style="background:${COLORES[k]}">${k + 1}</span>`;

/* ---------- Inicio ---------- */
function vistaInicio() {
  const listos = CURSOS.reduce((s, _, c) => s + modulosListos(c), 0);
  const DIAS = [
    ['Lun', 27, '#a81916', [['Abre la videocápsula 2.4', 'Cómo pedirle bien', 'Nueva']]],
    ['Mar', 28, '#1f4e9c', [['Curso 4 · Fuentes chilenas', 'Taller con tu profesor', '10:15 – 11:30'], ['Recordatorio', 'Termina el módulo 2.3', 'Te falta 1 paso']]],
    ['Mié', 29, '#c98a12', [['Abre el curso 6', 'Ética profesional y responsabilidad', 'Nuevo curso']]],
    ['Jue', 30, '#2d7d46', [['Pregunta de la semana', '¿Basta con citar un fallo?', 'EVA']]],
    ['Vie', 31, '#6b3fa0', [['Abre la videocápsula 3.2', 'Analizar un fallo', 'Nueva']]],
  ];
  return `
  <div class="titulo">
    <div><h1>Inicio</h1><p>Hola. Aprende a usar la IA en el Derecho sin perder el criterio. Sin crear cuenta.</p></div>
    <div class="acciones"><a class="btn suave" href="#videos">${I(IC.videos, 18)}Ver videocápsulas</a><a class="btn suave" href="#eva">${I(IC.eva, 18)}Preguntar a EVA</a></div>
  </div>
  <div class="tablero">
    <div class="caja dato"><div><div class="n" data-n="8">8</div><div class="l">Cursos abiertos</div></div><span class="ic">${I(IC.cursos)}</span></div>
    <div class="caja dato"><div><div class="n" data-n="32">32</div><div class="l">Videocápsulas de 5 min</div></div><span class="ic">${I(IC.videos)}</span></div>
    <div class="caja dato"><div><div class="n"><span data-n="${listos}">${listos}</span><small> / 32</small></div><div class="l">Módulos terminados</div></div><span class="ic">${I(IC.ok)}</span></div>
    <div class="caja dato"><div><div class="n"><span data-n="3">3</span><small> días</small></div><div class="l">Seguidos estudiando</div></div><span class="ic">${I(IC.racha)}</span></div>
    <section class="caja sigues">
      <span class="eti">Sigues en</span>
      <span class="num">2.3</span>
      <h2>Por qué inventa</h2>
      <p>Curso 2 · Cómo funciona y por qué se equivoca. Le pides un fallo y te entrega uno que no existe: aquí ves por qué pasa y cómo pillarlo.</p>
      <div class="pasos-mod" aria-label="Avance del curso 2: módulos 1 y 2 listos, el 3 a medias"><i class="ok"></i><i class="ok"></i><i class="va"></i><i></i></div>
      <a class="btn lleno" href="#cursos">Continuar<span class="flecha">${I(IC.flecha, 18)}</span></a>
    </section>
    <section class="caja avance">
      <header><h2>Tu avance por curso</h2><span class="muestra">MUESTRA</span><button class="selector" type="button">Todos los cursos ${I(IC.abajo, 14)}</button></header>
      <ol class="barras">${CURSOS.map(([t], k) => `<li>${chip(k)}<span class="t">${t}</span><span class="pista"><b data-w="${totalCurso(k) / 16 * 100}"></b></span><span class="v">${modulosListos(k)}/4</span></li>`).join('')}</ol>
    </section>
    <aside class="caja semana">
      <div class="pestanas" role="tablist"><button role="tab" aria-selected="true">Esta semana</button><button role="tab" aria-selected="false">Novedades</button><span class="raya"></span></div>
      <header>27 – 31 de octubre<span class="flechas"><button aria-label="Semana anterior">${I(IC.izq, 18)}</button><button aria-label="Semana siguiente">${I(IC.der, 18)}</button></span></header>
      <ol class="dias">${DIAS.map(([d, n, c, items]) => `<li><span class="d">${d}<b>${n}</b></span><ul style="--c:${c}">${items.map(([a, b, p], j) => `<li><p>${a}</p><p style="color:var(--texto-2);font-weight:400">${b}</p><span class="pild${j ? ' gris' : ''}">${p}</span></li>`).join('')}</ul></li>`).join('')}</ol>
      <p class="muestra">FECHAS ILUSTRATIVAS · POR CONFIRMAR CON LA ESCUELA</p>
    </aside>
  </div>`;
}
function alMontarInicio() {
  document.querySelectorAll('[data-n]').forEach((el) => contar(el, +el.dataset.n));
  const barras = document.querySelectorAll('.pista b[data-w]');
  requestAnimationFrame(() => setTimeout(() => barras.forEach((b) => (b.style.width = b.dataset.w + '%')), quieto ? 0 : 120));
  const p = $('.semana .pestanas');
  rayaPestanas(p);
  p.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    p.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    rayaPestanas(p);
  });
}

/* ---------- Cursos ---------- */
function sesionesDe(c, m) {
  const tema = CURSOS[c][1][m];
  return [
    [`Mira y anota: ${tema}`, `Entender la idea central de «${tema}» en cinco minutos y anotar una duda propia.`,
      ['Videocápsula de 5 minutos con EVA.', 'Anota una pregunta que te haya quedado: la usarás en la sesión 2.']],
    ['Hazlo con la IA', `Probar «${tema}» en una IA de verdad y fijarte en lo que responde con seguridad.`,
      ['Ejercicio guiado: le haces a la IA la pregunta que anotaste.', 'Marca cada afirmación como «la puedo comprobar» o «no sé de dónde sale».']],
    ['Comprueba y cierra', 'Contrastar lo que dijo la IA con la fuente y quedarte con lo que sí sirve.',
      ['Busca la norma o el fallo en la fuente oficial (Ley Chile, buscador del Poder Judicial).', 'Autoevaluación de cuatro preguntas. Sin nota: es para ti.']],
  ];
}
function vistaCursos() {
  const [titulo, mods] = CURSOS[cursoActual];
  const pct = Math.round(totalCurso(cursoActual) / 16 * 100);
  const ses = sesionesDe(cursoActual, moduloActual);
  return `
  <div class="titulo"><div><h1>Cursos</h1><p>Cuatro módulos por curso. Cada paso que marcas se guarda en este navegador.</p></div></div>
  <div class="barra-herr">
    <div class="desplegable">
      <button class="btn lleno" id="abrir-cursos" aria-expanded="false">${I(IC.cursos, 18)}Curso ${cursoActual + 1} · ${titulo}${I(IC.abajo, 16)}</button>
      <ul class="lista-cursos" id="lista-cursos" hidden>${CURSOS.map(([t], k) => `<li><button data-c="${k}" aria-current="${k === cursoActual}">${chip(k)}${t}</button></li>`).join('')}</ul>
    </div>
    <a class="btn" href="#docentes">${I(IC.docentes, 18)}Guía docente</a>
    <label class="buscador"><span>${I(IC.buscar, 18)}</span><input placeholder="Buscar en el curso" aria-label="Buscar en el curso"></label>
  </div>
  <div class="progreso" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Avance del curso"><b id="barra-curso" style="width:${Math.max(pct, 4)}%">${pct}%</b></div>
  <div class="curso">
    <div>
      <div class="mods" role="tablist">${mods.map((t, m) => `<button role="tab" data-m="${m}" aria-selected="${m === moduloActual}" title="${t}">Módulo ${m + 1}<span class="hecho">${hechas(cursoActual, m) === 4 ? '✓' : ''}</span></button>`).join('')}</div>
      <div class="sesiones">${ses.map(([t, obj, como], k) => `
        <article class="sesion${k === 0 ? ' abierta' : ''}">
          <button aria-expanded="${k === 0}"><span class="nro">${cursoActual + 1}.${moduloActual + 1}.${k + 1}</span>Sesión ${k + 1}: ${t}<span class="ch">${I(IC.abajo, 18)}</span></button>
          <div class="cuerpo"><div><div class="in">
            <h3>Objetivo de la sesión</h3><p>${obj}</p>
            <h3>Cómo se trabaja</h3><ul>${como.map((x) => `<li>${x}</li>`).join('')}</ul>
            <div class="pie-ses"><a href="#eva">${I(IC.eva, 16)}Pregúntale a EVA sobre esto</a><a href="#videos">${I(IC.videos, 16)}Ver la videocápsula</a></div>
          </div></div></div>
        </article>`).join('')}
      </div>
    </div>
    <aside class="caja lado">
      <div class="pestanas" role="tablist" id="pest-lado"><button role="tab" aria-selected="true" data-p="mat">Materiales</button><button role="tab" aria-selected="false" data-p="act">Tu actividad</button><span class="raya"></span></div>
      <div class="cont" id="cont-lado"></div>
    </aside>
  </div>`;
}
function ladoMateriales() {
  const t = CURSOS[cursoActual][1][moduloActual], n = `${cursoActual + 1}.${moduloActual + 1}`;
  return `
    <h3>Para ver</h3><ul><li><a href="#videos">Videocápsula ${n} · ${t}</a> (5 min)</li></ul>
    <h3>Para leer</h3><ul><li><a href="#cursos">Apunte del módulo ${n}</a>, 4 páginas</li><li>Glosario: alucinación, fuente, verificación</li></ul>
    <h3>Para el ejercicio</h3><ul><li>Pauta para comprobar lo que dice la IA</li></ul>
    <div class="btns"><button class="btn ancho">${I(IC.pdf, 18)}Descargar guía PDF</button><button class="btn ancho">${I(IC.carpeta, 18)}Material para el ejercicio</button></div>
    <p class="muestra" style="margin:14px 0 0">CONTENIDO DE MUESTRA · REVISIÓN JURÍDICA PENDIENTE</p>`;
}
function ladoActividad() {
  const h = hechas(cursoActual, moduloActual);
  return `<p style="margin:0 0 12px;font-size:14px;color:var(--texto-2)">Módulo ${cursoActual + 1}.${moduloActual + 1}: ${h} de 4 pasos.</p>
    <ul class="checks">${TAREAS.map((t, k) => `<li><label><input type="checkbox" data-k="${k}" ${k < h ? 'checked' : ''}><span>${t}<small>${['Sesión 1', 'Sesión 2', 'Sesión 2', 'Sesión 3'][k]}</small></span></label></li>`).join('')}</ul>`;
}
function alMontarCursos() {
  const abrir = $('#abrir-cursos'), lista = $('#lista-cursos');
  abrir.addEventListener('click', (e) => { e.stopPropagation(); lista.hidden = !lista.hidden; abrir.setAttribute('aria-expanded', String(!lista.hidden)); });
  document.addEventListener('click', () => { lista.hidden = true; abrir.setAttribute('aria-expanded', 'false'); }, { once: true });
  lista.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; cursoActual = +b.dataset.c; moduloActual = 0; montar('cursos'); });
  $('.mods').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; moduloActual = +b.dataset.m; montar('cursos'); });
  $('.sesiones').addEventListener('click', (e) => {
    const b = e.target.closest('.sesion > button'); if (!b) return;
    const s = b.parentElement, abierta = !s.classList.contains('abierta');
    s.classList.toggle('abierta', abierta); b.setAttribute('aria-expanded', String(abierta));
  });
  const pest = $('#pest-lado'), cont = $('#cont-lado');
  const mostrar = (p) => {
    pest.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.p === p)));
    rayaPestanas(pest);
    cont.innerHTML = p === 'mat' ? ladoMateriales() : ladoActividad();
  };
  pest.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) mostrar(b.dataset.p); });
  cont.addEventListener('change', (e) => {
    const casillas = [...cont.querySelectorAll('input')];
    const n = casillas.filter((x) => x.checked).length;
    avance[cursoActual] = avance[cursoActual] || [0, 0, 0, 0];
    avance[cursoActual][moduloActual] = n; guardar();
    const pct = Math.round(totalCurso(cursoActual) / 16 * 100);
    const b = $('#barra-curso'); b.style.width = Math.max(pct, 4) + '%'; b.textContent = pct + '%';
    $(`.mods button[data-m="${moduloActual}"] .hecho`).textContent = n === 4 ? '✓' : '';
    $('p', cont).textContent = `Módulo ${cursoActual + 1}.${moduloActual + 1}: ${n} de 4 pasos.`;
  });
  mostrar(location.search.includes('actividad') ? 'act' : 'mat');
}

/* ---------- Videocápsulas ---------- */
let filtro = -1;
function tarjetasVideos() {
  return CURSOS.flatMap(([t, mods], c) => mods.map((m, j) => [c, j, t, m]))
    .filter(([c]) => filtro < 0 || c === filtro)
    .map(([c, j, t, m]) => `
      <a class="caja video" href="#cursos" data-c="${c}" data-m="${j}">
        <div class="mini"><span class="gr"></span><span class="k">${c + 1}.${j + 1}</span>
          ${hechas(c, j) ? '<span class="visto">VISTA</span>' : ''}
          <span class="play">${I(IC.play, 14)}</span><span class="dur">5:00</span><span class="linea" style="background:${COLORES[c]}"></span></div>
        <div class="info"><b>${m}</b><span>Curso ${c + 1} · ${t}</span></div>
      </a>`).join('');
}
function vistaVideos() {
  return `
  <div class="titulo"><div><h1>Videocápsulas</h1><p>32 videos de cinco minutos: uno por módulo. Con subtítulos y su guía en PDF.</p></div></div>
  <div class="filtros" id="filtros"><button aria-pressed="${filtro < 0}" data-c="-1">Todas</button>${CURSOS.map((_, k) => `<button aria-pressed="${filtro === k}" data-c="${k}">Curso ${k + 1}</button>`).join('')}</div>
  <div class="rejilla" id="rejilla">${tarjetasVideos()}</div>`;
}
function alMontarVideos() {
  $('#filtros').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    filtro = +b.dataset.c;
    $('#filtros').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#rejilla').innerHTML = tarjetasVideos();
  });
  $('#rejilla').addEventListener('click', (e) => {
    const a = e.target.closest('.video'); if (!a) return;
    cursoActual = +a.dataset.c; moduloActual = +a.dataset.m;
  });
}

/* ---------- Docentes ---------- */
const PASOS = [
  ['Antes', 'un día antes', 'Preparar a la sección', ['Comparte la videocápsula 1.1 (5 min) por el aula virtual.', 'Pide a cada estudiante una pregunta de examen que crea que la IA no puede responder.']],
  ['Durante', 'en clase · 45 min', 'Tomarle el examen a la IA', ['En grupos, le hacen a la IA sus preguntas.', 'Cada grupo anota una respuesta que suena segura y está mal, y cómo lo comprobó.']],
  ['Después', '10 min', 'Cerrar y registrar', ['¿Qué error costó más ver? Cada uno lo escribe en su bitácora.', 'En el panel de la sección ves cuántos terminaron el módulo.']],
  ['Revisa tú', 'docente', 'Lo que no se delega', ['Coteja con la fuente las respuestas que los grupos dieron por correctas.', 'Revisa el contenido jurídico del módulo: la guía marca qué cotejar.']],
];
function vistaDocentes() {
  const MODS = [['1.1', '¿Qué es una IA?', 92, 'ok'], ['1.2', 'La siguiente palabra', 74, 'ok'], ['1.3', 'Por qué inventa', 51, 'lento'], ['1.4', 'Cómo pedirle bien', 18, 'ok']];
  return `
  <div class="titulo">
    <div><h1>Docentes</h1><p>Una guía por módulo para usar el curso en tu clase: antes, durante y después.</p></div>
    <div class="acciones"><button class="btn">${I(IC.enlace, 18)}Copiar enlace para la sección</button><button class="btn lleno">${I(IC.pdf, 18)}Guía del módulo (PDF)</button></div>
  </div>
  <div class="curso">
    <div class="sesiones">${PASOS.map(([t, h, sub, ps], k) => `
      <article class="sesion${k === 0 ? ' abierta' : ''}">
        <button aria-expanded="${k === 0}"><span class="nro">${k + 1}</span>${t}: ${sub}<span class="pild gris" style="margin:0 0 0 auto">${h}</span><span class="ch" style="margin-left:8px">${I(IC.abajo, 18)}</span></button>
        <div class="cuerpo"><div><div class="in"><ul>${ps.map((p) => `<li>${p}</li>`).join('')}</ul></div></div></div>
      </article>`).join('')}
      <p class="muestra">GUÍA DEL MÓDULO 1.1 · CONTENIDO DE MUESTRA</p>
    </div>
    <aside class="caja lado"><div class="cont">
      <h2 style="margin-bottom:4px">Tu sección</h2><p class="muestra" style="margin:0 0 14px">DATOS FICTICIOS · SIN NOMBRES DE ESTUDIANTES</p>
      <div class="seccion-datos"><div><b data-n="42">42</b><span>en la sección</span></div><div><b data-n="31">31</b><span>abrieron 1.1</span></div><div><b data-n="12">12</b><span>terminaron</span></div></div>
      <table class="tabla"><thead><tr><th>Módulo</th><th style="width:38%">Avance</th><th></th></tr></thead>
        <tbody>${MODS.map(([n, t, v, e]) => `<tr><td><b class="mono">${n}</b> ${t}</td><td><span class="pista" style="display:block"><b data-w="${v}"></b></span></td><td style="text-align:right"><span class="estado ${e}">${e === 'ok' ? 'A tiempo' : 'Va lento'}</span></td></tr>`).join('')}</tbody></table>
    </div></aside>
  </div>`;
}
function alMontarDocentes() {
  document.querySelectorAll('[data-n]').forEach((el) => contar(el, +el.dataset.n));
  const barras = document.querySelectorAll('.pista b[data-w]');
  requestAnimationFrame(() => setTimeout(() => barras.forEach((b) => (b.style.width = b.dataset.w + '%')), quieto ? 0 : 120));
  $('.sesiones').addEventListener('click', (e) => {
    const b = e.target.closest('.sesion > button'); if (!b) return;
    const s = b.parentElement, abierta = !s.classList.contains('abierta');
    s.classList.toggle('abierta', abierta); b.setAttribute('aria-expanded', String(abierta));
  });
}

/* ---------- EVA ---------- */
const VEREDICTO = { no: ['#c8102e', 'No'], dep: ['#b7790f', 'Depende'], si: ['#2d7d46', 'Sí'] };
const PREGUNTAS = [
  ['¿Pego aquí un escrito con datos del cliente?', 'no', 'Primero quita nombres, RUT y domicilios. Lo que entra a una IA puede salir de tu control: está en juego el secreto profesional y los datos personales.', 'Anonimiza antes de pegar, siempre.'],
  ['¿Puedo usar IA en mi tesis?', 'dep', 'Para ordenar ideas, buscar contraargumentos y revisar la redacción, sí. Para escribir el capítulo por ti, no: lo que firmas tiene que ser tuyo. Y se declara.', 'Pregúntale a tu profesor guía qué permite tu programa.'],
  ['¿Basta con que cites un fallo?', 'no', 'Puedo inventar un rol que suena perfecto. Ábrelo tú en el buscador del Poder Judicial antes de citarlo.', 'Nunca cites un rol que no hayas abierto tú.'],
  ['Resume esta sentencia', 'si', 'Pega el texto y te devuelvo hechos, decisión y razonamiento en una página. Después compáralo con el fallo: los resúmenes también se equivocan.', 'El resumen no reemplaza la lectura.'],
];
let escribiendo;
function vistaEva() {
  return `
  <div class="titulo"><div><h1>Pregunta a EVA</h1><p>EVA es una inteligencia artificial: te ayuda a estudiar y te enseña a desconfiar de ella.</p></div></div>
  <div class="caja chat">
    <nav class="conv-lista" id="conv-lista"><h2>Lo que no se delega</h2>${PREGUNTAS.map(([q, v], k) => `<button data-k="${k}"><span class="semaf" style="background:${VEREDICTO[v][0]}"></span>${q}</button>`).join('')}</nav>
    <section class="conv">
      <header><span class="eva-sello">ƎVΛ</span><div><b>EVA</b><small><span class="vivo"></span>Responde al tiro · puede equivocarse: verifica</small></div></header>
      <div class="mensajes" id="mensajes">
        <div class="msj eva"><p>Hola. Pregúntame lo que quieras sobre usar IA en la carrera. Te contesto con un veredicto —sí, no o depende— y con lo que tienes que revisar tú.</p></div>
      </div>
      <form class="enviar" id="form-eva"><input id="campo-eva" placeholder="Escribe tu pregunta" aria-label="Tu pregunta"><button class="btn lleno" aria-label="Enviar">${I(IC.enviar, 18)}<span class="solo-pc">Enviar</span></button></form>
    </section>
  </div>`;
}
function alMontarEva() {
  const caja = $('#mensajes');
  const bajar = () => { caja.scrollTop = caja.scrollHeight; };
  function preguntar(q) {
    const hallada = PREGUNTAS.find((p) => p[0] === q) || [q, 'dep', 'En esta maqueta sólo respondo las preguntas de la lista. En la plataforma real cada respuesta trae su advertencia y sus fuentes.', 'Verifica todo lo que te diga.'];
    const [, v, texto, ojo] = hallada;
    document.querySelectorAll('#conv-lista button').forEach((b) => b.setAttribute('aria-current', String(b.textContent === q)));
    clearInterval(escribiendo);
    caja.insertAdjacentHTML('beforeend', `<div class="msj yo"><p>${q.replace(/</g, '&lt;')}</p></div>`);
    caja.insertAdjacentHTML('beforeend', `<div class="msj eva" id="pensando"><span class="escribe"><i></i><i></i><i></i></span></div>`);
    bajar();
    setTimeout(() => {
      const m = $('#pensando'); m.removeAttribute('id');
      m.innerHTML = `<span class="veredicto" style="background:${VEREDICTO[v][0]}">${VEREDICTO[v][1]}</span><p class="txt"></p>`;
      const t = $('.txt', m); let n = 0;
      const fin = () => { m.insertAdjacentHTML('beforeend', `<p class="ojo">Ojo: ${ojo}</p>`); bajar(); };
      if (quieto) { t.textContent = texto; fin(); return; }
      escribiendo = setInterval(() => { n += 3; t.textContent = texto.slice(0, n); bajar(); if (n >= texto.length) { clearInterval(escribiendo); fin(); } }, 16);
    }, quieto ? 0 : 700);
  }
  $('#conv-lista').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) preguntar(PREGUNTAS[+b.dataset.k][0]); });
  $('#form-eva').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#campo-eva').value.trim(); if (v) { preguntar(v); $('#campo-eva').value = ''; } });
  if (captura) preguntar(PREGUNTAS[1][0]);
}

/* ---------- Navegación ---------- */
const PANTALLAS = {
  inicio: [vistaInicio, alMontarInicio], cursos: [vistaCursos, alMontarCursos], videos: [vistaVideos, alMontarVideos],
  docentes: [vistaDocentes, alMontarDocentes], eva: [vistaEva, alMontarEva],
};
function montar(id) {
  const [html, despues] = PANTALLAS[id] || PANTALLAS.inicio;
  const v = $('#vista');
  v.innerHTML = `<div class="vista">${html()}</div>`;
  document.querySelectorAll('[data-v]').forEach((a) => (a.dataset.v === id ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  despues();
}
function ruta() {
  const id = location.hash.slice(1);
  if (id === 'ajustes') return;
  montar(PANTALLAS[id] ? id : 'inicio');
  if (!captura) scrollTo(0, 0);
}
addEventListener('hashchange', ruta);
addEventListener('resize', () => document.querySelectorAll('.pestanas').forEach(rayaPestanas));
ruta();
