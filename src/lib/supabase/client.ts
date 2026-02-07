// src/lib/supabase/client.ts
// Single Supabase browser client for the entire app.
// All "use client" components should import from here.
// Do NOT create additional browser clients anywhere else.

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-key";

declare global {
  // eslint-disable-next-line no-var
  var __harmonydeskSupabaseBrowser: SupabaseClient | undefined;
}

export const supabaseBrowser: SupabaseClient =
  globalThis.__harmonydeskSupabaseBrowser ??
  createBrowserClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // prevents URL/session re-processing issues
    },
  });

if (typeof window !== "undefined") {
  globalThis.__harmonydeskSupabaseBrowser = supabaseBrowser;
}
