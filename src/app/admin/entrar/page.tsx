import Button from "@/components/Button";
import { entrar } from "../actions";

// Destino del enlace mágico. No inicia sesión al abrirse: lo hace el botón (POST), así el
// antivirus del correo que abre los enlaces no gasta el enlace de un solo uso.
export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="rounded-3xl bg-dys-surface border border-dys-border p-8 shadow-sm space-y-5">
        <h1 className="text-2xl font-bold text-dys-text">Entrar al panel</h1>
        <form action={entrar}>
          <input type="hidden" name="token" value={token} />
          <Button type="submit" className="w-full justify-center">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
