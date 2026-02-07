"use client";

import Link from "next/link";

const STRIPE_CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL ?? "";

export function DemoBanner() {
  return (
    <div className="w-full border-b bg-amber-50 text-amber-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <div className="text-sm font-medium">Demo — Sample data (read-only)</div>

        <Link
          href={STRIPE_CHECKOUT_URL || "#"}
          className={[
            "rounded-md px-3 py-1.5 text-sm font-semibold",
            STRIPE_CHECKOUT_URL
              ? "bg-amber-900 text-white hover:opacity-90"
              : "bg-amber-200 text-amber-900 opacity-60 cursor-not-allowed",
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
    </div>
  );
}

