-- Retención de leads: la política de privacidad indica 24 meses.
-- Programa con pg_cron un borrado semanal (lunes 04:00 UTC) de los leads con
-- más de 24 meses. Ejecutar en Supabase: SQL Editor → pegar y correr.
--
-- Es idempotente: cron.schedule con un nombre que ya existe reemplaza el job.

create extension if not exists pg_cron with schema pg_catalog;

select cron.schedule(
  'purgar-leads-antiguos',
  '0 4 * * 1',
  $$ delete from public.leads where created_at < now() - interval '24 months' $$
);

-- Verificar que el job quedó creado:
--   select jobid, jobname, schedule, command, active from cron.job where jobname = 'purgar-leads-antiguos';
-- Ver sus ejecuciones:
--   select status, return_message, start_time from cron.job_run_details
--   where jobid = (select jobid from cron.job where jobname = 'purgar-leads-antiguos')
--   order by start_time desc limit 10;
