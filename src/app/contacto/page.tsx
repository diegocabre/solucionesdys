"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { useActionState } from "react";
import { sendContactEmail, FormState } from "./actions";
import TurnstileWidget from "@/components/TurnstileWidget";
import { agregarAtribucion } from "@/lib/attribution";

const initialState: FormState = {
  success: false,
  message: "",
  error: ""
};

export default function ContactoPage() {
  const [state, formAction, pending] = useActionState(sendContactEmail, initialState);
  // Adjunta la página de origen y los utm_* (si los hay) antes de enviar.
  const enviar = (formData: FormData) => {
    agregarAtribucion(formData);
    formAction(formData);
  };
  return (
    <div className="bg-dys-bg min-h-[calc(100vh-64px)] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl font-bold text-dys-text">Cotiza tu sitio</h1>
          <p className="text-dys-muted font-light">
            Cuéntanos qué necesita tu negocio y te respondemos con una propuesta
            clara, sin compromiso.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-dys-surface rounded-3xl shadow-sm border border-dys-border p-8 lg:p-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-2xl font-bold text-dys-text">
              Información de Contacto
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-dys-muted">
                <div className="p-3 bg-dys-primary/10 rounded-full text-dys-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-semibold text-dys-text">Email</p>
                  <p>contacto@solucionesdys.cl</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-dys-muted">
                <div className="p-3 bg-dys-primary/10 rounded-full text-dys-primary">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="font-semibold text-dys-text">
                    Teléfono / WhatsApp
                  </p>
                  <p>
                    <a href="https://wa.me/56947637541" target="_blank" rel="noopener noreferrer" className="hover:text-dys-primary transition-colors">
                      +56 9 4763 7541
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-dys-muted">
                <div className="p-3 bg-dys-primary/10 rounded-full text-dys-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-semibold text-dys-text">Ubicación</p>
                  <p>Puerto Varas, Chile</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-dys-border flex justify-start">
                <a href="https://wa.me/56947637541" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-dys-primary text-dys-on-primary rounded-lg hover:bg-dys-primary/85 transition-colors font-medium shadow-md">
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
            className="bg-dys-surface/50 p-6 rounded-2xl border border-dys-border"
          >
            <form action={enviar} className="relative space-y-6">
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
                <div className="p-4 bg-dys-primary/10 text-dys-primary rounded-md text-sm border border-dys-primary/40">
                  {state.message}
                </div>
              )}
              {state.error && (
                <div className="p-4 bg-red-500/10 text-red-300 rounded-md text-sm border border-red-500/40">
                  {state.error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider">
                  Nombre Completo
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-sm"
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-sm"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label htmlFor="contacto-phone" className="block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider">
                  Teléfono <span className="normal-case font-normal">(opcional)</span>
                </label>
                <input
                  id="contacto-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  maxLength={20}
                  className="w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-sm"
                  placeholder="+56 9 1234 5678"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider">
                  Motivo de Contacto
                </label>
                <select name="subject" required className="w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-sm">
                  <option value="Diseño de Sitios Web">Diseño de Sitios Web</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Tienda Online / E-commerce">Tienda Online / E-commerce</option>
                  <option value="Alianzas / Partners">Alianzas / Partners</option>
                  <option value="Otro Motivo">Otro Motivo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-dys-muted mb-1 uppercase tracking-wider">
                  Mensaje
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-dys-border bg-dys-surface p-3 outline-none focus:ring-2 focus:ring-dys-primary/50 focus:border-dys-primary transition-all text-dys-text text-sm"
                  placeholder="¿Cómo podemos ayudarte?"
                ></textarea>
              </div>
              <TurnstileWidget resetKey={state} />
              <p className="text-xs text-dys-muted">
                Guardamos tu consulta para poder responderte. Más detalles en nuestra{" "}
                <Link href="/privacidad" className="underline underline-offset-2 hover:text-dys-text">
                  política de privacidad
                </Link>
                .
              </p>
              <Button type="submit" className="w-full justify-center bg-dys-primary hover:bg-dys-primary/85 border-dys-primary" disabled={pending}>
                {pending ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
