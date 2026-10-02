import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Ingresar al panel" };

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin/leads");

  return (
    <div className="max-w-sm mx-auto px-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand-primary">Panel de leads</h1>
          <p className="text-sm text-gray-500">Acceso solo para el equipo de Soluciones DyS.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
