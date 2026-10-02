"use client";

import { useActionState } from "react";
import Button from "@/components/Button";
import { login, type LoginState } from "../actions";

const initialState: LoginState = { error: "" };

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 text-sm";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div role="alert" className="p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
          {state.error}
        </div>
      )}
      <div>
        <label htmlFor="admin-email" className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Correo
        </label>
        <input id="admin-email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>
      <div>
        <label htmlFor="admin-password" className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
          Contraseña
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>
      <Button type="submit" className="w-full justify-center" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
