"use client";

import { useActionState } from "react";
import Button from "@/components/Button";
import { pedirEnlace, type LoginState } from "../actions";

const initialState: LoginState = { enviado: false, error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(pedirEnlace, initialState);

  if (state.enviado) {
    return (
      <p role="status" className="p-4 bg-green-50 text-green-800 rounded-md text-sm border border-green-200">
        Si el correo está autorizado, te llegó un enlace para entrar. Revisa tu bandeja.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="admin-email" className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Correo
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent text-slate-900 text-sm"
        />
      </div>
      {state.error && (
        <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full justify-center">
        {pending ? "Enviando..." : "Enviarme el enlace"}
      </Button>
    </form>
  );
}
