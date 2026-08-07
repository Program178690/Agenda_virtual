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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      const estado = form.fecha > hoy ? "pendiente" : "completado";

      await crearRegistro({
        ...form,
        valor: Number(form.valor),
        estado,
      });
      setForm({ ...form, valor: "", notas: "" });
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleEstado(registro) {
    const nuevoEstado =
      registro.estado === "pendiente" ? "completado" : "pendiente";
    await actualizarRegistro(registro.id, { estado: nuevoEstado });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">
        Mis registros
      </h1>

      {/* Formulario para crear un registro nuevo */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-5"
      >
        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm"
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
          className="rounded-md border border-slate-300 px-2 py-2 text-sm"
        />
        <input
          type="date"
          name="fecha"
          required
          value={form.fecha}
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm"
        />
        <select
          name="prioridad"
          value={form.prioridad} 
          onChange={handleChange}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm"
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
          className="rounded-md border border-slate-300 px-2 py-2 text-sm sm:col-span-1"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : "Agregar"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Listado de registros */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
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
          <tbody>
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
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-2 capitalize">{r.tipo}</td>
                <td className="px-4 py-2">{r.valor}</td>
                <td className="px-4 py-2">{r.fecha}</td>
                <td className="px-4 py-2 text-slate-500">{r.notas}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      r.estado === "pendiente"
                        ? "rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700"
                        : "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                    }
                  >
                    {r.estado === "pendiente" ? "Pendiente" : "Completado"}
                  </span>
                </td>
                <td className="px-4 py-2">
  <span
    className={
      r.prioridad === "alta"
        ? "rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
        : r.prioridad === "baja"
        ? "rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
        : "rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
    }
  >
    {PRIORIDADES.find((p) => p.valor === r.prioridad)?.etiqueta ?? "Media"}
  </span>
</td>
                <td className="px-4 py-2 text-right space-x-3">
                  <button
                    onClick={() => toggleEstado(r)}
                    className="text-blue-600 hover:underline"
                  >
                    {r.estado === "pendiente" ? "Marcar como hecho" : "Marcar pendiente"}
                  </button>
                  <button
                    onClick={() => eliminarRegistro(r.id)}
                    className="text-red-500 hover:underline"
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