# Convenciones del proyecto — Agenda Virtual

Este documento define cómo escribimos código en este proyecto. Cada integrante debe pegarle este archivo (o un resumen) a su IA como contexto antes de pedir código nuevo, para que todo salga consistente sin importar quién lo generó.

## Prompt base para usar con IA

Al inicio de cualquier conversación donde le pidas código a una IA para este proyecto, pega algo así:

> "Estoy trabajando en un proyecto React + Supabase + Tailwind llamado Agenda Virtual. Usamos componentes funcionales con hooks, nombres de variables y comentarios en español, Tailwind para estilos (nunca CSS por separado), y manejo de errores con try/catch mostrando mensajes al usuario. La estructura de carpetas es: components/, pages/, services/, hooks/, context/. Aquí está mi archivo actual: [pega el código]. Necesito que [tu pedido específico]."

## Idioma

- Nombres de variables, funciones y componentes: **en inglés** (`fetchRegistros`, `handleSubmit`) — es el estándar en código JS/React
- Comentarios, textos de la interfaz (labels, botones, mensajes de error): **en español**, porque la app es para usuarios hispanohablantes

## Componentes React

- Siempre componentes funcionales con hooks, nunca clases
- Un componente por archivo, nombre del archivo = nombre del componente (`Navbar.jsx`)
- Props desestructuradas en la firma de la función: `function Boton({ texto, onClick })`
- Si un componente supera ~150 líneas, considerar dividirlo

## Estilos

- Solo Tailwind, no archivos `.css` sueltos (excepto `index.css` con las directivas base)
- Colores del tema en `tailwind.config.js` bajo `brand` — usar `bg-brand-500`, no colores hardcodeados
- Mobile-first: diseñar para pantalla chica primero, luego `sm:` / `md:` para escritorio

## Manejo de datos (Supabase)

- Toda la lógica de conexión a Supabase vive en `services/` o en hooks dentro de `hooks/`
- Los componentes de página (`pages/`) no deben llamar a `supabase` directamente — siempre a través de un hook (ej. `useRegistros`)
- Todo `insert`, `update`, `delete` va envuelto en try/catch con mensaje de error visible para el usuario
- Nunca hardcodear las credenciales de Supabase — siempre desde `.env` vía `import.meta.env`

## Nombres de archivos y carpetas

- Componentes: `PascalCase.jsx` (`Navbar.jsx`, `ProtectedRoute.jsx`)
- Hooks: `camelCase.js` empezando con `use` (`useRegistros.js`)
- Páginas: `PascalCase.jsx` dentro de `pages/`

## Commits (Git)

Prefijos estándar para todo el equipo:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `style:` cambios visuales/CSS sin lógica nueva
- `refactor:` reorganizar código sin cambiar comportamiento
- `docs:` cambios en documentación

Ejemplo: `git commit -m "feat: agrega filtro de registros por fecha"`

## Manejo de errores

- Nunca dejar un `catch` vacío
- Mostrar el error al usuario de forma clara (no solo `console.log`)
- Usar estados de carga (`loading`) para que la interfaz no se sienta congelada

## Antes de abrir un Pull Request

- [ ] El código corre localmente sin errores (`npm run dev`)
- [ ] No quedan `console.log` de debug
- [ ] Las variables de entorno no están hardcodeadas en el código
- [ ] Podés explicar en una frase qué hace cada función nueva que agregaste
