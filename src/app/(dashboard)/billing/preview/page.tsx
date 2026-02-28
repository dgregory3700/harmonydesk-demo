import Link from "next/link";

const STRIPE_CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "";

const COUNTY_META: Record<
  string,
  { name: string; format: string; nextDue: string }
> = {
  "king-wa": {
    name: "King County Superior Court",
    format: "Summary by case (hours + outcome)",
    nextDue: "End of month",
  },
  "pierce-wa": {
    name: "Pierce County District Court",
    format: "One line per session",
    nextDue: "15th of next month",
  },
  "snohomish-wa": {
    name: "Snohomish County Superior Court",
    format: "Grouped by case with totals",
    nextDue: "End of quarter",
  },
};

function getCounty(countyId: string | undefined) {
  if (!countyId) return null;
  return COUNTY_META[countyId] ? { id: countyId, ...COUNTY_META[countyId] } : null;
}

export default function BillingPreviewPage({
  searchParams,
}: {
  searchParams: { county?: string };
}) {
  const county = getCounty(searchParams?.county);
  const title = county ? county.name : "County report preview";
  const subtitle = county
    ? `${county.format} • Next due: ${county.nextDue}`
    : "Sample preview (demo)";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            {title}
          </h1>
          <p className="text-sm text-slate-400">{subtitle}</p>
          <p className="mt-2 text-sm text-slate-400">
            This is a <span className="font-medium text-slate-200">sample preview</span>{" "}
            shown in the demo. Your paid dashboard generates real reports from your
            case and invoice data.
          </p>
        </div>

        <Link
          href="/billing"
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
        >
          Back to Billing
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-200">
            Sample report output (demo)
          </h2>

          <Link
            href={STRIPE_CHECKOUT_URL || "#"}
            className={[
              "rounded-md px-3 py-1.5 text-sm font-semibold",
              STRIPE_CHECKOUT_URL
                ? "bg-sky-500 text-slate-950 hover:opacity-90"
                : "bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed",
            ].join(" ")}
            aria-disabled={!STRIPE_CHECKOUT_URL}
            onClick={(e) => {
              if (!STRIPE_CHECKOUT_URL) e.preventDefault();
            }}
            title={
              STRIPE_CHECKOUT_URL
                ? "Start HarmonyDesk"
                : "Set NEXT_PUBLIC_STRIPE_CHECKOUT_URL in Vercel"
            }
          >
            Start HarmonyDesk
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-slate-200">
                <th className="px-2 py-1 font-medium">Case #</th>
                <th className="px-2 py-1 font-medium">Matter</th>
                <th className="px-2 py-1 font-medium">Hours</th>
                <th className="px-2 py-1 font-medium">Total</th>
                <th className="px-2 py-1 font-medium">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  caseNumber: "CASE-014",
                  matter: "Smith vs Turner",
                  hours: "3.00",
                  total: "$750.00",
                  outcome: "Settled",
                },
                {
                  caseNumber: "CASE-021",
                  matter: "Lopez Parenting Plan",
                  hours: "2.50",
                  total: "$625.00",
                  outcome: "Partial",
                },
                {
                  caseNumber: "CASE-033",
                  matter: "Wang Contract Dispute",
                  hours: "4.00",
                  total: "$1,000.00",
                  outcome: "Continued",
                },
              ].map((row) => (
                <tr
                  key={row.caseNumber}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                >
                  <td className="px-2 py-1">{row.caseNumber}</td>
                  <td className="px-2 py-1">{row.matter}</td>
                  <td className="px-2 py-1">{row.hours}</td>
                  <td className="px-2 py-1">{row.total}</td>
                  <td className="px-2 py-1">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[11px] text-slate-500">
          Demo mode: this preview is static and does not export files or save reporting status.
        </p>
      </div>
    </div>
  );
}
