# DECISIONS.md — Diógenes Lab

Registro de decisiones de arquitectura (ADR).
Formato fijo: **Decisión · Motivo · Alternativas consideradas · Consecuencia**.

Sólo se crea un ADR cuando la decisión es difícil de revertir, condiciona otras
decisiones, o alguien podría razonablemente preguntar más adelante "¿por qué está
hecho así?".

---

## ADR-000 — Sitio estático sin build step (HTML + CSS + JS clásico)

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

Construir el sitio como HTML estático multi-página con CSS y JavaScript planos,
sin bundler, sin framework y sin paso de compilación. Los scripts se cargan como
`<script defer>` clásicos (no ES modules).

### Motivo

1. **La máquina de desarrollo no tiene Node.js, npm ni Python instalados.**
   Verificado el 2026-08-29: sólo existen Git 2.55 y Windows PowerShell 5.1.
   Un proyecto React/Next/Vite se podría *escribir*, pero no se podría instalar,
   ejecutar, inspeccionar en consola ni medir. Eso rompe la regla de estabilidad
   del proyecto (§31: ejecutar y verificar después de cada etapa) desde la etapa 1.
2. El sitio no necesita servidor, sesión, ni estado compartido. Es un hub de
   contenido curado. Un framework SPA no resuelve ningún problema real aquí.
3. Sin build step, el sitio se despliega en cualquier hosting estático
   (GitHub Pages, Netlify, Cloudflare Pages, un directorio en un servidor) sin
   pipeline, y sobrevive intacto a años sin mantenimiento de dependencias.

### Alternativas consideradas

- **Next.js / React.** Rechazada: imposible de ejecutar y verificar en este
  entorno; introduce ~300 MB de dependencias y un ciclo de mantenimiento para un
  sitio de contenido. El prompt original menciona React (§9), pero como
  *restricción condicional* ("no usar React state para el cursor"), no como
  requisito de stack.
- **Vite + TypeScript sin framework.** Rechazada por el mismo bloqueo de Node.
- **ES Modules nativos (`<script type="module">`).** Rechazada: los módulos ES
  están bloqueados por CORS bajo el protocolo `file://`. Si el usuario abre
  `index.html` con doble clic, el sitio quedaría vacío — exactamente el modo de
  fallo prohibido en §29 ("errores JS que bloqueen el hero"). Los scripts
  clásicos funcionan idénticamente en `file://` y en HTTP.

### Consecuencia

- **A favor:** cero dependencias, cero superficie de fallo, arranque instantáneo,
  el sitio funciona con doble clic y en cualquier host estático.
- **En contra:** sin TypeScript, sin componentes reutilizables por composición.
  El *shell* (navbar y footer) está duplicado literalmente en las 5 páginas y
  debe mantenerse sincronizado a mano. Esto está documentado en
  `ARCHITECTURE.md → Shell compartido`.
- **Puerta de salida:** el código está organizado un fichero = una
  responsabilidad, y la capa de datos está aislada en `/data/`. Migrar a un
  bundler más adelante es mecánico, no una reescritura.

---

## ADR-001 — SVG + CSS para el fondo del hero, en lugar de WebGL

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

El *Parametric Knowledge Field* se construye con SVG estático (paths de estratos
generados y embebidos en el HTML) más capas CSS, animado exclusivamente mediante
`transform` y `opacity` sobre variables CSS. Sin Canvas, sin WebGL, sin shaders.

### Motivo

- El §8 del brief lo pide explícitamente: *"NO elegir WebGL automáticamente.
  Primero evaluar si SVG + CSS permiten alcanzar suficiente calidad."*
- El efecto buscado (estratos, relieve, profundidad, revelado por cursor) es una
  composición **estratificada y estática** movida en paralaje. No requiere
  simulación por píxel: no hay ruido animado, ni partículas, ni deformación
  continua de malla. SVG lo cubre por completo.
- El SVG está en el DOM: es visible aunque el JavaScript falle. Un canvas vacío
  o un contexto WebGL perdido dejarían el hero en negro. §29 exige lo contrario.
- Coste: 0 KB de dependencias frente a ~150 KB de una librería WebGL mínima.

### Alternativas consideradas

- **Canvas 2D.** Da libertad de deformación por frame, pero obliga a redibujar en
  cada tick, no tiene fallback sin JS, y no permite aplicar `mask-image` CSS por
  capa. Rechazada.
- **WebGL / shader.** Máxima libertad visual y coste máximo: pérdida de contexto,
  variabilidad entre GPUs, consumo de batería, y un modo de fallo (pantalla
  negra) que contradice el §29. Rechazada.

### Consecuencia

- Menor libertad de deformación orgánica: el relieve es una composición fija que
  se mueve, no una superficie que se deforma. A cambio, es estable, inspeccionable
  y degrada con elegancia.
- Si en el futuro se quisiera deformación real, el punto de inserción está
  aislado: la capa `.field__relief` se puede sustituir sin tocar el resto del
  sistema de interacción, que sólo escribe variables CSS.

---

## ADR-002 — Multi-página real, no router de cliente

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

Cada sección principal es un fichero HTML propio (`index`, `lab`, `conocimiento`,
`formacion`, `sobre`). No hay router JavaScript ni navegación por hash.

### Motivo

- El contenido crítico (hero, títulos, navegación, footer, CTA) existe como HTML
  real en cada página. §29 lo exige: *"El contenido HTML tiene prioridad absoluta."*
- URLs reales, indexables y compartibles, sin configuración de servidor.
- El botón "atrás" del navegador funciona sin código.

### Alternativas consideradas

- **SPA con hash router.** Evitaría duplicar el shell, pero deja el sitio en
  blanco si el JS falla y obliga a reimplementar el historial. Rechazada.
- **Inyectar navbar y footer por JavaScript.** Elimina la duplicación, pero hace
  desaparecer la navegación sin JS. Rechazada por la misma razón.

### Consecuencia

El bloque `<header>` y el `<footer>` están duplicados en 5 ficheros. Es
duplicación consciente y acotada (~40 líneas). La regla de mantenimiento está en
`ARCHITECTURE.md`. Las rejillas de contenido (Lab, Conocimiento, Formación) sí se
generan desde `/data/`, porque son la parte que crece.

---

## ADR-003 — Una sola familia sans + una mono, sin color como jerarquía

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

Instrument Sans (interfaz) + IBM Plex Mono (metadatos, numeración, campo
semántico). Un único acento cromático: cian muy desaturado. La jerarquía se
construye con tamaño, peso, tracking y opacidad — no con color.

### Motivo

§23 y §24 del brief. El color como jerarquía es lo que produce el aspecto
"dashboard corporativo" que el proyecto rechaza. La mono aporta carácter
técnico-institucional sin recurrir a estética *hacker*.

### Alternativas consideradas

- **Inter / Geist.** Neutras y competentes, pero son exactamente la tipografía
  por defecto del producto de IA genérico que el brief descarta.
- **Añadir una serif para Conocimiento.** Serían tres familias. El tono editorial
  de esa sección se resuelve con medida de línea, interlineado y escala.

### Consecuencia

Dos webfonts desde Google Fonts, con `font-display: swap` y una pila de respaldo
completa del sistema. Si la red falla, el sitio se ve correcto en la pila del
sistema.

---

## ADR-004 — Estados y categorías se comunican por tipografía, no por badges de color

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

`status`, `type` y `category` se renderizan como texto mono en minúscula/versalita
y opacidad graduada. No hay píldoras de color, ni fondos de badge, ni iconos.

### Motivo

§1 prohíbe explícitamente *badges excesivos* e *iconos redundantes*. Un `status`
con fondo verde/ámbar/gris introduce tres colores nuevos y convierte cada tarjeta
en un widget de dashboard.

### Consecuencia

Menor escaneabilidad instantánea del estado. Se compensa con orden: los ítems se
ordenan por relevancia y año, y el estado aparece siempre en la misma posición de
la tarjeta.

---

## ADR-005 — Máscaras por `mask-position`, no por centro del degradado

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

El revelado por cursor mantiene el degradado radial **fijo** y anima
`mask-position`. La luz propiamente dicha va un paso más allá: es un elemento
hijo de tamaño fijo movido con `translate3d`.

### Motivo

La forma intuitiva de escribirlo es
`radial-gradient(500px circle at var(--mx) var(--my), …)`. Eso obliga al
navegador a **regenerar y rasterizar el degradado en cada frame**, sobre un
elemento a pantalla completa. Es el camino directo a perder los 60 fps en
pantallas grandes.

Dejando el degradado quieto y desplazando su posición, se rasteriza una vez.
En el caso de la luz, un `translate3d` se compone en GPU y no repinta nada.

### Alternativas consideradas

- **`at var(--mx) var(--my)`.** Rechazada por coste de repintado.
- **Sólo `mix-blend-mode` sin máscaras.** Más barato todavía, pero un
  `screen` uniforme ilumina también los huecos entre curvas: produce el
  "círculo evidente siguiendo al ratón" que el brief prohíbe, en vez de hacer
  aparecer las líneas.

### Consecuencia

El código es menos obvio de leer, y por eso está explicado en
`INTERACTION-SYSTEM.md § 7`. Como las capas iluminadas viven dentro de los
contenedores de paralaje, el área revelada se desfasa hasta 13 px respecto del
cursor; a ese tamaño de luz (520 px de radio) es imperceptible.

---

## ADR-006 — El guardián de rendimiento descarta los frames estrangulados

**Fecha:** 2026-08-29
**Estado:** Aceptada

### Decisión

El guardián que degrada el hero (`is-lowfx`) ignora cualquier frame de más de
`perf.stallMs` (120 ms) en lugar de promediarlo.

### Motivo

Detectado durante la verificación: en un panel de previsualización el navegador
estranguló `requestAnimationFrame` a ~1 fps. Con la media simple, el guardián
habría concluido "esta máquina no puede" y retirado las máscaras de forma
**permanente** — degradando el hero por un motivo que no tiene nada que ver ni
con la máquina ni con el hero.

Los mismos frames anómalos aparecen con la pestaña en segundo plano, la ventana
oculta o el depurador detenido.

### Alternativas consideradas

- **Medir sólo cuando `document.visibilityState === 'visible'`.** No cubre el
  caso: en la prueba la pestaña se declaraba visible y aun así estaba
  estrangulada.
- **Permitir que el estado degradado se revierta.** Añade oscilación: el hero
  entraría y saldría de modo reducido a mitad de uso.

### Consecuencia

Una máquina genuinamente lenta que produzca frames de más de 120 ms (menos de
8 fps) no se detecta. Es un caso en el que el problema de rendimiento ya no está
en el hero.
