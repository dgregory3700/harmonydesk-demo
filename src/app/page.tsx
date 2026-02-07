// src/app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // Demo should land directly on the dashboard (no login in demo repo).
  redirect("/dashboard");
}
