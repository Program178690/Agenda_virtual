import { useState } from "react";
import { useRegistros } from "../hooks/useRegistros";
import RegistroFormModal from "../components/RegistroFormModal";

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

  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [submitting, setSubmitting] = useState(false);
    const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");

  function handleNuevoClick() {
    setRegistroEditando(null);
    setModalAbierto(true);
  }

  function handleEditarClick(registro) {
    setRegistroEditando(registro);
    setModalAbierto(true);
  }

  async function handleGuardar(datos) {
    setSubmitting(true);
    try {
      if (registroEditando) {
        await actualizarRegistro(registroEditando.id, datos);
      } else {
        await crearRegistro(datos);
      }
      setModalAbierto(false);
      setRegistroEditando(null);
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

    const tiposDisponibles = [...new Set(registros.map((r) => r.tipo))];

  const registrosFiltrados = registros.filter((r) => {
    const coincideTipo = filtroTipo === "todos" || r.tipo === filtroTipo;
    const coincideEstado = filtroEstado === "todos" || r.estado === filtroEstado;
    const coincidePrioridad =
      filtroPrioridad === "todos" || r.prioridad === filtroPrioridad;
    return coincideTipo && coincideEstado && coincidePrioridad;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Mis registros
        </h1>
        <button
          onClick={handleNuevoClick}
          className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          + Nuevo registro
        </button>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
       <div className="flex flex-wrap gap-3">
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="todos">Todos los tipos</option>
          {tiposDisponibles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="todos">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="completado">Completado</option>
        </select>
        <select
          value={filtroPrioridad}
          onChange={(e) => setFiltroPrioridad(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="todos">Todas las prioridades</option>
          {PRIORIDADES.map((p) => (
            <option key={p.valor} value={p.valor}>
              {p.etiqueta}
            </option>
          ))}
        </select>
      </div>

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
            {registrosFiltrados.map((r) => (
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

      <RegistroFormModal
        isOpen={modalAbierto}
        onClose={() => {
          setModalAbierto(false);
          setRegistroEditando(null);
        }}
        onGuardar={handleGuardar}
        registroInicial={registroEditando}
        submitting={submitting}
      />
    </div>
  );
}