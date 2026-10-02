"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

// Captcha de Cloudflare Turnstile. Dentro de un <form> agrega solo el campo oculto
// `cf-turnstile-response`, que la server action verifica contra Cloudflare.

interface TurnstileOptions {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  language?: string;
  size?: "normal" | "flexible" | "compact";
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

export default function TurnstileWidget({ resetKey }: { resetKey?: unknown }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const container = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const ultimoResetKey = useRef(resetKey);

  const render = useCallback(() => {
    if (!siteKey || !container.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(container.current, {
      sitekey: siteKey,
      // El sitio usa siempre tema claro.
      theme: "light",
      language: "es",
      size: "flexible",
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

  if (!siteKey) return null;

  return (
    <>
      <Script src={SCRIPT_URL} strategy="afterInteractive" onReady={render} />
      <div ref={container} className="min-h-[65px]" />
    </>
  );
}
