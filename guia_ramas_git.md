# Guía de ramas — Agenda Virtual

Flujo completo para que cada quien trabaje en su parte sin pisar el código de los demás, y mantener `main` siempre estable.

---

## 1. Crear una rama nueva

Antes de crear la rama, asegurarse de estar parado sobre `main` y actualizado:

```bash
git checkout main
git pull origin main
```

Luego crear la rama y moverse a ella en un solo paso:

```bash
git checkout -b feature/nombre-descriptivo
```

**Convención sugerida de nombres:**
- `feature/crud-registros` — funciones nuevas
- `fix/login-error` — arreglos de bugs
- `feature/recordatorios` — ej. la función de recordatorios por correo

## 2. Trabajar y subir la rama a GitHub

Programar normalmente, y cuando haya avances para guardar:

```bash
git add .
git commit -m "feat: descripción corta del cambio"
```

La primera vez que se sube esa rama a GitHub:

```bash
git push -u origin feature/nombre-descriptivo
```

El `-u` (upstream) solo hace falta la primera vez — conecta la rama local con la remota. Los próximos `push` en esa misma rama ya pueden ser solo:

```bash
git push
```

## 3. Bajar una rama que ya existe en GitHub (a otra PC)

Si un compañero ya subió una rama y otra persona quiere verla/trabajarla en su propia máquina:

```bash
git fetch origin
git checkout feature/nombre-descriptivo
```

`fetch` trae la información de las ramas remotas sin mezclar nada todavía; el `checkout` crea automáticamente una copia local de esa rama y se mueve a ella.

Para ver todas las ramas disponibles (locales y remotas):

```bash
git branch -a
```

## 4. Unir una rama a `main` (cuando ya está probada y funciona)

Primero, moverse a `main` y actualizarla:

```bash
git checkout main
git pull origin main
```

Luego traer los cambios de la rama de la funcionalidad:

```bash
git merge feature/nombre-descriptivo
```

Si no hay conflictos, git lo hace automático. Si hay conflicto, git va a marcar los archivos afectados — se resuelven a mano (como ya hicieron una vez con `README.md`) y luego:

```bash
git add archivo-en-conflicto
git commit
```

Finalmente, subir `main` ya actualizado:

```bash
git push origin main
```

> **Recomendación:** en vez de hacer el merge directo por terminal, se puede abrir un **Pull Request en GitHub** (botón "Compare & pull request" que aparece al subir una rama nueva) — permite que el resto del equipo revise el código antes de fusionarlo. Para un proyecto de clase con revisión de código de por medio, esto es buena práctica y le da evidencia extra de trabajo en equipo estructurado.

## 5. Borrar la rama una vez fusionada

Ya que la funcionalidad está en `main` y probada, borrar la rama para mantener el repo limpio:

**Borrar rama local:**
```bash
git branch -d feature/nombre-descriptivo
```

**Borrar rama remota (en GitHub):**
```bash
git push origin --delete feature/nombre-descriptivo
```

> `-d` (minúscula) solo borra la rama si ya fue fusionada — es una protección para no perder trabajo sin querer. Si por algún motivo hiciera falta forzar el borrado de una rama no fusionada, sería `-D` (mayúscula), pero normalmente no debería hacer falta.

---

## Resumen del ciclo completo

1. `git checkout main` + `git pull origin main` — partir siempre de una base actualizada
2. `git checkout -b feature/algo` — crear la rama
3. Programar, `git add .` + `git commit -m "..."` — guardar avances
4. `git push -u origin feature/algo` — subir a GitHub
5. Pull Request en GitHub (o `git merge` directo) — revisar y fusionar a `main`
6. `git branch -d feature/algo` + `git push origin --delete feature/algo` — limpiar

Con este ciclo, `main` se mantiene siempre estable y funcionando, y cada quien prueba su parte de forma aislada antes de integrarla.
