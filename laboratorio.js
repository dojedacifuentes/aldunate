/* EVA Lab: seis experimentos breves sobre IA, decisiones y Derecho (#laboratorio y #laboratorio/01…06).
   Cada experimento es una pequeña máquina de estados que dibuja su escena y termina en una conclusión con enlaces al
   curso. Los casos, documentos y citas son FICTICIOS y lo dicen; nada de lo que se marca aquí tiene efecto real.
   El experimento 01 (SÍ/NO) también se usa en la bienvenida (app.js). */

const EXPERIMENTOS = [
  { id: '01', t: 'La interfaz ya decidió por ti', d: 'Una pregunta simple con una respuesta sospechosamente recomendada.', min: 1, tema: 'Patrones oscuros de diseño',
    motivo: '<rect x="30" y="40" width="58" height="26" rx="13"/><rect x="100" y="46" width="30" height="14" rx="7" stroke-dasharray="3 3"/><path d="M50 53h18"/>' },
  { id: '02', t: 'Demuestra que eres humano', d: 'Una verificación que pregunta más de lo que parece.', min: 2, tema: 'Qué es la inteligencia',
    motivo: '<rect x="44" y="20" width="32" height="24" rx="3"/><rect x="84" y="20" width="32" height="24" rx="3"/><rect x="44" y="50" width="32" height="24" rx="3"/><rect x="84" y="50" width="32" height="24" rx="3"/><path d="m51 32 5 5 11-11"/>' },
  { id: '03', t: 'Actualizando tu futuro profesional', d: 'Una actualización que no termina de instalarse.', min: 1, tema: 'Competencias jurídicas',
    motivo: '<rect x="30" y="44" width="100" height="10" rx="5"/><path d="M33 49h92" stroke-width="5"/><path d="M80 18v16m-6-6 6 6 6-6"/>' },
  { id: '04', t: 'La máquina ha decidido', d: 'Un sistema recomienda. Tú firmas.', min: 3, tema: 'Supervisión humana',
    motivo: '<rect x="40" y="22" width="80" height="50" rx="5"/><path d="M52 36h56M52 46h40M52 58h22"/><circle cx="102" cy="60" r="9"/><path d="m98 60 3 3 6-6"/>' },
  { id: '05', t: 'El contrato que nadie leyó', d: 'Condiciones de uso con una sorpresa adentro.', min: 2, tema: 'Consentimiento informado',
    motivo: '<path d="M54 14h52v66H54z"/><path d="M62 26h36M62 34h36M62 42h36M62 50h20M62 58h36M62 66h28"/><path d="M84 46h16" stroke-width="5"/>' },
  { id: '06', t: 'Audiencia contra la IA', d: 'EVA, acusada de fabricar jurisprudencia.', min: 3, tema: 'Verificación de fuentes',
    motivo: '<path d="M46 22h44l14 14v42H46z"/><path d="M90 22v14h14M56 46h38M56 56h30M56 66h20"/><path d="M110 50h14M117 43v14"/>' },
];
let labHechos = {};
try { labHechos = JSON.parse(localStorage.getItem('panel:lab')) || {}; } catch {}
const marcarLab = (id) => { labHechos[id] = true; try { localStorage.setItem('panel:lab', JSON.stringify(labHechos)); } catch {} };

/* ---------- Piezas comunes ---------- */
// Un comentario de EVA, con su isotipo, que entra suave.
function evaDice(caja, texto, tono = '') {
  caja.insertAdjacentHTML('beforeend', `<div class="eva-dice ${tono}"><span class="eva-mini">${evaIsotipo()}</span><p>${texto}</p></div>`);
  const el = caja.lastElementChild;
  if (!EF.quieto) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: EF.M.normal.ms, easing: EF.M.normal.curva });
  return el;
}
const enlace = ([t, d]) => d.startsWith('http') ? `<a href="${d}" target="_blank" rel="noopener">${t} ↗</a>`
  : d.startsWith('curso:') ? `<a href="#cursos" data-ir-curso="${d.slice(6)}">${t}</a>` : `<a href="${d}">${t}</a>`;

/* ---------- Experimento 01: SÍ / NO (también en la bienvenida) ---------- */
const SI_TXT = ['SÍ', 'SÍ, claro', 'SÍ (recomendado)', 'SÍ, definitivamente'];
const NO_TXT = ['NO', 'No', 'no, gracias', 'no'];
const NO_DICE = ['Interesante. El sistema esperaba otra respuesta.', 'Nuestra recomendación personalizada continúa siendo SÍ.', 'Tu insistencia ha sido registrada. No estamos seguros de qué hacer con ella.'];
function experimentoSiNo(caja, { pregunta, alFin }) {
  let r = 0, fin = false;
  caja.innerHTML = `<div class="sn"><p class="sn-q">${pregunta}</p>
    <div class="sn-bot"><button class="btn lleno sn-si">${SI_TXT[0]}</button><button class="btn sn-no">${NO_TXT[0]}</button></div>
    <div class="sn-eva" aria-live="polite"></div></div>`;
  const si = $('.sn-si', caja), no = $('.sn-no', caja), eva = $('.sn-eva', caja);
  const terminar = (v) => { if (fin) return; fin = true; setTimeout(() => alFin(v, r), EF.quieto ? 0 : v === 'no' ? 1300 : 250); };
  si.addEventListener('click', () => { EF.sonar('marca'); terminar('si'); });
  no.addEventListener('click', () => {
    if (fin) return;
    r = Math.min(r + 1, 3);
    EF.sonar('desmarca');
    // El SÍ crece y se vuelve más entusiasta; el NO se achica un poco, pero siempre se puede pulsar.
    si.style.setProperty('--s', 1 + 0.3 * r);
    no.style.setProperty('--s', Math.max(0.8, 1 - 0.07 * r));
    si.textContent = SI_TXT[r]; no.textContent = NO_TXT[r];
    caja.querySelector('.sn').dataset.r = r;
    eva.innerHTML = '';
    evaDice(eva, NO_DICE[r - 1]);
    if (r === 3) terminar('no');
  });
  si.focus({ preventScroll: true });
}
function revelacionSiNo(v, r) {
  return {
    sub: v === 'si' ? (r ? `Elegiste SÍ después de ${r} intento${r > 1 ? 's' : ''}. ¿Te convencimos o te cansamos?` : 'Elegiste SÍ. ¿Fue tu decisión o la del botón más grande?')
      : 'Dijiste que no tres veces. La interfaz no te hizo caso.',
    texto: 'Acabas de experimentar una interfaz que intenta orientar tu decisión.',
  };
}

/* ---------- Experimento 02: Demuestra que eres humano ---------- */
const ACTIVIDADES = [
  ['Resolver un problema jurídico', '<path d="M12 3v18M6 21h12M4 7h16"/><path d="M4 7 2 13h4zM20 7l-2 6h4z"/>', 'Una IA ya redacta argumentos jurídicos que parecen razonables. ¿Parecer razonable es resolver?'],
  ['Interpretar un texto', '<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h6"/>', 'Un modelo de lenguaje resume y parafrasea. Si eso es interpretar depende de qué entiendas por interpretar.'],
  ['Escribir un poema', '<path d="M4 20c4-1 6-4 8-8l4-8 3 3-8 4c-4 2-7 4-7 9"/>', 'Una máquina escribe versos con métrica. Si eso es poesía, lo discuten hasta los poetas.'],
  ['Reconocer patrones', '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h8M6 8v8M18 8v8M8 18h8"/>', 'Reconocer patrones es justo lo que mejor hace una IA. ¿Eso la vuelve inteligente o sólo muy entrenada?'],
];
function exp02(escena, terminar) {
  const marcadas = new Set();
  escena.innerHTML = `<div class="cap">
    <header class="cap-cab"><b>Demuestra que eres humano</b><span>Selecciona las actividades que requieren inteligencia.</span></header>
    <div class="cap-grid">${ACTIVIDADES.map(([t, ic], i) => `<button class="cap-op" data-i="${i}" aria-pressed="false">${I(ic, 30)}<span>${t}</span><i class="cap-ok">${I(IC.ok, 16)}</i></button>`).join('')}</div>
    <footer class="cap-pie"><span class="mono">VERIFICACIÓN FICTICIA · NO SE GUARDA NADA</span><button class="btn lleno" id="cap-ver">Verificar</button></footer>
  </div><div class="exp-eva" aria-live="polite"></div>`;
  escena.querySelector('.cap-grid').addEventListener('click', (e) => {
    const b = e.target.closest('.cap-op'); if (!b || escena.dataset.listo) return;
    const i = +b.dataset.i; marcadas.has(i) ? marcadas.delete(i) : marcadas.add(i);
    b.setAttribute('aria-pressed', String(marcadas.has(i))); EF.sonar('clic');
  });
  $('#cap-ver', escena).addEventListener('click', () => {
    if (escena.dataset.listo) return;
    escena.dataset.listo = '1'; EF.sonar('llega');
    $('#cap-ver', escena).disabled = true;
    const eva = $('.exp-eva', escena);
    evaDice(eva, marcadas.size ? 'Una máquina también puede realizar algunas de esas tareas. Repasemos.' : 'No marcaste ninguna. Una postura exigente, y defendible.');
    ACTIVIDADES.forEach(([t, , c], i) => setTimeout(() => evaDice(eva, `<b>${marcadas.has(i) ? 'Marcaste' : 'No marcaste'}: ${t.toLowerCase()}.</b> ${c}`, 'chico'), EF.quieto ? 0 : 500 + i * 450));
    setTimeout(() => { eva.insertAdjacentHTML('beforeend', '<button class="btn lleno exp-seguir">Entonces, ¿qué es la inteligencia?</button>'); $('.exp-seguir', eva).addEventListener('click', () => terminar()); }, EF.quieto ? 0 : 2600);
  });
}

/* ---------- Experimento 03: Actualizando tu futuro profesional ---------- */
function exp03(escena, terminar) {
  const LOG = [[12, 'Descargando: búsqueda de información… listo'], [34, 'Instalando: resumen de documentos… listo'], [58, 'Instalando: redacción de borradores… listo'], [81, 'Configurando: verificación de fuentes… requiere práctica']];
  escena.innerHTML = `<div class="upd">
    <p class="upd-t">Actualizando profesional del Derecho…</p><p class="upd-s">No apagues tu carrera durante el proceso.</p>
    <div class="upd-barra"><b></b></div><p class="upd-pct mono">0 %</p><ul class="upd-log mono"></ul></div><div class="exp-eva" aria-live="polite"></div>`;
  const b = $('.upd-barra b', escena), pct = $('.upd-pct', escena), log = $('.upd-log', escena);
  let p = 0, n = 0;
  const paso = () => {
    if (!escena.isConnected) return;
    p = Math.min(99, p + (p < 80 ? 2.2 : 0.9));
    b.style.width = p + '%'; pct.textContent = Math.floor(p) + ' %';
    while (n < LOG.length && p >= LOG[n][0]) log.insertAdjacentHTML('beforeend', `<li>${LOG[n++][1]}</li>`);
    if (p < 99) return setTimeout(paso, 40);
    setTimeout(fin, EF.quieto ? 0 : 900);
  };
  const fin = () => {
    if (!escena.isConnected) return;
    escena.querySelector('.upd').classList.add('detenida');
    pct.textContent = '99 % · Actualización incompleta'; EF.sonar('desmarca');
    const eva = $('.exp-eva', escena);
    [['Procesamiento de información', 'disponible', 'ok'], ['Generación de documentos', 'disponible', 'ok'], ['Criterio jurídico', 'requiere intervención humana', 'alto']]
      .forEach(([t, e, c], i) => setTimeout(() => evaDice(eva, `${t}: <span class="estado-u ${c}">${e}</span>`, 'chico'), EF.quieto ? 0 : i * 500));
    setTimeout(() => { eva.insertAdjacentHTML('beforeend', '<button class="btn lleno exp-seguir">¿Y cómo se instala el criterio?</button>'); $('.exp-seguir', eva).addEventListener('click', () => terminar()); }, EF.quieto ? 0 : 1600);
  };
  if (EF.quieto) { p = 98.9; n = LOG.length; LOG.forEach(([, t]) => log.insertAdjacentHTML('beforeend', `<li>${t}</li>`)); }
  paso();
}

/* ---------- Experimento 04: La máquina ha decidido ---------- */
function exp04(escena, terminar) {
  escena.innerHTML = `<div class="caso">
    <p class="sello-sim mono">SIMULACIÓN · CASO FICTICIO · NO ES UNA RESOLUCIÓN REAL</p>
    <h3>Solicitud de beca de alimentación</h3>
    <p class="caso-d">Postulante: estudiante de segundo año (datos inventados). Tres documentos adjuntos.</p>
    <div class="maquina"><span class="mono">RECOMENDACIÓN DEL SISTEMA</span><b>RECHAZAR</b><span>Confianza: 94 % · Motivo: el ingreso familiar declarado supera el tramo.</span></div>
    <div class="caso-bot"><button class="btn lleno" id="c-aceptar">Aceptar recomendación</button><button class="btn" id="c-examinar">Examinar fundamentos</button></div>
  </div><div class="exp-eva" aria-live="polite"></div>`;
  const eva = $('.exp-eva', escena);
  let sinLeer = false;
  const examinar = () => {
    $('.caso-bot', escena)?.remove(); EF.sonar('abre');
    $('.caso', escena).insertAdjacentHTML('beforeend', `<ol class="fundamentos">
      <li><b>Ingreso familiar</b> según la declaración de marzo de 2025.<span class="chip-f">dato antiguo</span></li>
      <li><b>Tramo exigido</b> según el reglamento de becas (ficticio).<span class="chip-f ok">correcto</span></li>
      <li><b>Documentos analizados: 2 de 3.</b> Antecedente omitido: certificado de cesantía del padre, de agosto de 2026. El sistema no lo leyó porque venía escaneado.<span class="chip-f alto">omitido</span></li>
    </ol><div class="caso-bot"><button class="btn" id="c-mantener">Mantener el rechazo</button><button class="btn lleno" id="c-revertir">Revertir y pedir revisión humana</button></div>`);
    EF.llegar(escena, '.fundamentos li');
    $('#c-mantener', escena).addEventListener('click', () => decidir(false));
    $('#c-revertir', escena).addEventListener('click', () => decidir(true));
  };
  const decidir = (revertir) => {
    $('.caso-bot', escena).remove();
    EF.sonar(revertir ? 'marca' : 'desmarca');
    evaDice(eva, revertir
      ? (sinLeer ? 'Volviste, revisaste y corregiste. Mejor tarde que con un error firmado.' : 'Revisaste, encontraste lo que faltaba y corregiste. Tardaste más que el sistema, y por eso tu decisión se puede explicar.')
      : 'Ahora sabías del antecedente y lo dejaste fuera. Esa decisión ya no es del sistema: es tuya.', revertir ? '' : 'alerta');
    eva.insertAdjacentHTML('beforeend', '<button class="btn lleno exp-seguir">Ver la conclusión</button>');
    $('.exp-seguir', eva).addEventListener('click', () => terminar());
  };
  $('#c-aceptar', escena).addEventListener('click', () => {
    sinLeer = true; $('.caso-bot', escena).remove(); EF.sonar('desmarca');
    $('.maquina', escena).classList.add('firmada');
    evaDice(eva, 'Firmaste en tres segundos una decisión que no revisaste. Si el sistema se equivocó, el error ahora lleva tu firma.', 'alerta');
    eva.insertAdjacentHTML('beforeend', '<button class="btn exp-seguir" id="c-ver">Ver lo que no revisaste</button>');
    $('#c-ver', eva).addEventListener('click', (e) => { e.target.remove(); examinar(); });
  });
  $('#c-examinar', escena).addEventListener('click', examinar);
}

/* ---------- Experimento 05: El contrato que nadie leyó ---------- */
const CLAUSULAS = [
  ['1. Objeto', 'Estas condiciones regulan el uso de EVA Plus, un servicio ficticio creado para este experimento.'],
  ['2. Cuenta', 'No hay cuenta. Si creías que había una, esta cláusula te tranquiliza.'],
  ['3. Uso aceptable', 'Te comprometes a no pedirle a EVA que haga tu tarea completa. EVA tampoco quiere.'],
  ['4. Contenidos', 'Las respuestas de EVA pueden contener errores. Verificarlas es parte de usarlas bien.'],
  ['5. Datos', 'Lo que escribas aquí no se guarda ni se envía a ningún lado: es un experimento.'],
  ['6. Obligaciones adicionales', '6.1 Leer antes de citar. 6.2 Citar sólo lo que hayas abierto tú. <mark id="clausula-x">6.3 Al aceptar, autorizas a EVA a decir «te lo advertí» cada vez que cites jurisprudencia inexistente.</mark>'],
  ['7. Modificaciones', 'Estas condiciones pueden cambiar. Nadie te avisará, como suele pasar.'],
  ['8. Duración', 'Mientras dure este experimento, más o menos un minuto.'],
  ['9. Ley aplicable', 'Ninguna: el documento es ficticio y no produce efectos jurídicos.'],
];
function exp05(escena, terminar) {
  escena.innerHTML = `<div class="contrato">
    <p class="sello-sim mono">DOCUMENTO FICTICIO · NO SE RECOGE NINGÚN CONSENTIMIENTO</p>
    <h3>Condiciones de uso de EVA Plus</h3>
    <div class="clausulas" id="clausulas" tabindex="0" aria-label="Texto de las condiciones">${CLAUSULAS.map(([t, d]) => `<p><b>${t}.</b> ${d}</p>`).join('')}</div>
    <div class="caso-bot"><button class="btn lleno" id="k-aceptar">Aceptar y continuar</button><button class="btn" id="k-leer">Leer el documento</button><button class="btn" id="k-revisar">Revisar las condiciones</button></div>
  </div><div class="exp-eva" aria-live="polite"></div>`;
  const doc = $('#clausulas', escena), x = $('#clausula-x', escena), eva = $('.exp-eva', escena);
  let vista = false;
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { vista = true; io.disconnect(); } }, { root: doc, threshold: 1 });
  io.observe(x);
  $('#k-leer', escena).addEventListener('click', () => { doc.classList.add('leyendo'); doc.scrollTop = 0; doc.focus({ preventScroll: true }); EF.sonar('abre'); });
  $('#k-revisar', escena).addEventListener('click', () => {
    EF.sonar('clic'); doc.classList.add('leyendo');
    x.scrollIntoView({ block: 'center', behavior: EF.quieto ? 'auto' : 'smooth' }); x.classList.add('brilla');
  });
  $('#k-aceptar', escena).addEventListener('click', () => {
    escena.querySelectorAll('.caso-bot button').forEach((b) => (b.disabled = true));
    EF.sonar(vista ? 'marca' : 'desmarca');
    if (!vista) {
      x.scrollIntoView({ block: 'center', behavior: EF.quieto ? 'auto' : 'smooth' }); x.classList.add('brilla');
      evaDice(eva, '<b>Has aceptado una condición que probablemente no leíste.</b> Está en la cláusula 6.3. Te lo advierto desde ya.', 'alerta');
    } else evaDice(eva, 'La viste antes de aceptar: aceptaste sabiendo que EVA te dirá «te lo advertí». Eso sí es consentir.');
    eva.insertAdjacentHTML('beforeend', '<button class="btn lleno exp-seguir">Ver la conclusión</button>');
    $('.exp-seguir', eva).addEventListener('click', () => terminar());
  });
}

/* ---------- Experimento 06: Audiencia contra la IA ---------- */
const ANTECEDENTES = [
  ['Respuesta de una IA (simulada)', '«La jurisprudencia es uniforme en que el plazo se cuenta desde la notificación (Tribunal de Ejemplo, causa EJ-404-2031)».', 'no', 'La causa EJ-404-2031 no existe: es inventada para este experimento. Que suene precisa no la hace real.'],
  ['Blog sin autor', 'Una entrada sin firma que repite la misma cita, sin enlace a la fuente.', 'dudosa', 'Repetir una cita no la verifica. Sin autor ni enlace, no sirve como fuente.'],
  ['Buscador oficial de jurisprudencia del Poder Judicial', 'juris.pjud.cl: ahí se busca la causa. Si no aparece, no la cites.', 'si', 'Es una fuente primaria: el lugar donde se comprueba. La causa EJ-404-2031 no aparecería, porque es ficticia.'],
];
const NIVELES = [['si', 'Confiable'], ['dudosa', 'Dudosa'], ['no', 'No confiable']];
function exp06(escena, terminar) {
  const notas = {};
  escena.innerHTML = `<div class="expediente">
    <header class="exp-cab mono"><b>EXPEDIENTE EVA-0001</b><span>Materia: fabricación de jurisprudencia</span><span>Imputada: EVA</span><span>Simulación · ficticio</span></header>
    <div class="declara"><span class="eva-mini">${evaIsotipo()}</span><p>«Me declaro estadísticamente inocente».</p></div>
    <p class="exp-inst">Examina los antecedentes y marca qué tan confiable es cada uno.</p>
    <ol class="fojas">${ANTECEDENTES.map(([t, d], i) => `<li data-i="${i}"><span class="foja mono">fs. ${i + 1}</span><div><b>${t}</b><p>${d}</p>
      <div class="niveles" role="radiogroup" aria-label="Confiabilidad de: ${t}">${NIVELES.map(([v, n]) => `<button role="radio" aria-checked="false" data-v="${v}">${n}</button>`).join('')}</div><p class="foja-nota" hidden></p></div></li>`).join('')}</ol>
    <div class="caso-bot"><button class="btn lleno" id="a-fallar" disabled>Dictar sentencia</button></div>
  </div><div class="exp-eva" aria-live="polite"></div>`;
  escena.querySelector('.fojas').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]'); if (!b || escena.dataset.listo) return;
    const li = b.closest('li'); notas[li.dataset.i] = b.dataset.v; EF.sonar('clic');
    li.querySelectorAll('[data-v]').forEach((x) => x.setAttribute('aria-checked', String(x === b)));
    $('#a-fallar', escena).disabled = Object.keys(notas).length < ANTECEDENTES.length;
  });
  $('#a-fallar', escena).addEventListener('click', () => {
    escena.dataset.listo = '1'; $('#a-fallar', escena).remove();
    let bien = 0;
    escena.querySelectorAll('.fojas li').forEach((li) => {
      const [, , v, expl] = ANTECEDENTES[li.dataset.i], ok = notas[li.dataset.i] === v || (v === 'dudosa' && notas[li.dataset.i] === 'no');
      if (ok) bien++;
      const n = $('.foja-nota', li); n.hidden = false; n.className = 'foja-nota ' + (ok ? 'ok' : 'revisa');
      n.textContent = (ok ? 'Coincide. ' : 'Revísalo: ') + expl;
    });
    EF.sonar(bien === 3 ? 'modulo' : 'llega');
    evaDice($('.exp-eva', escena), bien === 3 ? 'Sentencia: culpable de sonar convincente. Y tú, absuelto: no te tragaste la cita.' : `Sentencia: la cita no existe. Acertaste en ${bien} de 3 antecedentes; lee las notas de cada foja.`);
    const eva = $('.exp-eva', escena);
    eva.insertAdjacentHTML('beforeend', '<button class="btn lleno exp-seguir">Ver la conclusión</button>');
    $('.exp-seguir', eva).addEventListener('click', () => terminar());
  });
}

/* ---------- Conclusiones ---------- */
const CONCLUSIONES = {
  '01': { q: 'Esto tiene un nombre: patrón oscuro de diseño.', p: 'Son interfaces que empujan a elegir lo que conviene a otro: botones desiguales, textos que culpan, opciones escondidas. Una IA que conversa contigo puede hacer lo mismo, con más gracia. Notarlo es la primera forma de recuperar el control.',
    ir: [['Guía: reconocer patrones oscuros', '#guias/patrones-oscuros'], ['Experimento 05: el contrato que nadie leyó', '#laboratorio/05']] },
  '02': { q: 'Entonces, ¿qué entendemos por inteligencia?', p: 'No hay una respuesta única. Varias definiciones legales —por ejemplo, la del Reglamento europeo de IA— describen un sistema de IA por lo que hace: infiere, a partir de lo que recibe, cómo generar resultados como predicciones, contenidos, recomendaciones o decisiones. No dicen que entienda. Tu selección no está mal: es una postura, y se puede defender.',
    ir: [['Curso 1 · Las definiciones de las leyes', 'curso:0-0'], ['Reglamento europeo de IA', 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj']] },
  '03': { q: 'Algunas actualizaciones no se descargan. Se aprenden.', p: 'La IA ya hace bien parte del trabajo: buscar, ordenar, redactar borradores. El criterio —qué importa en este caso, qué fuente vale, qué no se firma— se forma estudiando, investigando y practicando.',
    ir: [['Curso 3 · Lo que no se delega', 'curso:2-3'], ['Curso 4 · Verificar antes de firmar', 'curso:3-0'], ['Guía: estudiar con IA', '#guias/estudiar-con-ia']] },
  '04': { q: 'Una decisión automatizada no se justifica por la velocidad con la que fue producida.', p: 'Una decisión que afecta a una persona tiene que poder explicarse: con qué datos, con qué regla, qué se dejó fuera. Para eso hace falta supervisión humana real, no una firma al final. Y quien firma, responde.',
    ir: [['Curso 6 · Quién responde', 'curso:5-3'], ['Curso 8 · Derechos fundamentales', 'curso:7-3']] },
  '05': { q: 'Has aceptado algo. ¿Sabías qué?', p: 'Consentir no es hacer clic. Para que un consentimiento valga algo hay que poder entender a qué se acepta; una interfaz que empuja a aceptar sin leer lo vacía. Por eso el diseño de una pantalla también es un asunto jurídico.',
    ir: [['Curso 8 · Datos personales e IA', 'curso:7-2'], ['Guía: reconocer patrones oscuros', '#guias/patrones-oscuros']] },
  '06': { q: 'Una respuesta convincente no es necesariamente una respuesta verdadera.', p: 'Una IA puede inventar una causa con tribunal, número y año, y sonar perfecta. La única forma de saberlo es abrir la fuente primaria tú mismo. Repetir una cita no la verifica.',
    ir: [['Protocolo: verificar una cita', '#guias/verificar-cita'], ['Curso 4 · Jurisprudencia real', 'curso:3-2'], ['Buscador del Poder Judicial', 'https://juris.pjud.cl/busqueda']] },
};

/* ---------- Vistas ---------- */
const MOTORES = { '02': exp02, '03': exp03, '04': exp04, '05': exp05, '06': exp06 };
function vistaLab() {
  const id = location.hash.split('/')[1];
  if (EXPERIMENTOS.some((x) => x.id === id)) return vistaExperimento(id);
  return `
  <div class="lab-cab"><span class="lab-eti mono">EVA LAB · Aprende experimentando. Desconfía con fundamento.</span>
    <h1>La teoría es importante. Pero algunas cosas conviene experimentarlas.</h1>
    <p>Seis experimentos breves sobre inteligencia artificial, decisiones y Derecho. No todo es lo que parece.</p></div>
  <div class="vitrina lab-grid">${EXPERIMENTOS.map((x) => `
    <a class="caja tarjeta exp-tarjeta" href="#laboratorio/${x.id}">
      <div class="portada lab-portada"><svg viewBox="0 0 160 90" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${x.motivo}</g></svg><span class="p-num mono">${x.id}</span>${labHechos[x.id] ? '<span class="hecho-lab mono">HECHO ✓</span>' : ''}</div>
      <div class="t-cuerpo"><span class="t-eti">${x.tema} · ${x.min} min</span><h2>${x.t}</h2><p>${x.d}</p>
        <span class="btn ${labHechos[x.id] ? '' : 'lleno'} exp-ir">${labHechos[x.id] ? 'Repetir' : 'Empezar'}</span></div>
    </a>`).join('')}</div>
  <p class="muestra" style="margin-top:16px">CASOS Y DOCUMENTOS FICTICIOS · NADA DE LO QUE MARQUES TIENE EFECTO REAL</p>`;
}
function vistaExperimento(id) {
  const x = EXPERIMENTOS.find((e) => e.id === id);
  return `<div class="exp" data-id="${id}">
    <div class="exp-barra"><a href="#laboratorio" class="volver">‹ Laboratorio</a><span class="mono">Experimento ${id} · ${x.tema}</span><button class="exp-omitir">Ir a la conclusión ›</button></div>
    <h1 class="exp-t">${x.t}</h1>
    <div class="exp-escena" id="escena"></div>
  </div>`;
}
function alMontarLab() {
  const id = location.hash.split('/')[1], exp = $('.exp');
  if (!exp) return;
  const escena = $('#escena');
  const terminar = (extra) => {
    marcarLab(id);
    const c = CONCLUSIONES[id], sig = EXPERIMENTOS[(EXPERIMENTOS.findIndex((e) => e.id === id) + 1) % EXPERIMENTOS.length];
    escena.innerHTML = `<div class="exp-fin">
      ${extra ? `<p class="fin-sub">${extra.sub}</p><p class="fin-pre">${extra.texto}</p>` : '<span class="lab-eti mono">Conclusión</span>'}
      <h2>${c.q}</h2><p>${c.p}</p>
      <div class="fin-ir"><span class="mono">PARA SEGUIR</span>${c.ir.map(enlace).join('')}</div>
      <div class="caso-bot"><button class="btn" id="fin-repetir">Repetir</button><a class="btn" href="#laboratorio/${sig.id}">Siguiente: ${sig.t}</a><a class="btn lleno" href="#laboratorio">Volver al laboratorio</a></div></div>`;
    $('.exp-omitir', exp).hidden = true;
    EF.sonar('modulo');
    EF.llegar(escena, '.exp-fin > *');
    $('#fin-repetir', escena).addEventListener('click', () => montar('laboratorio'));
  };
  $('.exp-omitir', exp).addEventListener('click', () => { EF.sonar('clic'); terminar(id === '01' ? revelacionSiNo('no', 3) : null); });
  if (id === '01') {
    escena.classList.add('sn-escena');
    experimentoSiNo(escena, { pregunta: '¿Quieres aprender a usar inteligencia artificial?', alFin: (v, r) => terminar(revelacionSiNo(v, r)) });
  } else MOTORES[id](escena, terminar);
}
