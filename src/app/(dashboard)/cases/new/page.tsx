"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type CaseStatus = "Active" | "Closed";

type DemoCounty = {
  id: string;
  name: string;
};

const DEMO_COUNTIES: DemoCounty[] = [
  { id: "broward", name: "Broward County" },
  { id: "miami-dade", name: "Miami-Dade County" },
  { id: "palm-beach", name: "Palm Beach County" },
];

export default function NewCasePage() {
  const [caseNumber, setCaseNumber] = useState("");
  const [matter, setMatter] = useState("");
  const [parties, setParties] = useState("");

  const counties = DEMO_COUNTIES;
  const countiesById = useMemo(() => {
    const m = new Map<string, DemoCounty>();
    for (const c of counties) m.set(c.id, c);
    return m;
  }, [counties]);

  const [countyId, setCountyId] = useState<string>(counties[0]?.id ?? "");
  const [status, setStatus] = useState<CaseStatus>("Active");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Light validation purely for UX parity (still read-only)
    if (!caseNumber.trim() || !matter.trim() || !parties.trim()) {
      setError("Please fill in case number, matter, and parties.");
      return;
    }

    const selectedCounty = countiesById.get(countyId);
    if (!selectedCounty) {
      setError("Please select a county.");
      return;
    }

    // Demo truth: block mutation
    // eslint-disable-next-line no-alert
    alert("Demo mode — read-only");
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / back link */}
      <div className="flex flex-col gap-1">
        <Link
          href="/cases"
          className="text-xs text-slate-400 hover:text-slate-200 hover:underline transition-colors"
        >
          ← Back to cases
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            New case
          </h1>
          <p className="text-sm text-slate-400">
            Demo mode — sample data (read-only). Form is shown for parity; saving
            is disabled.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
        {/* Left: core details */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-medium text-slate-200">Case details</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">
                  Case number *
                </label>
                <input
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="HD-2025-004 or court case number"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">
                  County *
                </label>

                <select
                  value={countyId}
                  onChange={(e) => setCountyId(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  disabled={counties.length === 0}
                >
                  {counties.length === 0 ? (
                    <option value="">No counties configured</option>
                  ) : (
                    counties.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>

                <p className="text-[11px] text-slate-500">
                  Demo uses a fixed sample county list. Production counties come
                  from Settings.
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Matter / title *
              </label>
              <input
                type="text"
                value={matter}
                onChange={(e) => setMatter(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Smith vs. Turner – parenting plan"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Parties *
              </label>
              <input
                type="text"
                value={parties}
                onChange={(e) => setParties(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Alex Smith / Jamie Turner"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-slate-200">Notes</h2>
              <span className="text-[11px] text-slate-500">
                Optional — shown for parity.
              </span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Background, agreements, safety concerns, or anything you want handy."
            />
          </div>
        </div>

        {/* Right: status + submit */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-medium text-slate-200">Status</h2>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Case status
              </label>
              <select
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
              >
                <option value="Active">Active</option>
                <option value="Closed">Closed</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                “Upcoming” is tracked on Sessions (Calendar), not as a case
                status.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-3">
            <button
              type="submit"
              className="w-full rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 transition-colors"
            >
              Create case
            </button>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <p className="text-[11px] text-slate-500">
              Demo mode: submission is blocked. Production creates the case and
              routes to the case file.
            </p>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-500">
              <p className="font-medium text-slate-300 mb-1">Production truth</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Cases are Active/Closed only.</li>
                <li>Counties are defined in Settings and reused everywhere.</li>
                <li>Lifecycle hygiene uses Archive (soft-hide), not delete.</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
