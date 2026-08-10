import StatCard from "../components/StatCard";
import GraficaBarras from "../components/GraficaBarras";
import GraficaLinea from "../components/GraficaLinea";
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
        <StatCard titulo="Total de registros" valor={registros.length} />
        <StatCard titulo="Tipos distintos" valor={Object.keys(totalesPorTipo).length} />
        <StatCard titulo="Último registro" valor={registros[0]?.fecha ?? "—"} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard titulo="Promedio" valor={promedioValor} />
        <StatCard titulo="Más frecuente" valor={tipoMasFrecuente} />
      </div>

      <GraficaBarras data={dataGrafica} loading={loading} />
      <GraficaLinea data={dataLinea} loading={loading} />
    </div>
  );
}