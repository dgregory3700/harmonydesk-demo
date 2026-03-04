import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoFetchGuard } from "@/components/demo/DemoFetchGuard";

export const metadata: Metadata = {
  title: "HarmonyDesk Demo",
  description: "Read-only demo dashboard for HarmonyDesk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script id="rewardful-init" strategy="afterInteractive">
          {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`}
        </Script>
        <Script
          async
          src="https://r.wdfl.co/rw.js"
          data-rewardful="d91f66"
          strategy="afterInteractive"
        />
      </head>

      <body
        className="antialiased min-h-screen flex flex-col bg-slate-950 text-slate-200"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        <DemoFetchGuard />
        <DemoBanner />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
