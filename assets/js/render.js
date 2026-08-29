/* ==========================================================================
   render.js — plantillas

   Funciones puras: reciben un ítem de /data/ y devuelven una cadena HTML.
   No tocan el DOM, no leen estado y no dependen de la página en la que se
   usan. Todo el texto pasa por DL.util.esc().
   ========================================================================== */

DL.render = (function () {
  'use strict';

  var esc = DL.util.esc;

  var ARROW =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var CLOSE =
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" stroke-width="1.2" ' +
    'stroke-linecap="round"/></svg>';

  var EXTERNAL =
    '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">' +
    '<path d="M5 3h6v6M11 3 4 10" stroke="currentColor" stroke-width="1.2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* Etiqueta temporal del ítem: fecha si la hay, si no el año. */
  function when(item) {
    return item.date ? DL.util.formatDate(item.date) : String(item.year || '');
  }

  /* ---------------------------------------------------------------------
     Tarjeta — Lab y Formación.
     Muestra sólo lo mínimo para decidir si abrir: tipo, título, resumen,
     estado y una llamada. Nada de stack ni detalles. §20.
     --------------------------------------------------------------------- */
  function card(item) {
    return '' +
      '<button class="card" type="button" data-slug="' + esc(item.slug) + '" ' +
              'aria-label="Abrir ficha de ' + esc(item.title) + '">' +
        '<span class="card__top">' +
          '<span class="meta card__type">' + esc(item.type) + '</span>' +
          '<span class="meta card__status" data-status="' + esc(item.status) + '">' +
            esc(item.status) +
          '</span>' +
        '</span>' +
        '<span class="card__title">' + esc(item.title) + '</span>' +
        '<span class="card__summary">' + esc(item.summary) + '</span>' +
        '<span class="card__foot">' +
          '<span class="arrow">Ver ficha ' + ARROW + '</span>' +
          '<span class="meta card__year">' + esc(item.year) + '</span>' +
        '</span>' +
      '</button>';
  }

  /* ---------------------------------------------------------------------
     Entrada de índice — Conocimiento y selección destacada de la home.
     Más editorial: se lee como una tabla de contenidos. §21.
     --------------------------------------------------------------------- */
  function entry(item) {
    return '' +
      '<button class="entry" type="button" data-slug="' + esc(item.slug) + '" ' +
              'aria-label="Abrir ficha de ' + esc(item.title) + '">' +
        '<span class="entry__meta">' +
          '<span class="meta">' + esc(item.type) + '</span>' +
          '<span class="meta">' + esc(when(item)) + '</span>' +
        '</span>' +
        '<span class="entry__body">' +
          '<span class="entry__title">' + esc(item.title) + '</span>' +
          '<span class="entry__abstract">' + esc(item.summary) + '</span>' +
        '</span>' +
        '<span class="entry__go">' + ARROW + '</span>' +
      '</button>';
  }

  /* ---------------------------------------------------------------------
     Ficha de detalle (dentro del <dialog>)
     --------------------------------------------------------------------- */

  /* Los "hechos" se construyen sólo con los campos que el ítem trae. Añadir
     un campo nuevo al esquema es añadir una línea aquí. */
  function facts(item) {
    var rows = [];

    if (item.category) { rows.push(['Categoría', item.category]); }
    if (item.audience) { rows.push(['Dirigido a', item.audience]); }
    if (item.mode)     { rows.push(['Modalidad', item.mode]); }
    if (item.duration) { rows.push(['Duración', item.duration]); }
    if (item.next)     { rows.push(['Próxima edición', item.next]); }
    if (item.authors && item.authors.length) {
      rows.push(['Autoría', item.authors.join(', ')]);
    }
    if (item.venue)    { rows.push(['Publicado en', item.venue]); }
    if (item.date)     { rows.push(['Fecha', DL.util.formatDate(item.date)]); }
    else if (item.year) { rows.push(['Año', item.year]); }

    if (!rows.length) { return ''; }

    var html = '<dl class="sheet__facts">';
    for (var i = 0; i < rows.length; i++) {
      html += '<div class="sheet__fact">' +
                '<dt class="meta">' + esc(rows[i][0]) + '</dt>' +
                '<dd>' + esc(rows[i][1]) + '</dd>' +
              '</div>';
    }
    return html + '</dl>';
  }

  function paragraphs(text) {
    if (!text) { return ''; }
    var parts = String(text).split('\n\n');
    var html = '';
    for (var i = 0; i < parts.length; i++) {
      var t = parts[i].trim();
      if (t) { html += '<p>' + esc(t) + '</p>'; }
    }
    return html;
  }

  function tags(list) {
    if (!list || !list.length) { return ''; }
    var html = '<div class="sheet__tags">';
    for (var i = 0; i < list.length; i++) {
      html += '<span class="tag">' + esc(list[i]) + '</span>';
    }
    return html + '</div>';
  }

  function actions(item) {
    var html = '';
    if (item.url) {
      html += '<a class="btn btn--primary" href="' + esc(item.url) + '" ' +
              'target="_blank" rel="noopener noreferrer">Abrir ' + EXTERNAL + '</a>';
    }
    if (item.repo) {
      html += '<a class="btn btn--ghost" href="' + esc(item.repo) + '" ' +
              'target="_blank" rel="noopener noreferrer">Código ' + EXTERNAL + '</a>';
    }
    return html ? '<div class="sheet__actions">' + html + '</div>' : '';
  }

  function sheet(item) {
    return '' +
      '<div class="sheet__scroll">' +
        '<div class="sheet__top">' +
          '<div class="sheet__kicker">' +
            '<span class="meta">' + esc(item.type) + '</span>' +
            '<span class="meta">' + esc(item.status) + '</span>' +
            '<span class="meta">' + esc(when(item)) + '</span>' +
          '</div>' +
          '<button class="sheet__close" type="button" data-close ' +
                  'aria-label="Cerrar ficha">' + CLOSE + '</button>' +
        '</div>' +
        '<h2 class="sheet__title" id="sheet-title">' + esc(item.title) + '</h2>' +
        '<p class="sheet__summary">' + esc(item.summary) + '</p>' +
        '<div class="sheet__body prose">' + paragraphs(item.description) + '</div>' +
        facts(item) +
        tags(item.tags) +
        actions(item) +
      '</div>';
  }

  return {
    ARROW: ARROW,
    card: card,
    entry: entry,
    sheet: sheet
  };
}());
