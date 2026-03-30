"use server"

export async function verifyAdminPassword(password: string) {
  // Se lee la variable segura (sin NEXT_PUBLIC) para que no vaya al navegador
  const realPassword = process.env.ADMIN_PASSWORD || "P@ssword2026";
  return password === realPassword;
}
