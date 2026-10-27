"use client";

import { useActionState } from "react";
import Button from "@/components/Button";
import { gestionarAviso, type ResultadoAviso } from "@/app/comunidad/farmacias-de-turno/actions";

const MENSAJES: Record<Exclude<ResultadoAviso, null>, { texto: string; ok: boolean }> = {
  confirmado: { texto: "¡Listo! Tu aviso quedó activo: te llegará cada mañana.", ok: true },
  baja: { texto: "Listo, te diste de baja. No te enviaremos más avisos.", ok: true },
  invalido: { texto: "Este enlace no es válido o ya no existe. Puedes suscribirte de nuevo desde la página de farmacias.", ok: false },
  error: { texto: "No pudimos completar la acción. Intenta nuevamente en unos minutos.", ok: false },
};

export default function GestionarAviso({ accion, token, comuna }: { accion: string; token: string; comuna: string }) {
  const [resultado, formAction, pending] = useActionState(gestionarAviso, null);

  if (resultado) {
    const { texto, ok } = MENSAJES[resultado];
    return (
      <p
        role={ok ? "status" : "alert"}
        className={`p-4 rounded-md text-sm border ${ok ? "bg-dys-primary/10 text-dys-primary border-dys-primary/40" : "bg-red-500/10 text-red-300 border-red-500/40"}`}
      >
        {texto}
      </p>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="accion" value={accion} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="comuna" value={comuna} />
      <Button
        type="submit"
        disabled={pending}
        variant={accion === "baja" ? "outline" : "primary"}
        className={accion === "baja" ? "" : "bg-dys-primary hover:bg-dys-primary/85 border-dys-primary"}
      >
        {pending ? "Procesando..." : accion === "baja" ? "Darme de baja" : "Confirmar mi aviso"}
      </Button>
    </form>
  );
}
