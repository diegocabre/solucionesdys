import { SITE_URL, SITE_NAME, BUSINESS } from "@/lib/site";

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
    areaServed: "CL",
    sameAs: [BUSINESS.instagram],
    description:
      "Diseño y desarrollo de sitios web, landing pages y tiendas online a medida con React, Next.js y Tailwind CSS.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
