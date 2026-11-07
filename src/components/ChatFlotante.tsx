"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ChatN8n = dynamic(() => import("@/components/ChatN8n"), { ssr: false });

// Botón flotante del chat en todo el sitio, salvo /contacto, que ya lo tiene incrustado.
export default function ChatFlotante() {
  return usePathname() === "/contacto" ? null : <ChatN8n modo="ventana" />;
}
