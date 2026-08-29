# DESIGN-SYSTEM.md — Diógenes Lab

Última actualización: 2026-08-29
Fuente única de verdad: `assets/css/tokens.css`. Este documento explica **por qué**
cada token existe. Si un valor no está aquí ni en `tokens.css`, no debería existir.

---

## 1. Principios operativos

Cinco reglas que deciden discusiones de diseño sin necesidad de opinar:

1. **Una idea principal por pantalla.** Si una sección compite consigo misma por
   la atención, sobra algo.
2. **La jerarquía se construye con tamaño, peso, tracking y opacidad — antes que
   con color.** El color como jerarquía produce el aspecto de dashboard.
3. **El espacio negativo es un elemento de diseño, no un sobrante.** Ante la duda,
   más aire y menos elementos.
4. **Toda animación responde a una función.** Si no orienta, no informa ni acusa
   recibo de una acción, se elimina.
5. **Antes de añadir cualquier elemento visual:** ¿ayuda a orientarse, comprender
   o percibir la identidad? Si no, no se añade.

---

## 2. Color

Base cromática: negro carbón · gris frío · blanco cálido · cian muy tenue.
**Un solo acento.** Sin degradados multicolor. Sin azul + violeta + rosa.

### Fondos

| Token | Valor | Uso |
|---|---|---|
| `--bg-000` | `#030507` | pozo, la capa más profunda del hero |
| `--bg-010` | `#050709` | fondo del documento |
| `--bg-020` | `#071014` | superficies elevadas, tarjetas en hover |
| `--bg-030` | `#0B1418` | superficie máxima (panel de detalle) |

Ninguno es negro puro. La ligera desviación fría es lo que da la sensación de
profundidad óptica en pantallas OLED y en paneles IPS por igual.

### Tinta

| Token | Valor | Uso |
|---|---|---|
| `--ink-100` | `#F3F0EA` | títulos, blanco cálido — nunca `#FFF` |
| `--ink-080` | `#C9CDCF` | cuerpo de texto principal |
| `--ink-060` | `#8E979B` | descripciones secundarias |
| `--ink-040` | `#5E686D` | metadatos, mono, etiquetas |
| `--ink-020` | `#39423F` | texto desactivado |

El blanco es **cálido** (`#F3F0EA`) contra fondos **fríos**. Ese contraste de
temperatura es la mitad de la sofisticación percibida; el blanco puro sobre negro
azulado se lee barato y vibra.

### Acento

| Token | Valor | Uso |
|---|---|---|
| `--accent` | `#7FD6D2` | cian desaturado. Enlaces en hover, foco, línea activa |
| `--accent-dim` | `rgba(127,214,210,.14)` | fondos de estado, luz del cursor |

Regla: **el acento nunca rellena un área grande.** Aparece como línea de 1px,
punto, o luz. Si necesitas acento en un bloque, el diseño está mal.

### Líneas

| Token | Valor |
|---|---|
| `--line-soft` | `rgba(243,240,234,.06)` |
| `--line` | `rgba(243,240,234,.10)` |
| `--line-strong` | `rgba(243,240,234,.18)` |

### Contraste (verificado)

| Combinación | Ratio | AA |
|---|---|---|
| `--ink-100` sobre `--bg-010` | 16.8:1 | ✅ |
| `--ink-080` sobre `--bg-010` | 11.4:1 | ✅ |
| `--ink-060` sobre `--bg-010` | 5.9:1 | ✅ texto normal |
| `--ink-040` sobre `--bg-010` | 3.2:1 | ✅ sólo ≥18.66px o ≥14px bold, y sólo metadatos |
| `--accent` sobre `--bg-010` | 10.1:1 | ✅ |

`--ink-020` es decorativo: nunca lleva información que no esté disponible en otro sitio.

---

## 3. Tipografía

**Dos familias. Ni una más.** (ADR-003)

| Rol | Familia | Pesos | Respaldo |
|---|---|---|---|
| Interfaz | **Instrument Sans** | 400, 500, 600 | `system-ui, "Segoe UI", Inter, Helvetica Neue, Arial` |
| Conceptual | **IBM Plex Mono** | 400, 500 | `ui-monospace, "Cascadia Mono", Consolas, monospace` |

La mono **no** es decorativa. Marca exclusivamente aquello que es un dato del
sistema: numeración de portales, `type`, `status`, año, etiquetas, eyebrows y el
campo semántico del hero. Si un texto es prosa, es sans.

### Escala (fluida)

| Token | `clamp()` | Uso |
|---|---|---|
| `--fs-display` | `clamp(2.5rem, 1.2rem + 4.4vw, 5rem)` | H1 del hero |
| `--fs-h1` | `clamp(2.1rem, 1.3rem + 2.6vw, 3.4rem)` | título de sección |
| `--fs-h2` | `clamp(1.5rem, 1.1rem + 1.3vw, 2.1rem)` | subtítulo, portal |
| `--fs-h3` | `clamp(1.05rem, .95rem + .4vw, 1.3rem)` | título de tarjeta |
| `--fs-lead` | `clamp(1.02rem, .95rem + .5vw, 1.24rem)` | descripción del hero |
| `--fs-body` | `1rem` | cuerpo |
| `--fs-sm` | `.875rem` | secundario |
| `--fs-micro` | `.6875rem` | mono en versalita |

### Reglas

- **Tracking negativo crece con el tamaño.** `--fs-display` → `-0.035em`;
  `--fs-h1` → `-0.025em`; cuerpo → `0`. Sin esto, los titulares grandes se
  desmontan.
- **Mono siempre:** `text-transform: uppercase`, `letter-spacing: .16em`,
  peso 500. Es una etiqueta, no una frase.
- **Interlineado:** `1.02` en display, `1.15` en títulos, `1.6` en cuerpo,
  `1.7` en párrafos largos de Conocimiento.
- **Medida máxima:** `--measure: 62ch` en prosa, `44ch` en descripciones de
  tarjeta. Nunca una línea de texto a todo el ancho del contenedor.

---

## 4. Espacio

Escala base 4px. Sólo se usan estos valores:

```
--sp-1: 4px    --sp-5: 24px   --sp-9:  80px
--sp-2: 8px    --sp-6: 32px   --sp-10: 120px
--sp-3: 12px   --sp-7: 48px   --sp-11: 160px
--sp-4: 16px   --sp-8: 64px
```

### Ritmo vertical

El espacio entre secciones es fluido y grande — es el principal recurso de
minimalismo del sitio:

```
--section-y: clamp(80px, 9vw, 160px)
```

### Layout

| Token | Valor |
|---|---|
| `--shell-max` | `1240px` |
| `--gutter` | `clamp(20px, 4.5vw, 56px)` |
| `--nav-h` | `64px` (desktop) / `56px` (móvil) |

---

## 5. Radios y bordes

| Token | Valor | Uso |
|---|---|---|
| `--r-0` | `0` | por defecto — el sitio es esencialmente ortogonal |
| `--r-1` | `2px` | tarjetas, campos |
| `--r-2` | `4px` | botones |
| `--r-pill` | `999px` | sólo los chips de filtro |

Bordes: **siempre 1px**. La profundidad se consigue con fondo y luz, nunca con
bordes gruesos ni con sombras difusas grandes.

---

## 6. Reglas de animación

### Duraciones y curvas

| Token | Valor | Uso |
|---|---|---|
| `--dur-fast` | `140ms` | acuse de recibo (botón pulsado) |
| `--dur-base` | `240ms` | hover, cambio de estado |
| `--dur-slow` | `520ms` | aparición al hacer scroll |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | entradas |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | cambios de estado |

### Qué se anima

**Sólo `transform` y `opacity`.** Ambas se componen en la GPU y no provocan
*layout*. Está prohibido animar `width`, `height`, `top`, `left`, `margin`,
`padding`, `box-shadow` o `filter` de forma continua.

### Qué está prohibido (§25)

Animación permanente de tarjetas · texto flotando · partículas · *ticker* ·
*glitch* · números que se incrementan solos · cualquier bucle visible.

### Hover

Un hover cambia **como máximo dos propiedades**. El patrón del sitio:

```
opacidad del borde  →  --line → --line-strong
desplazamiento de la flecha →  translateX(0 → 4px)
```

Nada más. Sin elevación, sin escala, sin cambio de color de fondo brusco.

### `prefers-reduced-motion`

Cuando está activo: se elimina todo movimiento continuo, todo paralaje y toda
transición de entrada. Los elementos aparecen ya en su estado final. El hero
conserva su composición estática completa — sigue siendo bonito, sólo está quieto.
Ver `INTERACTION-SYSTEM.md § Reduced motion`.

---

## 7. Foco y accesibilidad

- Anillo de foco visible siempre: `outline: 1px solid var(--accent)` +
  `outline-offset: 3px`. Nunca `outline: none` sin sustituto.
- Se usa `:focus-visible` para no molestar al ratón, pero cualquier elemento
  interactivo alcanzable por teclado **debe** tener anillo.
- Objetivo táctil mínimo: 44×44px en móvil.
- Enlace "saltar al contenido" como primer elemento del `<body>`.
- El campo semántico del hero es `aria-hidden="true"`: es textura, no contenido.

---

## 8. Anti-patrones (lo que este sitio no hace)

- Tarjetas SaaS con borde, sombra, icono, badge de color y dos botones.
- Más de un CTA primario compitiendo en la misma pantalla.
- Métricas de vanidad ("+120 proyectos").
- Degradados de tres colores.
- Iconos que repiten lo que ya dice la etiqueta de al lado.
- Texto sobre imagen sin capa de contraste.
- Scroll horizontal en cualquier viewport.
