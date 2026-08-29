/* ==========================================================================
   reveal.js — aparición al entrar en viewport

   Un único patrón de aparición en todo el sitio (opacidad + 12px), definido
   en base.css. Aquí sólo se decide CUÁNDO se activa.

   Si no hay IntersectionObserver, o si el usuario pide menos movimiento,
   todo se marca como visible de inmediato: nunca queda contenido invisible
   por culpa de una animación que no llegó a dispararse. §29.
   ========================================================================== */

DL.reveal = (function () {
  'use strict';

  var observer = null;

  function showAll(root) {
    var nodes = DL.util.$$('[data-reveal]', root || document);
    for (var i = 0; i < nodes.length; i++) { nodes[i].classList.add('is-in'); }
  }

  function init() {
    if (DL.util.prefersReducedMotion() || !('IntersectionObserver' in window)) {
      showAll();
      return;
    }

    observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-in');
          observer.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    refresh();
  }

  /* Vuelve a registrar los elementos nuevos. Lo llama collection.js cada vez
     que repinta una rejilla (por ejemplo, al cambiar de filtro). */
  function refresh(root) {
    if (!observer) { showAll(root); return; }
    var nodes = DL.util.$$('[data-reveal]', root || document);
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].classList.contains('is-in')) { observer.observe(nodes[i]); }
    }
  }

  return { init: init, refresh: refresh };
}());
