/* ==========================================================================
   config.js — TUNING PARAMETERS

   Fuente única de todos los valores ajustables de la interacción del hero.
   Si quieres cambiar cómo se siente el fondo, se cambia AQUÍ y en ningún
   otro sitio. Ningún valor de estos está repetido en el CSS ni en el JS.

   La explicación de qué hace cada uno está en docs/INTERACTION-SYSTEM.md
   § Tuning Parameters.
   ========================================================================== */

DL.config = {

  hero: {

    /* --- Interpolación (§10) -------------------------------------------
       current += (target - current) * factor,  cada frame.
       Más alto = alcanza antes = se siente más ligero.
       Rango útil: 0.04 – 0.10.

       §15: NO todo responde igual. Esa diferencia de velocidades es lo que
       produce la sensación de materialidad — de capas con masa distinta. */
    lerp: {
      relief:   0.100,   // rápido pero amortiguado
      light:    0.075,   // medio
      deep:     0.050,   // paralaje profundo, más lento
      semantic: 0.042    // revelado semántico, ligeramente más lento aún
    },

    /* --- Paralaje (§11) --------------------------------------------------
       Desplazamiento máximo en píxeles con el cursor en el borde.
       El usuario debe SENTIR profundidad y no PERCIBIR que las capas se
       mueven. Subir estos valores rompe justamente eso. */
    depth: {
      back:  { x: 4,  y: 3 },
      mid:   { x: 8,  y: 6 },
      front: { x: 13, y: 9 }
    },

    /* --- Microrotación (§12) --------------------------------------------
       Grados máximos. Casi imperceptible por diseño: el hero no es una
       tarjeta 3D que se inclina. */
    rotation: {
      x: 0.5,
      y: 0.8
    },

    /* --- Luz del cursor (§8, Layer 05) ----------------------------------
       Radio en píxeles. El brief pide 450–600 en desktop.
       `semanticRatio` es la fracción de ese radio con la que se revela el
       campo semántico: más pequeño, para que las palabras aparezcan sólo
       en el centro de la luz y nunca en su borde. */
    light: {
      radius: 520,
      semanticRatio: 0.72
    },

    /* --- Guardián de rendimiento (§26) -----------------------------------
       Si el tiempo medio por frame supera `budgetMs` durante `samples`
       frames seguidos, se marca el campo como `is-lowfx` y se retiran las
       capas con máscara (lo más caro). El hero sigue funcionando: revela
       menos, pero conserva relieve, luz y paralaje.
       22 ms ≈ 45 fps.

       `stallMs` descarta frames anómalos. Por encima de ese valor no estamos
       midiendo una máquina lenta sino una pestaña estrangulada por el
       navegador (segundo plano, ventana oculta, depurador detenido), y contar
       esos frames degradaría el hero de forma permanente sin motivo. */
    perf: {
      budgetMs: 22,
      samples: 90,
      stallMs: 120
    }
  }
};
