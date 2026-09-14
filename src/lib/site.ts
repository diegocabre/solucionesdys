// Configuración central del sitio: cámbiala aquí y se propaga a metadata,
// sitemap, robots.txt y los datos estructurados (JSON-LD).
//
// Si el dominio final es distinto, defínelo en `.env.local`:
//   NEXT_PUBLIC_SITE_URL=https://www.tudominio.cl

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.solucionesdys.cl";

export const SITE_NAME = "Soluciones DyS";

export const BUSINESS = {
  legalName: "Soluciones DyS SpA",
  displayName: "Soluciones DyS",
  phone: "+56947637541",
  phoneDisplay: "+56 9 4763 7541",
  email: "sandracydiegoc@gmail.com",
  addressLocality: "Puerto Varas",
  addressRegion: "Los Lagos",
  addressCountry: "CL",
  instagram: "https://www.instagram.com/solucionesdys.cl/",
  whatsapp: "https://wa.me/56947637541",
};
