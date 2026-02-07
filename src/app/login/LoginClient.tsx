"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginClient({ loadingOverride }: { loadingOverride?: boolean }) {
  const router = useRouter();

  if (loadingOverride) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-100">
            HarmonyDesk Demo
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This is a read-only demo. No authentication required.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
          <p className="mb-4 text-sm text-slate-300">
            Welcome to the HarmonyDesk demo! Click below to explore the dashboard with sample data.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            Enter Demo Dashboard
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          All data is read-only. No changes will be saved.
        </p>
      </div>
    </div>
  );
}
