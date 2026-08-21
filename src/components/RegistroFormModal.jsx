// src/components/RegistroFormModal.jsx
import { useState, useEffect } from 'react';
import { CAMPOS_POR_TIPO, CAMPO_VALOR_PRINCIPAL } from '../config/camposPorTipo';

const TIPOS = Object.keys(CAMPOS_POR_TIPO);
const PRIORIDADES = [
  { valor: 'baja', etiqueta: 'Baja' },
  { valor: 'media', etiqueta: 'Media' },
  { valor: 'alta', etiqueta: 'Alta' },
];

export default function RegistroFormModal({ isOpen, onClose, onGuardar, registroInicial, submitting }) {
  const [tipo, setTipo] = useState(registroInicial?.tipo || TIPOS[0]);
  const [fecha, setFecha] = useState(registroInicial?.fecha || new Date().toISOString().slice(0, 10));
  const [notas, setNotas] = useState(registroInicial?.notas || '');
  const [prioridad, setPrioridad] = useState(registroInicial?.prioridad || 'media');
  const [detalles, setDetalles] = useState(registroInicial?.detalles || {});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!registroInicial) {
      setDetalles({});
    }
  }, [tipo]);

  if (!isOpen) return null;

  const campos = CAMPOS_POR_TIPO[tipo];

  const handleCampoChange = (key, value) => {
    setDetalles((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (campo, value) => {
    handleCampoChange(campo.key, value === 'Otro' ? '' : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!fecha) {
      setError('La fecha es obligatoria');
      return;
    }

    const camposNumericos = campos.filter((c) => c.type === 'number');
    const hayInvalido = camposNumericos.some((c) => {
      const val = detalles[c.key];
      if (val === undefined || val === '') return false;
      const num = Number(val);
      return !Number.isFinite(num) || num < 0 || num > 999999;
    });

    if (hayInvalido) {
      setError('Los valores numéricos deben ser razonables (sin notación científica ni negativos)');
      return;
    }

    const campoPrincipal = CAMPO_VALOR_PRINCIPAL[tipo];
    const valorPrincipal = Number(detalles[campoPrincipal]) || 0;

    const hoy = new Date().toISOString().slice(0, 10);
    const estado = registroInicial?.estado ?? (fecha > hoy ? 'pendiente' : 'completado');

    onGuardar({
      tipo,
      fecha,
      notas,
      prioridad,
      estado,
      valor: valorPrincipal,
      detalles,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {registroInicial ? 'Editar registro' : 'Nuevo registro'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={!!registroInicial}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Prioridad
            </label>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
            >
              {PRIORIDADES.map((p) => (
                <option key={p.valor} value={p.valor}>
                  {p.etiqueta}
                </option>
              ))}
            </select>
          </div>

          {campos.map((campo) => (
            <div key={campo.key}>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                {campo.label}
              </label>

              {campo.type === 'number' && (
                <input
                  type="number"
                  min="0"
                  value={detalles[campo.key] ?? ''}
                  onChange={(e) => handleCampoChange(campo.key, e.target.value)}
                  onKeyDown={(e) => {
                    if (['e', 'E', '+', '-'].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              )}

              {campo.type === 'text' && (
                <input
                  type="text"
                  value={detalles[campo.key] ?? ''}
                  onChange={(e) => handleCampoChange(campo.key, e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                />
              )}

              {campo.type === 'select' && (
                <>
                  <select
                    value={
                      campo.opciones.includes(detalles[campo.key])
                        ? detalles[campo.key]
                        : detalles[campo.key]
                        ? 'Otro'
                        : ''
                    }
                    onChange={(e) => handleSelectChange(campo, e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {campo.opciones.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>

                  {!campo.opciones.includes(detalles[campo.key]) &&
                    detalles[campo.key] !== undefined && (
                      <input
                        type="text"
                        placeholder="Especifica..."
                        value={detalles[campo.key] ?? ''}
                        onChange={(e) => handleCampoChange(campo.key, e.target.value)}
                        className="mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
                      />
                    )}
                </>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              Notas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-slate-100"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}