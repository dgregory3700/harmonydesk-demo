export default function InvoicesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-100">Invoices</h2>
      <p className="text-sm text-slate-400">
        Demo mode — read-only. Sample invoice data will appear here.
      </p>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-sm text-slate-300">
          This is a placeholder demo page. Next step is wiring local TS demo data
          to match the production invoices UI.
        </p>
      </div>
    </div>
  );
}
