"use client";

import { useActionState } from "react";
import Button from "@/components/Button";
import { pedirEnlace, type LoginState } from "../actions";

const initialState: LoginState = { enviado: false, error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(pedirEnlace, initialState);

  if (state.enviado) {
    return (
      <p role="status" className="p-4 bg-dys-primary/10 text-dys-primary rounded-md text-sm border border-dys-primary/40">
        Si el correo está autorizado, te llegó un enlace para entrar. Revisa tu bandeja.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="admin-email" className="block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider">
          Correo
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary text-dys-text text-sm"
        />
      </div>
      {state.error && (
        <p role="alert" className="p-3 bg-red-500/10 text-red-300 rounded-md text-sm border border-red-500/40">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full justify-center">
        {pending ? "Enviando..." : "Enviarme el enlace"}
      </Button>
    </form>
  );
}
