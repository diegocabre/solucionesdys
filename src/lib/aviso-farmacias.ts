import "server-only";
import { SITE_URL } from "@/lib/site";
import { escapeHtml } from "@/lib/form-utils";
import { COMUNAS_ZONA, toSlug, type FarmaciaTurno } from "@/lib/farmacias";

// Aviso diario de farmacia de turno por correo: comunas válidas, enlaces y el HTML
// de los dos correos (confirmación y aviso diario). Funciones puras, testeadas en
// test/aviso-farmacias.test.ts. El envío está en src/app/api/cron/aviso-farmacias.

export const AVISO_FROM = "Soluciones DyS <avisos@solucionesdys.cl>";

const COMUNAS = new Map<string, string>(COMUNAS_ZONA.map((c) => [toSlug(c), c]));

export const COMUNAS_AVISO = [...COMUNAS].map(([slug, nombre]) => ({ slug, nombre }));

/** Nombre de la comuna para un slug válido de la zona, o null. */
export const nombreComuna = (slug: string): string | null => COMUNAS.get(slug) ?? null;

const PAGINA_AVISO = `${SITE_URL}/comunidad/farmacias-de-turno/aviso`;

export const urlConfirmar = (token: string, comunaSlug: string) =>
  `${PAGINA_AVISO}?accion=confirmar&token=${token}&comuna=${comunaSlug}`;

export const urlBaja = (token: string) => `${PAGINA_AVISO}?accion=baja&token=${token}`;

/** Baja en un clic desde el cliente de correo (RFC 8058, cabecera List-Unsubscribe-Post). */
export const urlBajaUnClic = (token: string) => `${SITE_URL}/api/aviso-farmacias/baja?token=${token}`;

export const cabecerasBaja = (token: string): Record<string, string> => ({
  "List-Unsubscribe": `<${urlBajaUnClic(token)}>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
});

// Mismo marco que la respuesta automática del formulario de contacto: tablas para Gmail/Outlook.
// Colores de marca en hex: los clientes de correo no soportan variables CSS.
function marco(preheader: string, contenido: string, pie: string): string {
  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background-color:#000000;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#11161C; border-radius:16px; overflow:hidden; border:1px solid #262D36;">
            <tr>
              <td align="center" style="background-color:#000000; padding:28px 24px;">
                <img src="${SITE_URL}/assets/img/logo/dys-logo-para-fondo-oscuro.png" width="120" alt="Soluciones DyS" style="display:block; max-width:120px; height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:28px; font-family:Arial, Helvetica, sans-serif; color:#F6F1E7;">${contenido}</td>
            </tr>
            <tr>
              <td style="padding:20px 28px; background-color:#000000; border-top:1px solid #262D36; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.6; color:#B5B0A3; text-align:center;">${pie}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const boton = (href: string, texto: string) => `<table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="background-color:#34D399; border-radius:8px;">
      <a href="${href}" style="display:inline-block; padding:12px 24px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#000000; text-decoration:none; font-weight:bold;">${texto}</a>
    </td>
  </tr>
</table>`;

export interface Correo {
  subject: string;
  html: string;
  text: string;
}

export function correoConfirmacion(comuna: string, enlace: string): Correo {
  const c = escapeHtml(comuna);
  return {
    subject: `Confirma tu aviso de farmacia de turno en ${comuna}`,
    text:
      `Hola,\n\nPara recibir cada mañana la farmacia de turno en ${comuna}, confirma tu suscripción en este enlace:\n${enlace}\n\n` +
      `Si no lo pediste tú, ignora este correo: no te enviaremos nada más.\n\nSoluciones DyS · Puerto Varas`,
    html: marco(
      `Confirma para recibir la farmacia de turno en ${c} cada mañana.`,
      `<p style="font-size:16px; margin:0 0 16px;">Hola,</p>
       <p style="font-size:15px; line-height:1.6; margin:0 0 24px;">
         Para recibir <strong>cada mañana</strong> la farmacia de turno en <strong style="color:#34D399;">${c}</strong>,
         confirma tu suscripción:
       </p>
       ${boton(enlace, "Confirmar mi aviso")}
       <p style="font-size:13px; line-height:1.6; margin:24px 0 0; color:#B5B0A3;">
         Si no lo pediste tú, ignora este correo: no te enviaremos nada más.
       </p>`,
      "Soluciones DyS · Puerto Varas, Chile",
    ),
  };
}

const enlaceMapa = (f: FarmaciaTurno) =>
  f.lat !== null && f.lng !== null
    ? `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.direccion}, ${f.comuna}, Chile`)}`;

const horario = (f: FarmaciaTurno) => `${f.apertura} a ${f.cierre}${f.cruzaMedianoche ? " del día siguiente" : ""}`;

/**
 * Aviso diario. `farmacias` son las de la comuna; si viene vacío se muestran las de
 * toda la zona (`zona`) con una nota, porque las comunas chicas no siempre tienen turno.
 */
export function correoDiario(
  comuna: string,
  farmacias: FarmaciaTurno[],
  zona: FarmaciaTurno[],
  token: string,
): Correo {
  const enComuna = farmacias.length > 0;
  const lista = enComuna ? farmacias : zona;
  const c = escapeHtml(comuna);
  const pagina = `${SITE_URL}/comunidad/farmacias-de-turno`;
  const directorio = `${SITE_URL}/comunidad/directorio/inscribir`;
  const baja = urlBaja(token);

  const subject = enComuna
    ? lista.length === 1
      ? `Farmacia de turno hoy en ${comuna}: ${lista[0].nombre}`
      : `Farmacias de turno hoy en ${comuna}`
    : `Hoy no hay farmacia de turno informada en ${comuna}`;

  const intro = enComuna
    ? `Esta es la farmacia de turno de hoy en <strong style="color:#34D399;">${c}</strong>:`
    : `El MINSAL no informó farmacia de turno en <strong style="color:#34D399;">${c}</strong> para hoy. Estas son las de la zona:`;

  const filas = lista
    .map(
      (f) => `<tr><td style="padding:14px 0; border-top:1px solid #262D36;">
        <p style="margin:0; font-size:15px; font-weight:bold;">${escapeHtml(f.nombre)}</p>
        <p style="margin:4px 0 0; font-size:14px; line-height:1.5; color:#B5B0A3;">
          ${escapeHtml(f.direccion)}, ${escapeHtml(f.comuna)}<br />
          Horario: ${escapeHtml(horario(f))}
          ${f.telefono ? `<br />Teléfono: ${f.telefonoHref ? `<a href="tel:${f.telefonoHref}" style="color:#4C9AFF;">${escapeHtml(f.telefono)}</a>` : escapeHtml(f.telefono)}` : ""}
        </p>
        <p style="margin:6px 0 0; font-size:13px;"><a href="${enlaceMapa(f)}" style="color:#4C9AFF; font-weight:bold;">Cómo llegar →</a></p>
      </td></tr>`,
    )
    .join("");

  const textoLista = lista
    .map(
      (f) =>
        `- ${f.nombre}\n  ${f.direccion}, ${f.comuna}\n  Horario: ${horario(f)}` +
        (f.telefono ? `\n  Teléfono: ${f.telefono}` : "") +
        `\n  Cómo llegar: ${enlaceMapa(f)}`,
    )
    .join("\n\n");

  return {
    subject,
    text:
      `${enComuna ? `Farmacia de turno hoy en ${comuna}:` : `Hoy no hay farmacia de turno informada en ${comuna}. Estas son las de la zona:`}\n\n${textoLista}\n\n` +
      `Si vas de noche, llama antes. Más información: ${pagina}\n\n` +
      `¿Tienes un negocio en la zona? Aparece gratis en el directorio: ${directorio}\n\n` +
      `Para dejar de recibir este aviso: ${baja}`,
    html: marco(
      escapeHtml(subject),
      `<p style="font-size:15px; line-height:1.6; margin:0 0 8px;">${intro}</p>
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${filas}</table>
       <p style="font-size:13px; line-height:1.6; margin:16px 0 24px; color:#B5B0A3;">
         Los turnos van de 09:00 a 08:59 del día siguiente. Si vas de noche, <strong>llama antes</strong>.
       </p>
       ${boton(pagina, "Ver todas las farmacias")}
       <p style="font-size:14px; line-height:1.6; margin:28px 0 0; padding:16px; background-color:#000000; border-radius:8px;">
         ¿Tienes un negocio en la zona? <a href="${directorio}" style="color:#4C9AFF; font-weight:bold;">Aparece gratis en el directorio local →</a>
       </p>`,
      `Recibes este correo porque te suscribiste al aviso de farmacia de turno en ${c}.<br />
       <a href="${baja}" style="color:#B5B0A3;">Dejar de recibir este aviso</a> · Soluciones DyS · Puerto Varas`,
    ),
  };
}
