"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { MediationCase } from "@/lib/demo/data/cases";

type CaseStatusUI = "Active" | "Closed";

function toUiStatus(c: MediationCase): CaseStatusUI {
  // Demo data may still contain legacy statuses (Open/Upcoming/Closed).
  // Production truth: cases are Active/Closed only.
  return c.status === "Closed" ? "Closed" : "Active";
}

export default function CasesPage() {
  const [cases, setCases] = useState<MediationCase[]>([]);
  const [statusFilter, setStatusFilter] = useState<CaseStatusUI | "All">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        setError(null);

        const data = await demoDataClient.getCases();
        setCases(data);
      } catch (err: any) {
        console.error("Error loading cases:", err);
        setError(err?.message ?? "Failed to load cases");
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  const filteredCases = useMemo(() => {
    const q = search.toLowerCase().trim();

    return cases.filter((c) => {
      const uiStatus = toUiStatus(c);
      const matchesStatus = statusFilter === "All" ? true : uiStatus === statusFilter;

      const haystack = (
        c.caseNumber +
        " " +
        c.matter +
        " " +
        c.parties +
        " " +
        c.county
      ).toLowerCase();

      const matchesSearch = q ? haystack.includes(q) : true;

      return matchesStatus && matchesSearch;
    });
  }, [cases, statusFilter, search]);

  const activeCount = cases.filter((c) => toUiStatus(c) === "Active").length;
  const closedCount = cases.filter((c) => toUiStatus(c) === "Closed").length;
  const totalCount = cases.length;

  function formatDate(value?: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
            Cases
          </h1>
          <p className="text-sm text-slate-400">
            Demo mode — sample data (read-only). Cases are containers. Sessions are the work. “Upcoming” is session-level only.
          </p>
        </div>

        <Link
  href="/cases/new"
  className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
>
  + New case
</Link>
      </div>

      {/* Overview stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Active cases</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {activeCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            In progress (production: Active).
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Closed cases</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {closedCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Finished matters (production: Closed).
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Total cases</p>
          <p className="mt-2 text-2xl font-semibold text-slate-100">
            {totalCount}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Demo sample set size.
          </p>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Status:</span>

          {(["All", "Active", "Closed"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status as any)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                statusFilter === status
                  ? "border-sky-500/50 bg-sky-500/10 text-sky-400"
                  : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by case, parties, county…"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>

      {/* Case list */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-medium text-slate-300">Case list</h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading cases…</p>
        ) : error ? (
          <p className="text-sm text-red-400">
            {error || "Something went wrong loading cases."}
          </p>
        ) : filteredCases.length === 0 ? (
          <p className="text-sm text-slate-500">
            No cases match your filters. Try clearing the search or switching status tabs.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((c) => {
              const uiStatus = toUiStatus(c);

              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3 md:flex-row md:items-center md:justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-200">
                      {c.matter}
                    </p>
                    <p className="text-xs text-slate-400">
                      {c.caseNumber} • {c.parties}
                    </p>
                    <p className="text-xs text-slate-500">{c.county}</p>
                    {c.notes && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {c.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-2 text-xs md:items-end">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                          uiStatus === "Active"
                            ? "border-sky-500/20 bg-sky-500/10 text-sky-400"
                            : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {uiStatus}
                      </span>

                      <span className="text-slate-500">
                        Next session: {formatDate(c.nextSessionDate)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/cases/${c.id}`}
                        className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      >
                        View case file
                      </Link>

                      <DemoDisable>
                        <button
                          type="button"
                          disabled
                          className="rounded-md border border-slate-700 bg-transparent px-3 py-1 text-xs font-medium text-slate-400 disabled:opacity-60"
                        >
                          Create invoice
                        </button>
                      </DemoDisable>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500 shadow-sm">
        <p className="font-medium mb-1 text-slate-400">Demo truth</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Cases only have two states: <span className="text-slate-300">Active</span> or <span className="text-slate-300">Closed</span>.</li>
          <li>“Upcoming” is a session status, not a case status.</li>
          <li>Edits/archiving are disabled in the demo. Production supports Archive (soft-hide), not delete.</li>
        </ul>
      </div>
    </div>
  );
}
