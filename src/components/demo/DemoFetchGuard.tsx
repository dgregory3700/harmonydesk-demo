"use client";

import { useEffect } from "react";

export function DemoFetchGuard() {
  useEffect(() => {
    const orig = window.fetch.bind(window);

    window.fetch = async (...args: any[]) => {
      const url = String(args?.[0] ?? "");
      throw new Error(`DEMO MODE: fetch() blocked. Attempted request to: ${url}`);
    };

    return () => {
      window.fetch = orig;
    };
  }, []);

  return null;
}
