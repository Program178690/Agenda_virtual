import {
  BarChart,
  Bar,
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
    </div>
  );
}
