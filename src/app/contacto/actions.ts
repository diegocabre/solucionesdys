'use server'

import nodemailer from 'nodemailer'

export type FormState = {
  success: boolean
  message: string
  error: string
}

export async function sendContactEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const subject = formData.get('subject')?.toString() || ''
  const message = formData.get('message')?.toString() || ''

  if (!name || !email || !message) {
    return { success: false, message: '', error: 'Por favor, completa todos los campos requeridos.' }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'sandracydiegoc@gmail.com', 
      pass: process.env.EMAIL_PASS 
    }
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER || 'sandracydiegoc@gmail.com'}>`, // Enviado desde la misma cuenta para evitar problemas de proxy, pero ponemos el reply-to
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
