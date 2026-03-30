"use client";

import Button from "@/components/Button";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const collectionId = searchParams.get("collection_id");

  const idToShow = paymentId || collectionId || "No disponible";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-10 rounded-2xl shadow-sm border text-center max-w-lg mx-auto space-y-6"
    >
      <div className="flex justify-center">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </div>

      <h1 className="text-3xl font-bold text-brand-primary">¡Pago Exitoso!</h1>

      <p className="text-gray-500">
        Tu compra se ha procesado correctamente. En breve nos pondremos en
        contacto contigo para gestionar la entrega de tus productos.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 font-mono mt-6">
        <p>Número de Referencia:</p>
        <p className="font-bold">{idToShow}</p>
      </div>

      <div className="pt-6">
        <Link href="/">
          <Button variant="primary" className="w-full">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Cargando detalle del pago...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
