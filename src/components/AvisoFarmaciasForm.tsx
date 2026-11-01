"use client";

import Link from "next/link";
import { useActionState } from "react";
import Button from "@/components/Button";
import TurnstileWidget from "@/components/TurnstileWidget";
import { suscribirAviso, type AvisoState } from "@/app/comunidad/farmacias-de-turno/actions";

const initialState: AvisoState = { ok: false, mensaje: "" };

const campo =
  "w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-base";

export default function AvisoFarmaciasForm({ comunas }: { comunas: { slug: string; nombre: string }[] }) {
  const [state, formAction, pending] = useActionState(suscribirAviso, initialState);

  return (
    <section
      aria-labelledby="aviso-titulo"
      className="dys-light mt-16 rounded-xl bg-dys-bg text-dys-text p-6 sm:p-10"
    >
      <div className="max-w-2xl space-y-2">
        <h2 id="aviso-titulo" className="text-titular-3 font-semibold text-dys-text">
          Recibe la farmacia de turno cada mañana
        </h2>
        <p className="text-dys-muted leading-relaxed">
          Te llega un correo cada día con la farmacia de turno de tu comuna. Gratis, y te das de baja con un clic.
        </p>
      </div>

      {state.ok ? (
        <p role="status" className="mt-6 p-4 rounded-lg border-l-4 border-dys-primary bg-dys-surface text-dys-text">
          {state.mensaje}
        </p>
      ) : (
        <form action={formAction} className="relative mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          {/* Honeypot anti-spam: invisible para personas, los bots suelen rellenarlo */}
          <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
            <label htmlFor="aviso-hp">No completar este campo</label>
            <input id="aviso-hp" name="hp_check_x9" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="aviso-email" className="block mb-1.5 font-semibold text-dys-text">
                Tu correo
              </label>
              <input
                id="aviso-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                maxLength={254}
                placeholder="tu@correo.cl"
                className={campo}
              />
            </div>
            <div>
              <label htmlFor="aviso-comuna" className="block mb-1.5 font-semibold text-dys-text">
                Comuna
              </label>
              <select id="aviso-comuna" name="comuna" required defaultValue={comunas[0]?.slug} className={campo}>
                {comunas.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={pending}
            size="lg"
          >
            {pending ? "Enviando..." : "Quiero el aviso"}
          </Button>
          <div className="sm:col-span-2 space-y-3">
            <TurnstileWidget resetKey={state} theme="light" />
            {state.mensaje && (
              <p role="alert" className="p-3 rounded-lg border-l-4 border-red-700 bg-dys-surface text-red-800">
                {state.mensaje}
              </p>
            )}
            <p className="text-sm text-dys-muted">
              Solo usamos tu correo para este aviso. Más detalles en nuestra{" "}
              <Link href="/privacidad" className="text-dys-link underline underline-offset-2 hover:text-dys-text">
                política de privacidad
              </Link>
              .
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
