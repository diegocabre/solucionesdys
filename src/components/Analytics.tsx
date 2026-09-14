'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsent, COOKIE_CONSENT_CHANGE_EVENT } from '@/components/CookieConsent';

// Configura estos IDs en `.env.local` (no se commitean) cuando tengas las
// cuentas creadas:
//   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
//   NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
// Mientras no estén definidos, estos scripts simplemente no se cargan.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

export default function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(getCookieConsent() === 'accepted');

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setEnabled(detail === 'accepted');
    };
    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onChange);
  }, []);

  // Nunca se cargan sin consentimiento explícito, y solo si además
  // configuraste el ID correspondiente.
  if (!enabled) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  );
}
