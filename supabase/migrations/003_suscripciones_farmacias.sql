-- Aviso diario de farmacia de turno por correo (/comunidad/farmacias-de-turno).
-- Ejecutar en Supabase: SQL Editor → pegar y correr.
--
-- Doble opt-in: el formulario solo crea la fila (confirmado = false) y envía un enlace;
-- el cron diario (/api/cron/aviso-farmacias) solo escribe a filas confirmadas y sin baja.
-- Mismo esquema de acceso que `leads`: RLS activo sin políticas, solo la service role key.

create table if not exists public.suscripciones_farmacias (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  email         text not null unique check (char_length(email) between 3 and 254),
  comuna_slug   text not null check (char_length(comuna_slug) <= 40),
  -- Token aleatorio de los enlaces de confirmación y de baja (hex de 32 bytes).
  token         text not null unique check (char_length(token) = 64),
  confirmado    boolean not null default false,
  confirmado_en timestamptz,
  baja_en       timestamptz,
  ip_hash       text check (char_length(ip_hash) = 64)
);

create index if not exists suscripciones_farmacias_activas_idx
  on public.suscripciones_farmacias (comuna_slug)
  where confirmado and baja_en is null;

alter table public.suscripciones_farmacias enable row level security;
revoke all on table public.suscripciones_farmacias from anon, authenticated;

-- Limpieza: borra las suscripciones nunca confirmadas tras 30 días y las bajas tras 24 meses.
create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'purgar-suscripciones-farmacias',
  '15 4 * * 1',
  $$ delete from public.suscripciones_farmacias
     where (not confirmado and created_at < now() - interval '30 days')
        or (baja_en is not null and baja_en < now() - interval '24 months') $$
);
