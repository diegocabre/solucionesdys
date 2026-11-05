---
name: Soluciones DyS
description: Sitios web a medida para pymes, desde Puerto Varas para todo Chile.
colors:
  negro: "#000000"
  marfil: "#F6F1E7"
  marfil-apagado: "#B5B0A3"
  borde-oscuro: "#31302E"
  verde-dys: "#34D399"
  azul-enlace: "#4C9AFF"
  amarillo-punto: "#FFD60A"
  papel-blanco: "#FFFFFF"
  grafito: "#121820"
  grafito-apagado: "#4B5560"
  borde-claro: "#DDD6C8"
  verde-profundo: "#05694A"
  azul-profundo: "#1F5FD6"
typography:
  display:
    fontFamily: "Familjen Grotesk, Inter, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 4.6vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Familjen Grotesk, Inter, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 2.2vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Familjen Grotesk, Inter, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.8vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, Arial, Helvetica, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.verde-dys}"
    textColor: "{colors.negro}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-primary-lg:
    backgroundColor: "{colors.verde-dys}"
    textColor: "{colors.negro}"
    rounded: "{rounded.lg}"
    padding: "0 28px"
    height: "48px"
  button-outline:
    textColor: "{colors.marfil}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.verde-dys}"
    textColor: "{colors.negro}"
  button-ghost:
    textColor: "{colors.marfil}"
    rounded: "{rounded.lg}"
    padding: "0 20px"
    height: "44px"
  input-field:
    backgroundColor: "{colors.papel-blanco}"
    textColor: "{colors.grafito}"
    rounded: "{rounded.lg}"
    padding: "12px"
  nav-link:
    textColor: "{colors.marfil}"
    typography: "{typography.label}"
    padding: "8px 12px"
  nav-link-active:
    textColor: "{colors.verde-dys}"
  screenshot-frame:
    backgroundColor: "{colors.negro}"
    rounded: "{rounded.xl}"
---

# Design System: Soluciones DyS

## Overview

**Creative North Star: "El punto final"**

Todo el sistema está construido para que un solo gesto se note: el punto amarillo del logo "DyS.", que cierra el titular principal de cada página. Lo demás calla. El fondo es negro, el texto es marfil, los titulares son grandes y en una sola tinta, y las secciones se separan con divisores finos en lugar de cajas. La calma del conjunto es lo que hace que el punto se lea como firma.

El sitio se apoya en la prueba antes que en la decoración: capturas reales de sitios hechos por DyS ocupan el lugar donde una plantilla pondría íconos o ilustraciones. Las franjas marfil (`.dys-light`) alternan con el negro para marcar los momentos importantes, como los casos reales o el formulario de contacto, sin añadir colores nuevos.

La densidad es generosa y la composición, asimétrica (columnas 5/7 y 7/5) y alineada a la izquierda. El tono de la interfaz es cercano y amable: un dueño de pyme sin experiencia técnica debe entender de inmediato qué se puede tocar y qué pasa al hacerlo.

**Key Characteristics:**
- Tema oscuro único, con franjas marfil para alternar.
- Titulares grotescos grandes que encogen sin saltos en móvil.
- El verde significa "haz clic"; el amarillo es solo el punto de la firma.
- Listas con divisores en vez de tarjetas idénticas en fila.
- Un único momento animado: el punto del titular de la portada cae en su lugar.

## Colors

Una paleta de dos tintas (negro y marfil) con tres colores de marca de roles estrictos, tomada del kit `dys-brand-kit`.

### Primary
- **Verde DyS** (`verde-dys`): solo acciones. Rellena el botón principal, dibuja el borde del secundario, marca el enlace activo de la navegación, el anillo de foco y la selección de texto. Sobre marfil se usa **Verde profundo** (`verde-profundo`) con texto blanco, para mantener el contraste.

### Secondary
- **Azul enlace** (`azul-enlace`): enlaces dentro de texto corrido, subrayados con separación de 4 px. Sobre marfil, **Azul profundo** (`azul-profundo`).

### Tertiary
- **Amarillo punto** (`amarillo-punto`): la firma. Existe solo como el punto final del titular principal (`.firma-punto`). Nunca se usa para texto, fondos ni íconos.

### Neutral
- **Negro** (`negro`): fondo base y también superficie de tarjetas; el sitio no usa el gris azulado del kit.
- **Marfil** (`marfil`): texto sobre negro y fondo de las franjas claras.
- **Marfil apagado** (`marfil-apagado`): texto secundario, etiquetas y numeración sobre negro.
- **Borde oscuro** (`borde-oscuro`): divisores y bordes sobre negro (marfil al 20 %).
- **Papel blanco** (`papel-blanco`): superficie de campos y avisos dentro de una franja marfil.
- **Grafito** (`grafito`) y **Grafito apagado** (`grafito-apagado`): texto principal y secundario sobre marfil.
- **Borde claro** (`borde-claro`): divisores sobre marfil.

### Named Rules
**The Green Means Click Rule.** Si algo es verde, es una acción. Nunca se pinta de verde una palabra del titular ni un elemento decorativo.

**The One Dot Rule.** El amarillo aparece una sola vez por página, como punto final del titular principal. Si hay un segundo amarillo, sobra uno.

**The Token Swap Rule.** Las franjas claras no definen colores propios: `.dys-light` reasigna las mismas variables (`--dys-bg`, `--dys-text`, `--dys-primary`…), así que todo componente funciona en ambos fondos sin cambios.

## Typography

**Display Font:** Familjen Grotesk (con Inter y sans-serif)
**Body Font:** Inter (con Arial, Helvetica y sans-serif)

**Character:** una grotesca con trazos propios para los titulares, que se usan como elemento visual, y una sans neutra para el texto corrido. Todo h1–h3 usa Familjen Grotesk con `text-wrap: balance`.

### Hierarchy
- **Display** (700, `titular-1`, 0.98): el H1 de cada página; conserva su palabra clave de SEO y termina en el punto amarillo.
- **Headline** (700, `titular-2`, 1.05): el H2 de cada sección.
- **Title** (600, `titular-3`, 1.2): subtítulos dentro de una sección ("Cómo funciona", "Envíanos tu consulta").
- **Body** (400, 18 px en párrafos de entrada, 16 px en el resto, 1.625): texto corrido, con líneas por debajo de 75 caracteres (`max-w-2xl` / `max-w-3xl`).
- **Label** (600, 14 px): sobretítulos breves ("Nuestro producto") en minúscula de oración y color apagado.

### Named Rules
**The Sentence Case Rule.** Sin mayúsculas sostenidas ni etiquetas en versalitas sobre los títulos. Si un dato sirve, va en minúscula de oración.

**The Single Ink Rule.** El titular va en un solo color. El énfasis lo dan el tamaño y la composición, no una palabra resaltada.

## Layout

Contenedor de 1280 px (`max-w-7xl`) con márgenes laterales de 16, 24 y 32 px según el ancho. Las secciones respiran con 96 px de padding vertical y se separan con un borde inferior. La retícula es de 12 columnas con composiciones asimétricas (5/7 en escritorio) que se apilan en una sola columna en móvil. Todo se alinea a la izquierda.

La navegación es fija, de 80 px de alto; los anclajes compensan esa altura (`scroll-mt-20`). El menú completo aparece desde 1280 px; por debajo, un botón de menú abre una lista desplegable.

**The Dividers Not Boxes Rule.** Preguntas frecuentes, artículos, pasos y datos de contacto se presentan como listas con divisores finos, no como tarjetas redondeadas repetidas.

## Elevation & Depth

El sistema es plano. La profundidad se marca con el cambio de fondo entre negro y marfil y con bordes de 1 px, no con sombras. Las únicas sombras están en elementos que flotan sobre el contenido: el botón de WhatsApp en móvil y el aviso de cookies.

### Shadow Vocabulary
- **Flotante** (`box-shadow` de Tailwind `shadow-lg`): botón de WhatsApp fijo en móvil.
- **Aviso** (`shadow-2xl`): aviso de consentimiento de cookies.

### Named Rules
**The Flat Page Rule.** Nada que viva dentro del flujo de la página lleva sombra. Si un elemento necesita destacar, cambia de fondo (franja marfil) o gana espacio.

## Shapes

Bordes suavemente redondeados, nunca píldoras salvo el botón flotante. Botones, campos y avisos usan 8 px; los marcos de capturas y el panel del formulario, 12 px; los botones de ícono pequeños, 6 px. Las capturas de sitios van en un marco de proporción 24:11 con borde de 1 px y recorte del contenido.

## Components

### Buttons
Cercanos y amables: se ven claramente tocables, con texto que dice qué hacen y sin efectos que distraigan.
- **Shape:** esquinas suaves (8 px), alturas de 36, 44 y 48 px.
- **Primary:** fondo verde DyS, texto negro, peso 600. Uno por bloque, para la acción principal ("Cotizar mi sitio").
- **Hover / Focus:** el verde baja al 85 % de opacidad; foco con anillo verde de 2 px separado del fondo por 2 px. Sin escala ni movimiento; respeta `prefers-reduced-motion`.
- **Outline:** borde verde de 2 px y texto marfil; al pasar el cursor se rellena de verde. Para la acción secundaria junto a la principal.
- **Ghost:** solo texto, con fondo marfil al 10 % al pasar el cursor.
- **Enlace externo:** abre en pestaña nueva y anuncia "(abre en una pestaña nueva)" a lectores de pantalla.

### Inputs / Fields
- **Style:** fondo blanco, borde claro de 1 px, esquinas de 8 px, 12 px de relleno y texto de 16 px. Viven dentro de un panel marfil para que el formulario se lea como la acción principal de la página.
- **Label:** encima del campo, en peso 600, siempre visible (el placeholder es solo un ejemplo).
- **Focus:** el borde pasa a verde y aparece un halo verde al 40 %.
- **Avisos:** confirmación con barra izquierda verde de 4 px; error con barra izquierda roja y texto rojo oscuro.

### Navigation
- **Style:** barra negra fija con borde inferior; logo "DyS." de 96 px de ancho a la izquierda (nunca bajo 80 px).
- **Links:** 15 px, peso 500, marfil; al pasar el cursor, verde.
- **Active:** texto verde subrayado (2 px, separación de 8 px), marcado con `aria-current="page"`.
- **CTA:** "Cotizar mi sitio" como botón verde aparte, al final.
- **Mobile:** botón de menú de 44 px que despliega la lista con una transición de altura.

### Screenshot Frame
La pieza más característica: capturas reales de sitios de clientes en un marco 24:11, 12 px de radio y borde de 1 px. Reemplaza a íconos e ilustraciones como prueba del trabajo.

### Firma (punto del titular)
El punto final del H1 se dibuja con `::after` en amarillo punto. En la portada cae en su lugar al cargar (520 ms, con un leve rebote, 300 ms de retraso); con movimiento reducido, aparece fijo.

## Do's and Don'ts

### Do:
- **Do** cerrar el H1 de cada página nueva con `.firma-punto` y usar la escala `titular-1/2/3`.
- **Do** usar las variables `dys-*` y las franjas `.dys-light` para alternar fondos; nunca colores sueltos.
- **Do** mostrar capturas reales de sitios en el marco 24:11 cuando se necesite una imagen.
- **Do** presentar listas con divisores de 1 px en vez de tarjetas en fila.
- **Do** respetar las reglas del logo: ancho mínimo de 80 px, sin cambiar colores ni quitar el punto amarillo.

### Don't:
- **Don't** usar etiquetas en mayúsculas sobre los títulos ni resaltar una palabra del titular en verde.
- **Don't** usar el amarillo fuera del punto de la firma, ni como color de texto.
- **Don't** agregar animaciones de entrada al hacer scroll; el único momento animado es el punto de la portada.
- **Don't** terminar enlaces con "→"; el texto del enlace dice qué hace.
- **Don't** poner sombras en elementos dentro del flujo de la página ni íconos en cuadritos como relleno.
