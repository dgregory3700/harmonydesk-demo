"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { MediationCase } from "@/lib/demo/data/cases";

type CaseStatusUI = "Active" | "Closed";

function toUiStatus(c: MediationCase): CaseStatusUI {
  return c.status === "Closed" ? "Closed" : "Active";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = (params?.id as string) || "";

  const [allCases, setAllCases] = useState<MediationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await demoDataClient.getCases();
        setAllCases(data);
      } catch (err: any) {
        console.error("Error loading demo cases:", err);
        setError(err?.message ?? "Failed to load case");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [caseId]);

  const caseData = useMemo(() => {
    return allCases.find((c) => c.id === caseId) ?? null;
  }, [allCases, caseId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Link
          href="/cases"
          className="text-xs text-slate-400 hover:text-slate-200 hover:underline transition-colors"
        >
          ← Back to cases
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-400">Loading case…</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="space-y-4">
        <Link
          href="/cases"
          className="text-xs text-slate-400 hover:text-slate-200 hover:underline transition-colors"
        >
          ← Back to cases
        </Link>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm text-red-400">
            {error || "Case not found."}
          </p>
        </div>
      </div>
    );
  }

  const uiStatus = toUiStatus(caseData);

  const badgeClass =
    uiStatus === "Active"
      ? "border border-sky-500/20 bg-sky-500/10 text-sky-400"
      : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

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

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
              {caseData.matter}
            </h1>
            <p className="text-sm text-slate-400">
              Case number: {caseData.caseNumber}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Demo mode — sample data (read-only). No edits or saving.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${badgeClass}`}
            >
              {uiStatus}
            </span>
            <span className="text-slate-400">
              Next session: {formatDate(caseData.nextSessionDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Left */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
            <h2 className="text-sm font-medium mb-2 text-slate-200">
              Case information
            </h2>

            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Parties</p>
                <p className="text-slate-300">{caseData.parties}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">County</p>
                <p className="text-slate-300">{caseData.county}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Matter</p>
                <p className="text-slate-300">{caseData.matter}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-slate-300">{uiStatus}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-slate-200">Notes</h2>
              <span className="text-[11px] text-slate-500">
                Read-only in demo.
              </span>
            </div>

            <div className="rounded-md border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
              {caseData.notes ? (
                <p className="whitespace-pre-wrap">{caseData.notes}</p>
              ) : (
                <p className="text-slate-500">—</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500 shadow-sm">
            <p className="font-medium mb-1 text-slate-400">Production truth</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Cases are containers (Active/Closed only).</li>
              <li>“Upcoming” is a session state. Sessions live on Calendar and inside the case file in production.</li>
              <li>Lifecycle hygiene is Archive (soft-hide), not delete.</li>
            </ul>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm">
            <h2 className="text-sm font-medium mb-3 text-slate-200">Actions</h2>

            <DemoDisable>
              <button
                type="button"
                disabled
                className="mb-2 w-full rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
              >
                Save changes
              </button>
            </DemoDisable>

            <DemoDisable>
              <button
                type="button"
                disabled
                className="mb-2 w-full rounded-md border border-slate-700 bg-transparent px-3 py-2 text-xs font-medium text-slate-300 disabled:opacity-60"
              >
                Add session
              </button>
            </DemoDisable>

            <DemoDisable>
              <button
                type="button"
                disabled
                className="w-full rounded-md border border-slate-700 bg-transparent px-3 py-2 text-xs font-medium text-slate-300 disabled:opacity-60"
              >
                Create invoice from this case
              </button>
            </DemoDisable>

            <p className="mt-3 text-[11px] text-slate-500">
              Demo mode — read-only. These actions work in production but are disabled here to avoid any misleading “fake save” behavior.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-500 shadow-sm">
            <p className="font-medium mb-1 text-slate-400">Archive/Delete</p>
            <p>
              Demo does not allow lifecycle changes. In production, closed cases can be archived (soft-hide). Delete is not the default lifecycle path.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
