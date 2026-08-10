import { useState } from "react";
import { useRegistros } from "../hooks/useRegistros";

const TIPOS = ["ejercicio", "sueño", "alimentación", "estudio", "otro"];
const PRIORIDADES = [
  { valor: "baja", etiqueta: "Baja", color: "blue" },
  { valor: "media", etiqueta: "Media", color: "green" },
  { valor: "alta", etiqueta: "Alta", color: "red" },
];

export default function Registros() {
  const {
    registros,
    loading,
    error,
    crearRegistro,
    actualizarRegistro,
    eliminarRegistro,
  } = useRegistros();

  const [form, setForm] = useState({
    tipo: "ejercicio",
    valor: "",
    fecha: new Date().toISOString().slice(0, 10),
    notas: "",
    prioridad: "media",
  });
  const [submitting, setSubmitting] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleEditarClick(registro) {
    setForm({
      tipo: registro.tipo,
      valor: String(registro.valor),
      fecha: registro.fecha,
      notas: registro.notas ?? "",
      prioridad: registro.prioridad ?? "media",
    });
    setEditandoId(registro.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editandoId) {
        await actualizarRegistro(editandoId, {
          ...form,
          valor: Number(form.valor),
        });
        setEditandoId(null);
      } else {
        const hoy = new Date().toISOString().slice(0, 10);
        const estado = form.fecha > hoy ? "pendiente" : "completado";

        await crearRegistro({
          ...form,
          valor: Number(form.valor),
          estado,
        });
      }
      setForm({
        tipo: "ejercicio",
        valor: "",
        fecha: new Date().toISOString().slice(0, 10),
        notas: "",
        prioridad: "media",
      });
    } catch (err) {
      alert("No se pudo guardar el registro: " + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleEstado(registro) {
    const nuevoEstado =
      registro.estado === "pendiente" ? "completado" : "pendiente";
    try {
      await actualizarRegistro(registro.id, { estado: nuevoEstado });
    } catch (err) {
      alert("No se pudo actualizar el estado: " + err.message);
    }
  }

  async function handleEliminar(id) {
    if (!confirm("¿Seguro que querés eliminar este registro?")) return;
    try {
      await eliminarRegistro(id);
    } catch (err) {
      alert("No se pudo eliminar el registro: " + err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
        Mis registros
      </h1>

      {/* Formulario para crear un registro nuevo */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-5"
      >
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="valor"
          placeholder="Valor (ej. minutos)"
          required
          value={form.valor}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
        />
        <input
          type="date"
          name="fecha"
          required
          value={form.fecha}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          name="prioridad"
          value={form.prioridad}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          {PRIORIDADES.map((p) => (
            <option key={p.valor} value={p.valor}>
              {p.etiqueta}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="notas"
          placeholder="Notas (opcional)"
          value={form.notas}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 sm:col-span-1"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : editandoId ? "Guardar cambios" : "Agregar"}
        </button>
        {editandoId && (
          <button
            type="button"
            onClick={() => {
              setEditandoId(null);
              setForm({
                tipo: "ejercicio",
                valor: "",
                fecha: new Date().toISOString().slice(0, 10),
                notas: "",
                prioridad: "media",
              });
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
        )}
      </form>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {/* Listado de registros */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Notas</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Prioridad</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-slate-400">
                  Cargando...
                </td>
              </tr>
            )}
            {!loading && registros.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-slate-400">
                  Todavía no hay registros. ¡Agrega el primero!
                </td>
              </tr>
            )}
            {registros.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-2 capitalize">{r.tipo}</td>
                <td className="px-4 py-2">{r.valor}</td>
                <td className="px-4 py-2">{r.fecha}</td>
                <td className="px-4 py-2 text-slate-500 dark:text-slate-400">{r.notas}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      r.estado === "pendiente"
                        ? "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                        : "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
                    }
                  >
                    {r.estado === "pendiente" ? "Pendiente" : "Completado"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      r.prioridad === "alta"
                        ? "rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900 dark:text-red-300"
                        : r.prioridad === "baja"
                        ? "rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300"
                    }
                  >
                    {PRIORIDADES.find((p) => p.valor === r.prioridad)?.etiqueta ?? "Media"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right space-x-3">
                  <button
                    onClick={() => handleEditarClick(r)}
                    className="text-slate-600 hover:underline dark:text-slate-300"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleEstado(r)}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {r.estado === "pendiente" ? "Marcar como hecho" : "Marcar pendiente"}
                  </button>
                  <button
                    onClick={() => handleEliminar(r.id)}
                    className="text-red-500 hover:underline dark:text-red-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}