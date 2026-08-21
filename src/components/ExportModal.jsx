// src/components/ExportModal.jsx
import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';

// Flujo: 'config' -> 'preview' -> (descarga)
export default function ExportModal({ isOpen, onClose, registros }) {
  const [paso, setPaso] = useState('config');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tiposSeleccionados, setTiposSeleccionados] = useState([]);
  const [incluirGraficas, setIncluirGraficas] = useState(false);

  const tiposDisponibles = useMemo(
    () => [...new Set(registros.map((r) => r.tipo))],
    [registros]
  );

  // Registros filtrados según lo elegido en el modal (independiente de
  // cualquier filtro que el usuario tenga activo en la pantalla de Registros)
  const registrosFiltrados = registros.filter((r) => {
    const dentroDeFecha =
      (!fechaInicio || r.fecha >= fechaInicio) &&
      (!fechaFin || r.fecha <= fechaFin);
    const tipoOk =
      tiposSeleccionados.length === 0 || tiposSeleccionados.includes(r.tipo);
    return dentroDeFecha && tipoOk;
  });

  // Resumen ejecutivo, calculado sobre lo filtrado
  const resumen = useMemo(() => {
    const total = registrosFiltrados.length;
    const completados = registrosFiltrados.filter((r) => r.estado === 'completado').length;
    const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;

    const conteoTipos = {};
    registrosFiltrados.forEach((r) => {
      conteoTipos[r.tipo] = (conteoTipos[r.tipo] || 0) + 1;
    });
    const tipoMasFrecuente =
      Object.entries(conteoTipos).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return { total, completados, porcentaje, tipoMasFrecuente };
  }, [registrosFiltrados]);

  // El early return va DESPUÉS de todos los hooks (useState/useMemo),
  // nunca antes ni en medio — si no, React pierde la cuenta de hooks
  // entre el render con el modal cerrado y el render con el modal abierto.
  if (!isOpen) return null;

  const toggleTipo = (tipo) => {
    setTiposSeleccionados((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleContinuar = (e) => {
    e.preventDefault();
    setPaso('preview');
  };

  const handleDescargar = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text('Reporte de Registros — Agenda Virtual', 14, y);
    y += 10;

    doc.setFontSize(10);
    const rango =
      fechaInicio || fechaFin
        ? `Del ${fechaInicio || '...'} al ${fechaFin || '...'}`
        : 'Todas las fechas';
    doc.text(rango, 14, y);
    y += 10;

    // Resumen ejecutivo
    doc.setFontSize(12);
    doc.text('Resumen', 14, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(`Total de registros: ${resumen.total}`, 14, y);
    y += 6;
    doc.text(`Completados: ${resumen.completados} (${resumen.porcentaje}%)`, 14, y);
    y += 6;
    doc.text(`Tipo más frecuente: ${resumen.tipoMasFrecuente}`, 14, y);
    y += 12;

    // Detalle
    doc.setFontSize(12);
    doc.text('Detalle de registros', 14, y);
    y += 8;
    doc.setFontSize(9);

    registrosFiltrados.forEach((r) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      const linea = `${r.fecha}  |  ${r.tipo}  |  valor: ${r.valor}  |  ${r.estado}  |  prioridad: ${r.prioridad}`;
      doc.text(linea, 14, y);
      y += 6;
      if (r.notas) {
        doc.setTextColor(120);
        doc.text(`   nota: ${r.notas}`, 14, y);
        doc.setTextColor(0);
        y += 6;
      }
    });

    doc.save(`registros_${fechaInicio || 'inicio'}_${fechaFin || 'fin'}.pdf`);
    onClose();
    setPaso('config');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {paso === 'config' ? 'Exportar registros' : 'Vista previa'}
          </h2>
          <button
            onClick={() => {
              onClose();
              setPaso('config');
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {paso === 'config' && (
          <form onSubmit={handleContinuar} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                Tipos a incluir (ninguno seleccionado = todos)
              </label>
              <div className="flex flex-wrap gap-2">
                {tiposDisponibles.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleTipo(t)}
                    className={
                      tiposSeleccionados.includes(t)
                        ? 'rounded-full bg-brand-500 text-white px-3 py-1 text-xs capitalize'
                        : 'rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 text-xs capitalize'
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={incluirGraficas}
                onChange={(e) => setIncluirGraficas(e.target.checked)}
              />
              Incluir gráficas del dashboard (próximamente)
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                Ver vista previa
              </button>
            </div>
          </form>
        )}

        {paso === 'preview' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                {fechaInicio || fechaFin
                  ? `Del ${fechaInicio || '...'} al ${fechaFin || '...'}`
                  : 'Todas las fechas'}
              </p>
              <p className="font-medium text-slate-800 dark:text-slate-100">
                {resumen.total} registros — {resumen.porcentaje}% completados
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Tipo más frecuente: <span className="capitalize">{resumen.tipoMasFrecuente}</span>
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">Fecha</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Valor</th>
                    <th className="px-3 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="dark:text-slate-100">
                  {registrosFiltrados.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-3 py-1.5">{r.fecha}</td>
                      <td className="px-3 py-1.5 capitalize">{r.tipo}</td>
                      <td className="px-3 py-1.5">{r.valor}</td>
                      <td className="px-3 py-1.5">{r.estado}</td>
                    </tr>
                  ))}
                  {registrosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-slate-400">
                        No hay registros con estos filtros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPaso('config')}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleDescargar}
                disabled={registrosFiltrados.length === 0}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                Descargar PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}