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

## Cronograma

- **Semana 1:** Setup, esquema de base de datos, auth y CRUD básico
- **Semana 2:** Calendario, filtros, gráficas de progreso
- **Semana 3:** Dashboard, pulido visual, testing y deploy
