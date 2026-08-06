import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRegistros } from "../hooks/useRegistros";

export default function Dashboard() {
  const { registros, loading } = useRegistros();

  // Agrupa el total de "valor" por tipo de actividad
  const totalesPorTipo = registros.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] || 0) + Number(r.valor);
    return acc;
  }, {});
  const dataGrafica = Object.entries(totalesPorTipo).map(([tipo, total]) => ({
    tipo,
    total,
  }));

  // Promedio general de "valor" entre todos los registros
  const promedioValor =
    registros.length > 0
      ? (
          registros.reduce((sum, r) => sum + Number(r.valor), 0) / registros.length
        ).toFixed(1)
      : 0;

  // Cuenta cuántas veces se repite cada tipo (no el total acumulado)
  const conteoPorTipo = registros.reduce((acc, r) => {
    acc[r.tipo] = (acc[r.tipo] || 0) + 1;
    return acc;
  }, {});

  // Tipo de actividad que más se repite
  const tipoMasFrecuente =
    Object.entries(conteoPorTipo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Agrupa el total de "valor" por fecha
  const totalesPorFecha = registros.reduce((acc, r) => {
    acc[r.fecha] = (acc[r.fecha] || 0) + Number(r.valor);
    return acc;
  }, {});

  // Convierte a array y ordena por fecha (más antigua a más reciente)
  const dataLinea = Object.entries(totalesPorFecha)
    .map(([fecha, total]) => ({ fecha, total }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Total de registros</p>
          <p className="text-2xl font-semibold text-brand-700">
            {registros.length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Tipos distintos</p>
          <p className="text-2xl font-semibold text-brand-700">
            {Object.keys(totalesPorTipo).length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Último registro</p>
          <p className="text-2xl font-semibold text-brand-700">
            {registros[0]?.fecha ?? "—"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Promedio</p>
          <p className="text-2xl font-semibold text-brand-700">
            {promedioValor}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Más frecuente</p>
          <p className="text-2xl font-semibold text-brand-700">
            {tipoMasFrecuente}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-medium text-slate-600">
          Total acumulado por tipo de actividad
        </p>
        {loading ? (
          <p className="text-slate-400">Cargando...</p>
        ) : dataGrafica.length === 0 ? (
          <p className="text-slate-400">Aún no hay datos suficientes.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataGrafica}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3866d6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-sm font-medium text-slate-600">
          Evolución en el tiempo
        </p>
        {loading ? (
          <p className="text-slate-400">Cargando...</p>
        ) : dataLinea.length === 0 ? (
          <p className="text-slate-400">Aún no hay datos suficientes.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLinea}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3866d6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}