'use server'

import nodemailer from 'nodemailer'
import { headers } from 'next/headers'

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

export async function sendContactEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  // Campo honeypot: invisible para personas, pero los bots que autocompletan
  // formularios suelen rellenarlo. Si viene con contenido, fingimos éxito
  // sin enviar nada ni revelar que fue detectado.
  const honeypot = formData.get('company_website')?.toString() || ''
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

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'sandracydiegoc@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  })

  try {
    await transporter.sendMail({
      // Se envía desde la misma cuenta para evitar problemas de SPF/DKIM;
      // el remitente real queda en el reply-to.
      from: `"Formulario Web" <${process.env.EMAIL_USER || 'sandracydiegoc@gmail.com'}>`,
      replyTo: email,
      to: 'sandracydiegoc@gmail.com',
      subject: `Nuevo contacto web: ${subject}`,
      text: `Nombre: ${name}\nEmail: ${email}\nMotivo: ${subject}\n\nMensaje:\n${message}`,
    })
    return { success: true, message: '¡Mensaje enviado con éxito!', error: '' }
  } catch (error) {
    console.error('Error enviando email:', error)
    return { success: false, message: '', error: 'Error enviando el mensaje. Revisa la configuración del servidor de correo.' }
  }
}
