/* EVA en vertical: videos de unos tres minutos alojados en YouTube como «ocultos» (no listados), canal Diego Ojeda.
   La página sólo carga la portada (img/videos/, WebP de 540 y 360 px). El reproductor se carga al pulsar, en una
   ventana encima de la página, desde youtube-nocookie.com (vercel.json lo permite en frame-src y en nada más). */
const REELS = [
  { id: 'sky5G2C7oSY', n: 1, t: 'Modo entrenamiento: el modelo eres tú', dur: '2:31', portada: 'video-01',
    d: 'Machine learning en dos minutos y medio: supervisado, no supervisado, refuerzo, redes y transformers. Y al final, un sesgo real para quien estudia Derecho.',
    alt: 'Un tablero de damas del que sube una red de nodos de luz turquesa, bajo el título «Machine learning».' },
  // titulada: la portada ya trae el título escrito (la del reel), así que la tarjeta sólo pone «VIDEO n · duración».
  { id: 'uf24eLuF2tI', n: 2, t: 'Humano 2.0: ¿borrarías la muerte?', dur: '2:53', portada: 'video-02', titulada: true,
    d: 'Un chip que devuelve la memoria es curar; el mismo chip para recordarlo todo, ¿es mejorar? Transhumanistas y bioconservadores: Bostrom, Fukuyama, Sandel, Rita Leggett y la línea que ya trazó Chile.',
    alt: 'EVA partida en dos, mitad humana y mitad máquina, con el título «Humano 2.0: ¿curar o mejorar?».' },
];
const REELS_PRONTO = Math.max(1, 4 - REELS.length); // lugares marcados para los videos que vienen

function franjaReels() {
  return `
  <section class="reels" aria-labelledby="reels-t">
    <div class="reels-cab"><h2 id="reels-t">EVA en vertical</h2><p>Videos de unos tres minutos, como un reel. Se cargan sólo cuando los abres.</p></div>
    <div class="reels-fila" id="reels-fila">${REELS.map((r) => `
      <button class="reel${r.titulada ? ' titulada' : ''}" data-reel="${r.id}" aria-haspopup="dialog"${r.titulada ? ` aria-label="Video ${r.n}: ${r.t}, ${r.dur}"` : ''}>
        <img src="img/videos/${r.portada}-540.webp" srcset="img/videos/${r.portada}-360.webp 360w, img/videos/${r.portada}-540.webp 540w" sizes="(max-width: 860px) 46vw, 220px" width="540" height="960" alt="${r.alt}" loading="lazy" decoding="async">
        <span class="reel-play">${I(IC.play, 22)}</span>
        <span class="reel-pie"><span class="reel-eti mono">VIDEO ${r.n} · ${r.dur}</span>${r.titulada ? '' : `<b>${r.t}</b>`}</span>
      </button>`).join('')}${Array.from({ length: REELS_PRONTO }, (_, k) => `
      <div class="reel pronto"><span class="reel-pie"><span class="reel-eti mono">VIDEO ${REELS.length + k + 1}</span><b>Próximamente</b></span></div>`).join('')}
    </div>
  </section>`;
}

function abrirReel(id, desde) {
  const r = REELS.find((x) => x.id === id); if (!r) return;
  $('#reel-ver')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
  <div class="modal reel-modal" id="reel-ver" role="dialog" aria-modal="true" aria-labelledby="reel-t">
    <div class="reel-caja">
      <div class="reel-marco"><iframe src="https://www.youtube-nocookie.com/embed/${r.id}?autoplay=1&rel=0&playsinline=1" title="${r.t}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>
      <div class="reel-texto"><span class="reel-eti mono">VIDEO ${r.n} · ${r.dur}</span><h2 id="reel-t">${r.t}</h2><p>${r.d}</p>
        <a href="https://youtube.com/shorts/${r.id}" target="_blank" rel="noopener">Abrir en YouTube ↗</a></div>
      <button class="cerrar" aria-label="Cerrar el video">×</button>
    </div>
  </div>`);
  const m = $('#reel-ver');
  const cerrar = () => { m.remove(); desde?.focus(); };
  m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.cerrar')) cerrar(); });
  m.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
  $('.cerrar', m).focus();
  EF.sonar('llega');
}

function alMontarReels() {
  $('#reels-fila')?.addEventListener('click', (e) => {
    const b = e.target.closest('button.reel'); if (b) abrirReel(b.dataset.reel, b);
  });
}
