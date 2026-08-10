export default function StatCard({ titulo, valor }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm text-slate-500 dark:text-slate-400">{titulo}</p>
      <p className="text-2xl font-semibold text-brand-700 dark:text-brand-400">{valor}</p>
    </div>
  );
}