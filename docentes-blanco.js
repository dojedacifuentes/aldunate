/* Docentes «en blanco» (pedido del propietario, 29-10-2026): la sección se muestra vacía, como un plano de lo que podría
   tener, para conversarla con la Escuela antes de llenarla. Cada bloque dice qué iría ahí. La versión con contenido de
   muestra sigue en app.js (vistaDocentes) por si se quiere volver a ella. */
const BLOQUES_DOCENTES = [
  ['ancho', 'Guía del módulo', 'Antes, durante y después de cada clase: qué compartir, qué hacer en el aula y cómo cerrar. Una por módulo.'],
  ['', 'Tu sección', 'Cuántos estudiantes empezaron y terminaron cada módulo, sin nombres.'],
  ['', 'Materiales para la clase', 'Presentaciones, casos y pautas para descargar.'],
  ['', 'Evaluar con IA', 'Preguntas que una IA no resuelve bien sola, y cómo pedir el proceso además del resultado.'],
  ['', 'Lo que no se delega', 'Qué revisa siempre el docente: las fuentes, el contenido jurídico y la autoría.'],
];
function vistaDocentesBlanco() {
  return `
  <div class="titulo"><div><h1>Docentes</h1><p>Esta sección está en blanco a propósito: así podría quedar. Cada bloque dice qué iría ahí.</p>${evaLinea('Para quien enseña. Yo sólo respondo: enseñar es otra cosa.')}</div></div>
  <div class="doc-plano">${BLOQUES_DOCENTES.map(([cl, t, d], i) => `
    <section class="doc-bloque ${cl}"><span class="doc-n mono">${String(i + 1).padStart(2, '0')}</span><h2>${t}</h2><p>${d}</p>
      <div class="doc-lineas" aria-hidden="true"><i></i><i></i><i></i></div></section>`).join('')}</div>
  <p class="muestra" style="margin-top:16px">SECCIÓN EN DISEÑO · SE DEFINE CON LA ESCUELA</p>`;
}
