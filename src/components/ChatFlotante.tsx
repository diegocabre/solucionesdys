"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

const ChatN8n = dynamic(() => import("@/components/ChatN8n"), { ssr: false });

// Botón flotante en todo el sitio, salvo /contacto, que ya tiene el chat incrustado.
// El chat pesa 486 KiB: se descarga recién cuando alguien toca el botón.
export default function ChatFlotante() {
  const pathname = usePathname();
  const [pedido, setPedido] = useState(false);

  if (pathname === "/contacto") {
    // Sin esto, el chat se abriría solo al volver de /contacto.
    if (pedido) setPedido(false);
    return null;
  }

  return (
    <>
      {/* Queda debajo del botón real de n8n, que lo cubre apenas carga. */}
      <button
        type="button"
        onClick={() => setPedido(true)}
        disabled={pedido}
        aria-busy={pedido}
        aria-label="Abrir chat para agendar una reunión"
        className={`fixed right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full bg-dys-primary text-dys-on-primary shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2 ${pedido ? "motion-safe:animate-pulse" : ""}`}
      >
        <MessageCircle className="size-7" />
      </button>
      {pedido && <ChatN8n modo="ventana" />}
    </>
  );
}
