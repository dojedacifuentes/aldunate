/* ---------- Íconos de línea ---------- */
const I = {
  birrete: '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5v4c1.5 1.4 3.4 2 5.5 2s4-.6 5.5-2v-4M21.5 9.5v5"/>',
  persona: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.8-3.6 3.8-5.6 7.5-5.6s6.7 2 7.5 5.6"/>',
  chev: '<path d="M9 6l6 6-6 6"/>',
  lupa: '<circle cx="11" cy="11" r="6"/><path d="m15.5 15.5 4.5 4.5M8.5 11h5"/>',
  candado: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2"/>',
  pluma: '<path d="M14.5 4.5l5 5L9 20H4v-5z"/><path d="M12.5 6.5l5 5"/>',
  rejilla: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  play: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M10 9.2v5.6l4.6-2.8z"/>',
  rayo: '<path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12z"/>',
  doc: '<path d="M7 3.5h7l4.5 4.5V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4.5M9.5 12.5h6M9.5 16h6"/>',
  ayuda: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.6v.2"/>',
  escudo: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6z"/><path d="m8.8 12 2.2 2.2 4.4-4.4"/>',
  balanza: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7l-2.5 6h5zM19 7l-2.5 6h5z"/><path d="M2.5 13a2.5 2 0 0 0 5 0M16.5 13a2.5 2 0 0 0 5 0"/>',
  nodos: '<circle cx="12" cy="5.5" r="2"/><circle cx="5.5" cy="17.5" r="2"/><circle cx="18.5" cy="17.5" r="2"/><circle cx="12" cy="13" r="2"/><path d="M12 7.5V11M10.4 14.2l-3.4 2.2M13.6 14.2l3.4 2.2"/>',
  libro: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13"/>',
  cubo: '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
};
const svgI = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`;
document.querySelectorAll('[data-i]').forEach((el) => { el.innerHTML = svgI(el.dataset.i); });
document.querySelectorAll('[data-i-izq]').forEach((el) => { el.insertAdjacentHTML('afterbegin', svgI(el.dataset.iIzq)); });

/* ---------- Cursos (los títulos reales del catálogo de eva.derecho) ---------- */
const CURSOS = [
  ['0', 'Qué es la IA', '¿Qué dice la ley que es, y qué no sabe nadie?', 100],
  ['1', 'Cómo funciona y por qué se equivoca', 'Ponla a tomarte el examen y mira dónde falla.', 50],
  ['2', 'Estudiar y trabajar sin perder el criterio', 'Un tutor que pregunta, no que responde por ti.', 25],
  ['3', 'Investigación jurídica con IA', 'Fuentes chilenas, citas y fallos reales.', 0],
  ['4', 'Crea tus herramientas jurídicas', 'De una idea a una herramienta publicada.', 0],
  ['5', 'Ética profesional y responsabilidad', 'Cuando la IA se equivoca, ¿quién responde?', 0],
  ['6', 'Prueba digital y deepfakes', 'Autenticidad, custodia y peritaje.', 0],
  ['7', 'Regulación de la IA', 'Chile y el mundo: riesgo, datos y derechos.', 0],
];
document.getElementById('cursos').innerHTML = CURSOS.map(([n, t, p, a], k) => `
  <button class="tarjeta curso${k % 4 === 3 ? ' tarjeta--m' : ''}">
    <span class="curso__n">CURSO ${n}<em>${a ? a + ' %' : '4 módulos'}</em></span>
    <h3>${t}</h3><p>${p}</p>
    <span class="curso__barra"><i style="width:${a}%"></i></span>
  </button>`).join('');

/* ---------- Ilustraciones de línea (SVG) ---------- */
const plataforma = (cx, cy, r) => `
  <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * .2}" fill="url(#gLuz)" opacity=".5"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * .2}" fill="none" stroke="url(#gCian)" stroke-width="1.4"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${r * 1.25}" ry="${r * .25}" fill="none" stroke="url(#gCian)" stroke-width="1" stroke-dasharray="2 10" class="giro"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${r * .7}" ry="${r * .14}" fill="none" stroke="#00d1ff" stroke-width=".8" opacity=".6"/>`;
// Ficha flotante: un fragmento real de lo que hay en la plataforma (etiqueta, líneas y, si cabe, un veredicto).
const panel = (x, y, w, h, cls = '', etiqueta = '', lineas = [], marca = null) => `
  <g class="flota ficha ${cls}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="rgba(10,24,58,.82)" stroke="url(#gCian)" stroke-width="1.2"/>
    <text x="${x + 10}" y="${y + 17}" class="ficha-t" font-size="8.5" letter-spacing="1.2" fill="#00d1ff">${etiqueta}</text>
    ${lineas.map((l, k) => `<text x="${x + 10}" y="${y + 34 + k * 14}" font-family="Sora, sans-serif" font-size="11.5" fill="#ebf0ff">${l}</text>`).join('')}
    ${marca ? `<text x="${x + 10}" y="${y + h - 10}" class="ficha-t" font-size="9" fill="${marca[1]}">${marca[0]}</text>` : ''}
  </g>`;
const meridianos = [0, 1, 2, 3, 4, 5].map((k) => {
  const d = (k * 1.2).toFixed(1);
  return `<ellipse cx="300" cy="250" rx="150" ry="150" fill="none" stroke="url(#gCian)" stroke-width=".9" opacity=".55">
    <animate attributeName="rx" values="150;4;150" dur="7.2s" begin="-${d}s" repeatCount="indefinite"/></ellipse>`;
}).join('');
const paralelos = [-110, -60, 0, 60, 110].map((dy) => {
  const r = Math.sqrt(150 * 150 - dy * dy);
  return `<ellipse cx="300" cy="${250 + dy}" rx="${r.toFixed(1)}" ry="${(r * .18).toFixed(1)}" fill="none" stroke="url(#gCian)" stroke-width=".8" opacity=".45"/>`;
}).join('');
document.getElementById('arte-globo').innerHTML = `
<svg viewBox="0 0 600 560" class="glow">
  ${plataforma(300, 480, 200)}
  <circle cx="300" cy="250" r="150" fill="rgba(0,80,200,.08)" stroke="url(#gCian)" stroke-width="1.6"/>
  ${meridianos}${paralelos}
  <ellipse cx="300" cy="250" rx="205" ry="56" fill="none" stroke="#8a5cff" stroke-width="1.2" stroke-dasharray="3 8" class="giro" transform="rotate(-14 300 250)"/>
  <circle cx="300" cy="250" r="88" fill="rgba(10,15,30,.7)"/>
  <image href="img/escudo-luz.svg" x="226" y="160" width="148" height="190" class="pulso" style="animation-duration:5s"/>
  <path d="M300 400 v60" stroke="#00d1ff" stroke-width="1" stroke-dasharray="2 5"/>
  ${panel(0, 56, 170, 74, '', 'CURSO 0 · MÓDULO 1', ['Las definiciones', 'que usan las leyes'], ['● EN CURSO', '#00d1ff'])}${panel(430, 46, 170, 74, 'd1', 'EVA PREGUNTA', ['¿Qué dice la ley', 'que es una IA?'], ['▸ RESPONDE TÚ', '#b99bff'])}${panel(0, 340, 140, 56, 'd2', 'TU AVANCE', ['1 de 4 módulos'])}${panel(450, 330, 150, 56, 'd3', 'LO QUE NO SE DELEGA', ['Tu firma'])}
</svg>`;

/* ---------- Panel de sección (escena Docentes) ---------- */
const MODULOS = [['1.1', '¿Qué es una IA?', 92], ['1.2', 'La siguiente palabra', 74], ['1.3', 'Por qué inventa', 51], ['1.4', 'Cómo pedirle bien', 18]];
const barras = MODULOS.map(([n, t, v], k) => {
  const y = 196 + k * 46;
  return `<text x="150" y="${y}" class="ficha-t" font-size="9" fill="#00d1ff" letter-spacing="1">${n}</text>
    <text x="180" y="${y}" font-family="Sora, sans-serif" font-size="11.5" fill="#ebf0ff">${t}</text>
    <text x="450" y="${y}" class="ficha-t" font-size="10" fill="#a9b6d8" text-anchor="end">${v} %</text>
    <rect x="150" y="${y + 9}" width="300" height="5" rx="2.5" fill="rgba(169,182,216,.16)"/>
    <rect x="150" y="${y + 9}" width="${3 * v}" height="5" rx="2.5" fill="url(#gCian)"><animate attributeName="width" from="0" to="${3 * v}" dur="1.4s" begin="${k * .15}s" fill="freeze"/></rect>`;
}).join('');
document.getElementById('arte-panel').innerHTML = `
<svg viewBox="0 0 600 560" class="glow">
  ${plataforma(300, 480, 200)}
  <path d="M300 410 v62" stroke="#00d1ff" stroke-width="1" stroke-dasharray="2 5"/>
  <rect x="126" y="120" width="348" height="290" rx="14" fill="rgba(10,24,58,.78)" stroke="url(#gCian)" stroke-width="1.5"/>
  <text x="150" y="148" class="ficha-t" font-size="9" letter-spacing="1.4" fill="#00d1ff">PANEL DE SECCIÓN · CURSO 1</text>
  <text x="150" y="168" font-family="Sora, sans-serif" font-size="14" fill="#ebf0ff">Sección 3 · 28 estudiantes</text>
  <circle cx="440" cy="158" r="4" fill="#3ddc97"><animate attributeName="opacity" values="1;.3;1" dur="2.4s" repeatCount="indefinite"/></circle>
  ${barras}
  <path d="M150 384 H450" stroke="rgba(169,182,216,.18)"/>
  <text x="150" y="400" class="ficha-t" font-size="9" fill="#a9b6d8">ERRORES ENCONTRADOS · 71 de 112</text>
  ${panel(0, 40, 170, 66, '', 'SIN DATOS PERSONALES', ['Nadie entrega su RUT'], ['✓ SÓLO AVANCE', '#3ddc97'])}${panel(430, 40, 170, 66, 'd1', 'EVA SUGIERE', ['Repasar el 1.3', 'antes de la prueba'])}${panel(0, 400, 140, 56, 'd2', 'SECCIÓN', ['Ficticia'])}${panel(460, 400, 140, 56, 'd3', 'ESTA SEMANA', ['+9 módulos'])}
</svg>`;

const PASOS = [
  ['Comparte la videocápsula 1.1 (5 min) y pide a cada estudiante una pregunta de examen que crea que la IA no puede responder.', 'que la cápsula y el curso estén abiertos para tu sección.'],
  ['En grupos, le toman el examen a la IA con sus preguntas. Cada grupo anota una respuesta que suena segura y está mal, y cómo lo comprobó.', 'las respuestas «correctas» contra la fuente antes de darlas por buenas.'],
  ['Cierre de 10 minutos: ¿qué error costó más ver? Cada uno lo escribe en su bitácora. En el panel ves quién terminó el módulo.', 'el contenido jurídico del módulo: la guía marca qué cotejar.'],
];
const guia = document.getElementById('guia');
function paso(k) {
  guia.querySelectorAll('[data-paso]').forEach((b) => b.setAttribute('aria-selected', String(+b.dataset.paso === k)));
  document.getElementById('guia-texto').textContent = PASOS[k][0];
  document.getElementById('guia-ojo').textContent = PASOS[k][1];
}
guia.addEventListener('click', (e) => { const b = e.target.closest('[data-paso]'); if (b) paso(+b.dataset.paso); });
paso(0);

/* ---------- Asistente de muestra ---------- */
// Las preguntas de «Lo que no se delega»: cada respuesta abre con su veredicto.
const RESPUESTAS = {
  '¿Pego aquí un escrito con datos del cliente?': ['no', 'No', 'Primero quita nombres, RUT y domicilios. Lo que entra a una IA puede salir de tu control: secreto profesional y datos personales.', 'Ojo: anonimiza antes de pegar, siempre.'],
  '¿Puedo usar IA en mi tesis?': ['dep', 'Depende', 'Para ordenar ideas, buscar contraargumentos y revisar la redacción, sí. Para escribir el capítulo por ti, no: lo que firmas tiene que ser tuyo. Y se declara.', 'Ojo: pregúntale a tu profesor guía qué permite tu programa.'],
  '¿Basta con que cites un fallo?': ['no', 'No', 'Puedo inventar un rol que suena perfecto. Ábrelo tú en el buscador del Poder Judicial antes de citarlo.', 'Ojo: nunca cites un rol que no hayas abierto tú.'],
  'Resume esta sentencia': ['si', 'Sí', 'Pega el texto y te devuelvo hechos, decisión y razonamiento en una página. Después compáralo con el fallo: los resúmenes también se equivocan.', 'Ojo: el resumen no reemplaza la lectura.'],
};
const chips = document.getElementById('chips');
const resp = document.getElementById('respuesta');
chips.innerHTML = Object.keys(RESPUESTAS).map((q) => `<button class="chip" type="button" aria-pressed="false">${q}</button>`).join('');
let escribiendo;
function responder(q) {
  const [clase, veredicto, texto, ojo] = RESPUESTAS[q] || ['dep', 'Maqueta', 'En esta maqueta sólo respondo las sugerencias. En la plataforma real, cada respuesta trae su advertencia y sus fuentes.', 'Ojo: verifica todo lo que te diga.'];
  clearInterval(escribiendo);
  chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === q)));
  let n = 0;
  resp.innerHTML = `<div class="respuesta__quien">EVA</div><span class="veredicto v-${clase}">${veredicto}</span><span id="t"></span><span class="cursor"></span>`;
  const t = resp.querySelector('#t');
  escribiendo = setInterval(() => {
    n += 2; t.textContent = texto.slice(0, n);
    if (n >= texto.length) { clearInterval(escribiendo); resp.querySelector('.cursor').remove(); resp.insertAdjacentHTML('beforeend', `<span class="ojo">${ojo}</span>`); }
  }, 18);
}
chips.addEventListener('click', (e) => { const c = e.target.closest('.chip'); if (c) responder(c.textContent); });
document.getElementById('form-eva').addEventListener('submit', (e) => { e.preventDefault(); const v = document.getElementById('campo-eva').value.trim(); if (v) responder(v); });
resp.innerHTML = '<div class="respuesta__quien">EVA</div>Soy una inteligencia artificial: te ayudo a estudiar, investigar y revisar. Y te enseño a desconfiar de mí.';

/* ---------- Navegación entre escenas ---------- */
const escenas = [...document.querySelectorAll('.escena')];
const nav = document.querySelector('.nav');
const puntos = document.getElementById('puntos');
nav.innerHTML = escenas.map((s, k) => `<button data-ir="${k}"><i>0${k + 1}</i>${s.dataset.nombre}</button>`).join('');
puntos.innerHTML = escenas.map((s, k) => `<button data-ir="${k}" aria-label="${s.dataset.nombre}"></button>`).join('');
let actual = -1;
if (location.search.includes('captura')) document.body.classList.add('captura');
function ir(k, sinBarrido) {
  k = Math.max(0, Math.min(escenas.length - 1, k));
  if (k === actual) return;
  escenas.forEach((s, j) => { s.classList.toggle('activa', j === k); s.classList.toggle('antes', j < k); s.inert = j !== k; });
  document.querySelectorAll('[data-ir]').forEach((b) => { if (b.closest('.nav, .puntos')) b.setAttribute('aria-current', String(+b.dataset.ir === k)); });
  document.getElementById('barra').style.width = ((k + 1) / escenas.length * 100) + '%';
  document.getElementById('contador').innerHTML = `<b>0${k + 1}</b> / 0${escenas.length}`;
  if (!sinBarrido) { const b = document.getElementById('barrido'); b.classList.remove('va'); void b.offsetWidth; b.classList.add('va'); }
  actual = k;
  escenas.forEach((s, j) => s.querySelectorAll('svg').forEach((v) => { if (v.pauseAnimations) (j === k ? v.unpauseAnimations() : v.pauseAnimations()); }));
  history.replaceState(null, '', '#' + escenas[k].dataset.nombre.toLowerCase());
}
document.addEventListener('click', (e) => { const b = e.target.closest('[data-ir]'); if (b) { e.preventDefault(); ir(+b.dataset.ir); cerrar(); } });
document.getElementById('ant').onclick = () => ir(actual - 1);
document.getElementById('sig').onclick = () => ir(actual + 1);
const inicial = escenas.findIndex((s) => '#' + s.dataset.nombre.toLowerCase() === location.hash);
ir(inicial < 0 ? 0 : inicial, true);
addEventListener('hashchange', () => { const k = escenas.findIndex((s) => '#' + s.dataset.nombre.toLowerCase() === location.hash); if (k >= 0) ir(k); });

document.addEventListener('keydown', (e) => {
  const enCampo = e.target.matches('input');
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrir(); return; }
  if (e.key === 'Escape') { cerrar(); return; }
  if (enCampo || buscador.classList.contains('abierta')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); ir(actual + 1); }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); ir(actual - 1); }
  else if (e.key === 'Home') ir(0);
  else if (e.key === 'End') ir(escenas.length - 1);
  else if (/^[1-9]$/.test(e.key) && +e.key <= escenas.length) ir(+e.key - 1);
  else if (e.key === '/') { e.preventDefault(); abrir(); }
});
let ruedaLibre = true;
window.addEventListener('wheel', (e) => {
  if (!ruedaLibre || Math.abs(e.deltaY) < 24 || e.target.closest('.capa')) return;
  ruedaLibre = false; ir(actual + (e.deltaY > 0 ? 1 : -1)); setTimeout(() => (ruedaLibre = true), 900);
}, { passive: true });
let x0 = null, y0 = null;
window.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) ir(actual + (dx < 0 ? 1 : -1));
  x0 = null;
}, { passive: true });

/* ---------- Buscador ---------- */
const buscador = document.getElementById('buscador');
const campo = document.getElementById('campo-buscar');
const lista = document.getElementById('resultados');
const INDICE = [
  ...escenas.map((s, k) => ({ t: s.dataset.nombre, d: 'escena 0' + (k + 1), k })),
  ...CURSOS.map(([n, t]) => ({ t: 'Curso ' + n + ' · ' + t, d: 'Aprende', k: 1 })),
  { t: 'Videocápsulas', d: 'Aprende', k: 1 },
  { t: 'Guía docente', d: 'Docentes', k: 2 }, { t: 'Panel de sección', d: 'Docentes', k: 2 },
  { t: 'Lo que no se delega', d: 'EVA', k: 3 }, { t: 'Datos personales', d: 'EVA', k: 3 }, { t: 'Pregúntale a EVA', d: 'EVA', k: 3 },
];
function pintar() {
  const q = campo.value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const r = INDICE.filter((x) => x.t.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').includes(q)).slice(0, 9);
  lista.innerHTML = r.map((x, j) => `<li><button data-ir="${x.k}" class="${j ? '' : 'sel'}">${x.t}<small>${x.d}</small></button></li>`).join('') || '<li style="padding:12px;color:var(--texto2)">Nada con ese nombre.</li>';
}
function abrir() { buscador.classList.add('abierta'); campo.value = ''; pintar(); setTimeout(() => campo.focus(), 20); }
function cerrar() { buscador.classList.remove('abierta'); }
campo.addEventListener('input', pintar);
campo.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const b = lista.querySelector('button'); if (b) b.click(); } });
buscador.addEventListener('click', (e) => { if (e.target === buscador) cerrar(); });
document.getElementById('abrir-buscador').onclick = abrir;
document.getElementById('abrir-menu').onclick = abrir;

/* ---------- Chispas de fondo ---------- */
const lienzo = document.getElementById('chispas');
const cx = lienzo.getContext('2d');
let P = [];
function medir() {
  lienzo.width = innerWidth * devicePixelRatio; lienzo.height = innerHeight * devicePixelRatio;
  P = Array.from({ length: Math.round(innerWidth / 18) }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + .3, v: Math.random() * .00025 + .00008, a: Math.random() }));
}
medir(); addEventListener('resize', medir);
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
(function cuadro() {
  cx.clearRect(0, 0, lienzo.width, lienzo.height);
  for (const p of P) {
    if (!quieto) { p.y -= p.v; if (p.y < 0) p.y = 1; p.a += .01; }
    cx.globalAlpha = .25 + Math.sin(p.a) * .2;
    cx.fillStyle = p.r > 1.1 ? '#8a5cff' : '#00d1ff';
    cx.beginPath(); cx.arc(p.x * lienzo.width, p.y * lienzo.height, p.r * devicePixelRatio, 0, 7); cx.fill();
  }
  if (!quieto && innerWidth > 860) requestAnimationFrame(cuadro);
})();
