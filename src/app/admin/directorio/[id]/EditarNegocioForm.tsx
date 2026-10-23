"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import type { NegocioAdmin } from "@/lib/supabase/server";
import { editarNegocio, type EdicionState } from "../../actions";

const campo =
  "w-full rounded-lg border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-slate-900 text-sm";
const etiqueta = "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider";
const MAX_DESC = 300;

interface Props {
  negocio: NegocioAdmin;
  rubros: readonly string[];
  comunas: { slug: string; nombre: string }[];
}

export default function EditarNegocioForm({ negocio: n, rubros, comunas }: Props) {
  const [state, formAction, pending] = useActionState(editarNegocio, { error: "" } as EdicionState);
  const [largo, setLargo] = useState(n.descripcion.length);
  // onSubmit en vez de action={...}: si hay un error, React no vacía los campos.
  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    startTransition(() => formAction(datos));
  };

  return (
    <form onSubmit={enviar} className="space-y-5">
      <input type="hidden" name="id" value={n.id} />
      <div>
        <label htmlFor="ed-nombre" className={etiqueta}>Nombre del negocio</label>
        <input id="ed-nombre" name="nombre" required minLength={2} maxLength={80} defaultValue={n.nombre} className={campo} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ed-rubro" className={etiqueta}>Rubro</label>
          <select id="ed-rubro" name="rubro" required defaultValue={n.rubro} className={campo}>
            {rubros.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ed-comuna" className={etiqueta}>Comuna</label>
          <select id="ed-comuna" name="comuna" required defaultValue={n.comuna_slug} className={campo}>
            {comunas.map((c) => (
              <option key={c.slug} value={c.slug}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="ed-desc" className={etiqueta}>Descripción</label>
        <textarea
          id="ed-desc"
          name="descripcion"
          required
          minLength={10}
          maxLength={MAX_DESC}
          rows={5}
          defaultValue={n.descripcion}
          onChange={(e) => setLargo(e.target.value.length)}
          aria-describedby="ed-desc-largo"
          className={campo}
        />
        <p id="ed-desc-largo" className={`mt-1 text-xs ${largo >= MAX_DESC ? "text-red-700 font-semibold" : "text-gray-500"}`}>
          {largo} / {MAX_DESC} caracteres
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="ed-tel" className={etiqueta}>Teléfono</label>
          <input id="ed-tel" name="telefono" type="tel" maxLength={20} defaultValue={n.telefono ?? ""} className={campo} />
        </div>
        <div>
          <label htmlFor="ed-web" className={etiqueta}>Sitio web</label>
          <input id="ed-web" name="sitio_web" inputMode="url" maxLength={200} defaultValue={n.sitio_web ?? ""} className={campo} />
        </div>
        <div>
          <label htmlFor="ed-ig" className={etiqueta}>Instagram</label>
          <input id="ed-ig" name="instagram" maxLength={80} defaultValue={n.instagram ? `@${n.instagram}` : ""} className={campo} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ed-contacto" className={etiqueta}>Nombre del contacto (privado)</label>
          <input id="ed-contacto" name="contacto_nombre" required maxLength={100} defaultValue={n.contacto_nombre} className={campo} />
        </div>
        <div>
          <label htmlFor="ed-email" className={etiqueta}>Correo del contacto (privado)</label>
          <input id="ed-email" name="email" type="email" required maxLength={254} defaultValue={n.email_contacto} className={campo} />
        </div>
      </div>
      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input type="checkbox" name="quiere_sitio" defaultChecked={n.quiere_sitio} className="mt-1 size-4 accent-brand-accent-dark" />
        Le interesa un sitio web
      </label>
      {state.error && (
        <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full justify-center">
        {pending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
