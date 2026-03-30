import { createClient } from "@supabase/supabase-js";

// Extraemos las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Si en tu entorno local falla por no encontrar la variable, lanzamos una alerta para depurar
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno de Supabase en .env.local.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
