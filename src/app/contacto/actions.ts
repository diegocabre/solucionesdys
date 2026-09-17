'use server'

import { Resend } from 'resend'
import { headers } from 'next/headers'
import { SITE_URL } from '@/lib/site'

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

// Límite simple en memoria: máx. 5 envíos cada 10 minutos por IP.
// Es "best effort" (se reinicia si el servidor se reinicia o hay varias instancias);
// para tráfico alto conviene un store compartido (ej. Upstash Redis / Vercel KV).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX = 5
const submissions = new Map<string, number[]>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const timestamps = (submissions.get(key) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  )
  if (timestamps.length >= RATE_LIMIT_MAX) {
    submissions.set(key, timestamps)
    return true
  }
  timestamps.push(now)
  submissions.set(key, timestamps)
  return false
}

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

export async function sendContactEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  // Campo honeypot: invisible para personas, pero los bots que autocompletan
  // formularios suelen rellenarlo. Si viene con contenido, fingimos éxito
  // sin enviar nada ni revelar que fue detectado.
  const honeypot = formData.get('hp_check_x9')?.toString() || ''
  if (honeypot.trim() !== '') {
    return { success: true, message: '¡Mensaje enviado con éxito!', error: '' }
  }

  const rawName = formData.get('name')?.toString() || ''
  const rawEmail = formData.get('email')?.toString() || ''
  const rawSubject = formData.get('subject')?.toString() || ''
  const rawMessage = formData.get('message')?.toString() || ''

  const name = sanitizeForHeader(rawName).slice(0, 100)
  const email = sanitizeForHeader(rawEmail).slice(0, 254)
  const subject = ALLOWED_SUBJECTS.includes(rawSubject) ? rawSubject : 'Otro Motivo'
  const message = rawMessage.replace(/\0/g, '').trim().slice(0, 5000)

  if (!name || !email || !message) {
    return { success: false, message: '', error: 'Por favor, completa todos los campos requeridos.' }
  }

  if (!EMAIL_REGEX.test(email)) {
    return { success: false, message: '', error: 'Por favor, ingresa un correo electrónico válido.' }
  }

  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'

  if (isRateLimited(ip)) {
    return {
      success: false,
      message: '',
      error: 'Has enviado demasiados mensajes en poco tiempo. Intenta nuevamente en unos minutos.',
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error: resendError } = await resend.emails.send({
      from: 'Formulario Web <formulario@solucionesdys.cl>',
      replyTo: email,
      to: 'sandracydiegoc@gmail.com',
      subject: `Nuevo contacto web: ${subject}`,
      text: `Nombre: ${name}\nEmail: ${email}\nMotivo: ${subject}\n\nMensaje:\n${message}`,
    })

    if (resendError) {
      console.error('Error enviando email:', resendError)
      return { success: false, message: '', error: 'Error enviando el mensaje. Revisa la configuración del servidor de correo.' }
    }

    // Respuesta automática al visitante. Es "best effort": si falla no se
    // reporta error, ya que el mensaje principal a la empresa ya se envió.
    try {
      await resend.emails.send({
        from: 'Soluciones DyS <formulario@solucionesdys.cl>',
        to: email,
        subject: 'Hemos recibido tu mensaje - Soluciones DyS',
        text: `Hola ${name},\n\nGracias por contactarnos. Recibimos tu mensaje sobre "${subject}" y pronto nos comunicaremos contigo.\n\nSaludos,\nEquipo Soluciones DyS`,
        html: buildAutoReplyHtml(name, subject),
      })
    } catch (autoReplyError) {
      console.error('Error enviando respuesta automática:', autoReplyError)
    }

    return { success: true, message: '¡Mensaje enviado con éxito!', error: '' }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, message: '', error: 'Error enviando el mensaje. Revisa la configuración del servidor de correo.' }
  }
}
