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
