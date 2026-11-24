# Kit de marca · Soluciones DyS

Logo elegido: wordmark **DyS.** con D verde, y marfil (grafito en fondo claro), S azul y punto amarillo.

## Contenido
- `logo/` Logo en SVG y PNG con fondo transparente: `para-fondo-oscuro`, `para-fondo-claro`, `blanco`, `negro`.
- `favicon/` Favicon con el logo completo DyS. sobre fondo negro (trazo reforzado para que se lea en la pestaña): `favicon.svg`, `favicon.ico`, PNG 16/32/48, `apple-touch-icon.png`, `icon-192/512`, `icon-maskable-512`, `site.webmanifest` y `favicon-snippet.html`.
- `social/` Foto de perfil 1080x1080 (oscuro y claro) e imagen para compartir el link `og-image-1200x630.png`.
- `brand/` Paleta como variables CSS (`brand.css`) y `tokens.json`.

## Paleta
| Uso | Oscuro | Claro |
|---|---|---|
| Fondo | #000000 | #F6F1E7 |
| Superficie | #11161C | #FFFFFF |
| Texto | #F6F1E7 | #121820 |
| Primario (botones) | #34D399, texto #000000 | #05694A, texto #FFFFFF |
| Enlaces | #4C9AFF | #1F5FD6 |
| Acento | #FFD60A | #B58900 (texto #7A5C00) |

Contraste (WCAG): oscuro, texto 18,7:1, verde 10,9:1, azul 7,4:1, amarillo 14,9:1. Claro, texto 15,9:1, botón verde con texto blanco 6,7:1, azul 5,1:1. El verde del logo en claro (#078A5E) solo para gráficos o texto grande.

## Reglas de uso del logo
- Margen libre alrededor: al menos la altura de la "D" dividida en 2.
- Ancho mínimo: 80 px en pantalla. Por debajo de 40 px usar el favicon (versión con fondo negro y trazo reforzado).
- No cambiar colores, no estirar, no agregar sombras. Sobre fotos usar la versión blanca.
- El punto amarillo es parte del logo: no quitarlo.

## Prompt para Claude Code (copiar y pegar)
```
Actualiza la marca de este sitio usando los archivos de dys-brand-kit:
1. Reemplaza el logo actual (encabezado, pie de página, páginas de login/panel, correos y documentos) por logo/dys-logo-para-fondo-oscuro.svg o ...-para-fondo-claro.svg según el tema. Si el sitio es claro usa la versión para fondo claro.
2. Copia favicon/ a la carpeta pública (o a app/ si usa Next.js App Router: icon.svg, favicon.ico, apple-icon.png) y agrega el contenido de favicon/favicon-snippet.html al <head>. Copia social/og-image-1200x630.png como og-image.png y actualiza las metaetiquetas Open Graph.
3. Reemplaza la paleta actual por las variables de brand/brand.css (y tokens.json). Mapea: fondo, superficie, texto, botón primario (verde), enlaces (azul) y acento (amarillo, poco). Usa --dys-on-primary para el texto de los botones. Mantén el contraste WCAG AA.
4. Busca y reemplaza colores sueltos (hex, rgb, clases de Tailwind) por las variables. No dejes colores antiguos.
5. Revisa en móvil y escritorio, tema claro y oscuro, y confirma que el favicon se vea en la pestaña.
Antes de empezar, lista los archivos que vas a cambiar y los colores actuales que encontraste.
```
