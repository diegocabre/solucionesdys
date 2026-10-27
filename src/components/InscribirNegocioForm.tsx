"use client";

import Link from "next/link";
import { startTransition, useActionState, type FormEvent } from "react";
import Button from "@/components/Button";
import TurnstileWidget from "@/components/TurnstileWidget";
import { inscribirNegocio, type FichaState } from "@/app/comunidad/directorio/actions";

const initialState: FichaState = { ok: false, mensaje: "" };

const campo =
  "w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-sm";
const etiqueta = "block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider";
const opcional = <span className="normal-case font-normal">(opcional)</span>;

interface Props {
  rubros: readonly string[];
  comunas: { slug: string; nombre: string }[];
}

export default function InscribirNegocioForm({ rubros, comunas }: Props) {
  const [state, formAction, pending] = useActionState(inscribirNegocio, initialState);
  // onSubmit en vez de action={...}: React no vacía el formulario y, si hay un error de
  // validación, la persona no pierde todo lo que escribió.
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    startTransition(() => formAction(datos));
  };

  if (state.ok) {
    return (
      <div role="status" className="space-y-4 p-6 bg-dys-primary/10 text-dys-primary rounded-2xl border border-dys-primary/40">
        <p>{state.mensaje}</p>
        <Link href="/comunidad/directorio" className="inline-block font-semibold underline underline-offset-2">
          Ver el directorio
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="relative space-y-6">
      {/* Honeypot anti-spam: invisible para personas, los bots suelen rellenarlo */}
      <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="neg-hp">No completar este campo</label>
        <input id="neg-hp" name="hp_check_x9" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold text-dys-text mb-2">Tu negocio (se publica)</legend>
        <div>
          <label htmlFor="neg-nombre" className={etiqueta}>Nombre del negocio</label>
          <input id="neg-nombre" name="nombre" required minLength={2} maxLength={80} className={campo} placeholder="Cabañas Los Alerces" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="neg-rubro" className={etiqueta}>Rubro</label>
            <select id="neg-rubro" name="rubro" required defaultValue="" className={campo}>
              <option value="" disabled>Elige uno</option>
              {rubros.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="neg-comuna" className={etiqueta}>Comuna</label>
            <select id="neg-comuna" name="comuna" required defaultValue={comunas[0]?.slug} className={campo}>
              {comunas.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="neg-desc" className={etiqueta}>Qué ofreces (una o dos frases)</label>
          <textarea
            id="neg-desc"
            name="descripcion"
            required
            minLength={10}
            maxLength={300}
            rows={3}
            className={campo}
            placeholder="Cabañas para 4 a 6 personas a orillas del lago, con tinaja y estacionamiento."
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="neg-tel" className={etiqueta}>Teléfono {opcional}</label>
            <input id="neg-tel" name="telefono" type="tel" maxLength={20} className={campo} placeholder="+56 9 1234 5678" />
          </div>
          <div>
            <label htmlFor="neg-web" className={etiqueta}>Sitio web {opcional}</label>
            <input id="neg-web" name="sitio_web" inputMode="url" maxLength={200} className={campo} placeholder="www.minegocio.cl" />
          </div>
          <div>
            <label htmlFor="neg-ig" className={etiqueta}>Instagram {opcional}</label>
            <input id="neg-ig" name="instagram" maxLength={80} className={campo} placeholder="@minegocio" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="text-lg font-bold text-dys-text mb-2">Tus datos (no se publican)</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="neg-contacto" className={etiqueta}>Tu nombre</label>
            <input id="neg-contacto" name="contacto_nombre" required maxLength={100} autoComplete="name" className={campo} />
          </div>
          <div>
            <label htmlFor="neg-email" className={etiqueta}>Tu correo</label>
            <input id="neg-email" name="email" type="email" required maxLength={254} autoComplete="email" className={campo} />
          </div>
        </div>
        <label className="flex items-start gap-3 text-sm text-dys-text">
          <input type="checkbox" name="quiere_sitio" className="mt-1 size-4 accent-dys-primary" />
          Me interesa que me contacten para tener un sitio web para mi negocio.
        </label>
        <label className="flex items-start gap-3 text-sm text-dys-text">
          <input type="checkbox" name="acepto" required className="mt-1 size-4 accent-dys-primary" />
          <span>
            Autorizo publicar los datos del negocio en el directorio y acepto la{" "}
            <Link href="/privacidad" className="underline underline-offset-2 hover:text-dys-text">
              política de privacidad
            </Link>
            .
          </span>
        </label>
      </fieldset>

      <TurnstileWidget resetKey={state} />
      {state.mensaje && (
        <p role="alert" className="p-3 bg-red-500/10 text-red-300 rounded-md text-sm border border-red-500/40">
          {state.mensaje}
        </p>
      )}
      <Button
        type="submit"
        disabled={pending}
        className="w-full justify-center bg-dys-primary hover:bg-dys-primary/85 border-dys-primary"
      >
        {pending ? "Enviando..." : "Inscribir mi negocio gratis"}
      </Button>
    </form>
  );
}
