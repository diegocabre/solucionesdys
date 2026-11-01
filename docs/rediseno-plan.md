# Plan de rediseño: que el sitio no parezca plantilla

Plan propuesto para rediseñar solucionesdys.cl **por fases**, un PR por fase, con capturas antes/después.
Sigue la skill `.claude/skills/frontend-design` y respeta `PRODUCT.md` (marca, voz, SEO y evidencia).

**Decisiones fijas**
- Se mantienen los colores del kit de marca (`src/app/globals.css`).
- Se reemplaza Poppins.
- No se cambian rutas, `<title>`, metadescripciones, JSON-LD ni el sitemap. El H1 de cada página conserva su palabra clave (ej. "diseño web" + "Puerto Varas").
- Nada inventado: sin testimonios, cifras, fotos de Diego ni de equipo.

---

## 1. Diagnóstico (revisión de home y `/webs`)

| Señal de plantilla | Dónde | Qué hacemos |
|---|---|---|
| Etiqueta en mayúsculas sobre el título ("SOLUCIONES DYS • PUERTO VARAS, CHILE", "PROYECTO REAL") | ~27 usos de `uppercase` en ~20 archivos | Se eliminan. Si la información sirve, va en texto normal, en minúscula de oración. |
| Una sola palabra del título en verde ("*Puerto Varas*", "*te traen clientes*") | Hero de home y `/webs` | Título en un solo color. El énfasis lo da el tamaño y la composición. |
| Negro + un solo verde brillante en todo | Todo el sitio | Mismos colores, otros roles: más marfil, verde solo para acciones, amarillo como firma (ver §2). |
| Tarjeta con íconos en cuadritos + globo gigante decorativo | Hero de `/webs` | Se reemplaza por una lista tipográfica de beneficios, sin íconos de relleno. |
| Poppins + Inter | Global | Nueva pareja tipográfica (ver §2). |
| "→" al final de los enlaces | 4 usos | Se quita. El enlace dice qué hace ("Ver el sitio de Estribor"). |
| ~50 animaciones `whileInView` de entrada | Todo el sitio | Se quitan. Queda un único momento animado: la entrada del hero de la home. |
| FAQ y blog en cajas redondeadas idénticas | Home | Listas con divisores, igual que la lista de partners (que ya funciona bien). |
| Espacio vacío grande antes del footer | Home | Revisar y corregir en la fase 1. |

**Lo que se conserva:** la lista tipográfica de partners, la composición asimétrica de servicios, las franjas marfil y que todo lo mostrado es real.

---

## 2. Sistema de diseño

### Color (kit de marca, nuevos roles)

| Nombre | Hex | Rol |
|---|---|---|
| Negro | `#000000` | Fondo base de las zonas oscuras. |
| Marfil | `#F6F1E7` | Texto sobre negro **y** fondo de más secciones que hoy (pasa a ser casi la mitad de la página). |
| Verde DyS | `#34D399` (`#05694A` sobre marfil) | **Solo acciones:** botones y estados activos. Nunca para decorar palabras. |
| Amarillo punto | `#FFD60A` | **La firma:** el punto del logo "DyS." Se usa en un solo gesto (ver principios). Nunca para texto sobre marfil. |
| Azul | `#4C9AFF` (`#1F5FD6` sobre marfil) | Enlaces dentro de texto. |
| Borde | `#31302E` / `#DDD6C8` | Divisores. |

### Tipografía

Se elige en la fase 0 con una página de muestra real (titulares, párrafos y botones con textos del sitio). Candidatas, todas en Google Fonts y cargables con `next/font`:

- **Opción A (recomendada): Familjen Grotesk** para titulares + **Inter** para el texto. Es una grotesca con carácter (trazos y remates propios) que se distingue claramente de Inter, y funciona bien en tamaños muy grandes.
- **Opción B: Schibsted Grotesk** para titulares y texto (una sola familia, con pesos distintos). Más sobria y editorial.

Escala (base 18 px en texto corrido, líneas de menos de 75 caracteres):
`14 · 16 · 18 · 22 · 28 · 40 · 56 · 80` px. Los titulares grandes se usan como elemento visual, no solo para leer. Peso: titulares 600–700, texto 400. Sin mayúsculas sostenidas.

### Layout

Alineación a la izquierda en todo el sitio, retícula de 12 columnas, composición asimétrica (5/7 y 7/5) como la de servicios y partners. Sin tarjetas idénticas en fila.

Hero de la home (propuesta):

```
┌──────────────────────────────────────────────────────────────┐
│ DyS.                               Inicio  Diseño web  …  [Cotizar] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Diseño y desarrollo web                                     │
│  en Puerto Varas.  ← titular enorme, una línea por idea;      │
│                      el punto final es el amarillo del logo   │
│                                                              │
│  Sitios a medida para pymes: rápidos      [Cotizar mi sitio] │
│  en el celular, visibles en Google…       Ver servicios      │
│                                                              │
├──────────────────────── fondo marfil ────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐    │
│ │ Rincón del │ │ Estribor   │ │ Dogtoralia │ │ Caroline │ ←  │
│ │ Aromo      │ │ Consultores│ │ Vet        │ │ Magic    │ tira│
│ └────────────┘ └────────────┘ └────────────┘ └──────────┘    │
│  Sitios reales hechos por nosotros. Entra y míralos.         │
└──────────────────────────────────────────────────────────────┘
```

El carrusel con puntos se reemplaza por la tira de sitios reales: la prueba concreta del trabajo es lo más característico que tiene DyS.

### Principios

1. **El punto amarillo es la firma.** Viene del logo "DyS." y aparece solo como punto final del titular principal de cada página. Es el único gesto audaz; todo lo demás va sobrio.
2. **Mostrar trabajo real, no decir que es bueno.** Las capturas de sitios reales reemplazan íconos y frases de relleno.
3. **El verde significa "haz clic".** Si algo es verde, es una acción.
4. **Estructura con sentido.** Números solo si hay una secuencia real (ej. el proceso de trabajo). Divisores en lugar de cajas.
5. **Movimiento solo donde explica algo:** la entrada del hero, abrir y cerrar preguntas, confirmar el envío del formulario. Respetar `prefers-reduced-motion`.

---

## 3. Fases

Cada fase va en su propio PR, con capturas de escritorio (1440 px) y móvil (390 px) antes/después, y pasa `npm run lint`, `npm test` y `npm run build`.

| Fase | Alcance | Archivos principales |
|---|---|---|
| **0. Base** | Muestra tipográfica para elegir entre A y B → cambiar la fuente, escala tipográfica, nuevos roles de color, `Button`, `Navbar`, `Footer`. | `src/app/globals.css`, `src/app/layout.tsx`, `src/components/Button.tsx`, `Navbar.tsx`, `Footer.tsx` |
| **1. Home** | Hero nuevo + tira de sitios reales, servicios, caso destacado, FAQ como lista, blog como lista, cierre. Corregir el espacio vacío antes del footer. | `src/app/HomeContent.tsx`, `ServicesCarousel.tsx`, `FeaturedCase.tsx`, `FaqSection.tsx`, `UltimosArticulos.tsx`, `ZonaAtencion.tsx` |
| **2. Diseño web** | `/webs`, casos y partners. | `src/app/webs/**`, `src/app/partners/**`, `CasosDeExito.tsx`, `PartnersShowcase.tsx` |
| **3. Contacto** | Formulario y página de contacto (sin tocar Turnstile, límites de envío ni la acción del servidor). | `src/app/contacto/**` |
| **4. Contenido** | Aprende IA, Comunidad (farmacias, directorio), blog y artículos, legales, 404. Barrido final de `uppercase`, "→" y animaciones sobrantes. | `src/app/aprende-ia/**`, `src/app/comunidad/**`, `src/app/blog/**`, `privacidad`, `terminos`, `not-found.tsx` |

El panel `/admin` queda fuera del rediseño.

### Cómo pedir cada fase

> "Haz la fase 1 del plan de rediseño (`docs/rediseno-plan.md`)."

Antes de empezar una fase nueva, revisa que la anterior esté mezclada en `main`.
