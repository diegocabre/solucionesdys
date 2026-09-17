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
    <div className="bg-background min-h-[calc(100vh-64px)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-brand-primary">Contacto</h1>
          <p className="text-gray-500 dark:text-gray-400 font-light">
            Estamos listos para ayudarte con tus proyectos. Escríbenos y te
            responderemos a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 lg:p-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-brand-primary dark:text-white">
              Información de Contacto
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-semibold text-brand-primary dark:text-slate-100">Email</p>
                  <p>sandracydiegoc@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-semibold text-brand-primary dark:text-slate-100">
                    Teléfono / WhatsApp
                  </p>
                  <p>
                    <a href="https://wa.me/56947637541" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
                      +56 9 4763 7541
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="p-3 bg-brand-accent/10 rounded-full text-brand-accent">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-semibold text-brand-primary dark:text-slate-100">Ubicación</p>
                  <p>Puerto Varas, Chile</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-100 dark:border-slate-800 flex justify-start">
                <a href="https://wa.me/56947637541" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md">
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
            className="bg-gray-50/50 dark:bg-slate-850 p-6 rounded-2xl border border-gray-100 dark:border-slate-800"
          >
            <form action={formAction} className="relative space-y-6">
              {/* Honeypot anti-spam: invisible para personas, los bots suelen rellenarlo */}
              <div className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="hp_check_x9">No completar este campo</label>
                <input
                  id="hp_check_x9"
                  name="hp_check_x9"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
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
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Nombre Completo
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100 text-sm"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100 text-sm"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Motivo de Contacto
                </label>
                <select name="subject" required className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100 text-sm">
                  <option value="Diseño de Sitios Web">Diseño de Sitios Web</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Tienda Online / E-commerce">Tienda Online / E-commerce</option>
                  <option value="Alianzas / Partners">Alianzas / Partners</option>
                  <option value="Otro Motivo">Otro Motivo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent transition-all text-slate-900 dark:text-slate-100 text-sm"
                  placeholder="¿Cómo podemos ayudarte?"
                ></textarea>
              </div>
              <Button type="submit" className="w-full justify-center bg-brand-accent hover:bg-brand-accent-dark border-brand-accent" disabled={pending}>
                {pending ? "Enviando..." : "Enviar Mensaje"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
