"use client";

import { useEffect, useMemo, useState } from "react";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { DemoDocumentTemplate } from "@/lib/demo/data/documents";
import type { MediationCase } from "@/lib/demo/data/cases";
import type { MediationSession } from "@/lib/demo/data/sessions";

// Tokens the live app auto-fills from the selected case + session + mediator
// profile. In the demo these render as auto-filled chips (read-only);
// everything else is a manual field. Kept in sync with the live generate flow.
const AUTO_TOKENS = new Set([
  "{{case_number}}",
  "{{petitioner_name}}",
  "{{respondent_name}}",
  "{{matter_type}}",
  "{{county}}",
  "{{session_date}}",
  "{{session_date_long}}",
  "{{session_year}}",
  "{{agreement_day}}",
  "{{session_time}}",
  "{{mediator_name}}",
  "{{mediator_email}}",
  "{{mediator_phone}}",
  "{{mediator_business_name}}",
  "{{mediator_business_address}}",
]);

type View = "library" | "generate";

export default function DocumentsPage() {
  const [templates, setTemplates] = useState<DemoDocumentTemplate[]>([]);
  const [cases, setCases] = useState<MediationCase[]>([]);
  const [sessions, setSessions] = useState<MediationSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<View>("library");
  const [activeTemplate, setActiveTemplate] =
    useState<DemoDocumentTemplate | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [manualFields, setManualFields] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const [t, c, s] = await Promise.all([
          demoDataClient.getDocumentTemplates(),
          demoDataClient.getCases(),
          demoDataClient.getSessions(),
        ]);
        if (cancelled) return;
        setTemplates(t);
        setCases(c.filter((x) => x.status === "Active"));
        setSessions(s);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const caseById = useMemo(() => {
    const m = new Map<string, MediationCase>();
    for (const c of cases) m.set(c.id, c);
    return m;
  }, [cases]);

  function startGenerate(t: DemoDocumentTemplate) {
    setActiveTemplate(t);
    setSelectedCaseId("");
    setSelectedSessionId("");
    const manual: Record<string, string> = {};
    for (const tok of t.tokens) {
      if (!AUTO_TOKENS.has(tok)) manual[tok] = "";
    }
    setManualFields(manual);
    setView("generate");
  }

  const autoTokensInTemplate = useMemo(() => {
    if (!activeTemplate) return [] as string[];
    return activeTemplate.tokens.filter((tok) => AUTO_TOKENS.has(tok));
  }, [activeTemplate]);

  function formatSessionLabel(s: MediationSession): string {
    const c = caseById.get(s.caseId);
    const who = c?.parties?.split(",")[0]?.trim() || c?.matter || "Session";
    const when = new Date(s.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${who} · ${when}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">Court Documents</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload your court templates. Generate filled documents from your
            cases and sessions. Demo mode — sample data (read-only).
          </p>
        </div>
        {view === "library" && (
          <DemoDisable message="Demo mode — uploading templates is available in your live workspace.">
            <button className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition">
              + Upload Template
            </button>
          </DemoDisable>
        )}
      </div>

      {view === "library" && (
        <div className="space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 hover:border-slate-700 transition"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {[t.county, t.court].filter(Boolean).join(" · ") ||
                    "No county/court set"}
                  {" · "}
                  {t.tokens.length} token{t.tokens.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => startGenerate(t)}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white transition"
                >
                  Generate
                </button>
                <DemoDisable message="Demo mode — deleting templates is available in your live workspace.">
                  <button className="rounded-lg border border-slate-700 hover:border-red-800 hover:text-red-400 px-3 py-1.5 text-xs text-slate-400 transition">
                    Delete
                  </button>
                </DemoDisable>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "generate" && activeTemplate && (
        <div className="space-y-5 max-w-lg">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("library")}
              className="text-xs text-slate-400 hover:text-slate-200 transition"
            >
              ← Back
            </button>
            <h2 className="text-base font-semibold text-slate-100">
              {activeTemplate.name}
            </h2>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-400">
              Case — auto-fills parties, case number, matter
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">— No case —</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber}
                  {c.parties ? ` · ${c.parties}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-400">
              Session — auto-fills date, time
            </label>
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">— No session —</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatSessionLabel(s)}
                </option>
              ))}
            </select>
          </div>

          {autoTokensInTemplate.length > 0 && (
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
                Auto-filled from case + session + your profile
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {autoTokensInTemplate.map((tok) => (
                  <span
                    key={tok}
                    className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
                  >
                    {activeTemplate.token_labels?.[tok] ?? tok}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(manualFields).length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                Fill in remaining fields
              </p>
              {Object.keys(manualFields).map((tok) => {
                const label =
                  activeTemplate.token_labels?.[tok] ||
                  tok
                    .replace(/[{}]/g, "")
                    .split("_")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ");
                return (
                  <div key={tok} className="space-y-1">
                    <label className="block text-xs text-slate-400">{label}</label>
                    <input
                      type="text"
                      value={manualFields[tok] || ""}
                      onChange={(e) =>
                        setManualFields((f) => ({ ...f, [tok]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                      placeholder={label}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <DemoDisable message="Demo mode — generating documents is available in your live workspace.">
            <button className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition">
              Generate & Download
            </button>
          </DemoDisable>
        </div>
      )}
    </div>
  );
}
