'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookieConsent, COOKIE_CONSENT_CHANGE_EVENT } from '@/components/CookieConsent';
import { eventosDeClic } from '@/lib/clarity';

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

  useEffect(() => {
    if (!enabled) return;
    // Cada demo cuenta una vez por página: interesa cuántos la usan, no cuántos clics hacen.
    const demosVistas = new Set<string>();
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element;
      const enlace = el.closest('a');
      const demo = el.closest<HTMLElement>('[data-evento]')?.dataset.evento ?? null;
      const eventos = eventosDeClic({
        href: enlace?.getAttribute('href'),
        seccion: el.closest('section[id]')?.id,
        demo: demo && !demosVistas.has(demo) ? demo : null,
      });
      if (demo) demosVistas.add(demo);
      for (const ev of eventos) window.clarity?.('event', ev);
      // Al tocar un enlace dentro de [data-clarity-tag="clave=valor"], etiqueta la sesión.
      const tag = enlace ? el.closest<HTMLElement>('[data-clarity-tag]')?.dataset.clarityTag?.split('=') : undefined;
      if (tag?.length === 2) window.clarity?.('set', tag[0], tag[1]);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [enabled]);

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
