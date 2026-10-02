'use server'

import { createHash } from 'node:crypto'
import { Resend } from 'resend'
import { headers } from 'next/headers'
import { SITE_URL } from '@/lib/site'
import { getClientIp, limitByIp } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { insertLead, isSupabaseConfigured, type NewLead } from '@/lib/supabase/server'

export type FormState = {
  success: boolean
  message: string
  error: string
}

const ALLOWED_SUBJECTS = [
  'Diseño de Sitios Web',
  'Landing Page',
  'Tienda Online / E-commerce',
  'Alianzas / Partners',
  'Otro Motivo',
]

const EMAIL_REGEX = /^[^\s@"<>,]+@[^\s@"<>,]+\.[^\s@"<>,]+$/
// Teléfono opcional: dígitos, espacios, guiones, paréntesis y un + inicial.
const PHONE_REGEX = /^\+?[\d\s()-]{8,20}$/

// Máx. 5 envíos cada 10 minutos por IP (compartido entre instancias vía Upstash).
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_SEC = 10 * 60

// Quita saltos de línea y caracteres de control para evitar inyección de
// cabeceras SMTP (CRLF injection) cuando el valor se usa en headers de email.
function sanitizeForHeader(value: string): string {
  return value.replace(/[\r\n\t\0]/g, ' ').trim()
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// HTML basado en tablas (compatibilidad con Gmail/Outlook/Apple Mail).
// El logo ya incluye el texto "Soluciones DyS" dentro de la imagen.
function buildAutoReplyHtml(name: string, subject: string): string {
  const logoUrl = `${SITE_URL}/assets/img/logo.png`
  const safeName = escapeHtml(name)
  const safeSubject = escapeHtml(subject)

  return `<!DOCTYPE html>
<html lang="es">
  <body style="margin:0; padding:0; background-color:#fafaf9;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      Recibimos tu mensaje, ${safeName}. Pronto nos comunicaremos contigo.
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background-color:#ffffff; border-radius:16px; overflow:hidden; border:1px solid #e7e2dc;">
            <tr>
              <td align="center" style="background-color:#182838; padding:40px 24px;">
                <img src="${logoUrl}" width="160" alt="Soluciones DyS" style="display:block; max-width:160px; height:auto;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px 28px; font-family:Arial, Helvetica, sans-serif; color:#1c2733;">
                <p style="font-size:16px; margin:0 0 16px;">Hola ${safeName},</p>
                <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                  Gracias por contactarnos. Recibimos tu mensaje sobre
                  <strong style="color:#9e7f69;">"${safeSubject}"</strong> y muy pronto nos comunicaremos contigo.
                </p>
                <p style="font-size:15px; line-height:1.6; margin:0 0 24px;">
                  Mientras tanto, si tu consulta es urgente, puedes escribirnos directo por WhatsApp.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="background-color:#43663b; border-radius:8px;">
                      <a href="https://wa.me/56947637541" style="display:inline-block; padding:12px 24px; font-family:Arial, Helvetica, sans-serif; font-size:14px; color:#ffffff; text-decoration:none; font-weight:bold;">
                        Escribir por WhatsApp
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px; background-color:#fafaf9; border-top:1px solid #e7e2dc; font-family:Arial, Helvetica, sans-serif; font-size:12px; color:#6b7280; text-align:center;">
                Soluciones DyS · Puerto Varas, Chile
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

// Campos opcionales de texto corto (utm_*, página de origen): sin saltos de línea y acotados.
function optionalField(formData: FormData, key: string, max: number): string | null {
  const value = sanitizeForHeader(formData.get(key)?.toString() || '').slice(0, max)
  return value || null
}

// Hash de la IP con sal: permite detectar abuso repetido sin guardar la IP en claro.
function hashIp(ip: string): string | null {
  const salt = process.env.LEAD_IP_HASH_SALT
  if (!salt) {
    console.warn('[contacto] Falta LEAD_IP_HASH_SALT: el lead se guarda sin ip_hash.')
    return null
  }
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

const SUCCESS: FormState = {
  success: true,
  message: '¡Mensaje enviado con éxito! Te responderemos a la brevedad.',
  error: '',
}

const GENERIC_ERROR: FormState = {
  success: false,
  message: '',
  error: 'No pudimos enviar tu mensaje. Intenta nuevamente o escríbenos por WhatsApp al +56 9 4763 7541.',
}

export async function sendContactEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  // Campo honeypot: invisible para personas, pero los bots que autocompletan
  // formularios suelen rellenarlo. Si viene con contenido, fingimos éxito
  // sin enviar nada ni revelar que fue detectado.
  const honeypot = formData.get('hp_check_x9')?.toString() || ''
  if (honeypot.trim() !== '') {
    return SUCCESS
  }

  // 1. Validación
  const rawName = formData.get('name')?.toString() || ''
  const rawEmail = formData.get('email')?.toString() || ''
  const rawPhone = formData.get('phone')?.toString() || ''
  const rawSubject = formData.get('subject')?.toString() || ''
  const rawMessage = formData.get('message')?.toString() || ''

  const name = sanitizeForHeader(rawName).slice(0, 100)
  const email = sanitizeForHeader(rawEmail).slice(0, 254)
  const phone = sanitizeForHeader(rawPhone).slice(0, 30)
  const subject = ALLOWED_SUBJECTS.includes(rawSubject) ? rawSubject : 'Otro Motivo'
  const message = rawMessage.replace(/\0/g, '').trim().slice(0, 5000)

  if (!name || !email || !message) {
    return { success: false, message: '', error: 'Por favor, completa todos los campos requeridos.' }
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, message: '', error: 'Por favor, ingresa un correo electrónico válido.' }
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    return { success: false, message: '', error: 'Revisa el teléfono: usa solo números, por ejemplo +56 9 1234 5678.' }
  }

  const headersList = await headers()
  const ip = getClientIp(headersList)
  const knownIp = ip === 'desconocida' ? null : ip

  // 2. Captcha (Cloudflare Turnstile)
  const captcha = await verifyTurnstile(formData.get('cf-turnstile-response')?.toString() || '', knownIp)
  if (!captcha.ok) {
    console.warn('[contacto] Turnstile rechazado:', captcha.reason)
    if (captcha.reason === 'sin-configurar') {
      return {
        success: false,
        message: '',
        error: 'El formulario no está disponible en este momento. Escríbenos por WhatsApp al +56 9 4763 7541 o a contacto@solucionesdys.cl.',
      }
    }
    return {
      success: false,
      message: '',
      error: 'No pudimos confirmar que no eres un robot. Espera a que aparezca el check de verificación e intenta de nuevo.',
    }
  }

  // 3. Rate limit por IP
  const { success: withinLimit } = await limitByIp(`contacto:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_SEC)
  if (!withinLimit) {
    return {
      success: false,
      message: '',
      error: 'Has enviado demasiados mensajes en poco tiempo. Intenta nuevamente en unos minutos.',
    }
  }

  // 4. Guardar el lead primero: aunque el correo falle, la consulta no se pierde.
  const lead: NewLead = {
    name,
    email,
    phone: phone || null,
    subject,
    message,
    source_page: optionalField(formData, 'source_page', 300),
    utm_source: optionalField(formData, 'utm_source', 100),
    utm_medium: optionalField(formData, 'utm_medium', 100),
    utm_campaign: optionalField(formData, 'utm_campaign', 100),
    ip_hash: knownIp ? hashIp(knownIp) : null,
    user_agent: headersList.get('user-agent')?.slice(0, 400) || null,
  }

  let leadSaved = false
  if (isSupabaseConfigured()) {
    try {
      await insertLead(lead)
      leadSaved = true
    } catch (error) {
      console.error('[contacto] Error guardando el lead en Supabase (se intenta igual el correo):', error)
    }
  } else {
    console.warn('[contacto] Supabase no está configurado: el lead solo se envía por correo.')
  }

  // 5. Correos con Resend
  const resend = new Resend(process.env.RESEND_API_KEY)
  const origin = [
    lead.source_page && `Página de origen: ${lead.source_page}`,
    lead.utm_source && `utm_source: ${lead.utm_source}`,
    lead.utm_medium && `utm_medium: ${lead.utm_medium}`,
    lead.utm_campaign && `utm_campaign: ${lead.utm_campaign}`,
  ]
    .filter(Boolean)
    .join('\n')

  let notified = false
  try {
    const { error: resendError } = await resend.emails.send({
      from: 'Formulario Web <formulario@solucionesdys.cl>',
      replyTo: email,
      to: 'contacto@solucionesdys.cl',
      subject: `Nuevo contacto web: ${subject}`,
      text:
        `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone || '—'}\nMotivo: ${subject}\n\nMensaje:\n${message}` +
        (origin ? `\n\n---\n${origin}` : '') +
        (leadSaved
          ? `\n\nVer en el panel: ${SITE_URL}/admin/leads`
          : '\n\n(Este lead NO quedó guardado en la base de datos.)'),
    })
    if (resendError) {
      console.error('[contacto] Error enviando email:', resendError)
    } else {
      notified = true
    }
  } catch (error) {
    console.error('[contacto] Error enviando email:', error)
  }

  // Si no quedó ni en la base ni en el correo, la consulta se perdió: hay que avisar.
  if (!leadSaved && !notified) {
    return GENERIC_ERROR
  }

  // Respuesta automática al visitante. Es "best effort": si falla no se
  // reporta error, ya que la consulta ya quedó registrada.
  try {
    await resend.emails.send({
      from: 'Soluciones DyS <formulario@solucionesdys.cl>',
      to: email,
      subject: 'Hemos recibido tu mensaje - Soluciones DyS',
      text: `Hola ${name},\n\nGracias por contactarnos. Recibimos tu mensaje sobre "${subject}" y pronto nos comunicaremos contigo.\n\nSaludos,\nEquipo Soluciones DyS`,
      html: buildAutoReplyHtml(name, subject),
    })
  } catch (autoReplyError) {
    console.error('[contacto] Error enviando respuesta automática:', autoReplyError)
  }

  return SUCCESS
}
