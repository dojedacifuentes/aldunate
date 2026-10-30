/* Ficha del curso (pedido del propietario, 29-10-2026): al pulsar un curso en «Mis cursos» o en el Inicio, se abre al
   centro, como en una plataforma de series: la imagen grande que se funde con el vidrio, el título encima, la
   descripción, los cuatro módulos con su avance y el botón para entrar. El sitio queda desenfocado detrás.
   Se cierra con la X, con Esc o tocando fuera; «Entrar» lleva al curso (#cursos/N) o al módulo que toca. */
function abrirFicha(k, desde) {
  $('#ficha')?.remove();
  const [titulo, mods] = CURSOS[k], total = totalCurso(k), listos = modulosListos(k);
  const sigue = mods.findIndex((_, m) => hechas(k, m) < 4);
  const estado = listos === 4 ? 'Terminado' : total ? `${Math.round(total / 16 * 100)} % · vas en el módulo ${k + 1}.${sigue + 1}` : 'Sin empezar';
  document.body.insertAdjacentHTML('beforeend', `
  <div class="ficha-velo" id="ficha" role="dialog" aria-modal="true" aria-labelledby="ficha-t" style="--c:${COLORES[k]}">
    <article class="ficha">
      <div class="ficha-img"><img src="img/tarjetas/curso-${k + 1}-800.webp" alt="" decoding="async">
        <div class="ficha-sobre"><span class="ficha-eti mono">Curso ${k + 1} · 4 módulos · 20 min</span><h2 id="ficha-t">${titulo}</h2></div></div>
      <button class="ficha-cerrar" aria-label="Cerrar">×</button>
      <div class="ficha-cuerpo">
        <p class="ficha-desc">${DESCRIPCIONES[k]}</p>
        <div class="ficha-acc">
          <button class="btn lleno" data-entrar="${listos === 4 ? 0 : Math.max(sigue, 0)}">${listos === 4 ? 'Repasar el curso' : total ? `Seguir en el ${k + 1}.${sigue + 1}` : 'Empezar el curso'}<span class="flecha">${I(IC.flecha, 18)}</span></button>
          <span class="ficha-estado mono">${estado}</span>
        </div>
        <p class="ficha-sub mono">Los módulos</p>
        <ol class="ficha-mods">${mods.map((m, j) => {
          const h = hechas(k, j);
          return `<li><button data-entrar="${j}"><span class="fm-n mono">${k + 1}.${j + 1}</span><span class="fm-t">${m}</span>
            <span class="fm-av" aria-label="${h} de 4 pasos"><b style="width:${h / 4 * 100}%"></b></span><span class="fm-ok mono">${h === 4 ? '✓' : `${h}/4`}</span></button></li>`;
        }).join('')}</ol>
      </div>
    </article>
  </div>`);
  const f = $('#ficha'), caja = $('.ficha', f);
  // La ficha crece desde la tarjeta pulsada (si la hay) hasta el centro.
  if (!EF.quieto && desde) {
    const r = desde.getBoundingClientRect(), c = caja.getBoundingClientRect();
    const dx = r.left + r.width / 2 - (c.left + c.width / 2), dy = r.top + r.height / 2 - (c.top + c.height / 2);
    caja.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${Math.min(r.width / c.width, 1)})`, opacity: 0.4 }, { transform: 'none', opacity: 1 }],
      { duration: 480, easing: 'cubic-bezier(.2,.9,.25,1)' });
  }
  EF.sonar('abre');
  const cerrar = () => {
    if (EF.quieto) { f.remove(); desde?.focus({ preventScroll: true }); return; }
    f.classList.add('saliendo'); setTimeout(() => f.remove(), 220); desde?.focus({ preventScroll: true });
  };
  f.addEventListener('click', (e) => {
    if (e.target === f || e.target.closest('.ficha-cerrar')) return cerrar();
    const b = e.target.closest('[data-entrar]'); if (!b) return;
    f.remove(); irACurso(k, +b.dataset.entrar);
  });
  f.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  $('[data-entrar]', f).focus({ preventScroll: true });
}
// Las tarjetas de «Mis cursos» y los cursos del Inicio abren la ficha en vez de entrar directo.
document.addEventListener('click', (e) => {
  const a = e.target.closest('#vitrina a.tarjeta[href^="#cursos/"], .tablero-v .barras a[href^="#cursos/"]');
  if (!a || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  abrirFicha(+a.getAttribute('href').split('/')[1] - 1, a);
});
