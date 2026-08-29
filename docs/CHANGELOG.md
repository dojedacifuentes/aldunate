# CHANGELOG — Diógenes Lab

Cambios relevantes por sesión. No se registran cambios triviales.

---

## 2026-08-29

### Added
- Repositorio inicial. Sitio estático sin dependencias ni build step.
- Documentación base: `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `DECISIONS.md`.
- ADR-000 a ADR-004.
- `tools/serve.ps1`: servidor estático local sin dependencias.

### Added — implementación
- Arquitectura de información de cuatro secciones (Inicio, Lab, Conocimiento,
  Formación) más `sobre.html` fuera de la navegación principal.
- Navbar sticky con menú móvil, y footer, en las 5 páginas.
- Sistema de diseño: `tokens.css` como fuente única de color, tipografía,
  espacio y movimiento.
- Generador del *Parametric Knowledge Field* (`tools/generate-field.ps1`):
  curvas de nivel por marching squares sobre un campo escalar, repartidas en
  tres profundidades.
- Hero con las cinco capas del brief: base, relieve, retícula, campo semántico
  y luz del cursor.
- Interacción del hero: bucle rAF único, inercia con velocidades diferenciadas
  por sistema, paralaje de tres profundidades, microrrotación y revelado por
  máscara.
- Capa de datos en `/data/` con filtros derivados de los propios datos.
- Ficha de detalle sobre `<dialog>` nativo, con enlace profundo por slug.
- `tools/serve.ps1`: servidor estático local sin dependencias.
- ADR-005 (máscaras por `mask-position`) y ADR-006 (guardián de rendimiento).

### Fixed
- En el índice editorial, título y resumen se pegaban en la misma línea: son
  `<span>` dentro de un `<button>` (única opción válida según el modelo de
  contenido de `button`) y les faltaba `display: block`.
- El guardián de rendimiento degradaba el hero de forma permanente cuando el
  navegador estrangulaba `requestAnimationFrame`. Ahora descarta esos frames.

### Notas
- El contenido de `/data/` es **material de ejemplo (PLACEHOLDER)**.
- La dirección `hola@diogeneslab.cl` es un **PLACEHOLDER** presente en el
  marcado de las 5 páginas.

### Fixed — accesibilidad
- `--ink-040` pasa de `#5E686D` a `#747F84`. Es el color de toda la tipografía
  mono a 11px, y a 3.53:1 no alcanzaba el 4.5:1 que exige la AA para texto
  pequeño. Ahora da 4.91:1 sobre el fondo del documento y 4.53:1 sobre la
  superficie más clara del sistema.
- `--ink-020` pasa de `#39423F` a `#545F64`: sube a 3.07:1 (mínimo AA para
  texto grande) y vuelve a la familia de grises fríos — el valor anterior era
  verdoso, fuera del sistema.
- `.card__year` deja de usar `--ink-020`: es información y se muestra a 11px,
  así que necesita `--ink-040`.
- Al cerrar la ficha, la URL se limpia recortando el hash de `location.href` en
  vez de reconstruirla desde `pathname + search`, que bajo `file://` deforma
  las rutas con caracteres codificados.

### Verificado
- 5 páginas sin errores de consola; 26 assets comprobados, ningún enlace roto.
- Sin desbordamiento horizontal en 375px ni en escritorio.
- Contraste medido en navegador: todo el texto cumple AA.
- Foco: la ficha atrapa el foco y lo devuelve al cerrarse.
- Móvil: menú abre/cierra con `Esc`; luz, máscaras y campo semántico se
  desactivan por CSS.

### Added — despliegue y traspaso
- `vercel.json`: despliegue determinista sin build (`framework: null`,
  `outputDirectory: "."`), cabeceras de seguridad y una CSP **verificada en
  navegador con cero violaciones**. `cleanUrls` queda desactivado a propósito
  para que los enlaces `.html` sigan siendo válidos también con doble clic y en
  GitHub Pages.
- `docs/GUIA-RAPIDA.md`: comandos y tareas frecuentes, para el dueño del sitio.
- `docs/HANDOFF.md`: documento de traspaso — restricciones del entorno, estado
  verificado y no verificado, trampas ya descubiertas, qué falta y cómo
  comprobar que nada se rompió.
