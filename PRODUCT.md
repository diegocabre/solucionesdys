# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dos públicos con el mismo peso:

- **Pymes de la cuenca del Llanquihue** (Puerto Varas, Llanquihue, Frutillar, Puerto Montt) que quieren reunirse en persona con quien les hace el sitio. Buscan en Google "diseño web Puerto Varas" o llegan por recomendación.
- **Pymes y emprendedores de todo Chile** que trabajan de forma remota (por ejemplo, Dogtoralia Vet en Puente Alto y Santiago Centro). Para ellos lo local es un plus, no el motivo de contacto.

En ambos casos la tarea es la misma: decidir si confían en Soluciones DyS para tener un sitio que les traiga clientes, entender qué tipo de sitio necesitan (landing, corporativo o tienda) y cuánto cuesta, y escribir para cotizar.

## Product Purpose

Soluciones DyS (Soluciones DyS SpA) diseña y desarrolla sitios web, landing pages y tiendas online a medida para pymes. El sitio existe para generar cotizaciones: el éxito es que un dueño de pyme escriba por el formulario de contacto, WhatsApp o correo.

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
- Panel de administración propio (`/admin/leads`) para revisar los contactos recibidos.
- Idioma: español de Chile (`es_CL`). Los precios se expresan en pesos chilenos.

## Capabilities and Constraints

- Sitio en Next.js 16 + React 19 + Tailwind v4, desplegado en Vercel. Blog en MDX con RSS.
- Datos centralizados en `src/lib/site.ts`; casos en `src/lib/casos.ts`; partners en `src/lib/partners.ts`; preguntas frecuentes en `src/lib/faq.ts`.
- El SEO local es estratégico: hay datos estructurados (JSON-LD), sitemap y páginas pensadas para búsquedas por comuna. No cambiar rutas ni títulos sin revisar el impacto en el posicionamiento.
- Analítica: Vercel Analytics y Microsoft Clarity, este último solo con consentimiento de cookies.
- **Voz confirmada:** el sitio habla como marca, en "nosotros" ("Soluciones DyS"). Por ahora no se muestra la foto de Diego.

## Brand Commitments

- Nombre: Soluciones DyS (razón social Soluciones DyS SpA). Logo existente en `public/`.
- Voz: "nosotros", como marca. Sin foto de Diego por ahora; no agregar retratos ni fotos de equipo.
- Los textos deben hablarle a un dueño de pyme sin tecnicismos: beneficios concretos (clientes, Google, WhatsApp) antes que nombres de tecnologías.

## Evidence on Hand

- **Proyectos reales:** Rincón del Aromo (cowork y cafetería, Puerto Varas), Estribor Consultores, Dogtoralia Vet (Puente Alto y Santiago Centro) y Caroline Magic. Capturas en `public/assets/img/partners/`.
- **Blog:** 3 artículos en `content/blog/` sobre precios, Google Maps y tipos de sitio.
- **Precios:** los rangos del artículo de precios **no están confirmados** (hay un TODO pendiente). No usarlos como precio oficial hasta que Diego los valide.
- **Testimonios y métricas:** no hay ninguno confirmado. Los casos tienen campos pendientes (resultados "antes/después", PageSpeed y testimonio con autorización escrita). No inventar testimonios, cifras de resultados, reseñas ni calificaciones.
- **Fotografía:** no hay fotos de Diego ni de la zona; solo capturas de pantalla y una foto de Rincón del Aromo.

## Product Principles

1. **Una persona real detrás:** todo lo que el sitio diga debe poder cumplirlo Diego trabajando directamente con el cliente.
2. **Los proyectos son la prueba:** se muestran casos reales y con nombre; nada inventado.
3. **Beneficio antes que tecnología:** hablar de clientes, Google y WhatsApp, no de frameworks.
4. **Local con alcance nacional:** la cercanía en la cuenca del Llanquihue es un activo, sin excluir a quien escribe desde otra región.
5. **Contenido útil que genera confianza:** el blog, Aprende IA y Comunidad deben servir de verdad al vecino o al emprendedor, no solo existir por SEO.
