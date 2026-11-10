# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos públicos con el mismo peso:

- **Pymes de la cuenca del Llanquihue** (Puerto Varas, Llanquihue, Frutillar, Puerto Montt) que quieren reunirse en persona con quien les hace el sitio. Buscan en Google "diseño web Puerto Varas" o llegan por recomendación.
- **Pymes y emprendedores de todo Chile** que trabajan de forma remota (por ejemplo, Dogtoralia Vet en Puente Alto y Santiago Centro). Para ellos lo local es un plus, no el motivo de contacto.

En ambos casos la tarea es la misma: decidir si confían en Soluciones DyS para tener un sitio que les traiga clientes, entender qué tipo de sitio necesitan (landing, corporativo o tienda) y cuánto cuesta, y escribir para cotizar.

Ruta DyS suma un tercer público: **empresas con vendedores en terreno** que visitan clientes y quieren asignar cartera, ordenar la ruta del día y ver visitas y kilómetros. Su tarea es entender qué hace el producto y registrarse en el plan demo.

## Product Purpose

Soluciones DyS (Soluciones DyS SpA) diseña y desarrolla sitios web, landing pages, tiendas online y apps a medida para pymes, con postventa: actualizaciones, meses de soporte y respaldo de la base de datos. El sitio existe para generar cotizaciones: el éxito es que un dueño de pyme escriba por el formulario de contacto, WhatsApp o correo.

**Segunda línea de negocio: Ruta DyS**, producto propio que se vende. Es un panel web y una app Android para empresas con vendedores en terreno: se asigna la cartera (importada por CSV), cada vendedor vincula la app con un código QR, la app arma la ruta del día y funciona sin señal, y el panel muestra en un mapa el recorrido, las visitas y los kilómetros, con reportes descargables. Se presenta en la portada (`src/components/RutaDys.tsx`) y vive en `https://rutario.solucionesdys.cl`. En el sitio, el éxito es que la empresa pruebe el plan demo o descargue la app.

Las secciones **Aprende IA**, **Comunidad Puerto Varas** (farmacias de turno) y el **blog** no se venden: atraen visitas, sobre todo locales y de búsqueda, y muestran conocimiento para ganar confianza.

## Positioning

Detrás está una sola persona, Diego, que diseña y programa cada sitio. Lo que lo distingue, según él:

1. **Trato directo y cercano:** el cliente habla con quien construye el sitio, en persona si está en la zona.
2. **Código a medida:** sin WordPress ni plantillas; sitios rápidos, propios y preparados para Google.
3. **IA aplicada al negocio:** además de hacer webs, ayuda a las pymes a entender y usar inteligencia artificial.
4. **Precio accesible para pymes:** rangos pensados para negocios pequeños.

## Operating Context

- Atención presencial en Puerto Varas, Llanquihue, Frutillar y Puerto Montt; el resto de Chile, de forma remota (`AREA_SERVED` en `src/lib/site.ts`).
- Contacto: formulario en `/contacto` (con Turnstile y límite de envíos), WhatsApp +56 9 4763 7541, contacto@solucionesdys.cl, Instagram @solucionesdys.cl.
- Los contactos recibidos se guardan en Supabase (tabla `leads`) y llegan por correo.
- Idioma: español de Chile (`es_CL`). Los precios se expresan en pesos chilenos.

## Capabilities and Constraints

- Sitio en Next.js 16 + React 19 + Tailwind v4, desplegado en Vercel. Blog en MDX con RSS.
- Datos centralizados en `src/lib/site.ts`; casos en `src/lib/casos.ts`; partners en `src/lib/partners.ts`; preguntas frecuentes en `src/lib/faq.ts`.
- El SEO local es estratégico: hay datos estructurados (JSON-LD), sitemap y páginas pensadas para búsquedas por comuna. No cambiar rutas ni títulos sin revisar el impacto en el posicionamiento.
- Analítica: Vercel Analytics y Microsoft Clarity, este último solo con consentimiento de cookies.
- **Ruta DyS:** plan demo sin costo (2 clientes y 1 vendedor) y planes pagados. No hay precios publicados de los planes; no inventarlos. Declara cumplir las leyes 19.628 y 21.719 y usar solo cookies de sesión. Aún no hay capturas del panel ni de la app (solo el logo en `public/assets/img/ruta-dys/icon.webp`); las capturas futuras no deben mostrar datos de clientes reales.
- **Voz confirmada:** el sitio habla como marca, en "nosotros" ("Soluciones DyS"). Por ahora no se muestra la foto de Diego.

## Brand Commitments

- Nombre: Soluciones DyS (razón social Soluciones DyS SpA).
- **Logo oficial:** wordmark "DyS." con D verde, "y" marfil (grafito en fondo claro), S azul y punto amarillo. Archivos en `dys-brand-kit/dys-brand-kit/` (logos, favicon, imágenes sociales y paleta en `brand/brand.css` y `brand/tokens.json`). Reglas de uso: margen libre de al menos media altura de la "D"; ancho mínimo 80 px en pantalla (por debajo de 40 px, el favicon); no cambiar colores, estirar ni agregar sombras; sobre fotos, la versión blanca; el punto amarillo nunca se quita.
- Voz: "nosotros", como marca. Sin foto de Diego por ahora; no agregar retratos ni fotos de equipo.
- Los textos deben hablarle a un dueño de pyme sin tecnicismos: beneficios concretos (clientes, Google, WhatsApp) antes que nombres de tecnologías.

## Evidence on Hand

- **Proyectos reales:** Rincón del Aromo (cowork y cafetería, Puerto Varas), Estribor Consultores, Dogtoralia Vet (Puente Alto y Santiago Centro) y Caroline Magic. Capturas en `public/assets/img/partners/`.
- **Blog:** 2 guías en `content/blog/` (Google Maps y tipos de sitio). El blog es informativo: sin artículos de venta ni bloques promocionales; cada artículo cierra con una sola línea discreta hacia /contacto.
- **Precios:** precio de entrada confirmado: desde $350.000 por una página estática (`PRECIO_DESDE`). El artículo de precios se retiró (301 a la guía de tipos de sitio); no publicar otros rangos sin que Diego los confirme.
- **Testimonios:** dos opiniones reales de Google (Carolina Cosentino de Caroline Magic, y Dogtoralia), en `HomeContent.tsx`. Métricas de resultados: ninguna confirmada; los casos siguen con campos pendientes. No inventar testimonios, cifras, reseñas ni calificaciones.
- **Fotografía:** no hay fotos de Diego ni de la zona; solo capturas de pantalla y una foto de Rincón del Aromo.

## Product Principles

1. **Una persona real detrás:** todo lo que el sitio diga debe poder cumplirlo Diego trabajando directamente con el cliente.
2. **Los proyectos son la prueba:** se muestran casos reales y con nombre; nada inventado.
3. **Beneficio antes que tecnología:** hablar de clientes, Google y WhatsApp, no de frameworks.
4. **Local con alcance nacional:** la cercanía en la cuenca del Llanquihue es un activo, sin excluir a quien escribe desde otra región.
5. **Contenido útil que genera confianza:** el blog, Aprende IA y Comunidad deben servir de verdad al vecino o al emprendedor, no solo existir por SEO.
