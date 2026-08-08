-- Esquema de base de datos para Agenda Virtual
-- Ejecutar en el SQL Editor de Supabase

-- Tabla de registros de actividades
create table if not exists registros (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users(id) on delete cascade not null,
  tipo text not null,
  valor numeric not null,
  fecha date not null,
  notas text,
  creado_en timestamp with time zone default now()
);

-- Índice para acelerar las consultas por usuario
create index if not exists idx_registros_usuario on registros(usuario_id);

-- Habilitar Row Level Security (obligatorio para que cada usuario
-- solo pueda ver y modificar sus propios registros)
alter table registros enable row level security;

-- Política: un usuario solo puede LEER sus propios registros
create policy "Los usuarios pueden ver sus propios registros"
  on registros for select
  using (auth.uid() = usuario_id);

-- Política: un usuario solo puede CREAR registros para sí mismo
create policy "Los usuarios pueden crear sus propios registros"
  on registros for insert
  with check (auth.uid() = usuario_id);

-- Política: un usuario solo puede ACTUALIZAR sus propios registros
create policy "Los usuarios pueden actualizar sus propios registros"
  on registros for update
  using (auth.uid() = usuario_id);

-- Política: un usuario solo puede ELIMINAR sus propios registros
create policy "Los usuarios pueden eliminar sus propios registros"
  on registros for delete
  using (auth.uid() = usuario_id);

-- Estado del registro (pendiente/completado)
alter table registros
  add column if not exists estado text not null default 'completado';

-- ============================================================
-- Recordatorios por correo (un día antes de la fecha programada)
-- ============================================================

-- Marca si ya se envió el correo de recordatorio para este registro,
-- para no enviarlo dos veces cuando el cron corra cada día.
alter table registros
  add column if not exists recordatorio_enviado boolean not null default false;

-- Habilitar las extensiones necesarias para programar el envío diario
-- (pg_cron dispara el job, pg_net hace la llamada HTTP a la Edge Function)
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Programar el job diario que llama a la Edge Function "send-reminders".
-- Corre todos los días a las 9:00 UTC.
select cron.schedule(
  'enviar-recordatorios-diarios',
  '0 9 * * *',
  $$
  select net.http_post(
    url := 'https://yclzoqxtkdmobrohqnza.supabase.co/functions/v1/send-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer sb_publishable_zGtDc9JAH2u4uzyUtLwUvg_1FOowbLB'
    ),
    body := '{}'::jsonb
  );
  $$
);
