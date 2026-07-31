"use server"

import crypto from "crypto";
import nodemailer from "nodemailer";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

const SESSION_COOKIE_NAME = "admin_session";
const OTP_COOKIE_NAME = "admin_otp";
const SECRET_KEY = process.env.ADMIN_PASSWORD || "P@ssword2026"; // Clave de firma

// Helper: Firmar un token con HMAC SHA-256 (codificado en hexadecimal para evitar problemas de caracteres en cookies)
function signToken(payload: object, durationMs: number): string {
  const data = JSON.stringify({
    payload,
    exp: Date.now() + durationMs
  });
  const hexData = Buffer.from(data).toString("hex");
  const signature = crypto.createHmac("sha256", SECRET_KEY).update(hexData).digest("hex");
  return `${hexData}.${signature}`;
}

// Helper: Verificar y decodificar un token firmado
function verifyToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [hexData, signature] = parts;
    const expectedSignature = crypto.createHmac("sha256", SECRET_KEY).update(hexData).digest("hex");
    if (signature !== expectedSignature) return null;
    
    const data = JSON.parse(Buffer.from(hexData, "hex").toString("utf-8"));
    if (data.exp < Date.now()) return null; // Expirado
    return data.payload;
  } catch (e) {
    return null;
  }
}

// Helper: Enviar Correo de OTP con Nodemailer
async function sendOTPEmail(toEmail: string, code: string, purpose: "login" | "recovery") {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "sandracydiegoc@gmail.com",
      pass: process.env.EMAIL_PASS
    }
  });

  const subject = purpose === "login" 
    ? "Código de verificación de ingreso - Soluciones DyS" 
    : "Restablecer contraseña - Soluciones DyS";

  const description = purpose === "login"
    ? "Se ha solicitado un acceso al Panel Administrativo."
    : "Se ha solicitado restablecer la contraseña de administrador.";

  const title = purpose === "login" ? "Código de Acceso (2FA)" : "Restamiento de Clave";

  await transporter.sendMail({
    from: `"Soluciones DyS" <${process.env.EMAIL_USER || 'sandracydiegoc@gmail.com'}>`,
    to: toEmail,
    subject: subject,
    text: `Tu código de verificación es: ${code}. Válido por 5 minutos.`,
    html: `<div style="font-family: sans-serif; padding: 30px; max-width: 500px; border: 1px solid #e2e8f0; border-radius: 16px; margin: 0 auto; background-color: #ffffff;">
      <h2 style="color: #182838; text-align: center; margin-top: 0; font-family: serif;">Soluciones DyS</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.5; text-align: center;">
        ${description}
      </p>
      <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 20px; text-align: center; border-radius: 12px; margin: 25px 0;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 5px;">${title}</div>
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #bfa38a; font-family: monospace;">${code}</span>
      </div>
      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
        Este código es de un solo uso y vencerá en 5 minutos. Si no has realizado esta solicitud, por favor ignora este correo de forma segura.
      </p>
    </div>`
  });
}

// ----------------- ACCIONES DE AUTENTICACIÓN -----------------

// Paso 1 de Login: Validar clave e iniciar OTP
export async function loginStep1(emailInput: string, passwordInput: string) {
  const incomingHash = crypto.createHash("sha256").update(passwordInput).digest("hex");
  const normalizedEmail = emailInput.toLowerCase().trim();

  let isCredentialsValid = false;

  try {
    // Intentamos validar con base de datos
    const { data: verified, error } = await supabase.rpc("verify_admin", {
      input_email: normalizedEmail,
      input_password_hash: incomingHash
    });

    if (!error && typeof verified === "boolean") {
      isCredentialsValid = verified;
    } else {
      // Fallback local
      const allowedEmail = (process.env.EMAIL_USER || "sandracydiegoc@gmail.com").toLowerCase().trim();
      const realPassword = process.env.ADMIN_PASSWORD || "P@ssword2026";
      const realHash = crypto.createHash("sha256").update(realPassword).digest("hex");
      isCredentialsValid = (normalizedEmail === allowedEmail && incomingHash === realHash);
    }
  } catch (err) {
    // Fallback local en caso de error
    const allowedEmail = (process.env.EMAIL_USER || "sandracydiegoc@gmail.com").toLowerCase().trim();
    const realPassword = process.env.ADMIN_PASSWORD || "P@ssword2026";
    const realHash = crypto.createHash("sha256").update(realPassword).digest("hex");
    isCredentialsValid = (normalizedEmail === allowedEmail && incomingHash === realHash);
  }

  if (!isCredentialsValid) {
    return { success: false, error: "Usuario o contraseña incorrecta." };
  }

  // Generamos un código OTP de 6 dígitos
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Enviamos el correo
    await sendOTPEmail(normalizedEmail, otpCode, "login");

    // Guardamos la información en una cookie OTP cifrada (válida por 5 minutos)
    const otpPayload = signToken({ email: normalizedEmail, code: otpCode, type: "login" }, 5 * 60 * 1000);
    const cookieStore = await cookies();
    cookieStore.set(OTP_COOKIE_NAME, otpPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 300 // 5 minutos
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error enviando OTP:", err);
    return { success: false, error: "Error enviando correo de verificación de 2 factores." };
  }
}

// Paso 2 de Login: Verificar código y firmar sesión (JWT)
export async function loginStep2(code: string) {
  const cookieStore = await cookies();
  const otpCookie = cookieStore.get(OTP_COOKIE_NAME);

  if (!otpCookie) {
    return { success: false, error: "El código ha expirado o es inválido." };
  }

  const payload = verifyToken(otpCookie.value);
  if (!payload || payload.type !== "login") {
    return { success: false, error: "Código inválido o alterado." };
  }

  if (payload.code !== code.trim()) {
    return { success: false, error: "Código de verificación incorrecto." };
  }

  // Login correcto: Borrar cookie OTP y crear sesión (24 horas)
  cookieStore.delete(OTP_COOKIE_NAME);
  
  const sessionToken = signToken({ email: payload.email }, 24 * 60 * 60 * 1000);
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 24 * 60 * 60 // 24 horas
  });

  return { success: true };
}

// Recuperación de Contraseña Paso 1: Enviar OTP de Recuperación
export async function recoveryStep1(emailInput: string) {
  const normalizedEmail = emailInput.toLowerCase().trim();
  const adminEmail = (process.env.EMAIL_USER || "sandracydiegoc@gmail.com").toLowerCase().trim();

  // Validamos que el correo sea el de administración
  if (normalizedEmail !== adminEmail) {
    return { success: false, error: "El correo ingresado no corresponde al administrador." };
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOTPEmail(normalizedEmail, otpCode, "recovery");

    const otpPayload = signToken({ email: normalizedEmail, code: otpCode, type: "recovery" }, 5 * 60 * 1000);
    const cookieStore = await cookies();
    cookieStore.set(OTP_COOKIE_NAME, otpPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 300
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error enviando recovery OTP:", err);
    return { success: false, error: "Error enviando correo de recuperación." };
  }
}

// Recuperación de Contraseña Paso 2: Validar OTP y guardar nueva clave
export async function recoveryStep2(code: string, newPasswordInput: string) {
  const cookieStore = await cookies();
  const otpCookie = cookieStore.get(OTP_COOKIE_NAME);

  if (!otpCookie) {
    return { success: false, error: "El código ha expirado o es inválido." };
  }

  const payload = verifyToken(otpCookie.value);
  if (!payload || payload.type !== "recovery") {
    return { success: false, error: "Código inválido." };
  }

  if (payload.code !== code.trim()) {
    return { success: false, error: "Código de verificación incorrecto." };
  }

  const newHash = crypto.createHash("sha256").update(newPasswordInput).digest("hex");
  try {
    // 1. Intentamos actualizar mediante la función RPC segura
    const { data: rpcUpdated, error: rpcError } = await supabase.rpc("change_admin_password", {
      target_email: payload.email,
      new_password_hash: newHash
    });

    if (!rpcError && rpcUpdated === true) {
      // Limpiar cookie de OTP
      cookieStore.delete(OTP_COOKIE_NAME);
      return { success: true };
    }

    // 2. Si no está disponible el RPC, intentamos la actualización directa y verificamos si se afectaron filas
    console.warn("RPC change_admin_password no disponible o retornó falso, intentando actualización directa...");
    const { data, error } = await supabase
      .from("admin_users")
      .update({ password_hash: newHash })
      .eq("email", payload.email)
      .select();

    // En Supabase con RLS activo, el update bloqueado no retorna error pero 'data' estará vacío
    if (error || !data || data.length === 0) {
      console.warn("Update directo bloqueado por RLS o usuario no encontrado:", error?.message);
      return {
        success: false,
        error: "No se pudo actualizar la contraseña. Asegúrate de ejecutar la función 'change_admin_password' en Supabase para permitir modificaciones bajo políticas RLS."
      };
    }
  } catch (err) {
    console.error("Error al actualizar la base de datos:", err);
    return { 
      success: false, 
      error: "Error de comunicación con la base de datos." 
    };
  }

  // Limpiar cookie de OTP
  cookieStore.delete(OTP_COOKIE_NAME);
  return { success: true };
}

// Verificar si hay sesión activa (JWT)
export async function checkSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie) return null;

  const payload = verifyToken(sessionCookie.value);
  return payload ? payload.email : null;
}

// Cerrar sesión (Borrar JWT)
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

// Enviar email de cancelación
async function sendCancellationEmail(toEmail: string, clientName: string, orderId: string, totalAmount: number) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "sandracydiegoc@gmail.com",
      pass: process.env.EMAIL_PASS
    }
  });

  const subject = "Orden de compra cancelada - Soluciones DyS";

  await transporter.sendMail({
    from: `"Soluciones DyS" <${process.env.EMAIL_USER || 'sandracydiegoc@gmail.com'}>`,
    to: toEmail,
    subject: subject,
    text: `Hola ${clientName},\n\nLamentamos informarte que tu orden de compra en Soluciones DyS ha sido cancelada debido a que no recibimos el pago correspondiente dentro del plazo de 48 horas.\n\nDetalles de la orden cancelada:\n- Referencia: ${orderId}\n- Monto: $${Number(totalAmount).toLocaleString("es-CL")}\n\nSi deseas adquirir estos productos, puedes realizar una nueva compra en nuestro sitio web.\n\nAtentamente,\nEquipo Soluciones DyS`,
    html: `<div style="font-family: sans-serif; padding: 30px; max-width: 550px; border: 1px solid #e2e8f0; border-radius: 16px; margin: 0 auto; background-color: #ffffff;">
      <h2 style="color: #ef4444; font-family: serif; margin-top: 0;">Orden Cancelada</h2>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Hola <strong>${clientName}</strong>,
      </p>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Lamentamos informarte que tu orden de compra en **Soluciones DyS** ha sido cancelada automáticamente al cumplirse el plazo límite de 48 horas sin registrar el pago correspondiente.
      </p>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #334155;">
        <div style="margin-bottom: 5px;"><strong>Referencia de Orden:</strong> ${orderId}</div>
        <div><strong>Monto de la Compra:</strong> $${Number(totalAmount).toLocaleString("es-CL")}</div>
      </div>
      <p style="font-size: 14px; color: #475569; line-height: 1.6;">
        Si aún deseas recibir estos productos o servicios, te invitamos a realizar una nueva compra en nuestro sitio web.
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
      <p style="font-size: 12px; color: #94a3b8; text-align: center; margin-bottom: 0;">
        Soluciones DyS • sandracydiegoc@gmail.com
      </p>
    </div>`
  });
}

// Borrar orden manualmente y notificar por email
export async function deleteOrderAndNotify(orderId: string) {
  try {
    // 1. Obtener detalles de la orden
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      throw new Error("No se encontró la orden.");
    }

    // 2. Extraer correo usando expresión regular robusta
    let clientEmail = "";
    const emailMatch = (order.customer_address || "").match(/Correo:\s*([^\s|]+)/i);
    if (emailMatch && emailMatch[1]) {
      clientEmail = emailMatch[1].trim();
    } else {
      const genericEmailMatch = (order.customer_address || "").match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (genericEmailMatch && genericEmailMatch[1]) {
        clientEmail = genericEmailMatch[1].trim();
      }
    }

    // 3. Enviar correo de cancelación si existe correo
    if (clientEmail) {
      try {
        await sendCancellationEmail(
          clientEmail,
          order.customer_name,
          order.id,
          order.total_amount
        );
      } catch (emailErr) {
        console.error("Error al enviar correo de cancelación:", emailErr);
      }
    }

    // 4. Borrar la orden de Supabase usando RPC o fallback con select
    const { data: rpcDeleted, error: deleteError } = await supabase
      .rpc("delete_order", { target_order_id: orderId });

    if (deleteError || !rpcDeleted) {
      console.warn("RPC delete_order falló o no existe. Intentando delete directo con select...");
      const { data: directData, error: directDeleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .select();
      
      if (directDeleteError || !directData || directData.length === 0) {
        throw new Error(directDeleteError?.message || "No se pudo eliminar la orden. Asegúrate de ejecutar el script RPC 'delete_order' en Supabase para permitir eliminaciones bajo políticas RLS.");
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

// Limpiar órdenes no pagadas de más de 48 horas automáticamente
export async function cleanupExpiredOrders() {
  try {
    // Límite de 48 horas atrás
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    // Obtener órdenes vencidas (no pagadas y de más de 48 horas)
    const { data: expiredOrders, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .neq("status", "paid")
      .lt("created_at", cutoff);

    if (fetchError || !expiredOrders || expiredOrders.length === 0) {
      return { success: true, count: 0 };
    }

    let count = 0;

    for (const order of expiredOrders) {
      let clientEmail = "";
      const emailMatch = (order.customer_address || "").match(/Correo:\s*([^\s|]+)/i);
      if (emailMatch && emailMatch[1]) {
        clientEmail = emailMatch[1].trim();
      } else {
        const genericEmailMatch = (order.customer_address || "").match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (genericEmailMatch && genericEmailMatch[1]) {
          clientEmail = genericEmailMatch[1].trim();
        }
      }

      if (clientEmail) {
        try {
          await sendCancellationEmail(
            clientEmail,
            order.customer_name,
            order.id,
            order.total_amount
          );
        } catch (emailErr) {
          console.error(`Error enviando correo de expiración a ${clientEmail}:`, emailErr);
        }
      }

      // Intentar borrar por RPC, si falla usar delete directo
      const { data: rpcDeleted, error: rpcError } = await supabase.rpc("delete_order", { target_order_id: order.id });
      if (rpcError || !rpcDeleted) {
        await supabase.from("orders").delete().eq("id", order.id);
      }
      count++;
    }

    return { success: true, count };
  } catch (err: any) {
    console.error("Error en la limpieza de órdenes:", err);
    return { success: false, error: err.message };
  }
}
