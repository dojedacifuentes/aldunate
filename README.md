# DIÓGENES LAB

Hub digital de proyectos, investigación y formación en derecho, inteligencia
artificial y sistemas de conocimiento.

Sitio estático. **Cero dependencias, cero build step.**

---

## Ver el sitio

**Opción rápida** — doble clic en `index.html`. Funciona tal cual.

**Opción fiel a producción** — servidor local sin dependencias:

```bash
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Luego abrir `http://localhost:8080`. Detener con `Ctrl+C`.

---

## Editar contenido

Todo el contenido vive en `/data/`. No hay que tocar HTML para añadir un ítem.

| Fichero | Alimenta |
|---|---|
| `data/projects.js` | Lab |
| `data/knowledge.js` | Conocimiento |
| `data/training.js` | Formación |
| `data/site.js` | Contacto, campo semántico del hero, texto del footer |

Para añadir un proyecto, copiar un objeto existente en `data/projects.js`,
cambiar `id`, `slug` y el resto de campos. La tarjeta y su filtro aparecen solos.

El esquema completo de campos está en
[`docs/ARCHITECTURE.md § 6`](docs/ARCHITECTURE.md).

> El contenido incluido hoy es **material de ejemplo** (marcado como PLACEHOLDER
> en cada fichero de datos). Sustituirlo antes de publicar.

---

## Documentación

| Documento | Responde a |
|---|---|
| [`docs/GUIA-RAPIDA.md`](docs/GUIA-RAPIDA.md) | **empieza aquí** — comandos y tareas frecuentes |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | qué hay, dónde, y por qué está ahí |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | color, tipografía, espacio, reglas de animación |
| [`docs/INTERACTION-SYSTEM.md`](docs/INTERACTION-SYSTEM.md) | el hero al detalle + parámetros ajustables |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | por qué **no** se usó React, WebGL, etc. |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | qué cambió y cuándo |

---

## Desplegar

Copiar la carpeta a cualquier hosting estático. No hay comando de build.

- **GitHub Pages** — push a `main`, activar Pages sobre la raíz (`.nojekyll` ya está).
- **Netlify / Cloudflare Pages** — arrastrar la carpeta. Build command vacío.

---

## Regla de oro del proyecto

> Ante espectacularidad vs. claridad → claridad.
> Ante complejidad técnica vs. estabilidad → estabilidad.
> Ante cantidad de información vs. navegación → mostrar menos y revelar progresivamente.
