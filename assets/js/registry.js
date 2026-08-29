/* ==========================================================================
   registry.js — espacio de nombres global

   Sustituye a los imports de ES Modules. El sitio no tiene build step y los
   módulos ES están bloqueados bajo file://, así que todo se cuelga de un
   único objeto global en lugar de contaminar `window`. Ver ADR-000.

   Debe cargarse EL PRIMERO.
   ========================================================================== */

window.DL = window.DL || {};

DL.data = DL.data || {};

DL.util = (function () {
  'use strict';

  var ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

  return {

    /* Escapa texto que va a inyectarse como HTML. Todo el contenido de
       /data/ pasa por aquí antes de tocar el DOM. */
    esc: function (value) {
      if (value === null || value === undefined) { return ''; }
      return String(value).replace(/[&<>"']/g, function (c) { return ENT[c]; });
    },

    $: function (sel, root) { return (root || document).querySelector(sel); },

    $$: function (sel, root) {
      return Array.prototype.slice.call((root || document).querySelectorAll(sel));
    },

    /* Convierte '2026-05-14' en '14 mayo 2026'. Devuelve el original si no
       parsea, para no perder información por un formato inesperado. */
    formatDate: function (iso) {
      if (!iso) { return ''; }
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
      if (!m) { return iso; }
      var months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      return parseInt(m[3], 10) + ' ' + months[parseInt(m[2], 10) - 1] + ' ' + m[1];
    },

    /* Ordena una colección: primero por fecha si la tiene, si no por año.
       Descendente, y a igualdad, alfabético. */
    sorted: function (items) {
      return items.slice().sort(function (a, b) {
        var ka = a.date || String(a.year || 0);
        var kb = b.date || String(b.year || 0);
        if (ka > kb) { return -1; }
        if (ka < kb) { return 1; }
        return String(a.title).localeCompare(String(b.title), 'es');
      });
    },

    prefersReducedMotion: function () {
      return window.matchMedia &&
             window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    hasFinePointer: function () {
      return window.matchMedia &&
             window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    }
  };
}());
