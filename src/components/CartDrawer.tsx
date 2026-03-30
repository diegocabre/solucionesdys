"use client";

import { useCartStore } from "@/store/cartStore";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, X, User, Phone, MapPin, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    getTotal,
  } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // States para Formulario de Cliente
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");

  // Inicializar MP SDK
  useEffect(() => {
    const publicKey =
      process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ||
      "TEST-0000000-0000-0000-0000-00000000";
    initMercadoPago(publicKey, { locale: "es-CL" });
  }, []);

  const handleCheckout = async () => {
    if (!showCheckoutForm) {
      setShowCheckoutForm(true);
      return;
    }

    if (!customerName || !customerPhone || !customerAddress || !customerCity) {
      alert("Por favor completa todos los datos de envío.");
      return;
    }

    setIsLoading(true);
    try {
      const itemsToBuy = items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items: itemsToBuy,
          customer: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            city: customerCity
          }
        }),
      });

      const data = await res.json();

      if (data.id) {
        setPreferenceId(data.id);
      } else {
        alert("Ocurrió un error al generar la orden de pago.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reseteo visual al cerrar
  useEffect(() => {
    if (!isDrawerOpen) {
      setTimeout(() => {
        setShowCheckoutForm(false);
        setPreferenceId(null);
      }, 300);
    }
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col pt-[--header-height,0px]"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-brand-accent w-6 h-6" />
                <h2 className="text-xl font-bold text-slate-900">
                  {showCheckoutForm ? "Datos de Envío" : "Tu Carrito"}
                </h2>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
              {!showCheckoutForm ? (
                // --- VISTA LISTA DE ITEMS ---
                items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center flex-1 text-gray-400 space-y-4 min-h-[50vh]">
                    <ShoppingBag className="w-16 h-16 opacity-20" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {items.map((cartItem) => (
                      <div key={cartItem.product.id} className="flex gap-4 border-b border-gray-50 pb-4">
                        <div className="h-20 w-20 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 overflow-hidden">
                          {cartItem.product.image_url ? (
                            <img src={cartItem.product.image_url} alt={cartItem.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">Doc</span>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                              {cartItem.product.name}
                            </h3>
                            <button onClick={() => removeItem(cartItem.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-100 p-1">
                              <button onClick={() => updateQuantity(cartItem.product.id, Math.max(1, cartItem.quantity - 1))} className="p-1 hover:bg-white rounded-md text-slate-700">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium text-slate-900">{cartItem.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(cartItem.product.id, cartItem.product.stock > 0 ? Math.min(cartItem.product.stock, cartItem.quantity + 1) : cartItem.quantity + 1)} 
                                className="p-1 hover:bg-white rounded-md text-slate-700"
                                disabled={cartItem.product.stock > 0 && cartItem.quantity >= cartItem.product.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-bold text-slate-900">
                              ${(cartItem.product.price * cartItem.quantity).toLocaleString("es-CL")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                // --- VISTA FORMULARIO ---
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex items-start gap-3 text-sm">
                    <Truck className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>
                      <strong>Envíos:</strong> Entrega gratis en Puerto Varas. Otras ciudades el envío es "por pagar".
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><User className="w-3 h-3"/> Nombre Completo</label>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Ej: Juan Pérez" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><Phone className="w-3 h-3"/> Teléfono</label>
                    <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="+56 9 1234 5678" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3"/> Dirección</label>
                    <input type="text" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="Ej: Calle Principal 123, Depto 4" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-gray-900" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1.5 mb-1"><MapPin className="w-3 h-3"/> Ciudad</label>
                    <input type="text" value={customerCity} onChange={e => setCustomerCity(e.target.value)} placeholder="Ej: Puerto Varas" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent/50 outline-none text-sm text-gray-900" />
                    {customerCity && customerCity.toLowerCase().trim() === 'puerto varas' ? (
                      <p className="text-xs text-green-600 font-medium mt-1">Este envío local será gratuito.</p>
                    ) : customerCity ? (
                      <p className="text-xs text-orange-500 font-medium mt-1">El costo de mensajería será coordinado para pago en destino.</p>
                    ) : null}
                  </div>
                  <button onClick={() => setShowCheckoutForm(false)} className="text-sm text-brand-accent underline hover:opacity-80 pt-2 block">
                    Volver al carrito
                  </button>
                </motion.div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50/50 shrink-0">
                <div className="flex justify-between mb-6">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-xl font-bold text-slate-900">
                    ${getTotal().toLocaleString("es-CL")}
                  </span>
                </div>

                {!preferenceId ? (
                  <Button
                    className="w-full justify-center"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      showCheckoutForm ? "Continuar con el Pago" : `Proceder al Envío / Pago`
                    )}
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="w-full bg-white rounded-xl overflow-hidden"
                  >
                    <p className="text-sm text-center font-medium text-gray-500 py-2 border-b">
                      Billetera de Mercado Pago lista
                    </p>
                    <Wallet initialization={{ preferenceId }} />
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
