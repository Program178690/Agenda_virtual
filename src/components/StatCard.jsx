export default function StatCard({ titulo, valor }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{titulo}</p>
      <p className="text-2xl font-semibold text-brand-700">{valor}</p>
    </div>
  );
}