import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { DemoBanner } from "@/components/demo/DemoBanner";
import { DemoFetchGuard } from "@/components/demo/DemoFetchGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-950 text-slate-200`}
      >
        <DemoFetchGuard />
        <DemoBanner />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
