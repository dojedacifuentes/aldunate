# IA / Derecho PUCV · maqueta «Panel»

Maqueta de la plataforma de IA y Derecho para la Escuela de Derecho PUCV, con EVA, con estructura de panel de estudio
(menú lateral, buscador, tarjetas, pestañas de módulos, sesiones desplegables y panel de materiales). La estructura se
inspira en el archivo de la comunidad de Figma «Dashboard Instituto UIN»; el código y el diseño visual son propios.

- Ocho secciones por `#hash`: Inicio, Mis cursos (tarjetas; cada curso en `#cursos/1`…`#cursos/8`), Videocápsulas
  (`#video/curso-módulo`), Laboratorio EVA (`#laboratorio`, `#laboratorio/01`…`06`), Recursos, Guías y protocolos
  (`#guias/<id>`), Docentes y Pregunta a EVA. En el teléfono: cuatro en la barra y el resto en «Más».
- **EVA flotante** en todas las pantallas: el isotipo real de EVA (geometría de `eva.proyecto01/src/lib/brand.ts`:
  ocho piezas rígidas; al abrir, el cuadrado se desacopla). Abre un panel con sugerencias según la sección. Son
  respuestas preparadas: EVA no está conectada a un modelo de IA en esta maqueta, y el panel lo dice.
- **EVA Lab**: seis experimentos (patrón oscuro SÍ/NO, verificación «humana», actualización al 99 %, decisión
  automatizada, contrato con cláusula escondida, audiencia contra la IA). Casos y documentos ficticios; nada tiene efecto real.
- **Bienvenida** (sólo la primera vez): la pregunta SÍ/NO, la revelación y la entrada con nombre opcional. Se puede omitir.
- Sin cuentas: avance, nombre, ajustes y experimentos hechos se guardan sólo en el navegador (`panel:*` en localStorage).
  `?demo` muestra un avance simulado, `?nuevo` simula la primera visita y `?sinbienvenida` la salta.
- Buscador (Ctrl K), letra y contraste, recorrido de ayuda, constancia de avance (no es un certificado), sonidos
  sintetizados con botón para apagarlos. Respeta «reducir movimiento» y «reducir transparencia».
- Modo claro «Marfil y burdeos» (otras paletas con `?paleta=vino|tinta|noche|blanco`) y oscuro.
- Sitio estático sin dependencias: `index.html`, `app.js`, `efectos.js`, `eva-ui.js`/`.css`, `recursos.js`,
  `laboratorio.js`/`.css`, `vitrinas.css` y `escudo.js`.
- Es una **maqueta**: cursos, videocápsulas, guías, novedades y la sección docente son de muestra. Sólo se enlazan
  sitios ya publicados (de EVA y fuentes oficiales, revisados el 28-10-2026). Los textos jurídicos están pendientes de revisión.
- El escudo aparece siempre completo. Es una reconstrucción del archivo publicado por la Facultad; su uso está pendiente
  de autorización de la Escuela.

Las versiones anteriores de este repositorio («Plano azul», «Holograma» y DIÓGENES LAB) siguen en el historial de git.
