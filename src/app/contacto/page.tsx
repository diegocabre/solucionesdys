"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useActionState } from "react";
import { sendContactEmail, FormState } from "./actions";
import TurnstileWidget from "@/components/TurnstileWidget";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { agregarAtribucion } from "@/lib/attribution";
import dynamic from "next/dynamic";

// Carga diferida: el chat (Vue + estilos de n8n) no entra en el bundle inicial de la página.
const ChatN8n = dynamic(() => import("@/components/ChatN8n"), { ssr: false });

// Campos de 16 px (text-base): con menos, iOS hace zoom al tocarlos.
const CAMPO =
  "w-full rounded-lg border border-dys-border bg-dys-surface px-3 py-3 text-base text-dys-text outline-none transition-colors focus:border-dys-primary focus:ring-2 focus:ring-dys-primary/40";
const ETIQUETA = "block mb-1.5 font-semibold text-dys-text";

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
    <div className="bg-dys-bg">
      <section className="pt-16 pb-12 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h1 className="firma-punto text-titular-1 font-bold text-dys-text">Cotiza tu sitio</h1>
          <p className="max-w-[52ch] text-lg sm:text-xl text-dys-muted leading-relaxed">
            Cuéntanos qué necesita tu negocio y te respondemos con una propuesta clara, sin compromiso.
          </p>
        </div>
      </section>

      <section aria-labelledby="agenda-titulo" className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-2">
            <h2 id="agenda-titulo" className="text-titular-3 font-semibold text-dys-text">Agenda una reunión</h2>
            <p className="text-dys-muted">Nuestro asistente te ayuda a elegir día y hora, sin esperar respuesta por correo.</p>
          </div>
          <ChatN8n modo="incrustado" />
        </div>
      </section>

      <section aria-label="Formulario y datos de contacto" className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">
          {/* Datos de contacto: correo y teléfono en grande, como en el footer; sin íconos en círculos */}
          <div className="space-y-8 lg:sticky lg:top-28">
            <h2 className="text-titular-3 font-semibold text-dys-text">¿Prefieres escribirnos directo?</h2>
            <dl className="border-t border-dys-border">
              <div className="border-b border-dys-border py-5">
                <dt className="text-sm text-dys-muted">Correo</dt>
                <dd className="mt-1">
                  <a
                    href="mailto:contacto@solucionesdys.cl"
                    className="break-all font-display text-xl sm:text-2xl font-semibold text-dys-text underline-offset-4 decoration-2 hover:underline hover:decoration-dys-primary"
                  >
                    contacto@solucionesdys.cl
                  </a>
                </dd>
              </div>
              <div className="border-b border-dys-border py-5">
                <dt className="text-sm text-dys-muted">Teléfono y WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href="tel:+56947637541"
                    className="font-display text-xl sm:text-2xl font-semibold text-dys-text underline-offset-4 decoration-2 hover:underline hover:decoration-dys-primary"
                  >
                    +56 9 4763 7541
                  </a>
                </dd>
              </div>
              <div className="border-b border-dys-border py-5">
                <dt className="text-sm text-dys-muted">Dónde estamos</dt>
                <dd className="mt-1 text-lg text-dys-text">
                  Puerto Varas, Chile. Nos juntamos en persona en la zona y atendemos de forma remota en todo el país.
                </dd>
              </div>
            </dl>
            <a
              href="https://wa.me/56947637541"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-lg border-2 border-dys-primary px-6 font-semibold text-dys-text transition-colors hover:bg-dys-primary hover:text-dys-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dys-primary focus-visible:ring-offset-2"
            >
              <WhatsAppIcon className="size-5" />
              Chatea por WhatsApp
            </a>
          </div>

          {/* Formulario sobre papel marfil: destaca como la acción principal de la página */}
          <div className="dys-light bg-dys-bg text-dys-text rounded-xl p-6 sm:p-10">
            <h2 className="text-titular-3 font-semibold">Envíanos tu consulta</h2>
            <div className="mt-6">
                <form action={enviar} className="relative space-y-5">
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
                    <p role="status" className="p-4 rounded-lg border border-dys-primary/40 bg-dys-surface text-dys-text">
                      {state.message}
                    </p>
                  )}
                  {state.error && (
                    <p role="alert" className="p-4 rounded-lg border border-red-700/40 bg-dys-surface text-red-800">
                      {state.error}
                    </p>
                  )}
                  <div>
                    <label htmlFor="contacto-name" className={ETIQUETA}>
                      Nombre completo
                    </label>
                    <input
                      id="contacto-name"
                      name="name"
                      autoComplete="name"
                      type="text"
                      required
                      className={CAMPO}
                      placeholder="Juan Pérez"
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-email" className={ETIQUETA}>
                      Correo electrónico
                    </label>
                    <input
                      id="contacto-email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      required
                      className={CAMPO}
                      placeholder="juan@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-phone" className={ETIQUETA}>
                      Teléfono <span className="font-normal text-dys-muted">(opcional)</span>
                    </label>
                    <input
                      id="contacto-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      maxLength={20}
                      className={CAMPO}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  <div>
                    <label htmlFor="contacto-subject" className={ETIQUETA}>
                      Motivo de contacto
                    </label>
                    <select id="contacto-subject" name="subject" required className={CAMPO}>
                      <option value="Diseño de Sitios Web">Diseño de sitio web</option>
                      <option value="Landing Page">Landing page</option>
                      <option value="Tienda Online / E-commerce">Tienda online</option>
                      <option value="Alianzas / Partners">Alianzas y partners</option>
                      <option value="Otro Motivo">Otro motivo</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contacto-message" className={ETIQUETA}>
                      Mensaje
                    </label>
                    <textarea
                      id="contacto-message"
                      name="message"
                      required
                      rows={4}
                      className={CAMPO}
                      placeholder="¿Cómo podemos ayudarte?"
                    ></textarea>
                  </div>
                  <TurnstileWidget resetKey={state} theme="light" />
                  <p className="text-sm text-dys-muted">
                    Guardamos tu consulta para poder responderte. Más detalles en nuestra{" "}
                    <Link href="/privacidad" className="text-dys-link underline underline-offset-2 hover:text-dys-text">
                      política de privacidad
                    </Link>
                    .
                  </p>
                  <Button type="submit" size="lg" className="w-full" disabled={pending}>
                    {pending ? "Enviando..." : "Enviar mensaje"}
                  </Button>
                </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
