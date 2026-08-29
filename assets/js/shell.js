/* ==========================================================================
   shell.js — navbar

   Dos comportamientos, nada más:
     1. la línea inferior de la navbar aparece cuando la página se desplaza;
     2. el menú móvil se abre y se cierra.

   La navegación funciona sin este fichero: son cinco enlaces reales en el
   marcado. Esto sólo la pule.
   ========================================================================== */

DL.shell = (function () {
  'use strict';

  function init() {
    var nav = DL.util.$('[data-nav]');
    if (!nav) { return; }

    scrolled(nav);
    mobileMenu(nav);
  }

  // -----------------------------------------------------------------------
  // Línea inferior al desplazarse
  // -----------------------------------------------------------------------
  function scrolled(nav) {
    var ticking = false;

    function apply() {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }

    apply();

    window.addEventListener('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(apply);
    }, { passive: true });
  }

  // -----------------------------------------------------------------------
  // Menú móvil
  // -----------------------------------------------------------------------
  function mobileMenu(nav) {
    var toggle = DL.util.$('[data-nav-toggle]', nav);
    var panel = DL.util.$('[data-nav-panel]', nav);
    if (!toggle || !panel) { return; }

    function setOpen(open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    }

    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('is-open'));
    });

    // Al elegir un destino, el menú sobra.
    panel.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) { setOpen(false); }
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Al pasar a desktop, el panel deja de existir: no dejarlo "abierto".
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) { setOpen(false); }
    }, { passive: true });
  }

  return { init: init };
}());
