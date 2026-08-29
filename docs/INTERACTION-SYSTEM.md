# INTERACTION-SYSTEM.md — el hero de Diógenes Lab

Última actualización: 2026-08-29

Este documento describe **una sola pantalla**: el hero de `index.html`. Es la
parte del sitio con más maquinaria, y la única que necesita explicación.

Ficheros implicados:

| Fichero | Papel |
|---|---|
| `assets/js/config.js` | **todos** los valores ajustables |
| `assets/js/hero-field.js` | el bucle de animación |
| `assets/css/hero.css` | las capas y cómo consumen las variables |
| `assets/img/field-*.svg` | la gráfica, generada por `tools/generate-field.ps1` |
| `index.html` | el marcado de las capas |

---

## 1. La idea

El fondo es un **Parametric Knowledge Field**: una superficie abstracta de
curvas de nivel que se comporta como si tuviera masa. El cursor no la controla:
la *solicita*. La superficie llega tarde, con inercia, y trae consigo luz.

Dos reglas gobiernan todo lo demás:

> **El contenido del hero no se mueve nunca.** Título, texto y botones son
> absolutamente estables. Es justamente esa estabilidad la que hace que el
> fondo se lea como profundidad y no como un adorno tembloroso.

> **Si algo falla, se cae hacia una composición estática correcta.** Nunca hacia
> un fondo blanco, un lienzo vacío o un hero sin texto.

---

## 2. Las cinco capas

De atrás hacia delante, tal como están en el DOM:

```
.field
├── .field__base                   Layer 01 · degradado casi negro
├── .field__stage                  ← microrrotación (JS)
│   └── .field__drift              ← deriva autónoma (CSS puro)
│       ├── .field__depth--back    Layer 02a · curvas exteriores
│       │   └── img field-back.svg
│       ├── .field__grid           Layer 03 · retícula al 3.2%
│       ├── .field__depth--mid     Layer 02b · curvas intermedias
│       │   ├── img field-mid.svg
│       │   └── img .field__relief--lit   ← copia revelada por máscara
│       ├── .field__depth--front   Layer 02c · curvas interiores
│       │   ├── img field-front.svg
│       │   └── img .field__relief--lit
│       └── .field__semantic       Layer 04 · palabras, reveladas por máscara
├── .field__light                  Layer 05 · luz radial del cursor
└── .field__edge                   viñeta y fundido con la página
```

**Por qué la retícula va entre `back` y `mid`:** puesta encima de todo se lee
como una hoja de cálculo; puesta detrás de todo desaparece. Intercalada, se lee
como un sistema de coordenadas *bajo* el relieve, que es lo que se busca.

**Por qué el relieve está en tres ficheros y no en uno:** los tres SVG son
grupos de niveles distintos del mismo campo escalar. Los niveles interiores
(picos) están en `front`, los exteriores en `back`. Así el paralaje es correcto
por construcción: lo que está más alto es lo que más se desplaza.

---

## 3. El bucle

Exactamente el flujo del brief:

```
pointermove  →  coordenadas objetivo  →  requestAnimationFrame
             →  interpolación  →  escritura de variables CSS
```

**Hay un único `requestAnimationFrame` en todo el sitio.**

El manejador de `pointermove` no calcula nada. Guarda dos números y, si hace
falta, arranca el bucle:

```js
function onPointerMove(ev) {
  pointerX = ev.clientX - rect.left;      // píxeles dentro del hero
  pointerY = ev.clientY - rect.top;
  targetX  = (pointerX / rect.width)  * 2 - 1;   // normalizado -1 .. 1
  targetY  = (pointerY / rect.height) * 2 - 1;
  start();
}
```

`rect` está cacheado y se actualiza en `resize` y `scroll`. Leer
`getBoundingClientRect()` dentro del manejador provocaría un *reflow* sincrónico
en cada evento del ratón, que es uno de los modos clásicos de perder los 60 fps.

Dentro del frame, cada sistema interpola por su cuenta:

```js
current += (target - current) * factor;
```

### Paradas

El bucle **se detiene solo**. No hay un `rAF` girando eternamente:

- cuando el puntero sale del hero y todos los valores se han asentado
  (diferencia < 0.001), el bucle termina;
- cualquier movimiento posterior vuelve a arrancarlo;
- si la pestaña se oculta (`visibilitychange`), se cancela.

---

## 4. Velocidades diferenciadas

Esto es lo que hace que la superficie parezca material y no una imagen pegada al
ratón. **Si todo respondiera igual, el efecto se pierde por completo.**

| Sistema | Factor | Sensación |
|---|---|---|
| Relieve (mid + front) | `0.100` | rápido, pero amortiguado |
| Luz del cursor | `0.075` | medio — la luz "arrastra" |
| Paralaje profundo (back + retícula) | `0.050` | lento, lejano |
| Revelado semántico | `0.042` | el último en llegar |

Las palabras del campo semántico son deliberadamente lo más lento: aparecen
cuando el cursor ya lleva un momento quieto en una zona, no mientras se pasa por
encima. Eso las convierte en un descubrimiento en lugar de en un cartel.

---

## 5. Paralaje y rotación

Amplitud máxima, alcanzada con el cursor en el borde:

| Capa | X | Y |
|---|---|---|
| `back` (y retícula) | ±4 px | ±3 px |
| `mid` | ±8 px | ±6 px |
| `front` | ±13 px | ±9 px |

La microrrotación es **cruzada**: el movimiento horizontal del cursor gira sobre
el eje Y, y el vertical sobre el eje X en sentido inverso, que es como se inclina
una superficie real.

| Eje | Máximo |
|---|---|
| `rotateY` | ±0.8° |
| `rotateX` | ±0.5° |

Subir estos números convierte el hero en una tarjeta 3D que se inclina, que es
exactamente lo que no se quiere. El usuario debe **sentir** profundidad sin
**percibir** que las capas se desplazan.

Todas las capas están sobredimensionadas (`inset: -4%; width: 108%`) para que ni
el paralaje ni la rotación lleguen a descubrir un borde.

---

## 6. Deriva autónoma

Sin ninguna interacción, `.field__drift` respira:

```css
@keyframes field-drift {
  from { transform: translate3d(-3px,  2px, 0) scale(1.000); }
  to   { transform: translate3d( 3px, -2px, 0) scale(1.006); }
}
/* 8s alternate = 16s por ciclo completo */
```

Es CSS puro, en un elemento distinto del que escribe el JS, para que no compitan
por la misma propiedad `transform`. El usuario debería notar que hay vida, no
detectar la animación.

---

## 7. Las máscaras — y por qué están escritas así

El revelado por cursor usa `mask-image`, pero **no** de la forma obvia.

La forma obvia es mover el centro del degradado:

```css
/* ✗ regenera el degradado en cada frame, sobre un elemento a pantalla completa */
mask-image: radial-gradient(500px circle at var(--mx) var(--my), black, transparent);
```

La forma que usa este sitio deja el degradado quieto y mueve **su posición**:

```css
/* ✓ el degradado se rasteriza una vez; cada frame sólo lo desplaza */
mask-image: radial-gradient(closest-side, #000 0%, rgba(0,0,0,.74) 40%,
                            rgba(0,0,0,.26) 66%, transparent 82%);
mask-repeat: no-repeat;
mask-size: var(--light-size) var(--light-size);
mask-position: var(--light-x) var(--light-y);
```

`--light-x` y `--light-y` son la **esquina superior izquierda** del cuadrado que
contiene la luz, es decir `cursor − radio`, no el centro.

La luz en sí (`.field__light`) va un paso más allá: es un cuadrado hijo con el
degradado dentro, y lo que se anima es un `translate3d`. Una traslación se compone
en la GPU y no repinta nada.

**No se dibuja un círculo siguiendo al ratón.** Lo que hay es una copia más
presente del relieve que sólo se ve donde llega la luz, más un resplandor muy
tenue en `mix-blend-mode: screen`. El efecto es que las líneas *aparecen*, no que
un foco se pasea por encima.

---

## 8. Fallback y degradación

| Situación | Qué pasa |
|---|---|
| **JavaScript no carga o falla** | El hero queda en su composición estática: fondo, relieve, retícula y viñeta están en el HTML y el CSS. No hay luz ni paralaje. El título, el texto y los botones son HTML normal y no dependen de nada. |
| **Un sistema lanza una excepción** | `main.js` envuelve cada subsistema en su propio `try/catch`. Un fallo en el hero no toca la navegación ni las colecciones; queda un aviso en consola. |
| **El navegador no soporta `mask-image`** | Las copias `--lit` y el campo semántico se ven completos en lugar de recortados. Es más plano, no está roto. |
| **`prefers-reduced-motion: reduce`** | El bucle **no arranca**. Se anulan la deriva, la rotación, el paralaje y las transiciones de aparición; se ocultan luz, copias iluminadas y campo semántico. Queda una composición estática completa. |
| **Sin puntero fino** (móvil, táctil) | El bucle **no arranca**. Se conservan relieve, profundidad y deriva lenta; el CSS oculta luz, máscaras y campo semántico. No se usa giroscopio. |
| **Rendimiento insuficiente** | El guardián añade `is-lowfx` al campo y retira las capas con máscara (lo más caro). Siguen el relieve, la luz y el paralaje. |
| **Pestaña oculta** | El bucle se cancela. |

El guardián de rendimiento **descarta** los frames de más de `stallMs` (120 ms).
Un frame larguísimo no significa que la máquina sea lenta: significa que el
navegador estranguló la pestaña. Contarlo degradaría el hero de forma permanente
por un motivo que no tiene nada que ver con el hero.

---

## 9. Coste

Lo que se toca en cada frame:

- 12 llamadas a `style.setProperty()` sobre **un solo elemento** (`.field`), no
  sobre `documentElement`, para acotar la invalidación.
- Todo lo que consumen esas variables es `transform`, `opacity` o
  `mask-position`.

Lo que **nunca** se anima: `width`, `height`, `top`, `left`, `margin`, `padding`,
`box-shadow`, ni `filter` de forma continua. No hay `blur` sobre capas en
movimiento. `.field` lleva `contain: layout paint` para aislar su repintado del
resto de la página.

---

## 10. Tuning Parameters

**Todos los valores ajustables están en `assets/js/config.js`.** No hay ninguno
duplicado en el CSS ni disperso por el JS. Cambiar cómo se siente el hero es
cambiar este objeto.

```js
DL.config.hero = {
  lerp:     { relief, light, deep, semantic },
  depth:    { back:{x,y}, mid:{x,y}, front:{x,y} },
  rotation: { x, y },
  light:    { radius, semanticRatio },
  perf:     { budgetMs, samples, stallMs }
};
```

| Parámetro | Valor | Rango sensato | Qué cambia |
|---|---|---|---|
| `lerp.relief` | `0.100` | 0.04 – 0.12 | Velocidad del relieve. Más alto = más ligero, menos masa. |
| `lerp.light` | `0.075` | 0.05 – 0.12 | Cuánto arrastra la luz detrás del cursor. |
| `lerp.deep` | `0.050` | 0.03 – 0.07 | Lejanía del fondo. Bajarlo aleja. |
| `lerp.semantic` | `0.042` | 0.03 – 0.06 | Cuánto tarda una palabra en aparecer. |
| `depth.back` | `4 / 3 px` | ≤ 5 | Paralaje de la capa lejana. |
| `depth.mid` | `8 / 6 px` | ≤ 10 | Paralaje intermedio. |
| `depth.front` | `13 / 9 px` | ≤ 16 | Paralaje cercano. Pasado 16 px se percibe. |
| `rotation.x` | `0.5°` | ≤ 0.5 | Inclinación vertical. |
| `rotation.y` | `0.8°` | ≤ 0.8 | Inclinación horizontal. |
| `light.radius` | `520 px` | 450 – 600 | Tamaño de la luz. Se reduce a 78% por debajo de 900 px de ancho. |
| `light.semanticRatio` | `0.72` | 0.6 – 0.85 | Radio del revelado semántico respecto a la luz. Bajarlo hace las palabras más difíciles de encontrar. |
| `perf.budgetMs` | `22` | 16 – 30 | Umbral de degradación (22 ms ≈ 45 fps). |
| `perf.samples` | `90` | 60 – 180 | Frames promediados antes de decidir. |
| `perf.stallMs` | `120` | 80 – 250 | Por encima de esto, el frame se descarta por estrangulamiento. |

### Valores que no están en `config.js`

Dos cosas se ajustan en otro sitio, a propósito, porque no son parámetros de
interacción sino de composición:

- **La deriva autónoma** está en `hero.css`, en `@keyframes field-drift`. Es CSS
  puro y no pasa por el bucle.
- **La gráfica del campo** (posición de los centros, número de niveles, densidad)
  está en la cabecera de `tools/generate-field.ps1`. Cambiarla exige regenerar
  los SVG:

  ```powershell
  powershell -ExecutionPolicy Bypass -File tools/generate-field.ps1
  ```

---

## 11. El campo semántico

Las palabras (`NORMA`, `MODELO`, `CONTROL`, `DECISIÓN`, `LENGUAJE`,
`TRANSPARENCIA`, `INFERENCIA`, `PODER`) se definen en `data/site.js` con su
posición y tamaño, y las construye `hero-field.js`.

Tres reglas:

1. Todas viven a la derecha del 50% del hero, para no competir jamás con el
   titular.
2. El contenedor es `aria-hidden="true"`. Son **textura conceptual**, no
   contenido: un lector de pantalla no debe encontrarse ocho sustantivos sueltos
   entre el título y los botones.
3. Nunca se ven todas a la vez. La máscara sólo revela las que caen dentro del
   radio de la luz.

Que se construyan en JavaScript no es una degradación: sin JavaScript no hay
cursor, y sin cursor estas palabras serían invisibles de todas formas.
