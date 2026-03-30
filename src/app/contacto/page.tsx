"use client";

import Button from "@/components/Button";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { useActionState } from "react";
import { sendContactEmail, FormState } from "./actions";

const initialState: FormState = {
  success: false,
  message: "",
  error: ""
};

export default function ContactoPage() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState);
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Contacto</h1>
          <p className="text-slate-700">
            Estamos listos para ayudarte con tus proyectos. Escríbenos y te
            responderemos a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl shadow-sm border p-8 lg:p-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-slate-900">
              Información de Contacto
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Email</p>
                  <p>sandracydiegoc@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    Teléfono / WhatsApp
                  </p>
                  <p>
                    <a href="https://wa.me/56987887209" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
                      +56 9 8788 7209
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Ubicación</p>
                  <p>Puerto Varas, Chile</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 flex justify-start">
                <a href="https://wa.me/56987887209" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md">
                  <MessageCircle size={22} />
                  Chatea por WhatsApp
                </a>
              </div>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-50 p-6 rounded-xl border border-gray-100"
          >
            <form action={formAction} className="space-y-6">
              {state.message && (
                <div className="p-4 bg-green-50 text-green-800 rounded-md text-sm border border-green-200">
                  {state.message}
                </div>
              )}
              {state.error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-md text-sm border border-red-200">
                  {state.error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Nombre Completo
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent p-3 border outline-none bg-white text-slate-900"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent p-3 border outline-none bg-white text-slate-900"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Motivo (Ferretería, Servicios, Web...)
                </label>
                <select name="subject" required className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent p-3 border outline-none bg-white text-slate-900">
                  <option value="Ferretería / Productos">Ferretería / Productos</option>
                  <option value="Servicios/Transporte">Servicios Generales</option>
                  <option value="Consultoría">Consultoría y Partners</option>
                  <option value="Desarrollo Web">Desarrollo Web</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-accent focus:ring-brand-accent p-3 border outline-none bg-white text-slate-900"
                  placeholder="¿Cómo podemos ayudarte?"
                ></textarea>
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
