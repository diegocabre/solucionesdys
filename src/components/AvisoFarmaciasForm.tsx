"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BellRing } from "lucide-react";
import Button from "@/components/Button";
import TurnstileWidget from "@/components/TurnstileWidget";
import { suscribirAviso, type AvisoState } from "@/app/comunidad/farmacias-de-turno/actions";

const initialState: AvisoState = { ok: false, mensaje: "" };

const campo =
  "w-full rounded-lg border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 text-sm";

export default function AvisoFarmaciasForm({ comunas }: { comunas: { slug: string; nombre: string }[] }) {
  const [state, formAction, pending] = useActionState(suscribirAviso, initialState);

  return (
    <section
      aria-labelledby="aviso-titulo"
      className="mt-16 rounded-3xl border border-brand-accent/30 bg-brand-accent/5 p-6 sm:p-8"
    >
      <div className="max-w-2xl space-y-2">
        <h2 id="aviso-titulo" className="flex items-center gap-2 text-2xl font-bold text-brand-primary">
          <BellRing className="size-6 text-brand-accent-dark" aria-hidden="true" />
          Recibe la farmacia de turno cada mañana
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Te llega un correo cada día con la farmacia de turno de tu comuna. Gratis, y te das de baja con un clic.
        </p>
      </div>

      {state.ok ? (
        <p role="status" className="mt-6 p-4 bg-green-50 text-green-800 rounded-md text-sm border border-green-200">
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
              <label htmlFor="aviso-email" className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
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
              <label htmlFor="aviso-comuna" className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
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
            className="justify-center bg-brand-accent hover:bg-brand-accent-dark border-brand-accent"
          >
            {pending ? "Enviando..." : "Quiero el aviso"}
          </Button>
          <div className="sm:col-span-2 space-y-3">
            <TurnstileWidget resetKey={state} />
            {state.mensaje && (
              <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
                {state.mensaje}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Solo usamos tu correo para este aviso. Más detalles en nuestra{" "}
              <Link href="/privacidad" className="underline underline-offset-2 hover:text-brand-primary">
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
