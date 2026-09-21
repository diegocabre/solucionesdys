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
import {
  COMUNAS_ZONA,
  MINSAL_URL,
  distanciaAPuertoVarasKm,
  normalizarRespuesta,
  toSlug,
  turnoVigente,
} from "@/lib/farmacias";
import type { FarmaciasResponse, FarmaciaTurno, TurnoVigente } from "@/lib/farmacias";

const COMUNA_PRINCIPAL = { slug: "puerto-varas", nombre: "Puerto Varas" };

type Estado =
  | { tipo: "cargando" }
  | { tipo: "error" }
  | { tipo: "listo"; data: FarmaciasResponse; turno: TurnoVigente };

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
  // El turno vigente se decide con el reloj del visitante, no con el de la respuesta: el caché
  // del API puede haberse generado antes del cambio de turno de las 09:00.
  const listo = (data: FarmaciasResponse): Estado => ({ tipo: "listo", data, turno: turnoVigente() });

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

function TarjetaFarmacia({
  f,
  seleccionada,
  distanciaKm,
  anterior,
  onVerMapa,
}: {
  f: FarmaciaTurno;
  seleccionada: boolean;
  /** Es del turno anterior (ya terminado), mostrado solo como referencia. */
  anterior?: boolean;
  /** Distancia en línea recta a Puerto Varas; solo se informa en las farmacias de comunas vecinas. */
  distanciaKm?: number | null;
  onVerMapa: () => void;
}) {
  return (
    <motion.li
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
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                anterior ? "bg-amber-100 text-amber-900" : "bg-brand-green/10 text-brand-green-dark"
              }`}
            >
              <Pill className="w-3.5 h-3.5" aria-hidden="true" />
              {anterior ? "Turno anterior" : "De turno ahora"}
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
              {typeof distanciaKm === "number" && (
                <span className="text-gray-500"> · a unos {Math.max(1, Math.round(distanciaKm))} km de Puerto Varas</span>
              )}
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
              onClick={onVerMapa}
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
}

export default function FarmaciasTurno() {
  const [estado, setEstado] = useState<Estado>({ tipo: "cargando" });
  const [comuna, setComuna] = useState(COMUNA_PRINCIPAL.slug);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [verAnterior, setVerAnterior] = useState(false);

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

  const { data, turno } = estado;

  // Se juntan las dos listas y se elige por fecha con el reloj del visitante.
  // `otrasFechas` puede faltar en respuestas del API que aún estén en caché con el formato anterior.
  const registros = [...data.farmacias, ...(data.otrasFechas ?? [])];
  const vigentes = registros.filter((f) => f.fecha === turno.fechaVigente);
  const anteriores = registros.filter((f) => f.fecha === turno.fechaAnterior);
  // El MINSAL a veces demora en publicar el turno nuevo. En ese caso no mostramos el del día
  // anterior como si siguiera vigente: el visitante debe pedirlo expresamente.
  const sinPublicar = vigentes.length === 0;
  const viendoAnterior = verAnterior && sinPublicar && anteriores.length > 0;
  const farmacias = viendoAnterior ? anteriores : vigentes;
  const fechaMostrada = viendoAnterior ? turno.fechaAnterior : turno.fechaVigente;

  // Chips: Puerto Varas siempre, más las comunas vecinas que tengan turno informado. Si el
  // MINSAL aún no publica nada, aparecen todas las comunas de la zona en 0.
  const conteo = new Map<string, { nombre: string; total: number }>();
  conteo.set(COMUNA_PRINCIPAL.slug, { nombre: COMUNA_PRINCIPAL.nombre, total: 0 });
  if (farmacias.length === 0) {
    for (const nombre of COMUNAS_ZONA) conteo.set(toSlug(nombre), { nombre, total: 0 });
  }
  for (const f of farmacias) {
    const actual = conteo.get(f.comunaSlug) ?? { nombre: f.comuna, total: 0 };
    conteo.set(f.comunaSlug, { ...actual, total: actual.total + 1 });
  }

  const esPrincipal = comuna === COMUNA_PRINCIPAL.slug;
  const lista = farmacias.filter((f) => f.comunaSlug === comuna);
  // En Puerto Varas mostramos además las de comunas y localidades vecinas (Llanquihue, Fresia,
  // Puerto Montt, Alerce, Braunau…), de la más cercana a la más lejana, haya o no en la propia comuna.
  const cercanas = esPrincipal
    ? farmacias
        .filter((f) => f.comunaSlug !== COMUNA_PRINCIPAL.slug)
        .map((f) => ({ f, km: distanciaAPuertoVarasKm(f) }))
        .sort((x, y) => (x.km ?? Infinity) - (y.km ?? Infinity))
    : [];
  const activa =
    lista.find((f) => f.id === seleccion) ??
    cercanas.find((c) => c.f.id === seleccion)?.f ??
    lista[0] ??
    cercanas[0]?.f;
  const mapa = activa ? mapaEmbedUrl(activa) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Turno del <strong className="text-brand-primary">{fechaLarga(fechaMostrada)}</strong>
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

      {turno.hora < 9 && !sinPublicar && (
        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Clock className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>
            Los turnos cambian a las 09:00. Antes de esa hora puede seguir de turno la farmacia del día
            anterior, así que <strong>llama antes de ir</strong>.
          </p>
        </div>
      )}

      {viendoAnterior && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="flex gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Este turno <strong>ya terminó</strong> y el MINSAL aún no publica el vigente. Puede estar
              desactualizado: <strong>llama antes de ir</strong>.
            </span>
          </p>
          <button
            type="button"
            onClick={() => {
              setVerAnterior(false);
              setSeleccion(null);
            }}
            className="rounded-md border border-amber-300 bg-white px-3 py-1.5 font-medium hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            Volver al turno vigente
          </button>
        </div>
      )}

      {sinPublicar && !viendoAnterior ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center space-y-4">
          <Clock className="w-8 h-8 text-amber-600 mx-auto" aria-hidden="true" />
          <p className="text-brand-primary font-medium">
            El MINSAL aún no publica el turno del {fechaLarga(turno.fechaVigente)}.
          </p>
          <p className="text-sm text-gray-600">
            Suele actualizarse durante la mañana. Vuelve en un rato o confirma en el{" "}
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
          {anteriores.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setVerAnterior(true);
                setSeleccion(null);
              }}
              className="inline-flex items-center gap-2 rounded-md border-2 border-brand-accent text-brand-accent-dark px-4 py-2 text-sm font-medium hover:bg-brand-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
            >
              Ver el turno anterior ({fechaLarga(turno.fechaAnterior)}, puede estar desactualizado)
            </button>
          )}
        </div>
      ) : lista.length === 0 && cercanas.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center space-y-3">
          <Pill className="w-8 h-8 text-brand-accent mx-auto" aria-hidden="true" />
          <p className="text-brand-primary font-medium">
            El MINSAL no informa farmacia de turno para {conteo.get(comuna)?.nombre} por ahora.
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
          <div className="space-y-8 lg:col-span-3">
            {lista.length === 0 ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 flex gap-3 text-sm text-amber-900">
                <Pill className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                <p>
                  <strong>El MINSAL no informa farmacia de turno en {conteo.get(comuna)?.nombre} por ahora.</strong>{" "}
                  Estas son las más cercanas. Confirma también en el{" "}
                  <a
                    href="https://seremienlinea.minsal.cl/asdigital/mfarmacias/mapa.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-brand-primary"
                  >
                    buscador oficial del MINSAL
                  </a>
                  .
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {lista.map((f) => (
                    <TarjetaFarmacia
                      key={f.id}
                      f={f}
                      seleccionada={f.id === activa?.id}
                      anterior={viendoAnterior}
                      onVerMapa={() => setSeleccion(f.id)}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {cercanas.length > 0 && (
              <section aria-labelledby="farmacias-cercanas" className="space-y-4">
                <div>
                  <h2 id="farmacias-cercanas" className="text-lg font-bold font-serif text-brand-primary">
                    De turno cerca de Puerto Varas
                  </h2>
                  <p className="text-sm text-gray-600">
                    Farmacias de turno en las comunas y localidades vecinas, de la más cercana a la más lejana.
                  </p>
                </div>
                <ul className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cercanas.map(({ f, km }) => (
                      <TarjetaFarmacia
                        key={f.id}
                        f={f}
                        distanciaKm={km}
                        seleccionada={f.id === activa?.id}
                        anterior={viendoAnterior}
                        onVerMapa={() => setSeleccion(f.id)}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            )}
          </div>

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
