import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRegistros } from "../hooks/useRegistros";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: es }),
  getDay,
  locales,
});

export default function Calendario() {
  const { registros, loading } = useRegistros();

  // Convierte cada registro en un "evento" que el calendario pueda mostrar
  const eventos = registros.map((r) => ({
    id: r.id,
    title: `${r.tipo}: ${r.valor}`,
    start: new Date(`${r.fecha}T00:00:00`),
    end: new Date(`${r.fecha}T23:59:59`),
    allDay: true,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-800">Calendario</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {loading ? (
          <p className="text-slate-400">Cargando...</p>
        ) : (
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            culture="es"
          />
        )}
      </div>
    </div>
  );
}
