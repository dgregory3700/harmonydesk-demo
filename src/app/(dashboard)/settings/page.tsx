"use client";

import { useEffect, useState, FormEvent } from "react";
import { demoDataClient } from "@/lib/demo/client";
import { DemoDisable } from "@/components/demo/DemoDisable";
import type { UserSettings } from "@/lib/demo/data/settings";

const TIMEZONE_OPTIONS = [
  { value: "America/Los_Angeles", label: "Pacific – America/Los_Angeles" },
  { value: "America/Denver", label: "Mountain – America/Denver" },
  { value: "America/Chicago", label: "Central – America/Chicago" },
  { value: "America/New_York", label: "Eastern – America/New_York" },
  { value: "America/Anchorage", label: "Alaska – America/Anchorage" },
  { value: "Pacific/Honolulu", label: "Hawaii – Pacific/Honolulu" },
  { value: "UTC", label: "UTC" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load settings from demo data
  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        setLoadError(null);

        const data = await demoDataClient.getUserSettings();
        setSettings(data);
      } catch (err: any) {
        console.error("Error loading settings:", err);
        setLoadError(err?.message ?? "Failed to load settings");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // In demo mode, form submission is blocked
    alert("Demo mode — read-only");
  }

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Settings
        </h1>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm text-slate-400">Loading settings…</p>
        </div>
      </div>
    );
  }

  if (loadError || !settings) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Settings
        </h1>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-sm text-red-400">
            {loadError || "Failed to load settings."}
          </p>
        </div>
      </div>
    );
  }

  const timezoneIsKnown = settings.timezone
    ? TIMEZONE_OPTIONS.some((tz) => tz.value === settings.timezone)
    : false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Settings
        </h1>
        <p className="text-sm text-slate-400">
          Configure your profile, business details, defaults, and subscription.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
        {/* Left: profile + business */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-medium text-slate-200">Profile</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">
                  Full name
                </label>
                <input
                  type="text"
                  value={settings.fullName ?? ""}
                  onChange={(e) => update("fullName", e.target.value || null)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-400">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone ?? ""}
                  onChange={(e) => update("phone", e.target.value || null)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-medium text-slate-200">
              Business details
            </h2>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Business name
              </label>
              <input
                type="text"
                value={settings.businessName ?? ""}
                onChange={(e) =>
                  update("businessName", e.target.value || null)
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="Example: HarmonyDesk Mediation Services"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Business address
              </label>
              <textarea
                value={settings.businessAddress ?? ""}
                onChange={(e) =>
                  update("businessAddress", e.target.value || null)
                }
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder={"Street\nCity, State ZIP"}
              />
            </div>
          </div>
        </div>

        {/* Right: defaults only (removed plan section) */}
        <div className="space-y-4">
          {/* Defaults */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-medium text-slate-200">Defaults</h2>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Default hourly rate
              </label>
              <input
                type="number"
                min={0}
                step={10}
                value={settings.defaultHourlyRate ?? ""}
                onChange={(e) =>
                  update(
                    "defaultHourlyRate",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="200"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Default county
              </label>
              <input
                type="text"
                value={settings.defaultCounty ?? ""}
                onChange={(e) =>
                  update("defaultCounty", e.target.value || null)
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="King County"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Default session duration (hours)
              </label>
              <input
                type="number"
                min={0.25}
                step={0.25}
                value={settings.defaultSessionDuration ?? ""}
                onChange={(e) =>
                  update(
                    "defaultSessionDuration",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="1.0"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-400">
                Timezone
              </label>
              <select
                value={settings.timezone ?? ""}
                onChange={(e) => update("timezone", e.target.value || null)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select timezone…</option>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
                {settings.timezone && !timezoneIsKnown && (
                  <option value={settings.timezone}>
                    {settings.timezone} (custom)
                  </option>
                )}
              </select>
              <p className="text-[11px] text-slate-500">
                Used for session times, calendar views, and reminders.
              </p>
            </div>
          </div>

          <DemoDisable>
            <button
              type="submit"
              className="w-full rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:opacity-60 transition-colors"
            >
              Save settings
            </button>
          </DemoDisable>
        </div>
      </form>
    </div>
  );
}
