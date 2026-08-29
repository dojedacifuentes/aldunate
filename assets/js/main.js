/* ==========================================================================
   main.js — arranque

   Último script de la página. Decide qué se inicia según lo que el marcado
   declare, no según la URL: si una página añade un hero o una colección,
   funciona sin tocar este fichero.

   Todo va dentro de un try/catch por sistema. Un fallo en la interacción del
   hero no puede llevarse por delante la navegación ni el contenido. §29.
   ========================================================================== */

(function () {
  'use strict';

  function safe(label, fn) {
    try {
      fn();
    } catch (err) {
      // El sitio sigue en pie; el error queda registrado para depurarlo.
      if (window.console && console.warn) {
        console.warn('[Diógenes Lab] fallo en ' + label + ':', err);
      }
    }
  }

  function boot() {
    safe('shell', function () { DL.shell.init(); });
    safe('reveal', function () { DL.reveal.init(); });

    safe('sheet', function () { DL.collection.wireSheet(); });
    safe('collections', function () { DL.collection.mountAll(); });

    safe('hero', function () {
      var hero = DL.util.$('[data-hero]');
      if (hero) { DL.heroField.init(hero); }
    });

    document.documentElement.classList.add('js-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}());
