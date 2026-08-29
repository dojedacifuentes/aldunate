/* ==========================================================================
   collection.js — montaje de una colección

   Lee la configuración del propio marcado:

     <div data-collection="projects"   nombre(s) en DL.data, separados por coma
          data-layout="grid|index"     tarjetas o índice editorial
          data-filters                 (opcional) construye los filtros dentro
                                       del hijo marcado con data-filters-host
          data-limit="3"               (opcional) recorta, para la home
          data-featured>               (opcional) sólo los destacados

   Los filtros NO están escritos a mano en ninguna parte: se derivan de los
   `type` presentes en los datos. Añadir un ítem con un tipo nuevo hace
   aparecer su filtro solo. §19.
   ========================================================================== */

DL.collection = (function () {
  'use strict';

  var $ = DL.util.$;
  var esc = DL.util.esc;

  var ALL = 'todo';

  function mountAll() {
    var roots = DL.util.$$('[data-collection]');
    for (var i = 0; i < roots.length; i++) { mount(roots[i]); }
    if (roots.length) { openFromHash(); }
  }

  function mount(root) {
    // Acepta varias colecciones separadas por coma. La home lo usa para
    // mezclar Lab, Conocimiento y Formación en una sola selección.
    var names = root.getAttribute('data-collection').split(',');
    var source = [];

    for (var n = 0; n < names.length; n++) {
      var set = DL.data[names[n].trim()];
      if (set && set.length) { source = source.concat(set); }
    }

    // Si faltan los datos, se deja el aviso del marcado y no se rompe nada.
    if (!source.length) { return; }

    var items = DL.util.sorted(source);

    if (root.hasAttribute('data-featured')) {
      items = items.filter(function (it) { return it.featured; });
    }

    var limit = parseInt(root.getAttribute('data-limit'), 10);
    if (limit > 0) { items = items.slice(0, limit); }

    var layout = root.getAttribute('data-layout') || 'grid';
    var list = $('[data-list]', root);
    if (!list) { return; }

    var state = { filter: ALL };

    // --- Filtros -------------------------------------------------------
    var filtersHost = $('[data-filters-host]', root);
    if (filtersHost && root.hasAttribute('data-filters')) {
      buildFilters(filtersHost, items, state, function () { draw(); });
    }

    // --- Pintado -------------------------------------------------------
    function visible() {
      if (state.filter === ALL) { return items; }
      return items.filter(function (it) { return it.type === state.filter; });
    }

    function draw() {
      var shown = visible();

      list.className = layout === 'index' ? 'index' : 'grid';

      if (!shown.length) {
        list.className = '';
        list.innerHTML = '<p class="empty">No hay elementos con ese filtro.</p>';
      } else {
        var html = '';
        var tpl = layout === 'index' ? DL.render.entry : DL.render.card;
        for (var i = 0; i < shown.length; i++) { html += tpl(shown[i]); }
        list.innerHTML = html;
      }

      var count = $('[data-count]', root);
      if (count) {
        count.textContent = shown.length + (shown.length === 1 ? ' elemento' : ' elementos');
      }

      if (DL.reveal) { DL.reveal.refresh(root); }
    }

    // --- Apertura de ficha ---------------------------------------------
    list.addEventListener('click', function (ev) {
      var trigger = ev.target.closest('[data-slug]');
      if (!trigger) { return; }
      var slug = trigger.getAttribute('data-slug');
      var item = find(slug);
      if (item) { open(item); }
    });

    draw();
  }

  // -----------------------------------------------------------------------
  // Filtros
  // -----------------------------------------------------------------------
  function buildFilters(host, items, state, onChange) {
    var types = [];
    for (var i = 0; i < items.length; i++) {
      if (types.indexOf(items[i].type) === -1) { types.push(items[i].type); }
    }
    types.sort(function (a, b) { return a.localeCompare(b, 'es'); });

    // Con un solo tipo, un filtro no ayuda a nadie: no se muestra. §1
    if (types.length < 2) { host.hidden = true; return; }

    var html = button(ALL, 'Todo', true);
    for (var j = 0; j < types.length; j++) {
      html += button(types[j], types[j], false);
    }
    html += '<span class="filters__count" data-count aria-live="polite"></span>';

    host.innerHTML = html;
    host.hidden = false;

    host.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.filter');
      if (!btn) { return; }

      var value = btn.getAttribute('data-filter');
      if (value === state.filter) { return; }

      state.filter = value;

      var all = DL.util.$$('.filter', host);
      for (var k = 0; k < all.length; k++) {
        all[k].setAttribute('aria-pressed',
          all[k].getAttribute('data-filter') === value ? 'true' : 'false');
      }
      onChange();
    });

    function button(value, label, pressed) {
      return '<button class="filter" type="button" data-filter="' + esc(value) + '" ' +
             'aria-pressed="' + (pressed ? 'true' : 'false') + '">' +
             esc(label) + '</button>';
    }
  }

  // -----------------------------------------------------------------------
  // Ficha de detalle
  // -----------------------------------------------------------------------
  function find(slug) {
    var names = ['projects', 'knowledge', 'training'];
    for (var i = 0; i < names.length; i++) {
      var set = DL.data[names[i]];
      if (!set) { continue; }
      for (var j = 0; j < set.length; j++) {
        if (set[j].slug === slug) { return set[j]; }
      }
    }
    return null;
  }

  function open(item) {
    var dialog = $('[data-sheet]');
    if (!dialog) { return; }

    dialog.innerHTML = DL.render.sheet(item);

    // Enlace profundo: la ficha abierta se puede compartir.
    try {
      history.replaceState(null, '', '#' + item.slug);
    } catch (e) { /* file:// puede rechazarlo; no es crítico */ }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      // Sin <dialog> modal: se muestra igualmente, sin bloqueo de fondo.
      dialog.setAttribute('open', '');
    }
  }

  function openFromHash() {
    var slug = (location.hash || '').replace(/^#/, '');
    if (!slug) { return; }
    var item = find(decodeURIComponent(slug));
    if (item) { open(item); }
  }

  function wireSheet() {
    var dialog = $('[data-sheet]');
    if (!dialog) { return; }

    // Cerrar con el botón, o pulsando fuera de la ficha.
    dialog.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-close]')) { dialog.close(); return; }
      if (ev.target === dialog) { dialog.close(); }
    });

    dialog.addEventListener('close', function () {
      dialog.innerHTML = '';
      try {
        history.replaceState(null, '', location.pathname + location.search);
      } catch (e) { /* ídem */ }
    });
  }

  return { mountAll: mountAll, wireSheet: wireSheet };
}());
