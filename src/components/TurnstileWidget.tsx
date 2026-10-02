"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { BUSINESS } from "@/lib/site";

// Captcha de Cloudflare Turnstile. Dentro de un <form> agrega solo el campo oculto
// `cf-turnstile-response`, que la server action verifica contra Cloudflare.
//
// Ojo: NEXT_PUBLIC_TURNSTILE_SITE_KEY se incrusta al compilar. Si se agrega o cambia
// en Vercel, hay que volver a desplegar para que el widget aparezca.

interface TurnstileOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  language?: string;
  size?: "normal" | "flexible" | "compact";
  "error-callback"?: (code: string) => void;
  callback?: (token: string) => void;
}

interface TurnstileApi {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function AvisoSinVerificacion() {
  return (
    <p role="alert" className="p-3 rounded-md text-sm border border-amber-200 bg-amber-50 text-amber-900">
      No pudimos cargar la verificación anti-robots. Recarga la página o escríbenos directo por{" "}
      <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
        WhatsApp
      </a>
      .
    </p>
  );
}

export default function TurnstileWidget({ resetKey }: { resetKey?: unknown }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const ultimoResetKey = useRef(resetKey);
  const [fallo, setFallo] = useState(false);

  const render = useCallback(() => {
    if (!siteKey || !container.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      // El sitio usa siempre tema claro.
      theme: "light",
      language: "es",
      size: "flexible",
      callback: () => setFallo(false),
      // Llave inválida, dominio no autorizado en Cloudflare, red bloqueada, etc.
      "error-callback": (code) => {
        console.error("[turnstile] Error del widget:", code);
        setFallo(true);
      },
    });
  }, [siteKey]);

  // Si el script ya estaba cargado (p. ej. al volver a /contacto), se dibuja de inmediato.
  useEffect(() => {
    render();
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [render]);

  // Cada token sirve una sola vez: tras cada envío se pide uno nuevo.
  useEffect(() => {
    if (ultimoResetKey.current === resetKey) return;
    ultimoResetKey.current = resetKey;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  if (!siteKey) {
    // En desarrollo el servidor omite la verificación si falta la llave; en producción no.
    if (process.env.NODE_ENV !== "production") return null;
    console.error("[turnstile] Falta NEXT_PUBLIC_TURNSTILE_SITE_KEY en el build: agrégala en Vercel y vuelve a desplegar.");
    return <AvisoSinVerificacion />;
  }

  return (
    <>
      <Script
        src={SCRIPT_URL}
        strategy="afterInteractive"
        onReady={render}
        onError={() => setFallo(true)}
      />
      <div ref={container} className="min-h-[65px]" />
      {fallo && <AvisoSinVerificacion />}
    </>
  );
}
