"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { UserSettings } from "@/lib/demo/data/settings";
import type { County } from "@/lib/demo/data/counties";
import { demoCounties } from "@/lib/demo/data/counties";

const TIMEZONE_OPTIONS = [
  { value: "America/Los_Angeles", label: "Pacific – America/Los_Angeles" },
  { value: "America/Denver", label: "Mountain – America/Denver" },
  { value: "America/Chicago", label: "Central – America/Chicago" },
  { value: "America/New_York", label: "Eastern – America/New_York" },
  { value: "America/Anchorage", label: "Alaska – America/Anchorage" },
  { value: "Pacific/Honolulu", label: "Hawaii – Pacific/Honolulu" },
  { value: "UTC", label: "UTC" },
];

type Banner =
  | { kind: "success"; text: string }
  | { kind: "error"; text: string }
  | null;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<Banner>(null);

  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [counties, setCounties] = useState<County[]>([]);

  // General settings form state (mirrors production)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [defaultHourlyRate, setDefaultHourlyRate] = useState<number | string>(
    200
  );
  const [defaultSessionDuration, setDefaultSessionDuration] = useState<
    number | string
  >(1.0);
  const [timezone, setTimezone] = useState("America/Los_Angeles");

  // County settings (mirrors production)
  const [defaultCountyId, setDefaultCountyId] = useState<string | null>(null);

  // Add county form (present for parity, disabled in demo)
  const [newCountyName, setNewCountyName] = useState("");
  const [newCountyFormat, setNewCountyFormat] = useState<"csv" | "pdf">("csv");

  const countiesById = useMemo(() => {
    const m = new Map<string, County>();
    for (const c of counties) m.set(c.id, c);
    return m;
  }, [counties]);

  const timezoneIsKnown = useMemo(() => {
    return TIMEZONE_OPTIONS.some((tz) => tz.value === timezone);
  }, [timezone]);

  async function loadAll() {
    setLoading(true);
    setBanner(null);

    try {
      // Demo: settings from demo data client; counties from local demo list
      const [s] = await Promise.all([demoDataClient.getUserSettings()]);

      setSettings(s);
      setCounties(demoCounties);

      setFullName(s.fullName ?? "");
      setPhone(s.phone ?? "");
      setBusinessName(s.businessName ?? "");
      setBusinessAddress(s.businessAddress ?? "");
      setDefaultHourlyRate(
        s.defaultHourlyRate !== null && s.defaultHourlyRate !== undefined
          ? s.defaultHourlyRate
          : 200
      );
      setDefaultSessionDuration(
        s.defaultSessionDuration !== null && s.defaultSessionDuration !== undefined
          ? s.defaultSessionDuration
          : 1.0
      );
      setTimezone(s.timezone ?? "America/Los_Angeles");

      // Default county: prefer new uuid field, fall back to first demo county
      const initialDefaultCountyId =
        s.defaultCountyId ?? (demoCounties.length > 0 ? demoCounties[0].id : null);
      setDefaultCountyId(initialDefaultCountyId);
    } catch (err: any) {
      console.error(err);
      setBanner({
        kind: "error",
        text: err?.message ? String(err.message) : "Failed to load settings",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function demoReadOnlyNotice(text: string) {
    setBanner({ kind: "success", text });
    // keep it subtle; do not pretend to persist
    setTimeout(() => setBanner(null), 2500);
  }

  const defaultCountyLabel = defaultCountyId
    ? countiesById.get(defaultCountyId)?.name || "Unknown county"
    : "None";

  return (
    <div className="space-y-6">
      <DashboardGreeting />

      {banner && (
        <div
          className={[
            "rounded-xl border p-4",
            banner.kind === "success"
              ? "border-emerald-800 bg-emerald-900/20"
              : "border-red-800 bg-red-900/20",
          ].join(" ")}
        >
          <p
            className={[
              "text-sm font-medium",
              banner.kind === "success" ? "text-emerald-200" : "text-red-200",
            ].join(" ")}
          >
            {banner.kind === "success" ? "Demo" : "Error"}
          </p>
          <p
            className={[
              "mt-1 text-sm",
              banner.kind === "success"
                ? "text-emerald-100/90"
                : "text-red-100/90",
            ].join(" ")}
          >
            {banner.text}
          </p>
        </div>
      )}

      {loading && <p className="text-sm text-slate-500">Loading…</p>}

      {/* GENERAL SETTINGS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <h1 className="text-lg font-semibold text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage defaults and operational preferences. Demo mode — sample data (read-only).
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            demoReadOnlyNotice("Demo mode — settings are read-only.");
          }}
          className="mt-4 grid gap-4"
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Full name
              </label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Phone
              </label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Business name
              </label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Mediation Practice LLC"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Business address
              </label>
              <input
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Street, City, State"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Default hourly rate
              </label>
              <input
                type="number"
                min="0"
                step="1"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={defaultHourlyRate}
                onChange={(e) => setDefaultHourlyRate(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Default session duration (hours)
              </label>
              <input
                type="number"
                min="0"
                step="0.25"
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={defaultSessionDuration}
                onChange={(e) => setDefaultSessionDuration(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Timezone
              </label>
              <select
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="">Select timezone…</option>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
                {!!timezone && !timezoneIsKnown && (
                  <option value={timezone}>{timezone} (custom)</option>
                )}
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Used for session times and calendar views.
              </p>
            </div>

            {/* Dark mode toggle intentionally absent (theme is fixed). */}
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => loadAll()}
              className="rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Reload
            </button>

            <DemoDisable>
              <button
                type="submit"
                className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
              >
                Save settings
              </button>
            </DemoDisable>
          </div>
        </form>
      </div>

      {/* COUNTY SETTINGS */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-sm font-semibold text-slate-200">
          County reporting
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Counties drive deterministic exports and invoice binding. Demo mode — read-only.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {/* Default county */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xs font-medium text-slate-300">Default county</p>
            <p className="mt-1 text-[11px] text-slate-500">
              Current:{" "}
              <span className="text-slate-200">{defaultCountyLabel}</span>
            </p>

            <div className="mt-3 flex items-center gap-2">
              <select
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                value={defaultCountyId ?? ""}
                onChange={(e) => setDefaultCountyId(e.target.value || null)}
                disabled={counties.length === 0}
              >
                {counties.length === 0 ? (
                  <option value="">No counties configured</option>
                ) : (
                  <>
                    <option value="">None</option>
                    {counties.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.reportFormat.toUpperCase()})
                      </option>
                    ))}
                  </>
                )}
              </select>

              <DemoDisable>
                <button
                  type="button"
                  className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 disabled:opacity-60"
                  onClick={() =>
                    demoReadOnlyNotice("Demo mode — default county is read-only.")
                  }
                >
                  Save
                </button>
              </DemoDisable>
            </div>
          </div>

          {/* Add county */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
            <p className="text-xs font-medium text-slate-300">Add county</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                demoReadOnlyNotice("Demo mode — counties are read-only.");
              }}
              className="mt-3 space-y-2"
            >
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">
                  County name
                </label>
                <input
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                  value={newCountyName}
                  onChange={(e) => setNewCountyName(e.target.value)}
                  placeholder="e.g. King County"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-400">
                  Report format
                </label>
                <select
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
                  value={newCountyFormat}
                  onChange={(e) =>
                    setNewCountyFormat(e.target.value as "csv" | "pdf")
                  }
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <DemoDisable>
                <button
                  type="submit"
                  className="rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500"
                >
                  Add county
                </button>
              </DemoDisable>
            </form>
          </div>
        </div>

        {/* County list */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-300">Counties</p>
            <p className="text-[11px] text-slate-500">{counties.length} configured</p>
          </div>

          {counties.length === 0 ? (
            <p className="mt-2 text-xs text-slate-500">
              No counties yet. (Demo mode)
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {counties.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-200">{c.name}</p>
                    <p className="text-[11px] text-slate-500">
                      Format: {c.reportFormat.toUpperCase()}
                    </p>
                  </div>

                  <DemoDisable>
                    <button
                      type="button"
                      onClick={() =>
                        demoReadOnlyNotice("Demo mode — delete is disabled.")
                      }
                      className="rounded-md border border-slate-700 bg-transparent px-3 py-1 text-xs font-medium text-red-400 hover:border-red-800 hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </DemoDisable>
                </div>
              ))}
            </div>
          )}

          <p className="mt-3 text-[11px] text-slate-500">
            Demo note: In production, counties are user-managed and bind invoices deterministically.
          </p>
        </div>
      </div>
    </div>
  );
}
