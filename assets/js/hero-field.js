/* ==========================================================================
   hero-field.js — sistema de interacción del hero

   UN SOLO bucle de animación para todo el campo. El flujo es exactamente el
   del brief (§9):

       pointermove → coordenadas objetivo → requestAnimationFrame
                   → interpolación → escritura de variables CSS

   Reglas que este fichero respeta de forma estricta:

     · El manejador de pointermove NO calcula ni escribe nada. Sólo guarda
       dos números. Todo el trabajo ocurre en el frame.
     · El contenido del hero (título, texto, botones) NUNCA se mueve. §17.
     · Sólo se animan transform, opacity y posición de máscara. §26.
     · Si algo falla, el hero se queda en su composición estática y el
       contenido sigue intacto. §29.

   Documentación: docs/INTERACTION-SYSTEM.md
   ========================================================================== */

(function () {
  'use strict';

  DL.heroField = { init: init };

  function init(hero) {
    if (!hero) { return; }

    var field = hero.querySelector('[data-field]');
    if (!field) { return; }

    var CFG = DL.config.hero;

    // ---------------------------------------------------------------------
    // Layer 04 — campo semántico.
    // Se construye siempre que haya datos: sin JavaScript no hay cursor, y
    // sin cursor estas palabras serían invisibles de todos modos. Por eso
    // vivir en JS es lo correcto y no una degradación.
    // ---------------------------------------------------------------------
    buildSemantic(field);

    // §28 — con reduced-motion no se arranca nada. La composición estática
    // del CSS ya es la versión final para ese usuario.
    if (DL.util.prefersReducedMotion()) { return; }

    // §27 — sin puntero fino no hay seguimiento. El relieve, la profundidad
    // y la deriva autónoma (CSS) siguen ahí.
    if (!DL.util.hasFinePointer()) { return; }

    // ---------------------------------------------------------------------
    // Estado
    // ---------------------------------------------------------------------
    var rect = hero.getBoundingClientRect();

    var targetX = 0, targetY = 0;      // objetivo normalizado -1 .. 1
    var pointerX = rect.width / 2;     // último punto conocido, en px del hero
    var pointerY = rect.height / 2;

    // Valores actuales, uno por sistema. Que sean independientes es lo que
    // permite que cada capa responda a distinta velocidad (§15).
    var reliefX = 0, reliefY = 0;
    var deepX = 0, deepY = 0;
    var lightX = pointerX, lightY = pointerY;
    var semX = pointerX, semY = pointerY;

    var running = false;
    var rafId = 0;
    var lit = false;

    // Guardián de rendimiento
    var lastTime = 0;
    var frameAcc = 0;
    var frameCount = 0;
    var degraded = false;

    var radius = CFG.light.radius;
    var semRadius = radius * CFG.light.semanticRatio;

    // ---------------------------------------------------------------------
    // Medidas — se cachean. Leer getBoundingClientRect() dentro de
    // pointermove forzaría un reflow sincrónico en cada evento.
    // ---------------------------------------------------------------------
    function measure() {
      rect = hero.getBoundingClientRect();
      radius = window.innerWidth < 900
        ? CFG.light.radius * 0.78
        : CFG.light.radius;
      semRadius = radius * CFG.light.semanticRatio;
      field.style.setProperty('--light-size', (radius * 2) + 'px');
      field.style.setProperty('--sem-size', (semRadius * 2) + 'px');
    }

    // ---------------------------------------------------------------------
    // Eventos. Sólo guardan números.
    // ---------------------------------------------------------------------
    function onPointerMove(ev) {
      pointerX = ev.clientX - rect.left;
      pointerY = ev.clientY - rect.top;

      // Normalizado a -1 .. 1 (§10)
      targetX = (pointerX / rect.width) * 2 - 1;
      targetY = (pointerY / rect.height) * 2 - 1;

      if (targetX < -1) { targetX = -1; } else if (targetX > 1) { targetX = 1; }
      if (targetY < -1) { targetY = -1; } else if (targetY > 1) { targetY = 1; }

      if (!lit) {
        lit = true;
        field.classList.add('is-lit');
      }
      start();
    }

    function onPointerLeave() {
      lit = false;
      field.classList.remove('is-lit');
      // Vuelve suavemente al reposo en lugar de saltar.
      targetX = 0;
      targetY = 0;
      start();
    }

    // ---------------------------------------------------------------------
    // Bucle único
    // ---------------------------------------------------------------------
    function frame(now) {
      var L = CFG.lerp;

      reliefX += (targetX - reliefX) * L.relief;
      reliefY += (targetY - reliefY) * L.relief;

      deepX += (targetX - deepX) * L.deep;
      deepY += (targetY - deepY) * L.deep;

      lightX += (pointerX - lightX) * L.light;
      lightY += (pointerY - lightY) * L.light;

      semX += (pointerX - semX) * L.semantic;
      semY += (pointerY - semY) * L.semantic;

      var d = CFG.depth;
      var s = field.style;

      s.setProperty('--p-back',    (deepX   * d.back.x).toFixed(2) + 'px');
      s.setProperty('--p-back-y',  (deepY   * d.back.y).toFixed(2) + 'px');
      s.setProperty('--p-mid',     (reliefX * d.mid.x).toFixed(2) + 'px');
      s.setProperty('--p-mid-y',   (reliefY * d.mid.y).toFixed(2) + 'px');
      s.setProperty('--p-front',   (reliefX * d.front.x).toFixed(2) + 'px');
      s.setProperty('--p-front-y', (reliefY * d.front.y).toFixed(2) + 'px');

      // §12 — la rotación es cruzada: el movimiento horizontal del cursor
      // gira sobre el eje Y, el vertical sobre el eje X (y en sentido
      // inverso, que es como se inclina una superficie real).
      s.setProperty('--rot-y', ( reliefX * CFG.rotation.y).toFixed(3) + 'deg');
      s.setProperty('--rot-x', (-reliefY * CFG.rotation.x).toFixed(3) + 'deg');

      // Máscaras y luz: esquina superior izquierda del cuadrado que las
      // contiene, no su centro.
      s.setProperty('--light-x', (lightX - radius).toFixed(1) + 'px');
      s.setProperty('--light-y', (lightY - radius).toFixed(1) + 'px');
      s.setProperty('--sem-x',   (semX - semRadius).toFixed(1) + 'px');
      s.setProperty('--sem-y',   (semY - semRadius).toFixed(1) + 'px');

      // --- Guardián de rendimiento (§26) -------------------------------
      if (!degraded) {
        if (lastTime) {
          var delta = now - lastTime;

          // Un frame larguísimo no significa que la máquina sea lenta:
          // significa que el navegador estranguló la pestaña (segundo plano,
          // ventana oculta, pausa del depurador). Contarlo degradaría el hero
          // para siempre por un motivo que no tiene que ver con el hero.
          if (delta > CFG.perf.stallMs) {
            lastTime = now;
            frameAcc = 0;
            frameCount = 0;
            rafId = window.requestAnimationFrame(frame);
            return;
          }

          frameAcc += delta;
          frameCount++;
          if (frameCount >= CFG.perf.samples) {
            if (frameAcc / frameCount > CFG.perf.budgetMs) {
              degraded = true;
              field.classList.add('is-lowfx');
            }
            frameAcc = 0;
            frameCount = 0;
          }
        }
        lastTime = now;
      }

      // --- Parada por reposo -------------------------------------------
      // Sin cursor encima y ya asentado: no tiene sentido seguir gastando
      // frames (ni batería). Cualquier movimiento vuelve a arrancarlo.
      if (!lit &&
          Math.abs(targetX - reliefX) < 0.001 &&
          Math.abs(targetY - reliefY) < 0.001 &&
          Math.abs(targetX - deepX) < 0.001 &&
          Math.abs(targetY - deepY) < 0.001) {
        running = false;
        lastTime = 0;
        return;
      }

      rafId = window.requestAnimationFrame(frame);
    }

    function start() {
      if (running) { return; }
      running = true;
      lastTime = 0;
      rafId = window.requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (rafId) { window.cancelAnimationFrame(rafId); rafId = 0; }
    }

    // ---------------------------------------------------------------------
    // Cableado
    // ---------------------------------------------------------------------
    measure();

    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', onPointerLeave, { passive: true });

    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', function () {
      rect = hero.getBoundingClientRect();
    }, { passive: true });

    // No animar en una pestaña oculta.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { stop(); } else if (lit) { start(); }
    });
  }

  // -----------------------------------------------------------------------
  // Layer 04 — construcción del campo semántico
  // -----------------------------------------------------------------------
  function buildSemantic(field) {
    var host = field.querySelector('[data-semantic]');
    var words = DL.data.site && DL.data.site.semantic;
    if (!host || !words || !words.length) { return; }

    var html = '';
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      html += '<span style="--x:' + DL.util.esc(w.x) +
              ';--y:' + DL.util.esc(w.y) +
              ';--s:' + DL.util.esc(w.s || 1) + '">' +
              DL.util.esc(w.word) + '</span>';
    }
    host.innerHTML = html;
  }
}());
