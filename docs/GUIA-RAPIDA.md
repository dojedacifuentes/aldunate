# GUÍA RÁPIDA — Diógenes Lab

Todo lo que hace falta para trabajar en el sitio, en una sola página.
Escrita para usarse sin saber programar.

Repositorio: <https://github.com/dojedacifuentes/aldunate>

---

## 1. Qué es esto, en dos frases

Un sitio web **estático**: cinco páginas HTML, sin base de datos, sin servidor y
sin dependencias que instalar o actualizar. Para verlo basta abrir `index.html`;
para publicarlo basta copiar la carpeta.

Eso significa que **no hay nada que "compilar"**. Editas un fichero, guardas, y
recargas el navegador.

---

## 2. Los cuatro comandos

Se ejecutan desde PowerShell, situado en la carpeta del proyecto.
Para llegar ahí: abre la carpeta en el Explorador, haz clic en la barra de
dirección, escribe `powershell` y pulsa Enter.

### Ver el sitio como se verá publicado

```powershell
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Levanta `http://localhost:8080`. Se detiene con `Ctrl+C`.
Si el puerto 8080 estuviera ocupado: añade `-Port 3000` al final.

> Para una ojeada rápida no hace falta: doble clic en `index.html` funciona.
> El servidor sólo reproduce con exactitud las condiciones reales de publicación.

### Regenerar la gráfica del fondo

```powershell
powershell -ExecutionPolicy Bypass -File tools/generate-field.ps1
```

Sólo si has cambiado los parámetros de composición dentro de ese mismo fichero.
Reescribe los tres `assets/img/field-*.svg`.

### Publicar los cambios

```bash
git add -A
```
```bash
git commit -m "describe aquí qué cambiaste"
```
```bash
git push
```

### Ver qué has tocado antes de publicar

```bash
git status
```

---

## 3. Mapa: quiero cambiar X, ¿qué fichero toco?

| Quiero cambiar… | Fichero |
|---|---|
| Un proyecto, herramienta o prototipo | `data/projects.js` |
| Un informe, investigación o recurso | `data/knowledge.js` |
| Un curso, taller o programa | `data/training.js` |
| Las palabras del fondo del hero | `data/site.js` |
| El titular y el texto de la portada | `index.html` |
| Los textos de "Sobre el Lab" | `sobre.html` |
| Los colores y las tipografías | `assets/css/tokens.css` |
| Cómo se siente el fondo al mover el ratón | `assets/js/config.js` |
| La forma del relieve del fondo | cabecera de `tools/generate-field.ps1` |

**Regla general:** el contenido del día a día vive en `/data/`. Los textos fijos
(titulares, descripciones de sección) viven en los `.html`. Nada más debería
hacer falta tocar.

---

## 4. Tareas frecuentes

### Añadir un proyecto al Lab

Abre `data/projects.js`, copia un bloque completo `{ … }`, pégalo y cambia los
campos. Los mínimos obligatorios:

```js
{
  id: 'p-009',                       // no repetir ninguno existente
  slug: 'nombre-en-minusculas',      // sin acentos ni espacios; es su enlace
  title: 'Título del proyecto',
  type: 'proyecto',                  // proyecto | herramienta | prototipo
  summary: 'Una sola línea. Es lo que se lee en la tarjeta.',
  status: 'activo',                  // activo | en curso | prototipo | archivado | próximamente
  year: 2026
}
```

Opcionales que merecen la pena: `description` (párrafos separados por una línea
en blanco doble `\n\n`, se ven al abrir la ficha), `tags`, `url`, `repo`,
`featured: true` para que aparezca en la portada.

**No hay que tocar el HTML.** La tarjeta aparece sola. Y si usas un `type` que
no existía, su filtro también aparece solo.

Conocimiento y Formación funcionan igual, con dos campos propios cada una:

- `data/knowledge.js` → `date` (`'2026-05-14'`), `authors`, `venue`
- `data/training.js` → `audience`, `mode`, `duration`, `next`

### Cambiar el correo de contacto

El correo actual, `hola@diogeneslab.cl`, es **inventado**. Aparece **31 veces**
repartidas en los cinco `.html`:

| Fichero | Veces |
|---|---|
| `index.html` | 3 |
| `lab.html` | 5 |
| `conocimiento.html` | 5 |
| `formacion.html` | 5 |
| `sobre.html` | 4 |

Está en el HTML y no en `/data/` a propósito: así el contacto sigue funcionando
aunque el JavaScript no cargue.

La forma rápida de cambiarlo todo de una vez:

```bash
sed -i 's/hola@diogeneslab.cl/TU-CORREO-REAL/g' *.html
```

Después comprueba que no queda ninguno:

```bash
grep -c "hola@diogeneslab.cl" *.html
```

### Quitar los avisos de "contenido de ejemplo"

Cuando sustituyas el material de relleno por contenido real, borra el bloque
`<p class="seed-note"> … </p>` de estos tres ficheros:

`lab.html` · `conocimiento.html` · `formacion.html`

Puedes borrar también la regla `.seed-note` al final de `assets/css/pages.css`.

### Ajustar cómo se comporta el fondo

Todos los valores están en `assets/js/config.js`, con su rango recomendado al
lado. Los tres que más se notan:

| Valor | Efecto |
|---|---|
| `lerp.relief` | Más alto = el fondo persigue al cursor más rápido |
| `depth.front` | Más alto = más profundidad (no pasar de 16) |
| `light.radius` | Tamaño de la luz que sigue al cursor |

La tabla completa está en [`INTERACTION-SYSTEM.md § 10`](INTERACTION-SYSTEM.md).

### Cambiar colores o tipografía

Todo en `assets/css/tokens.css`. **Un aviso importante:** `--ink-040` es el color
de toda la tipografía pequeña (tipos, estados, años). Está calculado para cumplir
el mínimo legal de contraste. Si lo oscureces, el sitio deja de ser accesible.

---

## 5. Publicar el sitio en internet

El repositorio ya está en GitHub. Para que además sea una web visitable:

**Settings → Pages → Source: _Deploy from a branch_ → Branch: `main` / `root` → Save**

En un par de minutos queda en:

```
https://dojedacifuentes.github.io/aldunate/
```

A partir de ahí, cada `git push` actualiza el sitio solo. No hay que hacer nada
más.

---

## 6. Qué conviene no tocar

| Fichero | Por qué |
|---|---|
| `assets/img/field-*.svg` | Son generados. Se cambian desde `tools/generate-field.ps1` y se regeneran. |
| `assets/js/hero-field.js` | El bucle de animación. Los valores ajustables están en `config.js`, no aquí. |
| `.nojekyll` | Sin él, GitHub Pages ignora algunas carpetas. |

Y una regla que sí importa: la **navbar y el pie están copiados literalmente en
las cinco páginas**. Si cambias uno, cambia los cinco. Están marcados con
`<!-- SHELL:NAV -->` y `<!-- SHELL:FOOT -->` para que se localicen rápido.

---

## 7. Qué queda pendiente

1. Sustituir el contenido de `/data/` — hoy son **21 elementos de ejemplo**
   (8 proyectos, 7 publicaciones, 6 formaciones). Ninguno describe trabajo real.
2. Cambiar el correo de contacto (§4).
3. Borrar los tres avisos de contenido de ejemplo (§4).
4. Activar GitHub Pages (§5).

---

## 8. El resto de la documentación

| Documento | Responde a |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | qué hay, dónde, y por qué está ahí |
| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | colores, tipografía, espacio, animación |
| [`INTERACTION-SYSTEM.md`](INTERACTION-SYSTEM.md) | el fondo del hero al detalle |
| [`DECISIONS.md`](DECISIONS.md) | por qué **no** se usó React, WebGL, etc. |
| [`CHANGELOG.md`](CHANGELOG.md) | qué cambió y cuándo |
