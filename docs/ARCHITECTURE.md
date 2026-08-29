# ARCHITECTURE.md — Diógenes Lab

Última actualización: 2026-08-29

---

## 1. Qué es este sitio

Un *hub* digital que reúne proyectos, prototipos, herramientas, informes,
investigación, cursos, talleres y recursos en torno a derecho, inteligencia
artificial y sistemas de conocimiento.

La home **no es un catálogo**: es un mapa del ecosistema. El contenido vive en
tres secciones y se revela progresivamente.

---

## 2. Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Marcado | HTML5 estático, multi-página | 5 páginas, sin plantillas |
| Estilos | CSS moderno (custom properties, `clamp()`, grid) | 6 hojas, sin preprocesador |
| Comportamiento | JavaScript ES2019, scripts clásicos con `defer` | sin módulos, sin bundler |
| Gráfica del hero | 3 SVG estáticos + capas CSS | generados; ver `INTERACTION-SYSTEM.md` |
| Datos | Objetos JS planos en `/data/*.js` | ver §6 |
| Dependencias | **ninguna** | sólo 2 webfonts de Google Fonts |
| Build | **ninguno** | se despliega copiando la carpeta |

**Por qué sin framework:** ver `DECISIONS.md → ADR-000`. Resumen: la máquina de
desarrollo no tiene Node.js, y un sitio de contenido no necesita SPA.

**Requisitos de navegador:** cualquier navegador con soporte de CSS custom
properties y `mask-image` (Chrome/Edge 120+, Firefox 121+, Safari 17+). En
navegadores sin `mask-image` el hero pierde el revelado por cursor y conserva
todo lo demás — degradación, no rotura.

---

## 3. Estructura de carpetas

```
/
├── index.html              01 · Inicio
├── lab.html                02 · Lab
├── conocimiento.html       03 · Conocimiento
├── formacion.html          04 · Formación
├── sobre.html              Sobre el Lab (portal 04, fuera del nav principal)
│
├── data/                   ← capa de contenido: es lo único que se edita a diario
│   ├── site.js               campo semántico del hero (el correo NO está aquí)
│   ├── projects.js           Lab
│   ├── knowledge.js          Conocimiento
│   └── training.js           Formación
│
├── assets/
│   ├── css/
│   │   ├── tokens.css        variables: color, tipografía, espacio, motion
│   │   ├── base.css          reset, tipografía base, primitivas de layout
│   │   ├── shell.css         navbar + footer
│   │   ├── hero.css          hero y las 5 capas del campo paramétrico
│   │   ├── components.css    portales, tarjetas, filtros, panel de detalle
│   │   └── pages.css         ajustes propios de cada sección
│   ├── js/
│   │   ├── config.js         TUNING PARAMETERS — fuente única de valores
│   │   ├── registry.js       namespace global `DL` (sustituye a los imports)
│   │   ├── shell.js          menú móvil, estado activo del nav
│   │   ├── render.js         plantillas: data → HTML
│   │   ├── collection.js     montaje de rejillas + filtros + panel de detalle
│   │   ├── reveal.js         aparición en scroll (IntersectionObserver)
│   │   ├── hero-field.js     bucle rAF: cursor, inercia, paralaje, revelado
│   │   └── main.js           arranque por página
│   └── img/
│       ├── field-back.svg    capas del relieve del hero.
│       ├── field-mid.svg     GENERADAS: no editar a mano,
│       └── field-front.svg   regenerar con tools/generate-field.ps1
│
├── docs/
│   ├── ARCHITECTURE.md       este fichero
│   ├── DESIGN-SYSTEM.md      tokens y reglas visuales
│   ├── INTERACTION-SYSTEM.md el hero, en detalle
│   ├── DECISIONS.md          ADR
│   └── CHANGELOG.md          cambios por sesión
│
├── tools/
│   ├── serve.ps1             servidor estático local, sin dependencias
│   └── generate-field.ps1    regenera assets/img/field-*.svg
│
├── .nojekyll                 para despliegue en GitHub Pages
└── README.md
```

---

## 4. Arquitectura de información

Navegación principal: **exactamente cuatro entradas** + un CTA de contacto.

```
DIÓGENES LAB · Inicio · Lab · Conocimiento · Formación · [Contacto]
```

| # | Sección | Fichero | Agrupa |
|---|---|---|---|
| 01 | Inicio | `index.html` | mapa del ecosistema |
| 02 | Lab | `lab.html` | proyectos, prototipos, herramientas, aplicaciones, experimentos |
| 03 | Conocimiento | `conocimiento.html` | informes, investigación, publicaciones, análisis, guías, recursos |
| 04 | Formación | `formacion.html` | cursos, talleres, programas, material docente |

**Contacto no es una quinta sección.** Es un CTA en la navbar, un bloque en el
footer y una llamada contextual al final de `sobre.html`.

**`sobre.html`** existe como cuarto portal de la home (identidad institucional),
deliberadamente fuera de la navegación principal. Se alcanza desde la home, desde
el footer y desde enlaces contextuales.

### Orden de la home

1. Hero
2. Cuatro portales al ecosistema
3. Selección destacada (`featured: true`, máximo 4, mezclando las tres colecciones)
4. Identidad / propósito breve
5. Footer

Nada más.

---

## 5. Shell compartido — regla de mantenimiento

> ⚠️ El `<header class="nav">` y el `<footer class="foot">` están **duplicados
> literalmente** en las 5 páginas. Es la contrapartida consciente de no tener
> build step (ADR-002).
>
> **Si cambias uno, cambia los cinco.** El bloque está delimitado en cada
> fichero por los comentarios `<!-- SHELL:NAV -->` … `<!-- /SHELL:NAV -->` y
> `<!-- SHELL:FOOT -->` … `<!-- /SHELL:FOOT -->`.
>
> Lo único que cambia entre páginas es el atributo `aria-current="page"` del
> enlace activo y el `data-page` del `<body>`.

---

## 6. Sistema de datos

Ninguna tarjeta se escribe a mano en el HTML. Todo se genera desde `/data/`.

Cada fichero de datos registra su colección en el namespace global:

```js
// data/projects.js
DL.data.projects = [ { …ítem… }, … ];
```

### Esquema del ítem

Campos comunes a las tres colecciones:

| Campo | Tipo | Obligatorio | Uso |
|---|---|---|---|
| `id` | string | sí | clave estable, no cambia nunca |
| `slug` | string | sí | identificador legible, se usa en el enlace profundo |
| `title` | string | sí | título de la tarjeta |
| `type` | string | sí | subtipo dentro de la sección (ver abajo) |
| `category` | string | no | agrupación temática libre |
| `summary` | string | sí | una línea. Se muestra en la tarjeta |
| `description` | string | no | párrafos. Sólo en el panel de detalle |
| `status` | string | sí | `activo` · `en curso` · `prototipo` · `archivado` · `próximamente` |
| `year` | number | sí | ordenación |
| `tags` | string[] | no | sólo visibles en el detalle |
| `url` | string | no | enlace externo principal |
| `repo` | string | no | enlace a código |
| `featured` | boolean | no | aparece en la selección de la home |
| `image` | string | no | ruta relativa a `assets/img/` |

Campos adicionales por colección:

- **`knowledge.js`** — `date` (ISO `YYYY-MM-DD`), `authors` (string[]), `venue`.
- **`training.js`** — `audience`, `mode` (`presencial` · `online` · `híbrido`),
  `duration`, `next` (próxima edición).

### Valores de `type` admitidos

| Colección | `type` |
|---|---|
| projects | `proyecto` · `herramienta` · `prototipo` |
| knowledge | `informe` · `investigación` · `guía` · `análisis` · `recurso` |
| training | `curso` · `taller` · `programa` · `material` |

Los filtros de cada sección se derivan **automáticamente** de los `type`
presentes en los datos (`collection.js`). Añadir un ítem con un `type` nuevo hace
aparecer su filtro solo; no hay que tocar el HTML.

> El contenido actual de `/data/` es **material de ejemplo marcado como
> PLACEHOLDER** en la cabecera de cada fichero. Está escrito en el dominio real
> del proyecto para que el diseño se pueda evaluar con densidad realista, pero
> debe sustituirse por contenido verdadero antes de publicar.

---

## 7. Imágenes

`assets/img/` contiene **sólo** las tres capas generadas del relieve del hero.
No hay fotografía ni ilustración en ninguna parte del sitio, y es deliberado:
el diseño **no depende de imágenes**. Ninguna tarjeta lleva miniatura; el peso
visual lo llevan la tipografía y los filetes.

Los tres `field-*.svg` son **artefactos generados**. No se editan a mano: se
cambian los parámetros de la cabecera de `tools/generate-field.ps1` y se
regeneran. Están versionados en git, así que el sitio no depende del script para
funcionar.

El campo `image` del esquema de datos está soportado en el renderizado por si
alguna vez hace falta, pero hoy no lo usa ningún ítem.

---

## 8. Componentes principales (JS)

| Fichero | Responsabilidad | Toca el DOM de |
|---|---|---|
| `registry.js` | crea `window.DL` y utilidades mínimas (`$`, `$$`, `el`) | — |
| `config.js` | **todos** los valores ajustables de animación | — |
| `shell.js` | apertura/cierre del menú móvil, cierre con `Esc` y por resize | `.nav` |
| `render.js` | funciones puras `item → string HTML` | — |
| `collection.js` | monta rejilla, filtros y panel de detalle de una sección | `[data-collection]` |
| `reveal.js` | aparición al entrar en viewport | `[data-reveal]` |
| `hero-field.js` | bucle de animación único del hero | `.hero` |
| `main.js` | decide qué arrancar según `body[data-page]` | — |

Orden de carga (fijo en las 5 páginas):

```
registry → config → data/* → shell → render → collection → reveal → hero-field → main
```

`main.js` es siempre el último. Todos con `defer`, por lo que se ejecutan en
orden tras el parseo del documento.

---

## 9. Servidor local

No hace falta para ver el sitio: `index.html` funciona con doble clic.

Para probar en condiciones reales de HTTP (rutas absolutas, cabeceras, fuentes):

```powershell
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Levanta un servidor estático en `http://localhost:8080` usando sólo
`System.Net.Sockets` de .NET. Sin dependencias, sin permisos de administrador.

---

## 10. Despliegue

Copiar la carpeta. No hay más.

- **GitHub Pages:** push a `main`, activar Pages sobre la raíz. `.nojekyll` ya
  está incluido para que no se ignoren carpetas.
- **Netlify / Cloudflare Pages:** arrastrar la carpeta. Build command vacío,
  publish directory `/`.
- **Servidor propio:** copiar a la raíz del *vhost*.

---

## 11. Qué actualizar cuando cambie la arquitectura

- Añadir/quitar una sección → §4 de este fichero + el shell de las 5 páginas + `DECISIONS.md`.
- Añadir un campo de datos → §6 de este fichero + `render.js`.
- Tocar el hero → `INTERACTION-SYSTEM.md`, no aquí.
- Tocar color/tipografía/espaciado → `DESIGN-SYSTEM.md`, no aquí.
