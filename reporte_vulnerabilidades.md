# Reporte de Vulnerabilidades — Agenda Virtual

Documentación de la revisión de seguridad realizada sobre el proyecto, para incluir en el entregable final.

## `npm audit`

Se ejecutó `npm audit` sobre el proyecto, encontrando 4 vulnerabilidades en dependencias (3 moderadas, 1 alta).

### 1. esbuild / vite (moderada)

- **Descripción:** permite que un sitio web externo envíe peticiones al servidor de desarrollo local y lea la respuesta.
- **Alcance real:** solo afecta el entorno de desarrollo (`npm run dev`) en la máquina de cada desarrollador. No afecta la aplicación ya compilada (`npm run build`) ni un eventual despliegue en producción.
- **Fix disponible:** `npm audit fix --force`, que instalaría Vite 8 (versión mayor, cambio incompatible con la configuración actual).
- **Decisión:** no se aplicó el fix. El riesgo real es bajo para un proyecto de desarrollo local en curso, y forzar una actualización de versión mayor a esta altura del proyecto arriesgaba romper la compatibilidad del build para todo el equipo, sin margen de tiempo suficiente para depurar posibles fallos.

### 2 y 3. react-router / react-router-dom (moderada y alta)

- **Descripción:** vulnerabilidad de redirección abierta (open redirect) a través de rutas con barra invertida, y un problema de deserialización de errores en hidratación SSR (server-side rendering).
- **Alcance real:** el proyecto no utiliza SSR en ningún punto, por lo que el segundo problema no aplica al caso de uso actual. El primero (redirección abierta) sí es teóricamente posible, aunque de bajo impacto dado que la app no maneja redirecciones basadas en input del usuario.
- **Fix disponible:** se intentó `npm audit fix` (sin forzar). El comando se ejecutó correctamente pero no aplicó ningún cambio, indicando que no existe una versión compatible dentro del rango actual que resuelva el problema sin subir a una versión mayor.
- **Decisión:** se documenta la vulnerabilidad como conocida y aceptada para el alcance del proyecto, dado el bajo impacto práctico y la ausencia de un fix no disruptivo disponible.

## Conclusión

Se revisaron las 4 vulnerabilidades reportadas por `npm audit`. Ninguna afecta directamente las funcionalidades implementadas en el proyecto (autenticación, CRUD de registros, calendario, dashboard, recordatorios por correo). Se optó por no forzar actualizaciones de versiones mayores para priorizar la estabilidad del proyecto durante el tiempo de desarrollo restante, documentando la decisión en este reporte como parte del proceso de revisión de seguridad del equipo.
