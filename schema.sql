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

  alter table registros
  add column if not exists estado text not null default 'completado';

alter table registros
  add column if not exists prioridad text not null default 'media';
  