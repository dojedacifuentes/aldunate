/* Otras primeras interacciones para la bienvenida, para comparar con la de SÍ/NO (que sigue siendo la de siempre).
   Se abren con ?bv=galletas o ?bv=recomendado (junto con ?nuevo para verlas otra vez). Todo es un ejercicio: lo que se
   marca aquí no se guarda. Al final llaman a `entrar`, que muestra la entrada de siempre (nombre y quién eres). */

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
    <div class="gal-bot"><button class="btn lleno gal-todo">Aceptar todo</button><button class="gal-conf">Configurar</button></div>
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
