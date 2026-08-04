# Prompts iniciales por integrante

Cada quien copia el prompt de su parte y lo pega en su IA de preferencia antes de pedir código nuevo. Reemplaza el `[ej. ...]` con lo que necesites en ese momento y pega el archivo relevante del proyecto. Esto mantiene todo el código consistente con `CONVENTIONS.md`, sin importar quién lo genera.

---

## 🔵 Persona A — Auth y estructura base

```
Estoy trabajando en un proyecto React + Supabase + Tailwind llamado
Agenda Virtual (sistema de reportes de actividades tipo ejercicio, con
registro de usuarios). Convenciones del proyecto: componentes
funcionales con hooks, nombres de variables en inglés pero comentarios
y textos de interfaz en español, solo Tailwind para estilos (nada de
CSS suelto), toda conexión a Supabase pasa por hooks o servicios,
nunca directo en los componentes de página. Manejo de errores siempre
con try/catch mostrando mensaje al usuario.

Ya tengo armado: AuthContext.jsx (maneja signUp/signIn/signOut/user),
ProtectedRoute.jsx, Login.jsx y Register.jsx.

Mi parte del proyecto es auth y estructura base. Necesito ayuda con:
[ej. "agregar recuperación de contraseña", "agregar validación de
formato de email más robusta", "agregar página de perfil de usuario"]

Aquí está mi código actual: [pega el archivo relevante]
```

---

## 🟢 Persona B — CRUD de registros

```
Estoy trabajando en un proyecto React + Supabase + Tailwind llamado
Agenda Virtual (sistema de reportes de actividades tipo ejercicio, con
registro de usuarios). Convenciones del proyecto: componentes
funcionales con hooks, nombres de variables en inglés pero comentarios
y textos de interfaz en español, solo Tailwind para estilos, toda
conexión a Supabase pasa por hooks (nunca directo en páginas).

Ya tengo armado: useRegistros.js (hook con fetch, crear, actualizar,
eliminar) y Registros.jsx (formulario + tabla). La tabla en Supabase
es "registros" con columnas: usuario_id, tipo, valor, fecha, notas.

Mi parte del proyecto es el CRUD de registros. Necesito ayuda con:
[ej. "agregar edición inline en la tabla", "agregar filtro por rango
de fechas", "agregar confirmación antes de eliminar", "paginación"]

Aquí está mi código actual: [pega el archivo relevante]
```

---

## 🟣 Persona C — Vistas y visualización

```
Estoy trabajando en un proyecto React + Supabase + Tailwind llamado
Agenda Virtual (sistema de reportes de actividades tipo ejercicio, con
registro de usuarios). Convenciones del proyecto: componentes
funcionales con hooks, nombres de variables en inglés pero comentarios
y textos de interfaz en español, solo Tailwind para estilos.

Ya tengo armado: Calendario.jsx (usa react-big-calendar, consume el
hook useRegistros para mostrar cada registro como evento) y
Dashboard.jsx (usa Recharts, muestra totales por tipo de actividad en
un BarChart).

Mi parte del proyecto son las vistas y visualización. Necesito ayuda
con: [ej. "agregar gráfica de tendencia por semana", "agregar racha
de días consecutivos", "mejorar el diseño del calendario", "agregar
selector de rango de fechas al dashboard"]

Aquí está mi código actual: [pega el archivo relevante]
```
