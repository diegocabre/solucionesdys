"use client";

import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import WhatsAppFlotante from "@/components/WhatsAppFlotante";
import { BUSINESS } from "@/lib/site";

type Modo = "incrustado" | "ventana";
type Estado = "cargando" | "listo" | "caido";

const WEBHOOK = process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL;

// Pregunta al Chat Trigger por una sesión vacía: responde rápido y no despierta al agente.
async function servidorResponde(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "loadPreviousSession", sessionId: crypto.randomUUID() }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Chat de agendamiento (agente de IA en n8n). "incrustado" llena su contenedor; "ventana" es el botón flotante.
export default function ChatN8n({ modo }: { modo: Modo }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>(WEBHOOK ? "cargando" : "caido");

  useEffect(() => {
    const target = contenedor.current;
    if (!WEBHOOK || !target) return;
    let cancelado = false;
    let app: { unmount: () => void } | undefined;
    let quitarEscucha: (() => void) | undefined;

    (async () => {
      // En la página de contacto se comprueba al cargar; el botón flotante, al abrirlo por primera vez,
      // para no generar una ejecución en n8n por cada visita.
      if (modo === "incrustado" && !(await servidorResponde(WEBHOOK))) {
        if (!cancelado) setEstado("caido");
        return;
      }
      try {
        const [{ createChat }] = await Promise.all([import("@n8n/chat"), import("@n8n/chat/style.css")]);
        if (cancelado) return;
        app = createChat({
          webhookUrl: WEBHOOK,
          target,
          mode: modo === "incrustado" ? "fullscreen" : "window",
          showWelcomeScreen: false,
          // Con true, el paquete llama a n8n en cada carga de página y, si falla, deja el chat sin campo de texto.
          loadPreviousSession: false,
          initialMessages: [
            "¡Hola! 👋 Soy el asistente de Soluciones DyS.",
            "Te ayudo a agendar una reunión para conversar sobre tu sitio web. ¿Qué día te acomoda?",
          ],
          // El paquete solo acepta "en" como idioma; ahí van los textos en español.
          i18n: {
            en: {
              title: "Agenda una reunión",
              subtitle: "Conversa con nuestro asistente y elige día y hora.",
              footer: "",
              getStarted: "Nueva conversación",
              inputPlaceholder: "Escribe tu mensaje…",
              closeButtonTooltip: "Cerrar chat",
            },
          },
        });
        setEstado("listo");
      } catch {
        if (!cancelado) setEstado("caido");
        return;
      }

      if (modo === "ventana") {
        const alAbrir = async (e: Event) => {
          if (!(e.target as Element).closest(".chat-window-toggle")) return;
          target.removeEventListener("click", alAbrir, true);
          if (!(await servidorResponde(WEBHOOK)) && !cancelado) {
            app?.unmount();
            app = undefined;
            setEstado("caido");
          }
        };
        target.addEventListener("click", alAbrir, true);
        quitarEscucha = () => target.removeEventListener("click", alAbrir, true);
        // La ventana solo se monta después de que tocaron el botón: se abre de inmediato.
        target.querySelector<HTMLElement>(".chat-window-toggle")?.click();
      }
    })();

    return () => {
      cancelado = true;
      quitarEscucha?.();
      app?.unmount();
      // createChat deja su raíz dentro del contenedor; se vacía para no duplicar el chat al volver a montar.
      target.replaceChildren();
    };
  }, [modo]);

  if (modo === "ventana") {
    // Si el chat no está disponible, el botón flotante vuelve a ser el de WhatsApp.
    return estado === "caido" ? <WhatsAppFlotante /> : <div ref={contenedor} className="dys-chat" />;
  }

  return (
    <div className="space-y-3">
      {estado === "caido" ? (
        <div role="alert" className="rounded-xl border border-dys-border p-6 sm:p-8 space-y-4">
          <p className="text-lg text-dys-text">El chat no está disponible en este momento.</p>
          <p className="text-dys-muted">Escríbenos por WhatsApp y coordinamos la reunión por ahí.</p>
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-dys-primary px-6 font-semibold text-dys-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2"
          >
            <WhatsAppIcon className="size-5" />
            Escribir por WhatsApp
          </a>
        </div>
      ) : (
        <div
          role="region"
          aria-label="Chat para agendar una reunión"
          aria-busy={estado === "cargando"}
          className="relative h-[min(600px,75svh)] overflow-hidden rounded-xl border border-dys-border"
        >
          {/* Vue toma el control de este div: React no le pone hijos. */}
          <div ref={contenedor} className="dys-chat dys-chat-incrustado h-full" />
          {estado === "cargando" && <p className="absolute inset-0 p-6 text-dys-muted">Cargando el chat…</p>}
        </div>
      )}
      {estado !== "caido" && (
        <p className="text-sm text-dys-muted">
          ¿Prefieres WhatsApp?{" "}
          <a
            href={BUSINESS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dys-link underline underline-offset-2 hover:text-dys-text"
          >
            Escríbenos aquí
          </a>
          .
        </p>
      )}
    </div>
  );
}
