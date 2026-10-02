"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { registrarVisita } from "@/lib/attribution";

// Recuerda la campaña (utm_*) y la última página vista para adjuntarlas al lead
// si el visitante escribe por el formulario. No renderiza nada.
export default function AttributionTracker() {
  const pathname = usePathname();

  useEffect(() => {
    registrarVisita(pathname, window.location.search);
  }, [pathname]);

  return null;
}
