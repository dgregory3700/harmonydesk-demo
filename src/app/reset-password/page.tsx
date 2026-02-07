"use client";

import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-100">
            Demo Mode
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This is a read-only demo. Authentication is not available.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
          <p className="text-sm text-slate-300">
            Password reset is not available in demo mode. To access the demo dashboard, please visit:
          </p>
          <Link
            href="/dashboard"
            className="mt-4 block w-full rounded-md bg-sky-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500">
          <Link href="/login" className="text-sky-400 hover:text-sky-300">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
