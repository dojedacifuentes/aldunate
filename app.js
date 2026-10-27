/* Maqueta «Plano azul»: escudo que se traza, cursos como plantas de cuatro módulos, guía docente y EVA. */
const NS = 'http://www.w3.org/2000/svg';
const $ = (s) => document.querySelector(s);
const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema: plano azul / hoja de dibujo ---------- */
const raiz = document.documentElement;
try { const t = localStorage.getItem('plano-azul:tema'); if (t) raiz.dataset.tema = t; } catch {}
if (location.search.includes('hoja')) raiz.dataset.tema = 'hoja';
$('#tema').addEventListener('click', () => {
  raiz.dataset.tema = raiz.dataset.tema === 'hoja' ? 'plano' : 'hoja';
  try { localStorage.setItem('plano-azul:tema', raiz.dataset.tema); } catch {}
});

/* ---------- Escudo ---------- */
const E = window.ESCUDO;
function cruz(x, y) {
  const a = 9, l = 34, r = 13, e = 6;
  return `<path transform="translate(${x} ${y})" pathLength="1" d="M${-a} ${-l + e} H${-r} V${-l - e} H${r} V${-l + e} H${a} V${-a} H${l - e} V${-r} H${l + e} V${r} H${l - e} V${a} H${a} V${l - e} H${r} V${l + e} H${-r} V${l - e} H${-a} V${a} H${-l + e} V${r} H${-l - e} V${-r} H${-l + e} V${-a} H${-a} Z"/>`;
}
const TRAZOS = [E.exterior, E.campo, E.escudete, E.campoInterior].map((d) => `<path pathLength="1" d="${d}"/>`).join('') + cruz(270, 212) + cruz(415, 212) + cruz(560, 212);
const LEMA = (id) => `
  <defs><path id="${id}-iz" d="${E.izquierda}"/><path id="${id}-de" d="${E.derecha}"/></defs>
  <g class="lema" fill="var(--trazo)" font-family="Times New Roman, serif">
    <text x="415" y="128" font-size="84" text-anchor="middle" letter-spacing="20">SS.CC</text>
    <text font-size="86"><textPath href="#${id}-iz" textLength="700" lengthAdjust="spacing">PRO JURE</textPath></text>
    <text font-size="86"><textPath href="#${id}-de" textLength="770" lengthAdjust="spacing">AEQUITATE</textPath></text>
    <text x="415" y="1038" font-size="84" text-anchor="middle" letter-spacing="6">ET</text>
  </g>`;

$('#escudo-mini').innerHTML = `<g fill="none" stroke="var(--trazo)" stroke-width="22" stroke-linejoin="round"><path d="${E.exterior}"/><path d="${E.escudete}"/></g>`;

const cota = (x1, y1, x2, y2, texto, tx, ty, giro = 0) => `
  <g class="capa-cotas">
    <path class="cota" d="M${x1} ${y1} L${x2} ${y2}"/>
    <path class="cota" d="M${x1 - (y1 === y2 ? 0 : 14)} ${y1 - (y1 === y2 ? 14 : 0)} l${y1 === y2 ? 0 : 28} ${y1 === y2 ? 28 : 0} M${x2 - (y1 === y2 ? 0 : 14)} ${y2 - (y1 === y2 ? 14 : 0)} l${y1 === y2 ? 0 : 28} ${y1 === y2 ? 28 : 0}"/>
    <text class="cota-t" x="${tx}" y="${ty}" text-anchor="middle" font-size="26" transform="rotate(${giro} ${tx} ${ty})">${texto}</text>
  </g>`;
const llamada = (x1, y1, x2, y2, texto, ancla = 'start') => `
  <g class="capa-cotas">
    <path class="cota" d="M${x1} ${y1} L${x2} ${y2} H${x2 + (ancla === 'start' ? 70 : -70)}"/>
    <circle cx="${x1}" cy="${y1}" r="5" fill="var(--texto-2)"/>
    <text class="cota-t" x="${x2 + (ancla === 'start' ? 78 : -78)}" y="${y2 + 8}" font-size="24" text-anchor="${ancla}">${texto}</text>
  </g>`;

$('#escudo-grande').innerHTML = `
  <g class="capa-relleno" style="opacity:0;transition:opacity .4s">
    <path d="${E.campo}" fill="var(--relleno)"/><path d="${E.campoInterior}" fill="var(--relleno-2)"/>
  </g>
  <g class="trazo-escudo" fill="none" stroke="var(--trazo)" stroke-width="4" stroke-linejoin="round">${TRAZOS}<path pathLength="1" d="${E.leon}" stroke-width="3.5"/></g>
  <g class="lema-capa" style="transition:opacity .4s">${LEMA('g')}</g>
  ${cota(20, -40, 810, -40, '830', 415, -52)}
  ${cota(-70, 6, -70, 1088, '1090', -86, 547, -90)}
  ${llamada(560, 212, 760, 140, 'TRES CRUCES')}
  ${llamada(415, 520, 880, 600, 'CAMPO INTERIOR')}
  ${llamada(104, 600, -40, 1160, 'LEMA', 'start')}`;

const trazos = [...document.querySelectorAll('.trazo-escudo path')];
trazos.forEach((p) => { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
const lema = $('.lema-capa');
const avance = $('#avance');
function trazar(v) {
  // Cada trazo empieza un poco después del anterior: el escudo se dibuja por partes, de afuera hacia adentro.
  trazos.forEach((p, k) => {
    const ini = k / trazos.length * 55;
    const t = Math.max(0, Math.min(1, (v - ini) / 45));
    p.style.strokeDashoffset = String(1 - t);
  });
  lema.style.opacity = v > 80 ? (v - 80) / 20 : 0;
  avance.value = v;
}
avance.addEventListener('input', () => { cancelAnimationFrame(animacion); trazar(+avance.value); });
let animacion;
function dibujar() {
  cancelAnimationFrame(animacion);
  if (quieto) { trazar(100); return; }
  const t0 = performance.now();
  (function paso(t) {
    const v = Math.min(100, (t - t0) / 3200 * 100);
    trazar(v);
    if (v < 100) animacion = requestAnimationFrame(paso);
  })(t0);
}
$('#dibujar').addEventListener('click', dibujar);
document.querySelectorAll('[data-capa]').forEach((b) => b.addEventListener('click', () => {
  const on = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', String(on));
  const capa = b.dataset.capa;
  if (capa === 'linea') document.querySelector('.trazo-escudo').style.opacity = on ? 1 : 0;
  if (capa === 'relleno') $('.capa-relleno').style.opacity = on ? 1 : 0;
  if (capa === 'cotas') document.querySelectorAll('.capa-cotas').forEach((g) => (g.style.opacity = on ? 1 : 0));
}));
trazar(0);
setTimeout(dibujar, location.search.includes('captura') ? 0 : 400);

/* ---------- Cursos: cada curso es una planta de cuatro módulos ---------- */
// Títulos del catálogo de eva.derecho (src/content/catalogo.ts).
const CURSOS = [
  ['Qué es la IA', '¿Qué dice la ley que es, qué no sabe nadie y de dónde viene la palabra?', ['Las definiciones de las leyes', 'Las dudas recientes: ¿entiende?', 'Lo propio de la IA', 'De dónde viene «inteligencia»']],
  ['Cómo funciona y por qué se equivoca', 'Ponla a tomarte el examen y mira dónde falla.', ['¿Qué es una IA?', 'La siguiente palabra', 'Por qué inventa', 'Cómo pedirle bien']],
  ['Estudiar y trabajar sin perder el criterio', 'Un tutor que pregunta, no que responde por ti.', ['Un tutor que pregunta', 'Analizar un fallo', 'Antes de subir', 'Lo que no se delega']],
  ['Investigación jurídica con IA', 'Fuentes chilenas, citas y fallos reales.', ['Verificar antes de firmar', 'Buscar en fuentes chilenas', 'Jurisprudencia real', 'Documentar la investigación']],
  ['Crea tus herramientas jurídicas', 'De una idea jurídica a una herramienta publicada.', ['De la idea a la herramienta', 'Tu primera herramienta', 'Pruébala antes de confiar', 'Publica con sus límites']],
  ['Ética profesional y responsabilidad', 'Cuando la IA se equivoca, ¿quién responde?', ['Secreto profesional', 'Diligencia', 'Transparencia con el cliente', 'Quién responde']],
  ['Prueba digital y deepfakes', 'Autenticidad, cadena de custodia y peritaje.', ['Qué es un deepfake', 'Autenticidad y custodia', 'Cuándo pedir un peritaje', 'Valorar la prueba']],
  ['Regulación de la IA', 'Chile y el mundo: riesgo, datos y derechos.', ['El modelo europeo', 'El proyecto chileno', 'Datos personales e IA', 'Derechos fundamentales']],
];
const n2 = (k) => String(k).padStart(2, '0');
$('#filas').innerHTML = CURSOS.map(([t, p], k) => `
  <tr class="fila" tabindex="0" data-curso="${k}" aria-selected="${k === 0}">
    <td class="n">${n2(k + 1)}</td><td class="t">${t}<small>${p}</small></td><td class="m">Curso ${k} · 4</td>
  </tr>`).join('');

function partir(texto, max = 20) {
  const lineas = []; let l = '';
  for (const p of texto.split(' ')) { if ((l + ' ' + p).trim().length > max) { lineas.push(l.trim()); l = p; } else l += ' ' + p; }
  if (l.trim()) lineas.push(l.trim());
  return lineas.slice(0, 3);
}
function planta(k) {
  const [t, p, mods] = CURSOS[k];
  // Cuatro salas en torno a un pasillo; la sala 1 es la de entrada.
  const salas = [[20, 40, 230, 120], [270, 40, 230, 120], [20, 190, 140, 120], [180, 190, 320, 120]];
  const svg = `
    <path class="cota" d="M20 18 H500 M20 12 v12 M500 12 v12"/>
    <text class="cota-t" x="260" y="12" text-anchor="middle">CURSO ${k} · 4 MÓDULOS</text>
    <rect x="20" y="40" width="480" height="270" fill="none" stroke="var(--trazo)" stroke-width="3"/>
    <path d="M20 170 H500 M20 180 H500" stroke="var(--linea-2)" stroke-dasharray="4 5"/>
    <text class="cota-t" x="260" y="178" text-anchor="middle">PASILLO</text>
    ${salas.map(([x, y, w, h], j) => `
      <g class="sala" data-sala="${j}">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${j === 0 ? 'var(--relleno-2)' : 'var(--relleno)'}" stroke="var(--trazo)" stroke-width="1.5"/>
        <path d="M${x + 24} ${j < 2 ? y + h : y} h30" stroke="var(--fondo-2)" stroke-width="4"/>
        <path d="M${x + 24} ${j < 2 ? y + h : y} a30 30 0 0 ${j < 2 ? 0 : 1} 30 ${j < 2 ? -30 : 30}" fill="none" stroke="var(--texto-2)" stroke-width="1"/>
        <text x="${x + 12}" y="${y + 22}" class="cota-t" style="fill:var(--acento)">MÓDULO ${k}.${j + 1}</text>
        ${partir(mods[j], w > 200 ? 26 : 16).map((l, i) => `<text x="${x + 12}" y="${y + 46 + i * 17}" font-size="14" fill="var(--texto)" font-family="Inter Tight, sans-serif">${l}</text>`).join('')}
      </g>`).join('')}
    <path d="M36 310 v14 M36 324 l-6 -8 M36 324 l6 -8" stroke="var(--texto-2)" fill="none"/>
    <text class="cota-t" x="48" y="324">ENTRADA</text>
    <text class="cota-t" x="500" y="324" text-anchor="end">PLANTA · 1:200</text>`;
  $('#planta').innerHTML = svg;
  $('#planta-titulo').textContent = `${n2(k + 1)} — ${t}`;
  $('#planta-sub').textContent = `Planta del curso ${k} · 4 módulos`;
  $('#planta-texto').textContent = p;
  document.querySelectorAll('.fila').forEach((f) => f.setAttribute('aria-selected', String(+f.dataset.curso === k)));
}
document.querySelectorAll('.fila').forEach((f) => {
  const elegir = () => planta(+f.dataset.curso);
  f.addEventListener('mouseenter', elegir); f.addEventListener('focus', elegir); f.addEventListener('click', elegir);
});
planta(0);

/* ---------- Docentes ---------- */
const PASOS = [
  ['Antes', 'Comparte la videocápsula 1.1 (5 min) y pide a cada estudiante una pregunta de examen que crea que la IA no puede responder.'],
  ['Durante', 'En grupos, le toman el examen a la IA con sus preguntas. Cada grupo anota una respuesta que suena segura y está mal, y cómo lo comprobó.'],
  ['Después', 'Cierre de 10 minutos: ¿qué error costó más ver? Cada uno lo escribe en su bitácora. En el panel ves quién terminó el módulo.'],
  ['Revisa tú', 'Las respuestas «correctas» contra la fuente, y el contenido jurídico del módulo: la guía marca qué cotejar.'],
];
const pasos = $('#pasos');
pasos.innerHTML = PASOS.map(([t, p], k) => `<li class="${k === 0 ? 'abierto' : ''}"><button aria-expanded="${k === 0}"><span class="mono">${n2(k + 1)}</span>${t}</button><p>${p}</p></li>`).join('');
pasos.addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  pasos.querySelectorAll('li').forEach((li) => { const yo = li.contains(b); li.classList.toggle('abierto', yo); li.querySelector('button').setAttribute('aria-expanded', String(yo)); });
});

const MODULOS = [['1.1', '¿Qué es una IA?', 92], ['1.2', 'La siguiente palabra', 74], ['1.3', 'Por qué inventa', 51], ['1.4', 'Cómo pedirle bien', 18]];
$('#panel').innerHTML = `
  ${[0, 25, 50, 75, 100].map((v) => `<path d="M${180 + v * 3.2} 30 V300" stroke="var(--linea-2)" stroke-dasharray="${v % 50 ? '2 5' : ''}"/><text class="cota-t" x="${180 + v * 3.2}" y="20" text-anchor="middle">${v}%</text>`).join('')}
  ${MODULOS.map(([n, t, v], k) => {
    const y = 50 + k * 62;
    return `<text class="cota-t" x="0" y="${y + 10}" style="fill:var(--acento)">MÓD. ${n}</text>
      <text x="0" y="${y + 30}" font-size="14" fill="var(--texto)" font-family="Inter Tight, sans-serif">${t}</text>
      <rect class="barra-fondo" x="180" y="${y}" width="320" height="26"/>
      <rect class="barra" x="180" y="${y}" width="${v * 3.2}" height="26"><animate attributeName="width" from="0" to="${v * 3.2}" dur="1.6s" begin="indefinite" fill="freeze" class="crece"/></rect>
      <text class="cota-t" x="${186 + v * 3.2}" y="${y + 18}">${v}%</text>`;
  }).join('')}
  <path d="M0 316 H560" stroke="var(--trazo)"/>
  <text class="cota-t" x="0" y="340">ERRORES ENCONTRADOS · 71 DE 112</text>
  <text class="cota-t" x="560" y="340" text-anchor="end" style="fill:var(--acento)">EVA SUGIERE: REPASAR EL 1.3</text>`;

/* ---------- EVA ---------- */
const RESPUESTAS = {
  '¿Pego aquí un escrito con datos del cliente?': ['no', 'No', 'Primero quita nombres, RUT y domicilios. Lo que entra a una IA puede salir de tu control: secreto profesional y datos personales.', 'Ojo: anonimiza antes de pegar, siempre.'],
  '¿Puedo usar IA en mi tesis?': ['dep', 'Depende', 'Para ordenar ideas, buscar contraargumentos y revisar la redacción, sí. Para escribir el capítulo por ti, no: lo que firmas tiene que ser tuyo. Y se declara.', 'Ojo: pregúntale a tu profesor guía qué permite tu programa.'],
  '¿Basta con que cites un fallo?': ['no', 'No', 'Puedo inventar un rol que suena perfecto. Ábrelo tú en el buscador del Poder Judicial antes de citarlo.', 'Ojo: nunca cites un rol que no hayas abierto tú.'],
  'Resume esta sentencia': ['si', 'Sí', 'Pega el texto y te devuelvo hechos, decisión y razonamiento en una página. Después compáralo con el fallo: los resúmenes también se equivocan.', 'Ojo: el resumen no reemplaza la lectura.'],
};
const sug = $('#sugerencias');
const resp = $('#respuesta');
sug.innerHTML = Object.keys(RESPUESTAS).map((q) => `<button type="button" aria-pressed="false">${q}</button>`).join('');
let escribiendo;
function responder(q) {
  const [clase, ver, texto, ojo] = RESPUESTAS[q] || ['dep', 'Maqueta', 'En esta maqueta sólo respondo las sugerencias. En la plataforma real, cada respuesta trae su advertencia y sus fuentes.', 'Ojo: verifica todo lo que te diga.'];
  clearInterval(escribiendo);
  sug.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.textContent === q)));
  resp.innerHTML = `<span class="mono">EVA</span><span class="veredicto v-${clase}">${ver}</span><span id="t"></span>`;
  const t = resp.querySelector('#t');
  let n = 0;
  escribiendo = setInterval(() => {
    n += 3; t.textContent = texto.slice(0, n);
    if (n >= texto.length) { clearInterval(escribiendo); resp.insertAdjacentHTML('beforeend', `<span class="ojo">${ojo}</span>`); }
  }, quieto ? 0 : 16);
}
sug.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) responder(b.textContent); });
$('#form-eva').addEventListener('submit', (e) => { e.preventDefault(); const v = $('#campo-eva').value.trim(); if (v) responder(v); });
resp.innerHTML = '<span class="mono">EVA</span>Soy una inteligencia artificial: te ayudo a estudiar, investigar y revisar. Y te enseño a desconfiar de mí.';

/* ---------- Aparición al bajar ---------- */
const vistos = new IntersectionObserver((entradas) => entradas.forEach((en) => {
  if (!en.isIntersecting) return;
  en.target.classList.add('visto');
  en.target.querySelectorAll('.crece').forEach((a) => a.beginElement());
  vistos.unobserve(en.target);
}), { threshold: .15 });
document.querySelectorAll('.aparece').forEach((el) => vistos.observe(el));
if (location.search.includes('captura')) document.querySelectorAll('.aparece').forEach((el) => { el.classList.add('visto'); el.querySelectorAll('.crece').forEach((a) => a.beginElement()); });
