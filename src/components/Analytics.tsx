'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsent, COOKIE_CONSENT_CHANGE_EVENT } from '@/components/CookieConsent';

// Configura este ID en `.env.local` (no se commitea) y en Vercel:
//   NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
// Mientras no esté definido, el script simplemente no se carga.
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

  // Nunca se carga sin consentimiento explícito, y solo si además
  // configuraste el Project ID.
  if (!enabled || !CLARITY_ID) return null;

  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}
