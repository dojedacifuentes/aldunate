# IA / Derecho PUCV · maqueta «Panel»

Maqueta de la plataforma de IA y Derecho para la Escuela de Derecho PUCV, con EVA, con estructura de panel de estudio
(menú lateral, buscador, tarjetas, pestañas de módulos, sesiones desplegables y panel de materiales). La estructura se
inspira en el archivo de la comunidad de Figma «Dashboard Instituto UIN»; el código y el diseño visual son propios.

- Cinco pantallas: Inicio, Cursos (un curso por dentro), Videocápsulas, Docentes y Pregunta a EVA (`#inicio`, `#cursos`…).
- Sin cuentas: el avance que marca cada estudiante se guarda sólo en su navegador. La primera visita muestra una
  bienvenida (con nombre opcional) y el avance en cero; `?demo` muestra un avance simulado.
- Modo claro «Marfil y burdeos» (otras paletas para comparar con `?paleta=vino|tinta|noche|blanco`) y oscuro, con estilo vidrio en los paneles (grano y borde de luz que sigue al puntero) sobre un fondo liso. Respeta «reducir transparencia» y «reducir movimiento».
- Movimiento y sonido (`efectos.js`): las piezas entran con muelle, el tema cambia en círculo desde su botón y, al
  terminar un módulo, saltan las cruces del escudo y aparece un aviso. Los sonidos se sintetizan en el navegador (sin
  archivos), suenan sólo al hacer algo y se apagan con el botón «Sonido»; en Android también vibra.
- Sitio estático: `index.html`, `app.js`, `efectos.js` y `escudo.js`. Sin dependencias ni compilación.
- Es una **maqueta**: el avance, las fechas, la sección docente y los textos de las sesiones son de muestra, y las
  respuestas de EVA están escritas de antemano. Los textos jurídicos están pendientes de revisión.
- El escudo aparece siempre completo (cruces, león y lema). Es una reconstrucción del archivo publicado por la Facultad; su uso está pendiente de
  autorización de la Escuela.

Las versiones anteriores de este repositorio («Plano azul», «Holograma» y DIÓGENES LAB) siguen en el historial de git.
