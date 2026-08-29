# HANDOFF — Diógenes Lab

**Para quien continúe este trabajo (persona o IA). Léelo entero antes de tocar nada.**

Última actualización: 2026-08-29
Repositorio: <https://github.com/dojedacifuentes/aldunate> · rama `main`

---

## 0. Resumen en diez segundos

Sitio estático terminado y funcionando: 5 páginas, cero dependencias, cero build
step. Está en GitHub y **es desplegable en Vercel tal cual, ahora mismo**.

Lo que falta **no es código**: es contenido real y tres decisiones del dueño.
Ver §5.

---

## 1. Restricción del entorno — esto condiciona TODO

> **En esta máquina no hay Node.js, ni npm, ni Python.**
> Sólo Git 2.55 y Windows PowerShell 5.1. Verificado el 2026-08-29.

Consecuencias que no son negociables:

- **No propongas ni instales un framework** (React, Next, Vite, Astro, Tailwind).
  No se podrían instalar, ejecutar ni verificar. Cualquier cambio así deja el
  proyecto imposible de comprobar en la máquina de su dueño.
- **No introduzcas un paso de compilación.** Ni TypeScript, ni Sass, ni PostCSS.
- **No uses ES Modules** (`<script type="module">`, `import`/`export`). Se
  bloquean por CORS bajo `file://` y el sitio debe seguir funcionando con doble
  clic sobre `index.html`. Los scripts son clásicos y el orden de carga importa.
- Para levantar un servidor local **usa `tools/serve.ps1`**, no `npx serve` ni
  `python -m http.server`. No existen.

Si crees que hace falta romper alguna de estas reglas, la decisión es del dueño
del repositorio, no tuya. Explícale el porqué y espera respuesta.

Todo esto está razonado en `DECISIONS.md → ADR-000`.

---

## 2. Estado actual: qué está hecho y verificado

| Área | Estado |
|---|---|
| Arquitectura de información (4 secciones + Sobre) | ✅ completa |
| Navbar, menú móvil, footer | ✅ en las 5 páginas |
| Sistema de diseño (tokens) | ✅ |
| Hero: 5 capas del campo paramétrico | ✅ |
| Interacción: cursor, inercia, paralaje, revelado | ✅ |
| Capa de datos + filtros derivados | ✅ |
| Ficha de detalle (`<dialog>`) + enlace profundo | ✅ |
| Accesibilidad AA (contraste, foco, teclado) | ✅ medida en navegador |
| Móvil y `prefers-reduced-motion` | ✅ |
| Documentación (7 documentos) | ✅ |
| Despliegue Vercel (`vercel.json` + CSP) | ✅ verificado |
| **Contenido real** | ❌ **todo es PLACEHOLDER** |

### Verificado empíricamente, no supuesto

- 5 páginas sin errores de consola.
- 26 assets comprobados, ningún enlace roto.
- Sin desbordamiento horizontal a 375 px ni en escritorio.
- Contraste medido: todo el texto cumple AA (tabla en `DESIGN-SYSTEM.md § 2`).
- Foco: la ficha lo atrapa y lo devuelve al cerrarse.
- Paralaje real `4 / 8 / 13 px` y rotación `0.30° / 0.56°`, dentro de los topes.
- `hero__content` tiene `transform: none` — el contenido del hero no se mueve.
- CSP probada en navegador con cero violaciones.

### NO verificado (dilo si lo comprueban)

- **Apertura real con doble clic (`file://`).** El panel de previsualización de
  este entorno convierte los ficheros locales en instantáneas `data:`, así que
  no se pudo probar de verdad. Se verificó por análisis estático: no hay
  módulos ES, ni `fetch`/XHR, ni rutas absolutas, y la única llamada sensible al
  origen (`history.replaceState`) está dentro de un `try/catch`. Debería
  funcionar; falta una comprobación humana de un clic.
- **60 fps sostenidos en una máquina real.** El panel estrangula
  `requestAnimationFrame` a ~1 fps, así que no se pudo medir rendimiento real.
  El guardián de `hero-field.js` degrada solo si hiciera falta.

---

## 3. Trampas ya descubiertas — no vuelvas a caer en ellas

Cada una de estas costó una iteración. Están documentadas para que no se repitan.

### PowerShell (sólo afecta a `tools/*.ps1`)

1. **Índice de array 2D.** `$grid[$i + 1, $j]` se interpreta como
   `$grid[$i + (1,$j)]`. Escribe siempre `$grid[($i + 1), $j]`.
2. **La coma liga más fuerte que la aritmética.** `@($a + $b * $c, $d)` se
   interpreta como `@($a + $b * ($c, $d))`. Calcula cada valor en una variable
   aparte antes de meterlo en el array.
3. **`return $unArrayList` desenrolla la colección.** Devuelve `,$coleccion`
   (con la coma delante) o perderás la estructura cuando tenga un solo elemento.
   Este fue el bug que hacía que faltaran curvas de nivel en el fondo.

### HTML / CSS

4. **`<button>` sólo admite contenido de tipo *phrasing*.** No puedes meter
   `<p>`, `<div>` ni `<h3>` dentro. Por eso las tarjetas y las entradas usan
   `<span>` — y por eso esos `<span>` **necesitan `display: block` explícito**,
   o el título y el resumen se pegan en la misma línea.
5. **`--ink-040` no se puede oscurecer.** Es el color de toda la tipografía mono
   a 11 px y está calculado al límite del mínimo AA (4.5:1). `--ink-020` sólo
   vale a partir de 24 px, y hoy únicamente lo usa `.portal__num`.

### Rendimiento e interacción

6. **No confundas estrangulamiento con lentitud.** El guardián de rendimiento
   descarta los frames de más de 120 ms (`perf.stallMs`), porque un frame
   larguísimo significa pestaña en segundo plano, no máquina lenta. Sin eso, el
   hero se degradaba para siempre en cuanto se ocultaba la ventana.
7. **Las máscaras se mueven con `mask-position`, no reposicionando el
   degradado.** `radial-gradient(... at var(--x) var(--y))` regenera el
   degradado en cada frame y hunde los fps. Ver `ADR-005`.

### Entorno de verificación

8. El panel de previsualización **estrangula `rAF` a ~1 fps**. Si compruebas algo
   que dependa de frames, espera segundos, no milisegundos, o no verás cambios.
9. `html { scroll-behavior: smooth }` + rAF estrangulado hace que `scrollIntoView`
   parezca no funcionar. Pon `document.documentElement.style.scrollBehavior='auto'`
   antes de medir posiciones.

---

## 4. Dónde está la verdad de cada cosa

No dupliques ninguno de estos valores en otro sitio.

| Concepto | Fuente única |
|---|---|
| Color, tipografía, espacio, radios, duraciones | `assets/css/tokens.css` |
| Valores ajustables de la interacción del hero | `assets/js/config.js` |
| Forma del relieve del fondo | cabecera de `tools/generate-field.ps1` |
| Contenido (proyectos, publicaciones, formación) | `data/*.js` |
| Palabras del campo semántico | `data/site.js` |
| Correo de contacto | **el marcado de los 5 `.html`** (31 veces), a propósito |
| Cabeceras y config de despliegue | `vercel.json` |

Dos reglas de mantenimiento:

- **La navbar y el pie están duplicados literalmente en las 5 páginas.** Es una
  decisión consciente (`ADR-002`). Están delimitados por `<!-- SHELL:NAV -->` y
  `<!-- SHELL:FOOT -->`. **Si cambias uno, cambia los cinco.**
- **`assets/img/field-*.svg` son artefactos generados.** No los edites a mano:
  cambia los parámetros de `tools/generate-field.ps1` y regenera.

---

## 5. Lo que falta, en orden

### Bloqueante — decisiones del dueño, no las tomes tú

1. **Contenido real.** Los 21 elementos de `/data/` (8 proyectos, 7
   publicaciones, 6 formaciones) son **material de relleno inventado**. Están
   marcados como PLACEHOLDER en la cabecera de cada fichero.
   *Criterio de aceptación:* ningún ítem inventado en `/data/`, y los tres
   avisos `<p class="seed-note">` borrados de `lab.html`, `conocimiento.html` y
   `formacion.html`.

2. **Correo de contacto.** `hola@diogeneslab.cl` es inventado. Aparece 31 veces.
   ```bash
   sed -i 's/hola@diogeneslab.cl/CORREO-REAL/g' *.html
   ```
   *Verificar:* `grep -c "hola@diogeneslab.cl" *.html` debe dar 0 en las cinco.

3. **Correo en el historial de Git.** Los commits van firmados como
   `Diogenes Lab <dojedacifuentes@gmail.com>` y el repositorio es público. El
   dueño puede querer la dirección `noreply` de GitHub. Reescribir el historial
   es barato ahora (pocos commits) y caro más adelante. **Pregunta antes.**

### No bloqueante

4. Activar el despliegue (§6). Es un clic, no requiere código.
5. Comprobación humana de la apertura con doble clic (§2, "no verificado").
6. Si se añaden imágenes: el campo `image` del esquema ya está soportado en el
   renderizado, pero hoy no lo usa ningún ítem y **el diseño no depende de
   imágenes**. No introduzcas miniaturas sin pedirlo.

---

## 6. Despliegue

El sitio es estático: **no hay comando de build en ninguna plataforma.**

### Vercel (configurado y listo)

`vercel.json` ya fija `framework: null`, `outputDirectory: "."`, cabeceras de
seguridad y una CSP verificada. Pasos:

1. <https://vercel.com/new> → **Import Git Repository** → `dojedacifuentes/aldunate`
2. No cambies nada: Framework Preset **Other**, Build Command **vacío**,
   Output Directory **`.`** (`vercel.json` ya lo impone).
3. **Deploy.**

Cada `git push` a `main` vuelve a desplegar solo.

`cleanUrls` está **desactivado a propósito**: los enlaces internos apuntan a
`lab.html`, y deben seguir haciéndolo para que el sitio funcione también con
doble clic y en GitHub Pages. Activarlo provocaría una redirección en cada clic.

### GitHub Pages (alternativa, sin configurar)

**Settings → Pages → Deploy from a branch → `main` / `root`.** `.nojekyll` ya
está. Queda en `https://dojedacifuentes.github.io/aldunate/`.

Las dos opciones pueden convivir.

---

## 7. Cómo verificar que no has roto nada

Después de cualquier cambio. Levanta el servidor:

```powershell
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Y en la consola del navegador, sobre `http://localhost:8080`:

**a) Enlaces y assets rotos en las 5 páginas**

```js
const pages=['index.html','lab.html','conocimiento.html','formacion.html','sobre.html'];
const bad=[]; const seen=new Set();
for (const p of pages){
  const doc=new DOMParser().parseFromString(await (await fetch(p)).text(),'text/html');
  const urls=[...doc.querySelectorAll('[href],[src]')].map(e=>e.getAttribute('href')||e.getAttribute('src'));
  for (const u of urls){
    if(!u||u.startsWith('mailto:')||u.startsWith('#')||u.startsWith('http')||u.startsWith('data:'))continue;
    if(seen.has(u))continue; seen.add(u);
    if(!(await fetch(u)).ok) bad.push(`${p}: ${u}`);
  }
}
bad.length ? bad : 'sin enlaces rotos';
```

**b) Contraste de todo el texto (debe dar ≥4.5 salvo `.portal__num`, que es ≥3)**

```js
function lin(x){x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);}
function L(s){const m=s.match(/\d+/g).map(Number);return 0.2126*lin(m[0])+0.7152*lin(m[1])+0.0722*lin(m[2]);}
const bg=getComputedStyle(document.body).backgroundColor;
[...document.querySelectorAll('.meta,.card__summary,.card__title,.entry__abstract,.portal__line,.portal__num')]
  .map(e=>{const c=getComputedStyle(e),a=L(c.color),b=L(bg);
    return {el:e.className, px:+c.fontSize.replace('px',''),
            ratio:+(((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2))};});
```

**c) El contenido del hero no se mueve (regla intocable)**

```js
getComputedStyle(document.querySelector('.hero__content')).transform  // debe ser "none"
```

**d) Sin desbordamiento horizontal**

```js
document.documentElement.scrollWidth > innerWidth + 1  // debe ser false
```

Y siempre: **consola sin errores** en las cinco páginas, y prueba a 375 px de
ancho.

---

## 8. Definición de "terminado"

El encargo original fija el criterio, y sigue vigente:

> Ante espectacularidad vs. claridad → **claridad**.
> Ante complejidad técnica vs. estabilidad → **estabilidad**.
> Ante cantidad de información vs. navegación → **mostrar menos y revelar
> progresivamente**.

Y la regla que decide si algo entra:

> Antes de añadir cualquier elemento visual: ¿ayuda al usuario a orientarse,
> comprender o percibir mejor la identidad? Si la respuesta es no, no se añade.

El sitio está terminado como **producto**. Lo que falta es **contenido**.
No añadas secciones, animaciones ni componentes para "completarlo": está
deliberadamente vacío de adorno.

---

## 9. El resto de la documentación

| Documento | Responde a |
|---|---|
| [`GUIA-RAPIDA.md`](GUIA-RAPIDA.md) | comandos y tareas frecuentes, para el dueño |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | qué hay, dónde, y por qué está ahí |
| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | colores, tipografía, espacio, animación |
| [`INTERACTION-SYSTEM.md`](INTERACTION-SYSTEM.md) | el hero al detalle + Tuning Parameters |
| [`DECISIONS.md`](DECISIONS.md) | ADR-000 a 006: por qué **no** React, **no** WebGL… |
| [`CHANGELOG.md`](CHANGELOG.md) | qué cambió y cuándo |
