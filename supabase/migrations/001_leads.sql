-- Leads del formulario de contacto de solucionesdys.cl.
-- Ejecutar en Supabase: SQL Editor → pegar y correr (o `supabase db push`).
--
-- Acceso: solo el servidor del sitio, con la service role key (que salta RLS).
-- RLS queda activo y SIN políticas, así las llaves públicas (anon/authenticated)
-- no pueden leer ni escribir nada.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 1 and 100),
  email         text not null check (char_length(email) between 3 and 254),
  phone         text check (char_length(phone) <= 30),
  subject       text not null check (char_length(subject) <= 100),
  message       text not null check (char_length(message) between 1 and 5000),
  source_page   text check (char_length(source_page) <= 300),
  utm_source    text check (char_length(utm_source) <= 100),
  utm_medium    text check (char_length(utm_medium) <= 100),
  utm_campaign  text check (char_length(utm_campaign) <= 100),
  -- SHA-256 de la IP con sal (LEAD_IP_HASH_SALT). Nunca se guarda la IP en claro.
  ip_hash       text check (char_length(ip_hash) = 64),
  user_agent    text check (char_length(user_agent) <= 400),
  status        text not null default 'nuevo'
                check (status in ('nuevo', 'contactado', 'cerrado', 'descartado')),
  notes         text check (char_length(notes) <= 5000)
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_created_at_idx on public.leads (status, created_at desc);

alter table public.leads enable row level security;

-- Sin políticas públicas: además quitamos los permisos por defecto a los roles públicos.
revoke all on table public.leads from anon, authenticated;

-- Conservación: la política de privacidad indica 24 meses. Para borrar automáticamente
-- los leads más antiguos, activa la extensión pg_cron (Database → Extensions) y corre:
--
--   select cron.schedule(
--     'purgar-leads-antiguos',
--     '0 4 * * 1',
--     $$ delete from public.leads where created_at < now() - interval '24 months' $$
--   );
