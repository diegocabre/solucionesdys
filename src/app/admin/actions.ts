'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  ADMIN_COOKIE,
  SESSION_SECONDS,
  checkCredentials,
  createSessionToken,
  isAdminConfigured,
  requireAdmin,
} from '@/lib/admin-auth'
import { getClientIp, limitByIp } from '@/lib/rate-limit'
import { isLeadStatus, updateLead } from '@/lib/supabase/server'

export type LoginState = { error: string }

// Máx. 5 intentos de login cada 15 minutos por IP.
const LOGIN_MAX = 5
const LOGIN_WINDOW_SEC = 15 * 60

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    console.error('[admin] Faltan ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_AUTH_SECRET (mín. 32 caracteres).')
    return { error: 'El panel no está configurado.' }
  }

  const ip = getClientIp(await headers())
  const { success } = await limitByIp(`admin-login:${ip}`, LOGIN_MAX, LOGIN_WINDOW_SEC)
  if (!success) {
    return { error: 'Demasiados intentos. Espera unos minutos antes de volver a intentar.' }
  }

  const email = formData.get('email')?.toString().slice(0, 254) || ''
  const password = formData.get('password')?.toString().slice(0, 200) || ''

  if (!checkCredentials(email, password)) {
    return { error: 'Correo o contraseña incorrectos.' }
  }

  ;(await cookies()).set(ADMIN_COOKIE, createSessionToken(email.trim().toLowerCase()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: SESSION_SECONDS,
  })
  redirect('/admin/leads')
}

export async function logout(): Promise<void> {
  ;(await cookies()).delete({ name: ADMIN_COOKIE, path: '/admin' })
  redirect('/admin/login')
}

export async function updateLeadStatus(formData: FormData): Promise<void> {
  // Las server actions son endpoints públicos: se vuelve a verificar la sesión.
  await requireAdmin()

  const id = formData.get('id')?.toString() || ''
  const status = formData.get('status')?.toString() || ''
  const notes = formData.get('notes')?.toString().replace(/\0/g, '').trim().slice(0, 5000) || null

  if (!UUID_REGEX.test(id) || !isLeadStatus(status)) {
    throw new Error('Datos inválidos.')
  }

  await updateLead(id, { status, notes })
  revalidatePath('/admin/leads')
}
