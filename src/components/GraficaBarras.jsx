import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GraficaBarras({ data, loading }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
        Total acumulado por tipo de actividad
      </p>
      {loading ? (
        <p className="text-slate-400">Cargando...</p>
      ) : data.length === 0 ? (
        <p className="text-slate-400">Aún no hay datos suficientes.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tipo" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3866d6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}