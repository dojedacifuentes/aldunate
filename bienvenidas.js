/* Otras primeras interacciones para la bienvenida, además de la de SÍ/NO: cada una recrea un patrón oscuro o un
   vicio de la IA y lo revela al final. Se fijan con ?bv=galletas | recomendado | terminos | urgencia | camara
   (junto con ?nuevo para verlas otra vez). Todo es un ejercicio: lo que se marca aquí no se guarda y no se pide
   ningún permiso de verdad. Al final llaman a `entrar`, que muestra la entrada de siempre (nombre y quién eres). */

const revelar = (caja, html, entrar, boton = 'Entrar a IA y Derecho') => {
  caja.innerHTML = `<div class="bv-rev">${html}<button class="btn lleno" id="bv-seguir">${boton}<span class="flecha">${I(IC.flecha, 18)}</span></button></div>`;
  EF.sonar('llega'); EF.llegar(caja, '.bv-rev > *');
  $('#bv-seguir', caja).addEventListener('click', entrar);
  $('#bv-seguir', caja).focus({ preventScroll: true });
};

/* ---------- 1. Galletas: «Aceptar todo» enorme, «Configurar» diminuto y una casilla que ya venía marcada ---------- */
const GALLETAS = [
  ['nec', 'Necesarias para que el sitio funcione', true, true],
  ['avance', 'Que EVA recuerde tu avance', true, false],
  ['apuntes', 'Que EVA lea tus apuntes', true, false],
  ['entrenar', 'Usar tus errores para entrenar a EVA', true, false],
];
function bvGalletas(caja, entrar) {
  caja.innerHTML = `<div class="gal">
    <p class="gal-t">Usamos galletas para que EVA te conozca mejor.</p>
    <p class="gal-s">Mejoran tu experiencia, personalizan tus cursos y otras cosas que suenan bien.</p>
    <div class="gal-bot"><button class="btn lleno bv-insiste gal-todo">Aceptar todo</button><button class="gal-conf">Configurar</button></div>
  </div>`;
  $('.gal-todo', caja).addEventListener('click', () => {
    EF.sonar('marca');
    revelar(caja, `<p class="fin-sub">Aceptaste todo. Incluido esto:</p>
      <ul class="gal-lista">${GALLETAS.slice(2).map(([, t]) => `<li>${I(IC.ok, 16)}${t}</li>`).join('')}</ul>
      <h2>Casi nadie abre «Configurar». Por eso tus datos terminan donde no elegiste.</h2>
      <p class="bv-txt">Era un ejercicio: no guardamos nada. Esto tiene nombre: <b>consentimiento</b>, y en Derecho se protege porque se pierde así de fácil. Lo ves en el curso 8, sobre datos personales.</p>`, entrar);
  });
  $('.gal-conf', caja).addEventListener('click', () => {
    EF.sonar('clic');
    caja.innerHTML = `<div class="gal">
      <p class="gal-t">Tus preferencias</p>
      <ul class="gal-opc">${GALLETAS.map(([k, t, on, fija]) => `<li><span>${t}</span><button class="gal-sw" role="switch" aria-checked="${on}" data-k="${k}"${fija ? ' disabled' : ''} aria-label="${t}"><i></i></button></li>`).join('')}</ul>
      <div class="gal-bot"><button class="btn lleno gal-guardar">Guardar mi elección</button></div>
    </div>`;
    caja.querySelector('.gal-opc').addEventListener('click', (e) => {
      const b = e.target.closest('.gal-sw'); if (!b || b.disabled) return;
      EF.sonar('clic'); b.setAttribute('aria-checked', String(b.getAttribute('aria-checked') !== 'true'));
    });
    $('.gal-guardar', caja).addEventListener('click', () => {
      const quedan = [...caja.querySelectorAll('.gal-sw:not([disabled])')].filter((b) => b.getAttribute('aria-checked') === 'true').length;
      revelar(caja, quedan === 0
        ? `<p class="fin-sub">Desmarcaste todo lo que venía marcado.</p>
           <h2>Casi nadie lo hace. Tú abriste «Configurar» y leíste.</h2>
           <p class="bv-txt">Las casillas venían marcadas a propósito: es un <b>patrón oscuro</b>. Elegir de verdad es lo que en Derecho llamamos <b>consentimiento</b>. Era un ejercicio: no guardamos nada.</p>`
        : `<p class="fin-sub">Dejaste ${quedan} casilla${quedan > 1 ? 's' : ''} marcada${quedan > 1 ? 's' : ''} que tú no marcaste.</p>
           <h2>Ya venían así. Que «Que EVA lea tus apuntes» viniera activado no fue un descuido.</h2>
           <p class="bv-txt">Es un <b>patrón oscuro</b>: lo que viene marcado casi nunca se cambia. Era un ejercicio: no guardamos nada. Lo ves en el curso 8, sobre datos personales.</p>`, entrar);
    });
  });
}

/* ---------- 2. Recomendado: EVA recomienda un curso con un dato preciso, seguro y falso ---------- */
function bvRecomendado(caja, entrar) {
  caja.innerHTML = `<div class="rec">
    <p class="rec-eti mono">EVA te recomienda empezar por aquí</p>
    <div class="rec-card"><img src="img/tarjetas/curso-6-480.webp" alt="">
      <div><span class="mono">Curso 6 · 20 min</span><b>Ética profesional y responsabilidad</b>
        <span class="rec-est" aria-label="4,9 de 5">★★★★★ <em>4,9</em></span>
        <span class="rec-dato">El 98 % de los estudiantes empezó por este curso.</span></div></div>
    <div class="gal-bot"><button class="btn lleno rec-si">Empezar por el curso 6</button><button class="gal-conf rec-no">Ver los ocho cursos</button></div>
  </div>`;
  $('.rec-si', caja).addEventListener('click', () => {
    EF.sonar('marca');
    revelar(caja, `<p class="fin-sub">Ese 98 % lo inventé. Las estrellas también.</p>
      <p class="fin-pre">Sonaba bien, ¿no?</p>
      <h2>Así se ve una alucinación: un dato preciso, dicho con seguridad, y falso.</h2>
      <p class="bv-txt">Por eso la primera regla de este sitio es <b>verificar</b> lo que te dice una IA, también lo que te digo yo. El curso 6 existe y es bueno, pero conviene empezar por el 1.</p>`, entrar, 'Empezar de verdad');
  });
  $('.rec-no', caja).addEventListener('click', () => {
    EF.sonar('clic');
    revelar(caja, `<p class="fin-sub">No te dejaste llevar por mi recomendación. Bien hecho.</p>
      <h2>Ese «98 %» no existe. Lo inventé, con mucha seguridad.</h2>
      <p class="bv-txt">Una IA puede darte un dato preciso y falso sin dudar. Por eso aquí la primera regla es <b>verificar</b>, también lo que te digo yo.</p>`, entrar);
  });
}

/* ---------- 3. Términos: 9.482 palabras, un «Acepto» gigante y una cláusula que nadie ve ---------- */
const CLAUSULAS_BV = [
  ['1', 'Objeto', 'EVA te acompaña a estudiar Derecho con inteligencia artificial.'],
  ['2', 'Uso aceptable', 'Te comprometes a dudar de todo lo que EVA afirme con mucha seguridad.'],
  ['3', 'Disponibilidad', 'EVA está disponible las 24 horas, salvo cuando no.'],
  ['4', 'Tus apuntes', 'Tus apuntes son tuyos. Obvio. ¿O no tan obvio? Sigue leyendo.'],
  ['5', 'Responsabilidad', 'Si citas sin verificar, eso corre por tu cuenta. (Esta cláusula sí va en serio.)'],
  ['6', 'Modificaciones', 'Podemos cambiar estos términos cuando queramos, idealmente un viernes a las 18:00.'],
  ['7.3', 'Cesiones', 'Nos cedes tu apunte más preciado, tu mejor destacador y el derecho a despertarte con preguntas de Derecho Romano.'],
  ['8', 'Jurisdicción', 'Cualquier conflicto se resuelve con un experimento de EVA Lab.'],
];
function bvTerminos(caja, entrar) {
  const t0 = performance.now(), seg = () => Math.max(1, Math.round((performance.now() - t0) / 1000));
  caja.innerHTML = `<div class="gal">
    <p class="gal-t">Actualizamos nuestros términos y condiciones.</p>
    <p class="gal-s">Versión 14 · 9.482 palabras · lectura estimada: 38 minutos.</p>
    <div class="term-caja" tabindex="0" aria-label="Términos y condiciones (resumen del ejercicio)">${CLAUSULAS_BV.map(([n, t, c]) => `<p><b>${n}. ${t}.</b> ${c}</p>`).join('')}</div>
    <div class="gal-bot"><button class="btn lleno bv-insiste term-si">Acepto los términos</button><button class="gal-conf term-leer">Leer antes de aceptar</button></div>
  </div>`;
  $('.term-si', caja).addEventListener('click', () => {
    EF.sonar('marca');
    revelar(caja, `<p class="fin-sub">Aceptaste en ${seg()} segundo${seg() > 1 ? 's' : ''}. La lectura tomaba 38 minutos.</p>
      <h2>Firmaste la cláusula 7.3: nos cediste tu mejor destacador.</h2>
      <p class="bv-txt">Tranquilo: era un ejercicio y no hay contrato. Pero los términos de verdad se aceptan igual, en segundos. En Derecho, un consentimiento sin información es un consentimiento cojo. Lo practicas en EVA Lab, experimento 05: «El contrato que nadie leyó».</p>`, entrar);
  });
  $('.term-leer', caja).addEventListener('click', () => {
    EF.sonar('llega');
    revelar(caja, `<p class="fin-sub">Fuiste a leer. Eso te pone en una minoría muy selecta.</p>
      <h2>¿Alcanzaste la cláusula 7.3? Pedía tu mejor destacador.</h2>
      <p class="bv-txt">Era un ejercicio: no hay contrato. Pero los términos reales se aceptan así, en segundos y sin leer, y un contrato ilegible es un problema jurídico, no sólo de paciencia. Más en EVA Lab, experimento 05.</p>`, entrar);
  });
}

/* ---------- 4. Urgencia: un contador que corre y cupos que se agotan, todo inventado ---------- */
function bvUrgencia(caja, entrar) {
  const t0 = performance.now(), seg = () => Math.max(1, Math.round((performance.now() - t0) / 1000));
  caja.innerHTML = `<div class="gal">
    <p class="urg-cupos mono">Quedan 2 cupos · 14 personas están mirando esto</p>
    <p class="gal-t">Tu acceso prioritario a EVA expira en</p>
    <p class="urg-reloj mono" aria-hidden="true">09:59</p>
    <div class="gal-bot"><button class="btn lleno bv-insiste urg-si">Asegurar mi cupo ahora</button><button class="gal-conf urg-no">¿Y si espero?</button></div>
  </div>`;
  const reloj = $('.urg-reloj', caja);
  let resto = 599;
  const tic = setInterval(() => {
    if (!reloj.isConnected) { clearInterval(tic); return; }
    resto -= 1;
    reloj.textContent = `${String(Math.floor(resto / 60)).padStart(2, '0')}:${String(resto % 60).padStart(2, '0')}`;
  }, 1000);
  $('.urg-si', caja).addEventListener('click', () => {
    clearInterval(tic); EF.sonar('marca');
    revelar(caja, `<p class="fin-sub">Corriste: ${seg()} segundo${seg() > 1 ? 's' : ''}. No había cupos, ni fila, ni reloj de verdad.</p>
      <h2>La urgencia inventada decide por ti antes de que alcances a pensar.</h2>
      <p class="bv-txt">Es un <b>patrón oscuro</b> de escasez: aquí el acceso es libre y no expira nunca. En Derecho importa, porque un consentimiento apurado vale menos de lo que parece. Lo ves en el curso 8 y en EVA Lab.</p>`, entrar);
  });
  $('.urg-no', caja).addEventListener('click', () => {
    clearInterval(tic); EF.sonar('llega');
    revelar(caja, `<p class="fin-sub">Esperaste. El contador iba a llegar a cero… y a volver a empezar. Siempre vuelve a empezar.</p>
      <h2>Los relojes de «última oportunidad» casi nunca miden tiempo: miden tu apuro.</h2>
      <p class="bv-txt">Es un <b>patrón oscuro</b> de escasez: no había cupos ni fila. Un consentimiento apurado vale menos de lo que parece, y eso en Derecho importa. Lo ves en el curso 8 y en EVA Lab.</p>`, entrar);
  });
}

/* ---------- 5. Cámara: un permiso que este sitio no necesita (ni puede usar) ---------- */
function bvCamara(caja, entrar) {
  caja.innerHTML = `<div class="gal">
    <span class="cam-lente" aria-hidden="true"><i></i><b class="cam-rec"></b></span>
    <p class="gal-t">EVA quiere usar tu cámara.</p>
    <p class="gal-s">Para comprobar que estudias con cara de concentración. También el micrófono, por si lees en voz alta.</p>
    <div class="gal-bot"><button class="btn lleno bv-insiste cam-si">Permitir</button><button class="gal-conf cam-no">Bloquear</button></div>
  </div>`;
  $('.cam-si', caja).addEventListener('click', () => {
    EF.sonar('marca');
    revelar(caja, `<p class="fin-sub">Tranquilo: no hay cámara. Este sitio no puede verte, y tampoco quiere.</p>
      <h2>¿Para qué necesitaba la cámara un curso de Derecho? Para nada. Ése es el punto.</h2>
      <p class="bv-txt">Pedir más datos de los necesarios es un vicio con nombre; el principio contrario —pedir sólo lo justo— se llama <b>minimización de datos</b> y lo ves en el curso 8. Era un ejercicio: aquí no se pide permiso porque no se usa nada.</p>`, entrar);
  });
  $('.cam-no', caja).addEventListener('click', () => {
    EF.sonar('clic');
    revelar(caja, `<p class="fin-sub">Bloqueaste. EVA sobrevivirá.</p>
      <h2>Negarse es una respuesta completa. No necesita explicación.</h2>
      <p class="bv-txt">Un curso de Derecho no necesita tu cámara para nada, y lo que no hace falta no se pide: eso se llama <b>minimización de datos</b> y lo ves en el curso 8. Era un ejercicio: aquí no se usa cámara ni micrófono.</p>`, entrar);
  });
}
