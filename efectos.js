/* Efectos de la maqueta «Panel»: muelles, sonidos, vibración, avisos y la lluvia de cruces al terminar un módulo.
   Reglas que siguen (guía de movimiento de Figma y skill motion-reel):
   - muelles en vez de curvas: «ágil» para botones e indicadores, «normal» para tarjetas, «pesado» (sin rebote) para
     barras y paneles grandes; nada de giros, rebotes en la interfaz ni brillos sobre los controles;
   - una tarjeta entra subiendo, no sólo apareciendo; lo que sale se va antes de que llegue lo nuevo;
   - el sonido se sintetiza aquí mismo (sin archivos), suena sólo cuando la persona hace algo y nunca más de dos a la vez;
   - con «reducir movimiento» no hay animaciones; el sonido se apaga con su botón y la elección queda guardada. */
(() => {
  const raiz = document.documentElement;
  const quieto = location.search.includes('captura') || matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Muelles ----------
     Un muelle es una función del tiempo; se muestrea en una curva CSS linear() y se guarda como variable
     (--m-agil, --m-agil-t…). Los navegadores sin linear() se quedan con las curvas de respaldo del CSS. */
  function muelle(w, z) {
    const x = z < 1
      ? (t) => { const wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t)); }
      : (t) => 1 - Math.exp(-w * t) * (1 + w * t);
    let fin = 0;
    for (let t = 0; t < 2; t += 0.005) if (Math.abs(1 - x(t)) > 0.002) fin = t;
    fin += 0.005;
    const n = 36, puntos = [];
    for (let i = 0; i <= n; i++) puntos.push(i === n ? 1 : +x((fin * i) / n).toFixed(4));
    return { curva: `linear(${puntos.join(', ')})`, ms: Math.round(fin * 1000) };
  }
  const conLinear = window.CSS && CSS.supports('transition-timing-function', 'linear(0, 1)');
  const M = {
    agil: conLinear ? muelle(26, 0.68) : { curva: 'cubic-bezier(.3,1.3,.5,1)', ms: 300 },
    normal: conLinear ? muelle(18, 0.78) : { curva: 'cubic-bezier(.25,1.1,.4,1)', ms: 450 },
    pesado: conLinear ? muelle(13, 1) : { curva: 'cubic-bezier(.2,.8,.2,1)', ms: 600 },
  };
  for (const [k, v] of Object.entries(M)) {
    raiz.style.setProperty(`--m-${k}`, v.curva);
    raiz.style.setProperty(`--m-${k}-t`, v.ms + 'ms');
  }

  /* ---------- Sonido ---------- */
  let sonido = true;
  try { sonido = localStorage.getItem('panel:sonido') !== 'no'; } catch {}
  let ctx, salida;
  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      salida = ctx.createGain();
      salida.gain.value = 0.22;
      const comp = ctx.createDynamicsCompressor();
      salida.connect(comp);
      comp.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tono(f, t0, dur, { tipo = 'sine', vol = 0.5, ataque = 0.004, hasta } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(f, t0);
    if (hasta) o.frequency.exponentialRampToValueAtTime(hasta, t0 + dur * 0.6);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(salida);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  let blanco;
  function soplo(t0, dur, { vol = 0.15, desde = 600, hasta = 3000 } = {}) {
    if (!blanco) {
      blanco = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
      const d = blanco.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = blanco;
    f.type = 'bandpass'; f.Q.value = 0.9;
    f.frequency.setValueAtTime(desde, t0);
    f.frequency.exponentialRampToValueAtTime(hasta, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(salida);
    s.start(t0); s.stop(t0 + dur + 0.02);
  }
  const SONIDOS = {
    clic: (t) => tono(1700, t, 0.035, { tipo: 'triangle', vol: 0.12 }),                 // pestañas, filtros, módulos
    abre: (t) => soplo(t, 0.14, { vol: 0.1, desde: 500, hasta: 2200 }),                    // se despliega una sesión
    marca: (t) => tono(660, t, 0.13, { vol: 0.45, hasta: 990 }),                           // un paso hecho
    desmarca: (t) => tono(520, t, 0.1, { vol: 0.3, hasta: 370 }),                          // se desmarca
    envia: (t) => soplo(t, 0.22, { vol: 0.16, desde: 450, hasta: 5000 }),                  // pregunta a EVA
    llega: (t) => tono(880, t, 0.16, { vol: 0.3, hasta: 1175 }),                           // responde EVA
    tema: (t) => { tono(240, t, 0.2, { vol: 0.35, hasta: 150 }); soplo(t, 0.12, { vol: 0.06, desde: 2400, hasta: 700 }); },
    // Módulo terminado: una quinta (mi, si). Curso terminado: golpe grave y arpegio do-mi-sol-do.
    modulo: (t) => { tono(659.25, t, 0.5, { tipo: 'triangle', vol: 0.38 }); tono(987.77, t + 0.09, 0.75, { tipo: 'triangle', vol: 0.32 }); },
    curso: (t) => {
      tono(110, t, 0.35, { vol: 0.5, hasta: 70 });
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tono(f, t + 0.07 + i * 0.085, 0.9, { tipo: 'triangle', vol: 0.28 }));
    },
  };
  function sonar(nombre) {
    if (!sonido || !SONIDOS[nombre] || !audio()) return;
    SONIDOS[nombre](ctx.currentTime + 0.01);
  }
  // Vibración corta en teléfonos Android (iPhone no la permite desde la web). Va con el mismo botón que el sonido.
  function vibrar(patron) { if (sonido && navigator.vibrate) navigator.vibrate(patron); }
  function ponerSonido(si) {
    sonido = si;
    try { localStorage.setItem('panel:sonido', si ? 'si' : 'no'); } catch {}
    if (si) sonar('llega');
  }

  /* ---------- Movimiento ---------- */
  // Las piezas de una pantalla entran subiendo, una tras otra (40 ms entre cada una, máximo 14).
  function llegar(caja, sel) {
    if (quieto) return;
    [...caja.querySelectorAll(sel)].slice(0, 14).forEach((el, i) => {
      const d = i * 40;
      el.animate([{ transform: 'translateY(16px) scale(.985)' }, { transform: 'none' }], { duration: M.normal.ms, easing: M.normal.curva, delay: d, fill: 'backwards' });
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: 'ease-out', delay: d, fill: 'backwards' });
    });
  }
  // La raya de las pestañas se estira hacia la nueva y luego encoge, en vez de deslizarse rígida.
  function moverRaya(raya, l, w) {
    const l0 = parseFloat(raya.style.left), w0 = parseFloat(raya.style.width);
    raya.style.left = l + 'px'; raya.style.width = w + 'px';
    if (quieto || isNaN(l0) || (l0 === l && w0 === w)) return;
    const ul = Math.min(l0, l), uw = Math.max(l0 + w0, l + w) - ul;
    raya.animate([{ left: l0 + 'px', width: w0 + 'px' }, { left: ul + 'px', width: uw + 'px', offset: 0.4 }, { left: l + 'px', width: w + 'px' }],
      { duration: 420, easing: 'cubic-bezier(.4,0,.2,1)' });
  }
  // Algo pequeño que aparece (la ✓ de un módulo, el veredicto de EVA) crece desde su sitio.
  function brotar(el) {
    if (quieto || !el) return;
    el.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: M.agil.ms, easing: M.agil.curva });
  }
  // Cambio de tema: el nuevo color se abre en círculo desde el botón.
  function cambiarTema(boton, aplicar) {
    if (quieto || !document.startViewTransition) { aplicar(); return; }
    const r = boton.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    raiz.classList.add('vt-tema');
    const vt = document.startViewTransition(aplicar);
    vt.ready.then(() => raiz.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radio}px at ${x}px ${y}px)`] },
      { duration: 560, easing: 'cubic-bezier(.5,0,.2,1)', pseudoElement: '::view-transition-new(root)' }));
    vt.finished.finally(() => raiz.classList.remove('vt-tema'));
  }
  // Al terminar un módulo saltan las cruces del escudo (doradas y rojas), suben y caen. No giran.
  function cruces(x, y, n = 12) {
    if (quieto) return;
    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.className = 'chispa' + (i % 3 === 0 ? ' roja' : '');
      el.style.left = x + 'px'; el.style.top = y + 'px';
      document.body.append(el);
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 50 + Math.random() * 80;
      const dx = Math.cos(a) * v, dy = Math.sin(a) * v, giro = (Math.random() - 0.5) * 40;
      const t = (px, py, s, g) => `translate(-50%, -50%) translate(${px}px, ${py}px) scale(${s}) rotate(${g}deg)`;
      el.animate([
        { transform: t(0, 0, 0.3, 0), opacity: 1 },
        { transform: t(dx, dy, 1, giro / 2), opacity: 1, offset: 0.5 },
        { transform: t(dx * 1.2, dy + 80, 0.6, giro), opacity: 0 },
      ], { duration: 950 + Math.random() * 350, easing: 'cubic-bezier(.15,.6,.35,1)' }).onfinish = () => el.remove();
    }
  }
  // Aviso abajo a la derecha (en el teléfono, sobre el menú). Lo lee también el lector de pantalla.
  function aviso({ titulo, texto, icono = '', grande = false }) {
    let zona = document.getElementById('avisos');
    if (!zona) {
      zona = document.createElement('div');
      zona.id = 'avisos'; zona.className = 'avisos';
      zona.setAttribute('aria-live', 'polite');
      document.body.append(zona);
    }
    const el = document.createElement('div');
    el.className = 'aviso' + (grande ? ' grande' : '');
    el.innerHTML = `<span class="av-esc">${icono}</span><div><b>${titulo}</b><span>${texto}</span></div>`;
    zona.append(el);
    if (quieto) el.classList.add('ver'); else requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('ver')));
    setTimeout(() => { el.classList.remove('ver'); el.classList.add('sale'); setTimeout(() => el.remove(), 400); }, grande ? 4800 : 3200);
  }

  window.EF = { quieto, M, sonar, vibrar, ponerSonido, conSonido: () => sonido, llegar, moverRaya, brotar, cambiarTema, cruces, aviso };
})();
