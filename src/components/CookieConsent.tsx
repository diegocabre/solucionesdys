'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const COOKIE_CONSENT_KEY = 'sdys_cookie_consent';
export const COOKIE_CONSENT_EVENT = 'sdys:open-cookie-preferences';
export const COOKIE_CONSENT_CHANGE_EVENT = 'sdys:cookie-consent-changed';

export type CookieConsentValue = 'accepted' | 'essential-only';

/**
 * Lee la preferencia de cookies guardada por la persona.
 * Úsalo antes de cargar cualquier script de analítica o marketing
 * (Google Analytics, Meta Pixel, etc.):
 *
 *   if (getCookieConsent() === 'accepted') {
 *     // cargar script de analítica aquí
 *   }
 */
export function getCookieConsent(): CookieConsentValue | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return value === 'accepted' || value === 'essential-only' ? value : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sincroniza con localStorage (solo existe en el navegador) al montar;
    // por eso no puede resolverse durante el render inicial en el servidor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getCookieConsent() === null);

    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, reopen);
  }, []);

  const setConsent = (value: CookieConsentValue) => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      // localStorage no disponible (modo privado, etc.) — igual ocultamos el banner
    }
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: value }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          role="dialog"
          aria-label="Preferencias de cookies"
          className="fixed bottom-0 inset-x-0 z-100 p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
              Usamos cookies esenciales para el funcionamiento del sitio. Con tu
              autorización, también usamos Microsoft Clarity para entender cómo
              se usa el sitio y mejorarlo. Puedes revisar los detalles en
              nuestra{' '}
              <Link href="/privacidad" className="underline text-brand-accent-dark hover:text-brand-primary">
                Política de Privacidad y Cookies
              </Link>
              .
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => setConsent('essential-only')}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Solo esenciales
              </button>
              <button
                onClick={() => setConsent('accepted')}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
