import { redirect } from "next/navigation";
import { esAdmin } from "@/lib/admin";
import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await esAdmin()) redirect("/admin/directorio");
  const { error } = await searchParams;

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm space-y-5">
        <h1 className="text-2xl font-bold text-brand-primary">Entrar al panel</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          Escribe el correo de administrador y te enviamos un enlace para entrar. Vale 15 minutos y sirve una sola vez.
        </p>
        {error === "enlace" && (
          <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
            El enlace no es válido, ya se usó o expiró. Pide uno nuevo.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
