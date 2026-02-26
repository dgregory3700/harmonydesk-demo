"use client";

import Link from "next/link";

export default function NewCasePage() {
  return (
    <div className="space-y-6">
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
            Demo mode — sample data (read-only).
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm space-y-3">
        <p className="text-sm text-slate-200 font-medium">
          Case creation is disabled in the demo.
        </p>

        <p className="text-sm text-slate-400">
          This demo is a sales artifact, not a sandbox. We disable creation/editing to avoid any misleading “fake save” behavior.
        </p>

        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
          <p className="font-medium text-slate-300 mb-2">Production truth</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Cases have two states only: <span className="text-slate-200">Active</span> or <span className="text-slate-200">Closed</span>.</li>
            <li>“Upcoming” is session-level only (Calendar / Session history).</li>
            <li>Counties are defined in Settings and reused everywhere (no free-text counties).</li>
            <li>Lifecycle hygiene uses Archive (soft-hide), not delete.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link
            href="/cases"
            className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            Return to Cases
          </Link>
        </div>
      </div>
    </div>
  );
}
