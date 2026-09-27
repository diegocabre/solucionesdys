import { SITE_URL, SITE_NAME, BUSINESS } from "@/lib/site";

// Comunas que atendemos presencialmente; el resto de Chile se atiende de forma remota.
const AREA_SERVED = ["Puerto Varas", "Llanquihue", "Frutillar", "Puerto Montt"];

export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: BUSINESS.legalName,
    alternateName: SITE_NAME,
    url: SITE_URL,
    image: `${SITE_URL}/assets/img/og-image.jpg`,
    logo: `${SITE_URL}/assets/img/logo.png`,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.addressLocality,
      addressRegion: BUSINESS.addressRegion,
      addressCountry: BUSINESS.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    areaServed: [
      ...AREA_SERVED.map((name) => ({ "@type": "City", name })),
      { "@type": "AdministrativeArea", name: "Región de Los Lagos" },
      { "@type": "Country", name: "Chile" },
    ],
    knowsAbout: [
      "Diseño web",
      "Desarrollo web",
      "Landing pages",
      "Tiendas online",
      "SEO",
      "React",
      "Next.js",
    ],
    sameAs: [BUSINESS.instagram],
    description:
      "Diseño y desarrollo de sitios web, landing pages y tiendas online a medida en Puerto Varas, para pymes de la Región de Los Lagos y todo Chile.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
