/* Maqueta «Panel»: estructura de dashboard (menú lateral, tarjetas, pestañas de módulos, sesiones desplegables,
   panel de materiales, chat) con la identidad de Derecho PUCV. Sin cuentas: el avance se guarda en el navegador. */
const $ = (s, r = document) => r.querySelector(s);
const captura = location.search.includes('captura');
// Ajustes de lectura de cada persona (letra, contraste, menos movimiento), guardados en su navegador.
const ajustes = { letra: 'normal', contraste: false, quieto: false };
try { Object.assign(ajustes, JSON.parse(localStorage.getItem('panel:ajustes')) || {}); } catch {}
let quieto = captura || ajustes.quieto || matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema ---------- */
const raiz = document.documentElement;
try { const t = localStorage.getItem('panel:tema'); if (t) raiz.dataset.tema = t; } catch {}
if (location.search.includes('oscuro')) raiz.dataset.tema = 'oscuro';
raiz.dataset.estilo = 'vidrio';
// Paleta del modo claro: «marfil» (marfil y burdeos), la elegida. Para comparar: ?paleta=vino | tinta | noche | blanco.
raiz.dataset.paleta = new URLSearchParams(location.search).get('paleta') || 'marfil';
function aplicarAjustes() {
  raiz.dataset.letra = ajustes.letra;
  raiz.toggleAttribute('data-contraste', ajustes.contraste);
  raiz.classList.toggle('quieto', captura || ajustes.quieto);
  quieto = captura || ajustes.quieto || matchMedia('(prefers-reduced-motion: reduce)').matches;
  EF.ponerQuieto(quieto);
}
aplicarAjustes();

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
  sonido: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>',
  mudo: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m17 9 5 6M22 9l-5 6"/>',
  constancia: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h5"/>',
  copiar: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  pausa: '<path d="M8 5v14M16 5v14"/>',
  laboratorio: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7.5 14h9"/>',
  recursos: '<path d="M4 4h6v16H4zM10 4h5v16h-5z"/><path d="m15.5 5 4.5 1.2-3.6 13.6-4.4-1.2"/>',
  guias: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 2h6v4H9zM8.5 11h.01M11 11h5M8.5 15h.01M11 15h5"/>',
  mas: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  enlace: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};

/* ---------- Escudo ---------- */
const E = window.ESCUDO;
function cruz(x, y) {
  const a = 9, l = 34, r = 13, e = 6;
  return `M${x - a} ${y - l + e} H${x - r} V${y - l - e} H${x + r} V${y - l + e} H${x + a} V${y - a} H${x + l - e} V${y - r} H${x + l + e} V${y + r} H${x + l - e} V${y + a} H${x + a} V${y + l - e} H${x + r} V${y + l + e} H${x - r} V${y + l - e} H${x - a} V${y + a} H${x - l + e} V${y + r} H${x - l - e} V${y - r} H${x - l + e} V${y - a} H${x - a} Z`;
}
// El isotipo completo, con los colores del logo publicado por la Facultad (borde dorado, campo rojo, escudete con tres
// cruces, león rampante y lema). Al abrir se traza el contorno, aparece el relleno y de vez en cuando lo cruza un brillo.
const ORO = '#b59a62', ROJO = '#a8372a';
const LEMA = (id, color) => `<g fill="${color}" font-family="'Times New Roman', Times, serif">
    <text x="415" y="128" font-size="84" text-anchor="middle" letter-spacing="20">SS.CC</text>
    <text font-size="86"><textPath href="#${id}-iz" textLength="700" lengthAdjust="spacing">PRO JURE</textPath></text>
    <text font-size="86"><textPath href="#${id}-de" textLength="770" lengthAdjust="spacing">AEQUITATE</textPath></text>
    <text x="415" y="1038" font-size="84" text-anchor="middle" letter-spacing="6">ET</text></g>`;
const CRUCES = [270, 415, 560].map((x) => `<path d="${cruz(x, 212)}"/>`).join('');
let nIso = 0;
function isotipo({ brillo = true } = {}) {
  const id = 'iso' + nIso++;
  return `<svg viewBox="-12 -12 854 1114" aria-hidden="true">
    <defs><path id="${id}-iz" d="${E.izquierda}"/><path id="${id}-de" d="${E.derecha}"/>
      <clipPath id="${id}-c"><path d="${E.exterior}"/></clipPath>
      <linearGradient id="${id}-g"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <path class="trazo" pathLength="1" d="${E.exterior}" fill="none" stroke="${ORO}" stroke-width="16" stroke-linejoin="round"/>
    <g class="iso-relleno">
      <path d="${E.exterior}" fill="${ORO}"/><path d="${E.campo}" fill="${ROJO}"/>
      <path d="${E.escudete}" fill="${ORO}"/><path d="${E.campoInterior}" fill="${ROJO}"/>
      <g fill="${ROJO}">${CRUCES}</g>
      <path d="${E.leon}" fill="${ORO}"/>
      ${LEMA(id, '#fff')}
    </g>
    ${brillo ? `<g clip-path="url(#${id}-c)"><rect class="iso-brillo" x="-420" y="-80" width="260" height="1260" fill="url(#${id}-g)"/></g>` : ''}
  </svg>`;
}
const escLat = $('#esc-lat');
escLat.innerHTML = isotipo();
$('.marca').addEventListener('pointermove', (e) => {
  const r = escLat.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  escLat.firstElementChild.style.transform = `rotateY(${x * 40}deg) rotateX(${-y * 30}deg)`;
});
$('.marca').addEventListener('pointerleave', () => { escLat.firstElementChild.style.transform = ''; });
$('#marca-tel').innerHTML = `${isotipo({ brillo: false })}<span>Derecho PUCV<small>con EVA</small></span>`;

// El borde de luz del vidrio toma su ángulo de la posición del puntero, como la luz del efecto Glass de Figma.
if (!quieto) {
  let pendiente = false;
  addEventListener('pointermove', (e) => {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      const a = Math.atan2(e.clientY - innerHeight / 2, e.clientX - innerWidth / 2) * 180 / Math.PI + 270;
      raiz.style.setProperty('--luz', a.toFixed(0) + 'deg');
      pendiente = false;
    });
  });
}

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
// Quien entra por primera vez no tiene avance: todo parte en cero. «?demo» muestra un avance simulado y «?nuevo» simula
// la primera visita aunque el navegador ya tenga avance guardado.
const AVANCE_DEMO = { '0': [4, 4, 4, 4], '1': [4, 4, 2, 0], '2': [1, 0, 0, 0] };
const TAREAS = ['Mirar la videocápsula (5 min)', 'Hacer el ejercicio con la IA', 'Comprobar en la fuente', 'Responder la autoevaluación'];
const demo = location.search.includes('demo'), simulaNuevo = location.search.includes('nuevo');
let avance = {};
try { if (!simulaNuevo) avance = JSON.parse(localStorage.getItem('panel:avance')) || {}; } catch {}
if (demo) avance = AVANCE_DEMO;
const guardar = () => { if (demo || simulaNuevo) return; try { localStorage.setItem('panel:avance', JSON.stringify(avance)); } catch {} };
const hechas = (c, m) => (avance[c] || [])[m] || 0;
const totalCurso = (c) => [0, 1, 2, 3].reduce((s, m) => s + hechas(c, m), 0);
const modulosListos = (c) => [0, 1, 2, 3].filter((m) => hechas(c, m) === 4).length;
const pasosTotales = () => CURSOS.reduce((s, _, c) => s + totalCurso(c), 0);
// El lugar donde sigue: el primer módulo que no está completo.
function dondeSigue() {
  for (let c = 0; c < CURSOS.length; c++) for (let m = 0; m < 4; m++) if (hechas(c, m) < 4) return [c, m];
  return [0, 0];
}
let [cursoActual, moduloActual] = dondeSigue();
let nombre = '';
try { if (!simulaNuevo) nombre = localStorage.getItem('panel:nombre') || ''; } catch {}
const limpio = (t) => t.replace(/[<>&"]/g, '');

/* ---------- Menú ---------- */
const VISTAS = [['inicio', 'Inicio'], ['cursos', 'Mis cursos'], ['videos', 'Videocápsulas'], ['laboratorio', 'Laboratorio EVA'], ['recursos', 'Recursos'],
  ['guias', 'Guías y protocolos'], ['docentes', 'Docentes'], ['eva', 'Pregunta a EVA']];
$('#menu').innerHTML = VISTAS.map(([id, t]) => `<li><a href="#${id}" data-v="${id}">${I(IC[id])}${t}</a></li>`).join('') + '<li class="menu-ind" aria-hidden="true"></li>';
$('#menu-abajo').innerHTML = `<li><a href="#ajustes" id="sonido-lat" role="button"></a></li><li><a href="#ajustes" id="letra-lat" role="button" aria-haspopup="dialog">${I(IC.letra)}Letra y contraste</a></li>`;
// En el teléfono caben cinco: los cuatro más usados y «Más», que abre el resto. EVA flota encima, siempre a mano.
const EN_BARRA = [['inicio', 'Inicio'], ['cursos', 'Cursos'], ['videos', 'Videos'], ['laboratorio', 'Lab']];
$('#menu-tel').innerHTML = EN_BARRA.map(([id, t]) => `<a href="#${id}" data-v="${id}">${I(IC[id], 22)}${t}</a>`).join('')
  + `<button id="mas-tel" aria-expanded="false" aria-controls="mas-hoja">${I(IC.mas, 22)}Más</button>`;
document.body.insertAdjacentHTML('beforeend', `<div class="mas-hoja" id="mas-hoja" hidden><p class="mono">MÁS SECCIONES</p>
  ${VISTAS.filter(([id]) => !EN_BARRA.some(([b]) => b === id)).map(([id, t]) => `<a href="#${id}" data-v="${id}">${I(IC[id], 22)}${t}</a>`).join('')}</div>`);
const masHoja = $('#mas-hoja'), masBtn = $('#mas-tel');
const cerrarMas = () => { masHoja.hidden = true; masBtn.setAttribute('aria-expanded', 'false'); };
masBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  masHoja.hidden = !masHoja.hidden; masBtn.setAttribute('aria-expanded', String(!masHoja.hidden));
  if (!masHoja.hidden) { EF.sonar('abre'); EF.llegar(masHoja, 'a'); }
});
masHoja.addEventListener('click', cerrarMas);
document.addEventListener('click', (e) => { if (!e.target.closest('#mas-hoja')) cerrarMas(); });
$('#ic-buscar').innerHTML = I(IC.buscar);
$('#ayuda').innerHTML = I(IC.ayuda);
const pintarTema = () => {
  const osc = raiz.dataset.tema === 'oscuro';
  $('#tema').innerHTML = I(osc ? IC.sol : IC.luna);
  $('#tema').setAttribute('aria-label', osc ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
};
pintarTema();
$('#tema').addEventListener('click', (e) => {
  EF.sonar('tema');
  EF.cambiarTema(e.currentTarget, () => {
    raiz.dataset.tema = raiz.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
    try { localStorage.setItem('panel:tema', raiz.dataset.tema); } catch {}
    pintarTema();
  });
});
// Sonido y vibración: encendidos, con un botón para apagarlos (en el menú lateral y, en el teléfono, en la cabecera).
const pintarSonido = () => {
  const si = EF.conSonido();
  $('#sonido-lat').innerHTML = `${I(si ? IC.sonido : IC.mudo)}Sonido: ${si ? 'sí' : 'no'}`;
  $('#sonido-tel').innerHTML = I(si ? IC.sonido : IC.mudo);
  for (const b of [$('#sonido-lat'), $('#sonido-tel')]) {
    b.setAttribute('aria-pressed', String(si));
    b.setAttribute('aria-label', si ? 'Apagar sonido y vibración' : 'Encender sonido y vibración');
  }
};
pintarSonido();
for (const b of [$('#sonido-lat'), $('#sonido-tel')]) {
  b.addEventListener('click', (e) => { e.preventDefault(); EF.ponerSonido(!EF.conSonido()); pintarSonido(); });
}

/* ---------- Letra y contraste ----------
   Se abre desde el menú lateral y desde el perfil (en el teléfono, el único lugar a mano). En el teléfono sale desde abajo. */
function cerrarAjustes() { $('#ajustes-pop')?.remove(); }
function abrirAjustes(ancla) {
  if ($('#ajustes-pop')) { cerrarAjustes(); return; }
  const sw = (k, t, s) => `<button class="sw" role="switch" data-k="${k}" aria-checked="${ajustes[k]}"><span>${t}<small>${s}</small></span><i></i></button>`;
  document.body.insertAdjacentHTML('beforeend', `
  <div class="pop ajustes-pop" id="ajustes-pop" role="dialog" aria-label="Letra y contraste">
    <h3>Letra y contraste</h3><p class="nota">Se guarda en este navegador.</p>
    <div class="tamanos" role="radiogroup" aria-label="Tamaño de la letra">${[['normal', 'Normal', 13], ['grande', 'Grande', 15], ['enorme', 'Enorme', 17]].map(([v, t, px]) =>
      `<button role="radio" data-letra="${v}" aria-checked="${ajustes.letra === v}" style="font-size:${px}px">A&nbsp;&nbsp;${t}</button>`).join('')}</div>
    ${sw('contraste', 'Alto contraste', 'Texto más oscuro y bordes marcados')}
    ${sw('quieto', 'Menos movimiento', 'Sin animaciones ni cruces')}
    <button class="sw" role="switch" data-k="sonido" aria-checked="${EF.conSonido()}"><span>Sonido y vibración<small>Al marcar pasos y terminar módulos</small></span><i></i></button>
    <button class="btn ancho" id="ver-recorrido" style="margin-top:14px">${I(IC.ayuda, 18)}Ver cómo funciona el sitio</button>
  </div>`);
  const pop = $('#ajustes-pop');
  if (matchMedia('(min-width: 861px)').matches) {
    const r = ancla.getBoundingClientRect();
    pop.style.left = (r.right + 14) + 'px';
    pop.style.top = Math.max(12, Math.min(r.top, innerHeight - pop.offsetHeight - 12)) + 'px';
    if (r.left > innerWidth / 2) { pop.style.left = ''; pop.style.right = (innerWidth - r.right) + 'px'; pop.style.top = (r.bottom + 10) + 'px'; }
  }
  EF.llegar(document.body, '#ajustes-pop');
  pop.addEventListener('click', (e) => {
    const t = e.target.closest('[data-letra]');
    if (t) { ajustes.letra = t.dataset.letra; pop.querySelectorAll('[data-letra]').forEach((b) => b.setAttribute('aria-checked', String(b === t))); }
    const s = e.target.closest('.sw');
    if (s) {
      const k = s.dataset.k;
      if (k === 'sonido') { EF.ponerSonido(!EF.conSonido()); pintarSonido(); s.setAttribute('aria-checked', String(EF.conSonido())); return; }
      ajustes[k] = !ajustes[k]; s.setAttribute('aria-checked', String(ajustes[k]));
    }
    if (e.target.closest('#ver-recorrido')) { cerrarAjustes(); recorrido(); return; }
    if (t || s) { EF.sonar('clic'); try { localStorage.setItem('panel:ajustes', JSON.stringify(ajustes)); } catch {} aplicarAjustes(); }
  });
}
$('#letra-lat').addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); abrirAjustes(e.currentTarget); });
const perfil = $('.perfil');
perfil.setAttribute('role', 'button'); perfil.tabIndex = 0; perfil.setAttribute('aria-label', 'Letra, contraste y sonido');
perfil.addEventListener('click', (e) => { e.stopPropagation(); abrirAjustes(perfil); });
perfil.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirAjustes(perfil); } });
document.addEventListener('click', (e) => { if (!e.target.closest('#ajustes-pop')) cerrarAjustes(); });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#buscar').focus(); }
  if (e.key === '/' && !e.target.closest('input, textarea')) { e.preventDefault(); $('#buscar').focus(); }
  if (e.key === 'Escape') cerrarAjustes();
});

/* ---------- Buscador ----------
   Responde mientras se escribe: términos del glosario, videocápsulas, cursos y preguntas de EVA. Sin tildes ni mayúsculas
   («alucin» encuentra «Alucinación»). Flechas para moverse, Enter para abrir, Esc para cerrar. */
const GLOSARIO = [
  ['Alucinación', 'Cuando la IA afirma con seguridad algo falso: un fallo, una norma o un dato que no existe.', 1, 2],
  ['Anonimizar', 'Quitar nombres, RUT, domicilios y todo lo que identifique a una persona antes de pegar un texto en una IA.', 2, 2],
  ['Fuente oficial', 'Donde se comprueba lo que dice la IA: Ley Chile, el buscador del Poder Judicial, el Diario Oficial.', 3, 1],
  ['Rol de la causa', 'El número que identifica una causa. Antes de citarlo, ábrelo tú en el buscador del Poder Judicial.', 3, 2],
  ['Secreto profesional', 'El deber de guardar lo que se sabe por el cliente. También pesa al usar una IA.', 5, 0],
  ['Deepfake', 'Imagen, audio o video falso hecho con IA para que parezca real.', 6, 0],
  ['Token', 'El pedazo de palabra con que trabaja un modelo de lenguaje: predice el siguiente, uno tras otro.', 1, 1],
];
const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
let preguntaPendiente = null;
const INDICE = [
  ...GLOSARIO.map(([t, d, c, m]) => ({ g: 'Glosario', ic: 'Aa', t, s: d, ir: () => irACurso(c, m) })),
  ...CURSOS.flatMap(([ct, mods], c) => mods.map((t, m) => ({ g: 'Videocápsulas', ic: `${c + 1}.${m + 1}`, t, s: `Curso ${c + 1} · ${ct} · 5 min`, ir: () => { location.hash = `video/${c}-${m}`; } }))),
  ...CURSOS.map(([t], c) => ({ g: 'Cursos', ic: String(c + 1), t, s: 'Curso de 4 módulos', ir: () => irACurso(c, 0) })),
  ...GUIAS.map((x) => ({ g: 'Guías y protocolos', ic: x.tipo[0], t: x.t, s: `${x.tipo} · ${x.d}`, ir: () => { location.hash = `guias/${x.id}`; } })),
  ...EXPERIMENTOS.map((x) => ({ g: 'EVA Lab', ic: x.id, t: x.t, s: `Experimento · ${x.tema}`, ir: () => { location.hash = `laboratorio/${x.id}`; } })),
];
const ORDEN_GRUPOS = ['Glosario', 'Guías y protocolos', 'Videocápsulas', 'Cursos', 'EVA Lab', 'Pregunta a EVA'];
const cajaBusca = $('.cabecera .buscador'), campo = $('#buscar');
let hallados = [], elegido = 0;
const marcar = (texto, q) => {
  const i = sinTildes(texto).indexOf(q);
  return i < 0 ? texto : `${texto.slice(0, i)}<mark>${texto.slice(i, i + q.length)}</mark>${texto.slice(i + q.length)}`;
};
function buscar() {
  const q = sinTildes(campo.value.trim());
  let html;
  if (!q) {
    hallados = [INDICE[0], INDICE.find((x) => x.t === 'Por qué inventa'), INDICE.find((x) => x.t === 'Verificar antes de firmar')];
    html = `<div class="r-grupo"><h4>Prueba con</h4>${hallados.map((x, i) => fila(x, i, '')).join('')}</div>`;
  } else {
    const ok = INDICE.filter((x) => sinTildes(x.t + ' ' + x.s).includes(q));
    const eva = PREGUNTAS.filter(([p]) => sinTildes(p).includes(q)).map(([p, v]) => ({ g: 'Pregunta a EVA', ic: '?', t: p, s: `Veredicto: ${VEREDICTO[v][1]}`, ir: () => { preguntaPendiente = p; location.hash = 'eva'; } }));
    const grupos = ORDEN_GRUPOS.map((g) => [g, [...ok, ...eva].filter((x) => x.g === g).slice(0, 3)]).filter(([, l]) => l.length);
    hallados = grupos.flatMap(([, l]) => l);
    let n = 0;
    html = hallados.length
      ? grupos.map(([g, l]) => `<div class="r-grupo"><h4>${g}</h4>${l.map((x) => fila(x, n++, q)).join('')}</div>`).join('')
      : `<p class="r-nada">Nada con «${limpio(campo.value.trim())}». Prueba con «alucinación», «fallo» o «tesis».</p>`;
  }
  elegido = 0;
  let r = $('#resultados');
  if (!r) { cajaBusca.insertAdjacentHTML('beforeend', '<div class="pop resultados" id="resultados" role="listbox"></div>'); r = $('#resultados'); }
  r.innerHTML = html + '<div class="r-pie"><span><kbd>↑↓</kbd>moverse</span><span><kbd>Enter</kbd>abrir</span><span><kbd>Esc</kbd>cerrar</span></div>';
  pintarElegido();
}
function fila(x, i, q) {
  return `<div class="r-fila" role="option" data-i="${i}"><span class="r-ic">${x.ic}</span><div>${q ? marcar(x.t, q) : x.t}<small>${x.s}</small></div></div>`;
}
function pintarElegido() {
  document.querySelectorAll('.r-fila').forEach((f) => f.setAttribute('aria-selected', String(+f.dataset.i === elegido)));
  $(`.r-fila[data-i="${elegido}"]`)?.scrollIntoView({ block: 'nearest' });
}
const cerrarBusqueda = () => $('#resultados')?.remove();
function abrirHallado(i) { const x = hallados[i]; if (!x) return; EF.sonar('clic'); cerrarBusqueda(); campo.value = ''; campo.blur(); x.ir(); }
campo.addEventListener('input', buscar);
campo.addEventListener('focus', buscar);
campo.addEventListener('blur', () => setTimeout(cerrarBusqueda, 150));
campo.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); elegido = (elegido + (e.key === 'ArrowDown' ? 1 : -1) + hallados.length) % Math.max(1, hallados.length); pintarElegido(); }
  if (e.key === 'Enter') { e.preventDefault(); abrirHallado(elegido); }
  if (e.key === 'Escape') { cerrarBusqueda(); campo.blur(); }
});
cajaBusca.addEventListener('mousedown', (e) => { const f = e.target.closest('.r-fila'); if (f) { e.preventDefault(); abrirHallado(+f.dataset.i); } });

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
  if (b && raya) EF.moverRaya(raya, b.offsetLeft, b.offsetWidth);
}
const chip = (k) => `<span class="chip-n" style="background:${COLORES[k]}">${k + 1}</span>`;

/* ---------- Inicio ---------- */
function vistaInicio() {
  const listos = CURSOS.reduce((s, _, c) => s + modulosListos(c), 0);
  const nuevo = pasosTotales() === 0;
  const [sc, sm] = dondeSigue();
  const h = hechas(sc, sm);
  const recordatorio = nuevo ? ['Para empezar', 'Curso 1 · Qué es la IA', '5 minutos'] : ['Recordatorio', `Termina el módulo ${sc + 1}.${sm + 1}`, `Te faltan ${4 - h} pasos`];
  const tarjeta = nuevo
    ? `<span class="eti">Empieza aquí</span><span class="num">1.1</span><h2>${CURSOS[0][1][0]}</h2>
       <p>Curso 1 · Qué es la IA. Antes de usarla, mira qué dicen las leyes que es. Una videocápsula de cinco minutos y un ejercicio corto.</p>
       <div class="pasos-mod" aria-label="Curso 1 sin empezar"><i></i><i></i><i></i><i></i></div>
       <a class="btn lleno" href="#cursos/1">Empezar el curso 1<span class="flecha">${I(IC.flecha, 18)}</span></a>`
    : `<span class="eti">Sigues en</span><span class="num">${sc + 1}.${sm + 1}</span><h2>${CURSOS[sc][1][sm]}</h2>
       <p>Curso ${sc + 1} · ${CURSOS[sc][0]}. Llevas ${h} de 4 pasos de este módulo.</p>
       <div class="pasos-mod" aria-label="Avance del curso ${sc + 1}">${[0, 1, 2, 3].map((m) => `<i class="${hechas(sc, m) === 4 ? 'ok' : hechas(sc, m) ? 'va' : ''}"></i>`).join('')}</div>
       <a class="btn lleno" href="#cursos/${sc + 1}">Continuar<span class="flecha">${I(IC.flecha, 18)}</span></a>`;
  recordatorioSemana = recordatorio;
  const sem = semanaDeEstudio(), nSem = sem.filter(Boolean).length, hoyI = (new Date().getDay() + 6) % 7;
  return `
  <div class="titulo">
    <div><h1>${nombre ? `Hola, ${nombre}` : 'Inicio'}</h1><p>${nuevo ? 'Te damos la bienvenida. ' : ''}Aprende a usar la IA en el Derecho sin perder el criterio. Sin crear cuenta.</p></div>
    <div class="acciones"><a class="btn suave" href="#videos">${I(IC.videos, 18)}Ver videocápsulas</a><a class="btn suave" href="#eva">${I(IC.eva, 18)}Preguntar a EVA</a></div>
  </div>
  <div class="tablero">
    <div class="caja dato"><div><div class="n" data-n="8">8</div><div class="l">Cursos abiertos</div></div><span class="ic">${I(IC.cursos)}</span></div>
    <div class="caja dato"><div><div class="n" data-n="32">32</div><div class="l">Videocápsulas de 5 min</div></div><span class="ic">${I(IC.videos)}</span></div>
    <div class="caja dato"><div><div class="n"><span data-n="${listos}">${listos}</span><small> / 32</small></div><div class="l">Módulos terminados</div></div><span class="ic">${I(IC.ok)}</span></div>
    <div class="caja dato dato-semana"><div><div class="n"><span data-n="${nSem}">${nSem}</span><small> de 7 días</small></div>
      <div class="l">${nuevo ? 'Hoy empiezas tu semana' : 'Estudiaste esta semana'}</div>
      <div class="dias-sem" aria-label="Días de esta semana en que entraste">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => `<i class="${sem[i] ? 'on' : ''}${i === hoyI ? ' hoy' : ''}">${d}</i>`).join('')}</div></div>
      <span class="ic">${I(IC.racha)}</span></div>
    <section class="caja sigues">${tarjeta}</section>
    <section class="caja avance">
      <header><h2>Tu avance por curso</h2><span class="muestra">${nuevo ? 'AQUÍ APARECERÁ LO QUE VAYAS HACIENDO' : demo ? 'MUESTRA' : 'GUARDADO EN ESTE NAVEGADOR'}</span><div class="desplegable sel-caja"><button class="selector" type="button" id="selector" aria-expanded="false"><span>${FILTROS_AVANCE[filtroAvance][1]}</span> ${I(IC.abajo, 14)}</button>
        <ul class="lista-cursos menu-sel" id="menu-sel" hidden>${FILTROS_AVANCE.map(([, t], i) => `<li><button data-f="${i}" aria-current="${i === filtroAvance}">${t}</button></li>`).join('')}</ul></div></header>
      <ol class="barras">${CURSOS.map(([t], k) => `<li data-k="${k}">${chip(k)}<span class="t">${t}</span><span class="pista"><b data-w="${totalCurso(k) / 16 * 100}"></b></span><span class="v">${modulosListos(k)}/4</span></li>`).join('')}</ol>
    </section>
    <aside class="caja semana">
      <div class="pestanas" role="tablist"><button role="tab" aria-selected="true">Esta semana</button><button role="tab" aria-selected="false">Novedades</button><span class="raya"></span></div>
      <div id="agenda">${agenda()}</div>
      <p class="muestra">FECHAS ILUSTRATIVAS · POR CONFIRMAR CON LA ESCUELA</p>
    </aside>
  </div>`;
}
/* La semana de estudio: los días en que la persona entró, de lunes a domingo, sin castigo por faltar. */
const fechaLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
let diasActivos = [];
try { if (!simulaNuevo) diasActivos = JSON.parse(localStorage.getItem('panel:dias')) || []; } catch {}
if (!demo && !diasActivos.includes(fechaLocal(new Date()))) {
  diasActivos = [...diasActivos, fechaLocal(new Date())].slice(-60);
  if (!simulaNuevo) try { localStorage.setItem('panel:dias', JSON.stringify(diasActivos)); } catch {}
}
function semanaDeEstudio() {
  const hoy = new Date(), lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  return [0, 1, 2, 3, 4, 5, 6].map((i) => {
    if (demo) return i === (hoy.getDay() + 6) % 7 || [0, 1].includes(i);   // muestra: lunes, martes y hoy
    const d = new Date(lunes); d.setDate(lunes.getDate() + i);
    return diasActivos.includes(fechaLocal(d));
  });
}
/* Filtro de «Tu avance por curso». */
const FILTROS_AVANCE = [['todos', 'Todos los cursos'], ['curso', 'En curso'], ['listos', 'Terminados'], ['nada', 'Sin empezar']];
let filtroAvance = 0;
function filtrarAvance() {
  const f = FILTROS_AVANCE[filtroAvance][0];
  let visibles = 0;
  document.querySelectorAll('.barras li').forEach((li) => {
    const k = +li.dataset.k, total = totalCurso(k), ver = f === 'todos' || (f === 'listos' ? modulosListos(k) === 4 : f === 'nada' ? total === 0 : total > 0 && modulosListos(k) < 4);
    li.hidden = !ver; if (ver) visibles++;
  });
  $('.barras + .r-nada')?.remove();
  if (!visibles) $('.barras').insertAdjacentHTML('afterend', `<p class="r-nada">Ningún curso ${FILTROS_AVANCE[filtroAvance][1].toLowerCase()} todavía.</p>`);
}
/* Calendario: la semana del 26 de octubre (la de la maqueta) y una antes y una después. Fechas ilustrativas. */
let semanaVista = 0, pestanaSemana = 'semana', recordatorioSemana;
const LUNES_BASE = new Date(2026, 9, 26);
// Novedades: noticias y actualizaciones de IA que el equipo irá subiendo. Por ahora, dos actualizaciones reales del sitio
// y casillas de muestra que muestran dónde irá cada noticia (con su fuente y su fecha). No hay noticias inventadas.
const NOVEDADES = [
  ['Actualización del sitio', 'Abrió EVA Lab: seis experimentos breves', 'Sitio', '#laboratorio'],
  ['Actualización del sitio', 'Nueva sección: guías, protocolos y tutoriales', 'Sitio', '#guias'],
  ['Noticia de IA · muestra', 'Aquí irá una noticia breve sobre IA y Derecho, con su fuente', 'Muestra', ''],
  ['Regulación · muestra', 'Aquí irá un cambio normativo, con enlace a la norma oficial', 'Muestra', ''],
];
function agenda() {
  if (pestanaSemana === 'novedades') {
    return `<ul class="novedades">${NOVEDADES.map(([a, b, p, h]) => `<li class="${h ? '' : 'nov-muestra'}">${h ? `<a href="${h}">` : ''}<p class="nov-eti mono">${a}</p><p>${b}</p><span class="pild${h ? '' : ' gris'}">${p}</span>${h ? '</a>' : ''}</li>`).join('')}</ul>
      <p class="r-nada" style="padding:10px 20px 0;font-size:12px">Las noticias de IA se publicarán aquí. Por ahora es una muestra.</p>`;
  }
  const lunes = new Date(LUNES_BASE); lunes.setDate(lunes.getDate() + semanaVista * 7);
  const viernes = new Date(lunes); viernes.setDate(lunes.getDate() + 4);
  const mes = (d) => d.toLocaleDateString('es-CL', { month: 'long' });
  const rango = lunes.getMonth() === viernes.getMonth() ? `${lunes.getDate()} – ${viernes.getDate()} de ${mes(viernes)}` : `${lunes.getDate()} de ${mes(lunes)} – ${viernes.getDate()} de ${mes(viernes)}`;
  const ITEMS = {
    '-1': [[], [], [], [], []],
    0: [[['Abre la videocápsula 2.4', 'Cómo pedirle bien', 'Nueva']], [['Curso 4 · Fuentes chilenas', 'Taller con tu profesor', '10:15 – 11:30'], recordatorioSemana],
      [['Abre el curso 6', 'Ética profesional y responsabilidad', 'Nuevo curso']], [['Pregunta de la semana', '¿Basta con citar un fallo?', 'EVA']], [['Abre la videocápsula 3.2', 'Analizar un fallo', 'Nueva']]],
    1: [[['Abre el curso 7', 'Prueba digital y deepfakes', 'Nuevo curso']], [], [['Taller: prueba digital', 'Con tu profesor', '10:15 – 11:30']], [], [['Abre la videocápsula 4.3', 'Jurisprudencia real', 'Nueva']]],
  }[semanaVista];
  const COL = ['#a81916', '#1f4e9c', '#c98a12', '#2d7d46', '#6b3fa0'];
  const flechas = `<span class="flechas"><button aria-label="Semana anterior" data-s="-1" ${semanaVista <= -1 ? 'disabled' : ''}>${I(IC.izq, 18)}</button><button aria-label="Semana siguiente" data-s="1" ${semanaVista >= 1 ? 'disabled' : ''}>${I(IC.der, 18)}</button></span>`;
  return `<header>${rango}${flechas}</header>
    ${semanaVista < 0 ? '<p class="r-nada" style="padding:12px 20px">Esa semana no hubo actividades: los cursos abrieron el 26 de octubre.</p>' : ''}
    <ol class="dias">${['Lun', 'Mar', 'Mié', 'Jue', 'Vie'].map((d, i) => {
      const f = new Date(lunes); f.setDate(lunes.getDate() + i);
      return ITEMS[i].length ? `<li><span class="d">${d}<b>${f.getDate()}</b></span><ul style="--c:${COL[i]}">${ITEMS[i].map(([a, b, p], j) => `<li><p>${a}</p><p style="color:var(--texto-2);font-weight:400">${b}</p><span class="pild${j ? ' gris' : ''}">${p}</span></li>`).join('')}</ul></li>` : '';
    }).join('')}</ol>`;
}
function alMontarInicio() {
  document.querySelectorAll('[data-n]').forEach((el) => contar(el, +el.dataset.n));
  const barras = document.querySelectorAll('.pista b[data-w]');
  requestAnimationFrame(() => setTimeout(() => barras.forEach((b) => (b.style.width = b.dataset.w + '%')), quieto ? 0 : 120));
  filtrarAvance();
  const p = $('.semana .pestanas'), ag = $('#agenda');
  p.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-selected', String((i === 1) === (pestanaSemana === 'novedades'))));
  rayaPestanas(p);
  p.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.getAttribute('aria-selected') === 'true') return;
    EF.sonar('clic');
    p.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    pestanaSemana = b === p.lastElementChild.previousElementSibling ? 'novedades' : 'semana';
    rayaPestanas(p);
    ag.innerHTML = agenda(); EF.llegar(ag, '.dias > li, .novedades > li, header');
  });
  ag.addEventListener('click', (e) => {
    const b = e.target.closest('[data-s]'); if (!b || b.disabled) return;
    semanaVista += +b.dataset.s; EF.sonar('clic');
    ag.innerHTML = agenda(); EF.llegar(ag, '.dias > li, .r-nada');
  });
  const sel = $('#selector'), menu = $('#menu-sel');
  sel.addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; sel.setAttribute('aria-expanded', String(!menu.hidden)); });
  menu.addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]'); if (!b) return;
    filtroAvance = +b.dataset.f; EF.sonar('clic');
    $('span', sel).textContent = FILTROS_AVANCE[filtroAvance][1];
    menu.querySelectorAll('button').forEach((x) => x.setAttribute('aria-current', String(x === b)));
    menu.hidden = true; filtrarAvance(); EF.llegar($('.barras'), 'li:not([hidden])');
  });
  document.addEventListener('click', () => { menu.hidden = true; }, { once: true });
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
  <div class="titulo"><div><a class="volver" href="#cursos">‹ Mis cursos</a><h1>Curso ${cursoActual + 1} · ${titulo}</h1><p>${DESCRIPCIONES[cursoActual]} Cada paso que marcas se guarda en este navegador.</p></div></div>
  <div class="barra-herr">
    <div class="desplegable">
      <button class="btn lleno" id="abrir-cursos" aria-expanded="false">${I(IC.cursos, 18)}Curso ${cursoActual + 1} · ${titulo}${I(IC.abajo, 16)}</button>
      <ul class="lista-cursos" id="lista-cursos" hidden>${CURSOS.map(([t], k) => `<li><button data-c="${k}" aria-current="${k === cursoActual}">${chip(k)}${t}</button></li>`).join('')}</ul>
    </div>
    <a class="btn" href="#docentes">${I(IC.docentes, 18)}Guía docente</a>
    ${modulosListos(cursoActual) === 4 ? `<button class="btn suave" id="ver-constancia">${I(IC.constancia, 18)}Constancia del curso</button>` : ''}
    <label class="buscador"><span>${I(IC.buscar, 18)}</span><input id="buscar-curso" placeholder="Buscar en el curso" aria-label="Buscar en el curso"></label>
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
            <div class="pie-ses"><a href="#eva">${I(IC.eva, 16)}Pregúntale a EVA sobre esto</a><a href="#video/${cursoActual}-${moduloActual}">${I(IC.videos, 16)}Ver la videocápsula</a>${k === 0 ? `<a href="#laboratorio/${EXP_DE_CURSO[cursoActual]}">${I(IC.laboratorio, 16)}Experimento: ${EXPERIMENTOS.find((x) => x.id === EXP_DE_CURSO[cursoActual]).t}</a>` : ''}</div>
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
    <h3>Para ver</h3><ul><li><a href="#video/${cursoActual}-${moduloActual}">Videocápsula ${n} · ${t}</a> (5 min)</li></ul>
    <h3>Para leer</h3><ul><li><a href="#" data-pdf>Apunte del módulo ${n}</a>, 4 páginas</li><li>Glosario: alucinación, fuente, verificación</li></ul>
    <h3>Para el ejercicio</h3><ul><li>Pauta para comprobar lo que dice la IA</li></ul>
    <div class="btns"><button class="btn ancho" data-pdf>${I(IC.pdf, 18)}Descargar guía PDF</button><button class="btn ancho" data-pdf>${I(IC.carpeta, 18)}Material para el ejercicio</button></div>
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
  lista.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; EF.sonar('clic'); irACurso(+b.dataset.c, 0); });
  $('.mods').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || +b.dataset.m === moduloActual) return;
    moduloActual = +b.dataset.m; EF.sonar('clic'); montar('curso', '.sesion, .lado .cont');
  });
  $('.sesiones').addEventListener('click', (e) => {
    const b = e.target.closest('.sesion > button'); if (!b) return;
    const s = b.parentElement, abierta = !s.classList.contains('abierta');
    s.classList.toggle('abierta', abierta); b.setAttribute('aria-expanded', String(abierta));
    if (abierta) EF.sonar('abre');
  });
  const pest = $('#pest-lado'), cont = $('#cont-lado');
  const mostrar = (p) => {
    pest.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x.dataset.p === p)));
    rayaPestanas(pest);
    cont.innerHTML = p === 'mat' ? ladoMateriales() : ladoActividad();
  };
  pest.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || b.getAttribute('aria-selected') === 'true') return;
    EF.sonar('clic'); mostrar(b.dataset.p); EF.llegar(cont, ':scope > h3, :scope > ul, :scope > p, .checks li, .btns');
  });
  cont.addEventListener('change', (e) => {
    const casillas = [...cont.querySelectorAll('input')];
    const n = casillas.filter((x) => x.checked).length;
    const antes = hechas(cursoActual, moduloActual);
    e.target.classList.remove('pulso'); void e.target.offsetWidth; e.target.classList.add('pulso');
    avance[cursoActual] = avance[cursoActual] || [0, 0, 0, 0];
    avance[cursoActual][moduloActual] = n; guardar();
    const pct = Math.round(totalCurso(cursoActual) / 16 * 100);
    const b = $('#barra-curso'); b.style.width = Math.max(pct, 4) + '%'; b.textContent = pct + '%';
    const marca = $(`.mods button[data-m="${moduloActual}"] .hecho`);
    marca.textContent = n === 4 ? '✓' : '';
    $('p', cont).textContent = `Módulo ${cursoActual + 1}.${moduloActual + 1}: ${n} de 4 pasos.`;
    if (n === 4 && antes < 4) {
      const r = e.target.getBoundingClientRect();
      EF.cruces(r.left + r.width / 2, r.top + r.height / 2);
      EF.brotar(marca);
      if (modulosListos(cursoActual) === 4) {
        const cursos = CURSOS.filter((_, k) => modulosListos(k) === 4).length;
        EF.sonar('curso'); EF.vibrar([14, 60, 14, 60, 40]);
        const c = cursoActual;
        terminados[c] = fechaLocal(new Date()); guardarTerminados();
        EF.aviso({ titulo: `Curso ${c + 1} terminado`, texto: `${CURSOS[c][0]}. Llevas ${cursos} de 8 cursos.`, icono: isotipo(), grande: true,
          accion: { texto: 'Ver constancia', al: () => constancia(c) } });
        if (!$('#ver-constancia')) $('#buscar-curso').closest('.buscador').insertAdjacentHTML('beforebegin', `<button class="btn suave" id="ver-constancia">${I(IC.constancia, 18)}Constancia del curso</button>`);
      } else {
        const listos = CURSOS.reduce((t, _, k) => t + modulosListos(k), 0);
        EF.sonar('modulo'); EF.vibrar([12, 50, 20]);
        EF.aviso({ titulo: `Módulo ${cursoActual + 1}.${moduloActual + 1} terminado`, texto: `Llevas ${listos} de 32 módulos.`, icono: isotipo({ brillo: false }) });
      }
    } else if (n > antes) { EF.sonar('marca'); EF.vibrar(8); } else EF.sonar('desmarca');
  });
  mostrar(location.search.includes('actividad') ? 'act' : 'mat');
  $('.barra-herr').addEventListener('click', (e) => { if (e.target.closest('#ver-constancia')) constancia(cursoActual); });
  // «Buscar en el curso»: deja a la vista sólo las sesiones que nombran lo buscado.
  $('#buscar-curso').addEventListener('input', (e) => {
    const q = sinTildes(e.target.value.trim());
    document.querySelectorAll('.sesion').forEach((s) => {
      const ok = !q || sinTildes(s.textContent).includes(q);
      s.hidden = !ok;
      if (ok && q) { s.classList.add('abierta'); $('button', s).setAttribute('aria-expanded', 'true'); }
    });
  });
}

/* ---------- Videocápsulas ---------- */
let filtro = -1;
function tarjetasVideos() {
  return CURSOS.flatMap(([t, mods], c) => mods.map((m, j) => [c, j, t, m]))
    .filter(([c]) => filtro < 0 || c === filtro)
    .map(([c, j, t, m]) => `
      <a class="caja video" href="#video/${c}-${j}" data-c="${c}" data-m="${j}">
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
    if (+b.dataset.c === filtro) return;
    filtro = +b.dataset.c; EF.sonar('clic');
    $('#filtros').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $('#rejilla').innerHTML = tarjetasVideos();
    EF.llegar($('#rejilla'), '.video');
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
    <div class="acciones"><button class="btn" id="copiar-enlace">${I(IC.enlace, 18)}Copiar enlace para la sección</button><button class="btn lleno" data-pdf>${I(IC.pdf, 18)}Guía del módulo (PDF)</button></div>
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
    if (abierta) EF.sonar('abre');
  });
  $('#copiar-enlace').addEventListener('click', () => {
    const url = location.href.split('#')[0].split('?')[0] + '#cursos';
    copiar(url, 'Enlace copiado', 'Pégalo en el aula virtual: lleva directo a los cursos.');
  });
}

/* ---------- Avisos de lo que la maqueta todavía no tiene ---------- */
async function copiar(texto, titulo, detalle) {
  let ok = true;
  try { await navigator.clipboard.writeText(texto); } catch { ok = false; }
  EF.sonar(ok ? 'llega' : 'desmarca');
  EF.aviso(ok ? { titulo, texto: detalle, icono: I(IC.copiar, 26) } : { titulo: 'No se pudo copiar', texto: 'Tu navegador no dejó copiar. Selecciona el texto a mano.', icono: I(IC.copiar, 26) });
}
// Los PDF y materiales no existen todavía: se dice en vez de fingir una descarga.
document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-pdf]')) return;
  e.preventDefault();
  EF.sonar('clic');
  EF.aviso({ titulo: 'Todavía no hay PDF', texto: 'Las guías y materiales llegarán con el contenido revisado por la Escuela.', icono: I(IC.pdf, 26) });
});

/* ---------- Constancia de avance ----------
   Al terminar un curso. Dice «constancia», no certificado: sin cuentas nadie puede verificarla. Se guarda en PDF con la
   ventana de impresión del navegador (sólo se imprime la constancia). Sin sellos ni timbres. */
let terminados = {};
try { if (!simulaNuevo) terminados = JSON.parse(localStorage.getItem('panel:terminados')) || {}; } catch {}
if (demo) terminados = { 0: fechaLocal(new Date()) };
const guardarTerminados = () => { if (demo || simulaNuevo) return; try { localStorage.setItem('panel:terminados', JSON.stringify(terminados)); } catch {} };
const fechaLarga = (iso) => { const [a, m, d] = (iso || fechaLocal(new Date())).split('-').map(Number); return new Date(a, m - 1, d).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }); };
function constancia(c) {
  $('#constancia')?.remove();
  const fecha = fechaLarga(terminados[c]);
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal" id="constancia" role="dialog" aria-modal="true" aria-labelledby="ct-nombre">
    <div class="pop const-caja">
      <button class="cerrar" aria-label="Cerrar">×</button>
      <div class="const-esc">${isotipo({ brillo: false })}</div>
      <span class="const-eti mono">Constancia de avance</span>
      <h2 id="ct-nombre">${nombre || 'Tu nombre'}</h2>
      ${nombre ? '' : `<label class="const-nombre">¿A nombre de quién? <input id="ct-campo" maxlength="40" placeholder="Escribe tu nombre"></label>`}
      <p class="const-curso">terminó el <b>Curso ${c + 1} · ${CURSOS[c][0]}</b><br>de la Escuela de Derecho PUCV, con EVA</p>
      <div class="const-datos"><div><b>4/4</b><span>módulos</span></div><div><b>12</b><span>sesiones</span></div><div><b>${fecha.replace(/ de \d+$/, '')}</b><span>${fecha.match(/\d{4}$/)[0]}</span></div></div>
      <p class="const-nota">Esta constancia la genera tu navegador. Como no hay cuentas, nadie puede verificarla: <b>no es un certificado</b>. Sirve para mostrarle a tu profesor lo que hiciste.</p>
      <div class="const-bot"><button class="btn lleno" id="ct-pdf">${I(IC.pdf, 18)}Guardar en PDF</button><button class="btn" id="ct-copiar">${I(IC.copiar, 18)}Copiar texto</button>${c < 7 ? `<button class="btn suave" id="ct-seguir">Seguir con el curso ${c + 2}</button>` : ''}</div>
    </div>
  </div>`);
  const m = $('#constancia');
  EF.sonar('llega'); EF.llegar(document.body, '#constancia .const-caja');
  const cerrar = () => m.remove();
  const quien = () => limpio(($('#ct-campo')?.value || nombre || '').trim()) || 'Estudiante';
  $('#ct-campo')?.addEventListener('input', (e) => { $('#ct-nombre').textContent = limpio(e.target.value) || 'Tu nombre'; });
  m.addEventListener('click', (e) => {
    if (e.target === m || e.target.closest('.cerrar')) cerrar();
    if (e.target.closest('#ct-pdf')) { $('#ct-nombre').textContent = quien(); window.print(); }
    if (e.target.closest('#ct-copiar')) copiar(`Constancia de avance. ${quien()} terminó el Curso ${c + 1} · ${CURSOS[c][0]} (4 módulos, 12 sesiones) el ${fecha}. Escuela de Derecho PUCV, con EVA. Generada en el navegador: no es un certificado.`, 'Texto copiado', 'Pégalo donde quieras mostrar lo que hiciste.');
    if (e.target.closest('#ct-seguir')) { cerrar(); irACurso(c + 1, 0); }
  });
  m.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  $('.cerrar', m).focus({ preventScroll: true });
}

/* ---------- Videocápsula ----------
   Reproductor simulado: los videos no existen todavía. Capítulos y subtítulos son un guion de muestra. Al llegar al final,
   o con «Marcar como vista», se completa el paso 1 del módulo. */
let videoSel = [0, 0], reloj, tVideo = 0, rodando = false, velocidad = 1, conSubs = true;
const CAPITULOS = [[0, 'Una pregunta para empezar'], [65, 'La idea central'], [130, 'Un caso jurídico'], [200, 'Cómo comprobarlo'], [270, 'Tu tarea']];
const subtitulo = (i, tema) => [`¿Qué tiene que ver «${tema}» con tu trabajo de abogado?`, `La idea central de «${tema}», en un minuto.`,
  'Un ejemplo con un escrito real, sin datos de ningún cliente.', 'Antes de usarlo, compruébalo en la fuente oficial.', 'Tu tarea: hazlo tú con una IA y anota lo que no puedas comprobar.'][i];
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function vistaVideo() {
  const [c, m] = videoSel, tema = CURSOS[c][1][m];
  const sig = m < 3 ? [c, m + 1] : c < 7 ? [c + 1, 0] : null;
  const vista = hechas(c, m) > 0;
  return `
  <div class="titulo"><div><a class="volver" href="#videos">‹ Videocápsulas</a><h1>${c + 1}.${m + 1} · ${tema}</h1><p>Curso ${c + 1} · ${CURSOS[c][0]} · 5 minutos</p></div>
    <div class="acciones"><button class="btn" data-pdf>${I(IC.pdf, 18)}Guía PDF</button><button class="btn lleno" id="marcar-vista" ${vista ? 'disabled' : ''}>${vista ? `${I(IC.ok, 18)}Vista` : 'Marcar como vista'}</button></div></div>
  <div class="reproductor">
    <div class="pantalla" id="pantalla" tabindex="0" aria-label="Videocápsula simulada. Espacio para reproducir o pausar.">
      <span class="gr"></span><span class="linea" style="background:${COLORES[c]}"></span>
      <span class="simulado mono">VIDEO SIMULADO</span>
      <span class="k">${c + 1}.${m + 1}</span><span class="tit">${tema}</span>
      <button class="gran-play" id="gran-play" aria-label="Reproducir">${I(IC.play, 30)}</button>
      <span class="sub" id="sub"></span>
      <div class="ctr">
        <button class="play" id="play" aria-label="Reproducir"></button><span id="t-ahora">0:00</span>
        <span class="barra" id="barra" role="slider" aria-label="Avance del video" aria-valuemin="0" aria-valuemax="300"><b id="barra-b"></b></span>
        <span>5:00</span><button class="chip" id="cc" aria-pressed="true">CC</button><button class="chip" id="vel">1×</button>
      </div>
    </div>
    <aside class="caja lado-video">
      <h3>En este video</h3>
      <ol class="capitulos" id="capitulos">${CAPITULOS.map(([s, t], i) => `<li><button data-s="${s}"><span>${mmss(s)}</span>${t}</button></li>`).join('')}</ol>
      <h3>Después de verlo</h3><p>Al marcarlo como visto se completa el paso 1 del módulo ${c + 1}.${m + 1}. Luego sigue con el ejercicio en Cursos.</p>
      ${sig ? `<a class="siguiente" href="#video/${sig[0]}-${sig[1]}"><span class="mk">${sig[0] + 1}.${sig[1] + 1}</span><span><b>Siguiente: ${CURSOS[sig[0]][1][sig[1]]}</b><small>Curso ${sig[0] + 1} · 5 min</small></span></a>` : ''}
      <p class="muestra" style="margin:14px 0 0">GUION DE MUESTRA · REVISIÓN JURÍDICA PENDIENTE</p>
    </aside>
  </div>`;
}
function alMontarVideo() {
  const [c, m] = videoSel, tema = CURSOS[c][1][m];
  tVideo = 0; rodando = false;
  const pantalla = $('#pantalla');
  const pintar = () => {
    const cap = CAPITULOS.reduce((a, [s], i) => (tVideo >= s ? i : a), 0);
    $('#t-ahora').textContent = mmss(tVideo);
    $('#barra-b').style.width = (tVideo / 300 * 100) + '%';
    $('#barra').setAttribute('aria-valuenow', Math.round(tVideo));
    $('#sub').textContent = conSubs && (rodando || tVideo > 0) ? subtitulo(cap, tema) : '';
    $('#sub').hidden = !$('#sub').textContent;
    $('#play').innerHTML = I(rodando ? IC.pausa : IC.play, 16);
    $('#play').setAttribute('aria-label', rodando ? 'Pausar' : 'Reproducir');
    pantalla.classList.toggle('rodando', rodando);
    document.querySelectorAll('#capitulos li').forEach((li, i) => li.classList.toggle('ahora', i === cap));
  };
  const marcarVista = (auto) => {
    if (hechas(c, m) > 0) return;
    avance[c] = avance[c] || [0, 0, 0, 0]; avance[c][m] = Math.max(1, avance[c][m]); guardar();
    const b = $('#marcar-vista'); b.disabled = true; b.innerHTML = `${I(IC.ok, 18)}Vista`;
    EF.sonar('marca'); EF.vibrar(8); EF.brotar(b);
    EF.aviso({ titulo: auto ? 'Terminaste la videocápsula' : 'Videocápsula vista', texto: `Paso 1 del módulo ${c + 1}.${m + 1} hecho. Sigue con el ejercicio en Cursos.`, icono: I(IC.ok, 26) });
  };
  const alternar = () => {
    if (!rodando && tVideo >= 300) tVideo = 0;
    rodando = !rodando; EF.sonar('clic');
    clearInterval(reloj);
    if (rodando) reloj = setInterval(() => {
      tVideo = Math.min(300, tVideo + 0.25 * velocidad);
      if (tVideo >= 300) { rodando = false; clearInterval(reloj); marcarVista(true); }
      pintar();
    }, 250);
    pintar();
  };
  pantalla.addEventListener('click', (e) => {
    if (e.target.closest('#cc')) { conSubs = !conSubs; e.target.closest('#cc').setAttribute('aria-pressed', String(conSubs)); pintar(); return; }
    if (e.target.closest('#vel')) { velocidad = velocidad === 1 ? 1.5 : velocidad === 1.5 ? 2 : 1; $('#vel').textContent = velocidad + '×'; EF.sonar('clic'); return; }
    const barra = e.target.closest('#barra');
    if (barra) { const r = barra.getBoundingClientRect(); tVideo = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 300; pintar(); return; }
    alternar();
  });
  pantalla.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'k') { e.preventDefault(); alternar(); } });
  $('#capitulos').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (!b) return; tVideo = +b.dataset.s; if (!rodando) alternar(); else pintar(); });
  $('#marcar-vista').addEventListener('click', () => marcarVista(false));
  pintar();
}

/* ---------- Recorrido de ayuda ----------
   Cuatro pasos sobre la portada: ilumina una parte y explica qué es. Se abre con «?» o desde Letra y contraste. */
const PASOS_AYUDA = [
  ['.lateral .menu', '#menu-tel', 'Todo está aquí', 'Inicio, los ocho cursos, las videocápsulas, la guía para docentes y EVA.'],
  ['.sigues', '.sigues', 'Aquí sigues', 'Siempre te muestra el módulo que toca y cuántos pasos te faltan. Un clic y vuelves donde quedaste.'],
  ['.avance', '.avance', 'Tu avance', 'Cada curso tiene cuatro módulos. Lo que marcas queda en este navegador: no necesitas cuenta.'],
  ['.cabecera .buscador', '.perfil', 'Busca y ajusta', 'Escribe un término —por ejemplo «alucinación»— y te lleva al video, al curso o a la pregunta de EVA. Atajo: Ctrl K.'],
];
function recorrido(paso = 0) {
  if (location.hash.slice(1) !== 'inicio' && location.hash) { location.hash = 'inicio'; setTimeout(() => recorrido(paso), 450); return; }
  $('#guia')?.remove();
  const tel = matchMedia('(max-width: 860px)').matches;
  const [selPc, selTel, titulo, texto] = PASOS_AYUDA[paso];
  const el = $(tel ? selTel : selPc);
  if (!el) return;
  const texto2 = tel && paso === 3 ? 'Toca tu perfil para agrandar la letra, subir el contraste o apagar el sonido.' : texto;
  if (!el.closest('.lateral, .cabecera, .abajo-tel')) el.scrollIntoView({ block: 'center', behavior: quieto ? 'auto' : 'smooth' });
  setTimeout(() => {
    const r = el.getBoundingClientRect(), ult = paso === PASOS_AYUDA.length - 1;
    document.body.insertAdjacentHTML('beforeend', `
    <div class="guia" id="guia" role="dialog" aria-modal="true" aria-labelledby="guia-t">
      <div class="guia-hueco" style="left:${r.left - 6}px;top:${r.top - 6}px;width:${r.width + 12}px;height:${r.height + 12}px"></div>
      <div class="pop guia-caja"><span class="guia-paso mono">AYUDA · ${paso + 1} DE ${PASOS_AYUDA.length}</span><h3 id="guia-t">${titulo}</h3><p>${texto2}</p>
        <div class="guia-bot"><span class="puntos">${PASOS_AYUDA.map((_, i) => `<i class="${i === paso ? 'on' : ''}"></i>`).join('')}</span>
          ${ult ? '' : '<button class="btn" data-g="fin">Saltar</button>'}<button class="btn lleno" data-g="${ult ? 'fin' : 'sig'}">${ult ? 'Listo' : 'Siguiente'}</button></div></div>
    </div>`);
    const g = $('#guia'), caja2 = $('.guia-caja', g);
    if (!tel) {
      const abajo = r.bottom + 20 + caja2.offsetHeight < innerHeight;
      caja2.style.top = (abajo ? r.bottom + 20 : Math.max(12, r.top - caja2.offsetHeight - 20)) + 'px';
      caja2.style.left = Math.min(innerWidth - caja2.offsetWidth - 16, Math.max(16, r.left + (r.width > 400 ? 40 : r.width + 20))) + 'px';
      if (r.height > innerHeight * 0.5) { caja2.style.top = Math.max(12, r.top + 40) + 'px'; caja2.style.left = (r.right + 24) + 'px'; }
    }
    EF.llegar(g, '.guia-caja');
    g.addEventListener('click', (e) => {
      const b = e.target.closest('[data-g]'); if (!b) return;
      EF.sonar('clic');
      g.remove();
      if (b.dataset.g === 'sig') recorrido(paso + 1);
    });
    g.addEventListener('keydown', (e) => { if (e.key === 'Escape') g.remove(); });
    $('[data-g="sig"], [data-g="fin"]:last-child', g).focus({ preventScroll: true });
  }, el.closest('.lateral, .cabecera, .abajo-tel') || quieto ? 0 : 380);
}
$('#ayuda').addEventListener('click', () => recorrido());

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
    // Primero la pregunta exacta; si no, por palabras clave; si tampoco, EVA dice que no sabe y ofrece lo que sí responde.
    const n = sinTildes(q), clave = CLAVES_EVA.find(([re]) => re.test(n));
    const hallada = PREGUNTAS.find((p) => p[0] === q) || (clave && PREGUNTAS[clave[1]]);
    const [, v, texto, ojo] = hallada || [q, 'dep', 'Depende de para qué la uses. En esta maqueta sólo sé responder algunas preguntas; en la plataforma cada respuesta traerá su advertencia y sus fuentes.', ''];
    document.querySelectorAll('#conv-lista button').forEach((b) => b.setAttribute('aria-current', String(b.textContent === q)));
    clearInterval(escribiendo);
    EF.sonar('envia');
    caja.insertAdjacentHTML('beforeend', `<div class="msj yo"><p>${q.replace(/</g, '&lt;')}</p></div>`);
    caja.insertAdjacentHTML('beforeend', `<div class="msj eva" id="pensando"><span class="escribe"><i></i><i></i><i></i></span></div>`);
    bajar();
    setTimeout(() => {
      const m = $('#pensando'); m.removeAttribute('id');
      m.innerHTML = `<span class="veredicto" style="background:${VEREDICTO[v][0]}">${VEREDICTO[v][1]}</span><p class="txt"></p>`;
      EF.sonar('llega'); EF.brotar($('.veredicto', m));
      const t = $('.txt', m); let n = 0;
      const fin = () => {
        m.insertAdjacentHTML('beforeend', hallada ? `<p class="ojo">Ojo: ${ojo}</p>`
          : `<p class="ojo">Prueba con una de éstas:</p><div class="eva-chips">${PREGUNTAS.map(([p], k) => `<button data-k="${k}">${p}</button>`).join('')}</div>`);
        bajar();
      };
      if (quieto) { t.textContent = texto; fin(); return; }
      escribiendo = setInterval(() => { n += 3; t.textContent = texto.slice(0, n); bajar(); if (n >= texto.length) { clearInterval(escribiendo); fin(); } }, 16);
    }, quieto ? 0 : 700);
  }
  $('#conv-lista').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) preguntar(PREGUNTAS[+b.dataset.k][0]); });
  $('#form-eva').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#campo-eva').value.trim(); if (v) { preguntar(v); $('#campo-eva').value = ''; } });
  caja.addEventListener('click', (e) => { const b = e.target.closest('.eva-chips button'); if (b) preguntar(PREGUNTAS[+b.dataset.k][0]); });
  if (preguntaPendiente) { preguntar(preguntaPendiente); preguntaPendiente = null; } else if (captura) preguntar(PREGUNTAS[1][0]);
}
// Palabras que llevan a cada pregunta de la lista (sin tildes).
const CLAVES_EVA = [[/cliente|\brut\b|datos personales|domicilio|confidencial/, 0], [/tesis|memoria|titulo|capitulo/, 1], [/fallo|\brol\b|citar|cita |jurisprudencia/, 2], [/resum|sentencia/, 3]];

/* ---------- Navegación ---------- */
const PANTALLAS = {
  inicio: [vistaInicio, alMontarInicio], cursos: [vistaCatalogo, alMontarCatalogo], curso: [vistaCursos, alMontarCursos],
  videos: [vistaVideos, alMontarVideos], video: [vistaVideo, alMontarVideo], laboratorio: [vistaLab, alMontarLab],
  recursos: [vistaRecursos, alMontarRecursos], guias: [vistaGuias, alMontarGuias],
  docentes: [vistaDocentes, alMontarDocentes], eva: [vistaEva, alMontarEva],
};
// Qué sección del menú queda marcada en cada pantalla interior.
const MENU_DE = { curso: 'cursos', video: 'videos' };
// Experimento de EVA Lab que acompaña a cada curso (se ofrece en la primera sesión de cada módulo).
const EXP_DE_CURSO = ['02', '06', '03', '06', '04', '05', '04', '01'];
// Las piezas que entran subiendo, una tras otra, al llegar a una pantalla.
const PIEZAS = '.titulo, .lab-cab, .tablero > *, .barra-herr, .progreso, .mods, .sesion, .lado, .filtros, .tarjeta, .video, .chat, .pantalla, .lado-video, .exp-barra, .exp-t, .exp-escena';
function montar(id, piezas = PIEZAS) {
  const [html, despues] = PANTALLAS[id] || PANTALLAS.inicio;
  const v = $('#vista');
  clearInterval(reloj);
  v.innerHTML = `<div class="vista vista-${id}">${html()}</div>`;
  EF.llegar(v, piezas);
  const menu = MENU_DE[id] || id;
  document.querySelectorAll('[data-v]').forEach((a) => (a.dataset.v === menu ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
  moverIndicador();
  despues();
}
// La marca del menú lateral se desliza hasta la sección activa.
function moverIndicador() {
  const a = $('#menu [aria-current="page"]'), ind = $('#menu .menu-ind');
  if (!ind) return;
  ind.style.opacity = a ? '1' : '0';
  if (a) { ind.style.transform = `translateY(${a.parentElement.offsetTop + 8}px)`; ind.style.height = (a.offsetHeight - 16) + 'px'; }
}
let moduloPedido = null;
// Entrar a un curso (y a un módulo) desde cualquier parte: buscador, EVA, guías, laboratorio.
function irACurso(c, m = null) {
  moduloPedido = m;
  if (location.hash === `#cursos/${c + 1}`) { cursoActual = c; if (m !== null) moduloActual = m; moduloPedido = null; montar('curso'); }
  else location.hash = `cursos/${c + 1}`;
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-ir-curso]'); if (!a) return;
  e.preventDefault();
  const [c, m] = a.dataset.irCurso.split('-').map(Number);
  irACurso(c, m);
});
function ruta() {
  const id = location.hash.slice(1), base = id.split(/[/?]/)[0];
  if (id === 'ajustes') return;
  // #video/2-1 abre la videocápsula 3.2 (curso y módulo cuentan desde cero). #cursos/3 abre el curso 3.
  const v = id.match(/^video\/(\d)-(\d)$/), c = id.match(/^cursos\/(\d)$/);
  if (v && +v[1] < CURSOS.length && +v[2] < 4) { videoSel = [+v[1], +v[2]]; montar('video'); }
  else if (c && +c[1] >= 1 && +c[1] <= CURSOS.length) {
    const k = +c[1] - 1;
    if (moduloPedido !== null) moduloActual = moduloPedido;
    else if (k !== cursoActual) moduloActual = Math.max(0, [0, 1, 2, 3].findIndex((m) => hechas(k, m) < 4));
    cursoActual = k; moduloPedido = null;
    montar('curso');
  } else montar(PANTALLAS[base] && !MENU_DE[base] ? base : 'inicio');
  $('#guia')?.remove(); cerrarBusqueda();
  if (!captura) scrollTo(0, 0);
}
addEventListener('hashchange', ruta);
addEventListener('resize', () => { document.querySelectorAll('.pestanas').forEach(rayaPestanas); moverIndicador(); });

/* ---------- Perfil y bienvenida (sólo la primera vez) ---------- */
function pintarPerfil() {
  $('.perfil .ini').textContent = nombre ? nombre.slice(0, 2) : 'Tú';
  $('.perfil b').textContent = nombre || 'Estudiante';
}
pintarPerfil();
let vista0 = false;
try { vista0 = !simulaNuevo && localStorage.getItem('panel:bienvenida') === '1'; } catch {}
if (location.search.includes('sinbienvenida') || demo) vista0 = true;
/* La bienvenida tiene tres etapas: 1) la pregunta con trampa (el experimento SÍ/NO de EVA Lab, en breve); 2) la
   revelación; 3) la entrada de siempre (nombre opcional y quién eres). Se puede omitir desde el primer momento y no se
   repite: queda marcada en panel:bienvenida. El experimento se puede repetir en EVA Lab. */
function bienvenida() {
  document.body.insertAdjacentHTML('beforeend', `
  <div class="bienvenida" id="bienvenida" role="dialog" aria-modal="true" aria-label="Bienvenida">
    <div class="bv-caja bv-grande">
      <div class="bv-top"><span class="eva-mini">${evaIsotipo()}</span><span class="mono">EVA · Escuela de Derecho PUCV</span><button class="bv-omitir" id="bv-omitir">Omitir ›</button></div>
      <div class="bv-etapa" id="bv-etapa"></div>
    </div>
  </div>`);
  const bv = $('#bienvenida'), etapa = $('#bv-etapa');
  if (!quieto) requestAnimationFrame(() => bv.classList.add('ver')); else bv.classList.add('ver');
  const entrada = () => {
    $('#bv-omitir').hidden = true;
    etapa.innerHTML = entradaHTML();
    EF.llegar(etapa, ':scope > *');
    setTimeout(() => $('#bv-nombre')?.focus({ preventScroll: true }), quieto ? 0 : 300);
  };
  experimentoSiNo(etapa, {
    pregunta: 'Una pregunta antes de empezar: <b>¿quieres aprender a usar inteligencia artificial?</b>',
    alFin: (v, r) => {
      const rev = revelacionSiNo(v, r);
      etapa.innerHTML = `<div class="bv-rev"><p class="fin-sub">${rev.sub}</p><p class="fin-pre">${rev.texto}</p>
        <h2>La IA puede influir en tus decisiones. Entender cómo funciona es una buena forma de recuperar el control.</h2>
        <p class="bv-txt">Esto tiene un nombre: <b>patrón oscuro de diseño</b>. Puedes repetir el experimento en EVA Lab.</p>
        <button class="btn lleno" id="bv-seguir">Entrar a IA y Derecho<span class="flecha">${I(IC.flecha, 18)}</span></button></div>`;
      EF.sonar('llega'); EF.llegar(etapa, '.bv-rev > *');
      $('#bv-seguir').addEventListener('click', entrada);
      $('#bv-seguir').focus({ preventScroll: true });
    },
  });
  $('#bv-omitir').addEventListener('click', () => { EF.sonar('clic'); entrada(); });
  bv.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ir]'); if (!b) return;
    EF.sonar('llega');
    const n = limpio($('#bv-nombre').value.trim());
    if (n) { nombre = n; try { localStorage.setItem('panel:nombre', n); } catch {} pintarPerfil(); }
    try { localStorage.setItem('panel:bienvenida', '1'); } catch {}
    bv.classList.remove('ver');
    setTimeout(() => bv.remove(), quieto ? 0 : 300);
    if (b.dataset.ir && location.hash.slice(1) !== b.dataset.ir) location.hash = b.dataset.ir; else ruta();
  });
}
function entradaHTML() {
  return `
      <div class="bv-esc">${isotipo()}</div>
      <p class="bv-eti mono">Escuela de Derecho PUCV · con EVA</p>
      <h1 id="bv-t">Te damos la bienvenida a IA y Derecho</h1>
      <p class="bv-txt">Ocho cursos para usar la inteligencia artificial en la carrera sin perder el criterio. No necesitas crear cuenta: lo que avances se guarda en este navegador.</p>
      <ol class="bv-pasos">
        <li><b>1</b>Mira una videocápsula de 5 minutos.</li>
        <li><b>2</b>Hazlo tú con una IA, guiado.</li>
        <li><b>3</b>Comprueba en la fuente lo que te dijo.</li>
      </ol>
      <label class="bv-nombre">¿Cómo te llamamos? <span>(opcional, queda sólo aquí)</span><input id="bv-nombre" maxlength="24" autocomplete="given-name" placeholder="Tu nombre"></label>
      <div class="bv-botones">
        <button class="btn lleno" data-ir="inicio">Soy estudiante<span class="flecha">${I(IC.flecha, 18)}</span></button>
        <button class="btn" data-ir="docentes">${I(IC.docentes, 18)}Soy docente</button>
        <button class="btn bv-mirar" data-ir="laboratorio">Sólo quiero explorar</button>
      </div>`;
}
iniciarEva();
ruta();
if (!vista0) bienvenida();
