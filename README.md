# Agenda Virtual - Sistema de Registro de Actividades

Sistema web para llevar reportes de actividades (ejercicio, hábitos, etc.) con registro de usuarios, calendario y visualización de progreso.

## Stack Tecnológico

- **Frontend:** React + Tailwind CSS
- **Backend / Base de datos:** Supabase (autenticación + PostgreSQL)
- **Gráficas:** Recharts / Chart.js
- **Calendario:** react-big-calendar
- **Deploy:** Vercel

## Equipo

| Integrante | Área asignada |
|---|---|
| Persona A | Auth y estructura base |
| Persona B | CRUD de registros |
| Persona C | Vistas y visualización |

## Requisitos previos

- Node.js (v18 o superior)
- Cuenta de Supabase
- Git

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repo>
   cd agenda-virtual
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear un archivo `.env` en la raíz del proyecto con las credenciales de Supabase:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. Correr el proyecto en modo desarrollo:
   ```bash
   npm run dev
   ```

## Estructura de ramas

- `main` → versión estable, solo se mergea desde `dev`
- `dev` → rama de integración, donde se juntan todas las features probadas
- `feature/<nombre>` → una rama por funcionalidad (ej. `feature/auth`, `feature/calendario`)

## Flujo de trabajo (Git)

1. Crear una rama desde `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b feature/nombre-de-tu-feature
   ```

2. Hacer commits pequeños y frecuentes con mensajes claros:
   ```bash
   git commit -m "feat: agrega formulario de login"
   git commit -m "fix: corrige validación de fecha en registro"
   ```

3. Subir la rama y abrir un Pull Request hacia `dev`:
   ```bash
   git push origin feature/nombre-de-tu-feature
   ```

4. Al menos uno de los otros dos integrantes revisa el PR antes de mergear.

5. Cada fin de semana (o checkpoint acordado), mergear `dev` a `main` cuando todo esté probado.

## Estructura del proyecto

```
src/
  components/     # Componentes reutilizables (navbar, formularios, etc.)
  pages/          # Vistas principales (login, dashboard, calendario)
  services/       # Conexión con Supabase (auth, queries)
  hooks/          # Custom hooks de React
  utils/          # Funciones auxiliares
```

## Esquema de base de datos (Supabase)

**Tabla `registros`**

| Columna | Tipo | Descripción |
|---|---|---|
| id | uuid | Identificador único |
| usuario_id | uuid | Referencia al usuario (auth.users) |
| tipo | text | Tipo de actividad (ej. ejercicio, sueño) |
| valor | numeric | Valor registrado (ej. minutos, repeticiones) |
| fecha | date | Fecha del registro |
| notas | text | Notas opcionales |

## Recordatorios por correo

La app envía un correo automático un día antes de la `fecha` de cada registro, usando una Supabase Edge Function (`supabase/functions/send-reminders`) programada con `pg_cron` (ver `schema.sql`) y [Resend](https://resend.com) para el envío.

### Setup (una sola vez)

1. Crear una cuenta gratis en [resend.com](https://resend.com) y generar una API key.
2. Instalar el [Supabase CLI](https://supabase.com/docs/guides/cli) si no lo tienes, y hacer login:
   ```bash
   supabase login
   supabase link --project-ref <tu-project-ref>
   ```
3. Configurar los secrets de la Edge Function (nunca van en el `.env` del frontend, porque esa API key no debe llegar al navegador):
   ```bash
   supabase secrets set RESEND_API_KEY=tu_api_key_de_resend
   supabase secrets set REMINDER_FROM_EMAIL=onboarding@resend.dev
   ```
4. Desplegar la función:
   ```bash
   supabase functions deploy send-reminders
   ```
5. En el SQL Editor de Supabase, correr `schema.sql` (ya incluye la columna `recordatorio_enviado`, habilitar `pg_cron`/`pg_net`, y programar el job diario). Antes de correrlo, reemplaza `<PROJECT_REF>` y `<ANON_OR_SERVICE_KEY>` en el bloque `cron.schedule` con los valores de tu proyecto (Project Settings → API).

Con esto, todos los días a las 9:00 UTC el cron llama a la función, que revisa qué registros tienen `fecha` = mañana y les manda el correo a cada usuario.

## Cronograma

- **Semana 1:** Setup, esquema de base de datos, auth y CRUD básico
- **Semana 2:** Calendario, filtros, gráficas de progreso
- **Semana 3:** Dashboard, pulido visual, testing y deploy
