/* ==========================================================================
   data/site.js — metadatos del sitio

   NOTA SOBRE EL CONTACTO
   La dirección de correo NO está aquí: vive como `mailto:` literal en el
   marcado de las 5 páginas (navbar, footer y cierres de página), porque el
   contacto tiene que funcionar aunque el JavaScript no cargue.
   Cambiarla = buscar y reemplazar `hola@diogeneslab.cl` en los .html.
   ⚠ Esa dirección es un PLACEHOLDER: sustituir antes de publicar.
   ========================================================================== */

DL.data.site = {

  name: 'Diógenes Lab',

  /* Layer 04 — campo semántico del hero.
     Textura conceptual, no contenido: el contenedor es aria-hidden y las
     palabras sólo asoman bajo la luz del cursor. Nunca compiten con el
     titular, por eso todas viven a la derecha del 50%.
        x, y : posición en el hero
        s    : multiplicador de tamaño sobre --fs-micro */
  semantic: [
    { word: 'NORMA',         x: '63%', y: '18%', s: 1.30 },
    { word: 'MODELO',        x: '84%', y: '27%', s: 1.05 },
    { word: 'INFERENCIA',    x: '71%', y: '41%', s: 0.95 },
    { word: 'DECISIÓN',      x: '90%', y: '52%', s: 1.20 },
    { word: 'CONTROL',       x: '58%', y: '61%', s: 1.00 },
    { word: 'LENGUAJE',      x: '77%', y: '72%', s: 1.10 },
    { word: 'TRANSPARENCIA', x: '66%', y: '86%', s: 0.90 },
    { word: 'PODER',         x: '93%', y: '79%', s: 1.35 }
  ]
};
