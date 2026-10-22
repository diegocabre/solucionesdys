-- Directorio de negocios locales (/comunidad/directorio).
-- Ejecutar en Supabase: SQL Editor → pegar y correr.
--
-- Las fichas llegan como 'pendiente'. Para publicarlas: Table Editor → negocios →
-- cambiar `estado` a 'aprobado'. La página pública solo lee las aprobadas y solo
-- columnas públicas (nunca email_contacto, contacto_nombre ni ip_hash).
-- Mismo esquema de acceso que `leads`: RLS activo sin políticas, solo la service role key.

create table if not exists public.negocios (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  nombre          text not null check (char_length(nombre) between 2 and 80),
  rubro           text not null check (char_length(rubro) <= 40),
  comuna_slug     text not null check (char_length(comuna_slug) <= 40),
  descripcion     text not null check (char_length(descripcion) between 10 and 300),
  telefono        text check (char_length(telefono) <= 30),
  sitio_web       text check (char_length(sitio_web) <= 200),
  instagram       text check (char_length(instagram) <= 30),
  -- Datos privados del contacto: no se publican.
  contacto_nombre text not null check (char_length(contacto_nombre) between 1 and 100),
  email_contacto  text not null check (char_length(email_contacto) between 3 and 254),
  quiere_sitio    boolean not null default false,
  ip_hash         text check (char_length(ip_hash) = 64),
  estado          text not null default 'pendiente'
                  check (estado in ('pendiente', 'aprobado', 'rechazado'))
);

create index if not exists negocios_aprobados_idx
  on public.negocios (rubro, nombre)
  where estado = 'aprobado';

alter table public.negocios enable row level security;
revoke all on table public.negocios from anon, authenticated;
