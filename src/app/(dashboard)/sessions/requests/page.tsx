// src/app/(dashboard)/sessions/requests/page.tsx
// Demo Session Requests inbox. Mirrors the live pro-dashboard surface (Cat 2G)
// but is fully disconnected: rows come from local seed data via demoDataClient,
// and approve/decline are read-only (no Resend, no backend).

import RequestsInboxClient from "./RequestsInboxClient";

export default function SessionRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">
          Session Requests
        </h1>
        <p className="text-sm text-slate-400">
          New requests from your public request page. Approve to schedule, or
          decline to send a polite no-thanks. Demo mode — sample data
          (read-only).
        </p>
      </div>

      <RequestsInboxClient />
    </div>
  );
}
