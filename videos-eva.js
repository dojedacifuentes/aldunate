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
  { id: 'VRrR5Wlb2hc', n: 3, t: '¿Soy alguien o algo?', dur: '1:20', portada: 'video-03', titulada: true,
    d: 'En Chile, persona es todo individuo de la especie humana; una empresa también lo es, y un río en Nueva Zelanda. Un orangután, no. ¿Y una IA? Turing, Chalmers y las leyes que ya se adelantaron.',
    alt: 'Un ojo con un iris de circuitos azules, sobre el título «¿Soy alguien o algo? La ley ya respondió. ¿Y tú?».' },
  { id: 'XdONlPfSSzg', n: 4, t: 'Tengo tus me gusta', dur: '1:15', portada: 'video-04', titulada: true,
    d: 'Con 300 «me gusta», un algoritmo te conoce mejor que tu pareja (Cambridge y Stanford, 2015). El dataísmo dice que entonces debería decidir por ti. Pero los datos heredan nuestros prejuicios.',
    alt: 'EVA mirando de frente, con una lágrima negra, sobre la pregunta «¿Tu pareja te conoce mejor que yo? Yo solo necesité 300 me gusta».' },
  // 5 a 8: los reels de EVA ACADEMY (29-10-2026). Portadas: sus miniaturas verticales. El 5 se subió en 4:5.
  { id: '2xe2z00vQBA', n: 5, t: '¿Si pago, mis datos están protegidos? · Parte 1', dur: '1:26', portada: 'video-05', titulada: true,
    d: 'Pagar no es contratar. Cuatro mitos sobre tus datos en ChatGPT, Claude y Gemini, con lo que dicen sus políticas, textual.',
    alt: 'EVA de frente, con el título «Pagar no es contratar. ¿Si pago, mis datos están protegidos? 4 mitos, parte 1».' },
  { id: 'zgjBObDpyAE', n: 6, t: 'Apagaste el entrenamiento · Parte 2', dur: '1:25', portada: 'video-06', titulada: true,
    d: 'Apagar el entrenamiento vale hacia adelante: lo ya aprendido se queda. Cuatro mitos más, con lo que dicen sus políticas.',
    alt: 'EVA de frente, con el título «Pagar no es contratar. ¿Si pago, mis datos están protegidos? 4 mitos, parte 2».' },
  { id: 'ZKBdWKaiRL8', n: 7, t: 'Tacha antes de pegar', dur: '1:12', portada: 'video-07', titulada: true,
    d: 'Si pegaste el escrito de tu cliente en una IA, ya le entregaste sus datos. Cómo tacharlos antes, gratis y sin internet. Tachar no es anonimizar.',
    alt: 'EVA de frente, con el título «¿Pegaste el escrito en una IA? Tacha antes de pegar» y datos reemplazados por etiquetas.' },
  { id: 'kT7IS1YSqK8', n: 8, t: 'Tu chat, al expediente', dur: '1:25', portada: 'video-08', titulada: true,
    d: 'Lo que le cuentas a una IA puede usarse en tu contra en un juicio: Nueva York 2026, el caso del New York Times contra OpenAI y qué pasa en Chile.',
    alt: 'EVA de frente, con el título «Tu chat, al expediente. Lo que le cuentas a una IA puede usarse en tu contra».' },
];
const REELS_PRONTO = (4 - REELS.length % 4) % 4; // lugares marcados para los videos que vienen: completan la fila de cuatro

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

// Los videos en la vitrina del Inicio: sólo la portada y un botón chico; abren la misma ventana.
function reelsVitrina() {
  return REELS.slice(0, 4).map((r) => `
    <button class="reel vit-reel" type="button" data-reel="${r.id}" aria-haspopup="dialog" aria-label="Video ${r.n}: ${r.t}, ${r.dur}">
      <img src="img/videos/${r.portada}-540.webp" srcset="img/videos/${r.portada}-360.webp 360w, img/videos/${r.portada}-540.webp 540w" sizes="(max-width: 860px) 40vw, 150px" width="540" height="960" alt="" loading="lazy" decoding="async">
      <span class="reel-play">${I(IC.play, 14)}</span>
    </button>`).join('');
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
