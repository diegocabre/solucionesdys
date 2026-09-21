"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Phone,
  Pill,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MINSAL_URL, normalizarRespuesta } from "@/lib/farmacias";
import type { FarmaciasResponse, FarmaciaTurno } from "@/lib/farmacias";

const COMUNA_PRINCIPAL = { slug: "puerto-varas", nombre: "Puerto Varas" };

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "listo"; data: FarmaciasResponse; horaSantiago: number };

const horarioTexto = (f: FarmaciaTurno) => {
  if (f.apertura === "00:00" && f.cierre === "23:59") return "Atiende las 24 horas";
  if (f.cruzaMedianoche) return `Desde las ${f.apertura} hasta las ${f.cierre} del día siguiente`;
  return `De ${f.apertura} a ${f.cierre} hrs`;
};

const fechaLarga = (fecha: string) =>
  new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${fecha}T12:00:00Z`));

const mapaEmbedUrl = (f: FarmaciaTurno) => {
  if (f.lat === null || f.lng === null) return null;
  const d = 0.006;
  const bbox = [f.lng - d, f.lat - d, f.lng + d, f.lat + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${f.lat},${f.lng}`;
};

const rutaUrl = (f: FarmaciaTurno) =>
  f.lat !== null && f.lng !== null
    ? `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.direccion}, ${f.comuna}, Chile`)}`;

// Primero consulta nuestro API. Si el servidor no logra llegar al MINSAL (su Cloudflare bloquea
// a veces las IP de servidores), reintenta directo desde el navegador del visitante, que el MINSAL
// sí acepta (CORS abierto). Devuelve siempre un Estado: los errores no se lanzan.
async function pedirFarmacias(signal?: AbortSignal): Promise<Estado | null> {
  const listo = (data: FarmaciasResponse): Estado => {
    const horaSantiago = Number(
      new Intl.DateTimeFormat("es-CL", {
        hour: "numeric",
        hour12: false,
        timeZone: "America/Santiago",
      }).format(new Date()),
    );
    return { tipo: "listo", data, horaSantiago };
  };

  try {
    const res = await fetch("/api/farmacias-turno", { signal });
    if (!res.ok) throw new Error(String(res.status));
    return listo((await res.json()) as FarmaciasResponse);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
  }

  try {
    const res = await fetch(MINSAL_URL, { signal: signal ?? AbortSignal.timeout(15_000) });
    if (!res.ok) throw new Error(String(res.status));
    return listo(normalizarRespuesta(await res.json()));
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") return null;
    return { tipo: "error" };
  }
}

export default function FarmaciasTurno() {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [comuna, setComuna] = useState(COMUNA_PRINCIPAL.slug);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    pedirFarmacias(controller.signal).then((e) => e && setEstado(e));
    return () => controller.abort();
  }, []);

  const reintentar = () => {
    setEstado({ tipo: "cargando" });
    pedirFarmacias().then((e) => e && setEstado(e));
  };

  if (estado.tipo === "cargando") {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <span className="sr-only">Cargando farmacias de turno…</span>
        {[0, 1].map((i) => (
          <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (estado.tipo === "error") {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center space-y-4">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" aria-hidden="true" />
        <p className="text-brand-primary font-medium">
          No pudimos consultar las farmacias de turno en este momento.
        </p>
        <p className="text-sm text-gray-600">
          El servicio del Ministerio de Salud puede estar con problemas. Intenta de nuevo en unos minutos.
        </p>
        <button
          type="button"
          onClick={reintentar}
          className="inline-flex items-center gap-2 rounded-md bg-brand-primary text-white px-4 py-2 text-sm font-medium hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Reintentar
        </button>
      </div>
    );
  }

  const { data, horaSantiago } = estado;

  // Chips: Puerto Varas siempre, más las comunas vecinas que tengan turno informado.
  const conteo = new Map<string, { nombre: string; total: number }>();
  conteo.set(COMUNA_PRINCIPAL.slug, { nombre: COMUNA_PRINCIPAL.nombre, total: 0 });
  for (const f of data.farmacias) {
    const actual = conteo.get(f.comunaSlug) ?? { nombre: f.comuna, total: 0 };
    conteo.set(f.comunaSlug, { ...actual, total: actual.total + 1 });
  }

  const lista = data.farmacias.filter((f) => f.comunaSlug === comuna);
  const activa = lista.find((f) => f.id === seleccion) ?? lista[0];
  const mapa = activa ? mapaEmbedUrl(activa) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Turno del <strong className="text-brand-primary">{fechaLarga(data.fecha)}</strong>
        </p>
        <div role="tablist" aria-label="Comuna" className="flex flex-wrap gap-2">
          {[...conteo.entries()].map(([slug, c]) => (
            <button
              key={slug}
              type="button"
              role="tab"
              aria-selected={comuna === slug}
              onClick={() => {
                setComuna(slug);
                setSeleccion(null);
              }}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                comuna === slug
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-foreground border-gray-200 hover:border-brand-accent hover:text-brand-accent-dark"
              }`}
            >
              {c.nombre}
              <span className={`ml-2 text-xs ${comuna === slug ? "text-brand-accent-light" : "text-gray-400"}`}>
                {c.total}
              </span>
            </button>
          ))}
        </div>
      </div>

      {horaSantiago < 9 && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Clock className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Los turnos cambian a las 09:00. Antes de esa hora puede seguir de turno la farmacia del día
            anterior, así que <strong>llama antes de ir</strong>.
          </p>
        </div>
      )}

      {lista.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center space-y-3">
          <Pill className="w-8 h-8 text-brand-accent mx-auto" aria-hidden="true" />
          <p className="text-brand-primary font-medium">
            El MINSAL no informa farmacia de turno para {conteo.get(comuna)?.nombre} hoy.
          </p>
          <p className="text-sm text-gray-600">
            Prueba con una comuna vecina o confirma en el{" "}
            <a
              href="https://seremienlinea.minsal.cl/asdigital/mfarmacias/mapa.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-accent-dark underline underline-offset-2 hover:text-brand-primary"
            >
              buscador oficial del MINSAL
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <ul className="space-y-4 lg:col-span-3">
            <AnimatePresence mode="popLayout">
              {lista.map((f) => {
                const seleccionada = f.id === activa?.id;
                return (
                  <motion.li
                    key={f.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <article
                      className={`rounded-3xl bg-white border p-6 space-y-4 transition-shadow ${
                        seleccionada ? "border-brand-accent shadow-lg" : "border-gray-100 shadow-sm hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 text-brand-green-dark px-3 py-1 text-xs font-semibold">
                            <Pill className="w-3.5 h-3.5" aria-hidden="true" />
                            De turno hoy
                          </span>
                          <h3 className="mt-3 text-xl font-bold font-serif text-brand-primary">{f.nombre}</h3>
                        </div>
                      </div>

                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-brand-accent-dark shrink-0" aria-hidden="true" />
                          <span>
                            {f.direccion}
                            {f.localidad && f.localidad.toLowerCase() !== f.comuna.toLowerCase() && (
                              <span className="text-gray-500"> · {f.localidad}</span>
                            )}
                            <span className="text-gray-500">, {f.comuna}</span>
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <Clock className="w-4 h-4 mt-0.5 text-brand-accent-dark shrink-0" aria-hidden="true" />
                          <span>{horarioTexto(f)}</span>
                        </li>
                        {f.telefono && (
                          <li className="flex gap-2">
                            <Phone className="w-4 h-4 mt-0.5 text-brand-accent-dark shrink-0" aria-hidden="true" />
                            <span>{f.telefono}</span>
                          </li>
                        )}
                      </ul>

                      <div className="flex flex-wrap gap-2 pt-1">
                        <a
                          href={rutaUrl(f)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md bg-brand-primary text-white px-4 py-2 text-sm font-medium hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                        >
                          <Navigation className="w-4 h-4" aria-hidden="true" />
                          Cómo llegar
                        </a>
                        {f.telefonoHref && (
                          <a
                            href={`tel:${f.telefonoHref}`}
                            className="inline-flex items-center gap-2 rounded-md border-2 border-brand-accent text-brand-accent-dark px-4 py-2 text-sm font-medium hover:bg-brand-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
                          >
                            <Phone className="w-4 h-4" aria-hidden="true" />
                            Llamar
                          </a>
                        )}
                        {!seleccionada && mapaEmbedUrl(f) && (
                          <button
                            type="button"
                            onClick={() => setSeleccion(f.id)}
                            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-brand-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                          >
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            Ver en el mapa
                          </button>
                        )}
                      </div>
                    </article>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          {mapa && activa && (
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-28 rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                <iframe
                  key={activa.id}
                  title={`Mapa: ${activa.nombre}, ${activa.direccion}`}
                  src={mapa}
                  loading="lazy"
                  className="w-full h-72 lg:h-96 border-0"
                />
                <div className="flex items-center justify-between gap-3 p-4 text-sm">
                  <span className="font-medium text-brand-primary truncate">{activa.nombre}</span>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${activa.lat}&mlon=${activa.lng}#map=17/${activa.lat}/${activa.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-accent-dark hover:text-brand-primary shrink-0"
                  >
                    Mapa completo
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
