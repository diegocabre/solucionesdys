import { SITE_URL, SITE_NAME, BUSINESS, AREA_SERVED } from "@/lib/site";

// Único JSON-LD del negocio en todo el sitio (ProfessionalService es un subtipo de
// LocalBusiness). Otros bloques lo referencian por su @id en vez de repetirlo.

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
