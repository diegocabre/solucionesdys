"use client";

import Button from "@/components/Button";
import { motion } from "framer-motion";
import { CheckCircle2, ClipboardCheck, Info, Landmark } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const collectionId = searchParams.get("collection_id");
  const method = searchParams.get("method");
  const orderId = searchParams.get("order_id");
  const [copied, setCopied] = useState(false);

  const isTransfer = method === "transfer";
  const idToShow = orderId || paymentId || collectionId || "No disponible";

  const copyBankData = () => {
    const dataText = `Banco: Banco de Chile
Tipo de Cuenta: Cuenta Vista
Número: 00-021-07251-20
RUT: 78152735-1
Nombre: SOLUCIONES DYS SPA
Email: sandracydiegoc@gmail.com`;
    navigator.clipboard.writeText(dataText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 text-center max-w-xl mx-auto space-y-6"
    >
      <div className="flex justify-center">
        {isTransfer ? (
          <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center text-brand-accent">
            <Landmark className="w-10 h-10" />
          </div>
        ) : (
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        )}
      </div>

      <h1 className="text-3xl font-bold text-brand-primary">
        {isTransfer ? "¡Orden Registrada!" : "¡Pago Exitoso!"}
      </h1>

      <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">
        {isTransfer 
          ? "Tu pedido ha sido guardado en nuestro sistema. Para procesar y despachar tu compra, realiza la transferencia bancaria con los siguientes datos."
          : "Tu compra se ha procesado correctamente mediante Mercado Pago. En breve nos pondremos en contacto contigo para gestionar la entrega."}
      </p>

      {isTransfer && (
        <div className="bg-gray-50 dark:bg-slate-950 p-6 rounded-2xl text-left border border-gray-100 dark:border-slate-800 space-y-3 relative">
          <h3 className="font-bold text-brand-primary text-sm uppercase tracking-wider border-b pb-2 mb-2">Datos de Transferencia</h3>
          
          <div className="grid grid-cols-3 gap-1 text-xs">
            <span className="text-gray-400">Banco:</span>
            <span className="col-span-2 font-medium text-brand-primary">Banco de Chile</span>
            
            <span className="text-gray-400">Tipo Cuenta:</span>
            <span className="col-span-2 font-medium text-brand-primary">Cuenta Vista</span>
            
            <span className="text-gray-400">N° Cuenta:</span>
            <span className="col-span-2 font-mono font-bold text-brand-accent">00-021-07251-20</span>
            
            <span className="text-gray-400">RUT:</span>
            <span className="col-span-2 font-medium text-brand-primary">78152735-1</span>
            
            <span className="text-gray-400">Nombre:</span>
            <span className="col-span-2 font-medium text-brand-primary">SOLUCIONES DYS SPA</span>
            
            <span className="text-gray-400">Email:</span>
            <span className="col-span-2 font-medium text-brand-primary">sandracydiegoc@gmail.com</span>
          </div>

          <button 
            onClick={copyBankData}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 rounded-xl transition-all"
          >
            <ClipboardCheck className="w-4 h-4 text-brand-accent" />
            {copied ? "¡Copiado al portapapeles!" : "Copiar datos bancarios"}
          </button>
        </div>
      )}

      {isTransfer && (
        <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-xs text-left flex items-start gap-2.5 border border-amber-100 dark:border-amber-900/50">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Envía el comprobante de transferencia a <strong>sandracydiegoc@gmail.com</strong> o a nuestro WhatsApp <strong>+56 9 8788 7209</strong> incluyendo tu número de orden de abajo.
          </p>
        </div>
      )}

      <div className="bg-gray-50 dark:bg-slate-950 p-4 rounded-xl text-xs text-gray-500 font-mono border border-gray-100 dark:border-slate-800 flex justify-between items-center">
        <span>Referencia de Orden:</span>
        <span className="font-bold text-brand-primary">{idToShow}</span>
      </div>

      <div className="pt-4">
        <Link href="/">
          <Button variant="primary" className="w-full justify-center">
            Volver al Inicio
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-gray-500">Cargando detalle de la orden...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
