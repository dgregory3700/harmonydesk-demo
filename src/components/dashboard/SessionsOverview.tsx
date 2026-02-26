// src/components/dashboard/SessionsOverview.tsx

type MediationSession = {
  id: string;
  caseId: string;
  date: string; // ISO
  completed: boolean;
  durationHours?: number;
  notes?: string | null;
  caseLabel?: string;
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SessionsOverview({
  sessions = [],
}: {
  sessions?: MediationSession[];
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-200">
          Upcoming sessions
        </h2>
        <span className="text-[11px] text-slate-400">Next few sessions</span>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
          <p className="text-sm text-slate-400">No upcoming sessions.</p>
          <p className="mt-1 text-[11px] text-slate-500">
            In production, sessions are created from the Calendar or inside a case file.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-slate-700 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-400">
                  {formatWhen(s.date)}
                  {typeof s.durationHours === "number" && s.durationHours > 0
                    ? ` • ${s.durationHours}h`
                    : ""}
                </p>

                <p className="text-sm font-medium text-slate-200 truncate">
                  {s.caseLabel || `Case ${s.caseId}`}
                </p>

                {s.notes ? (
                  <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2">
                    {s.notes}
                  </p>
                ) : (
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    —
                  </p>
                )}
              </div>

              <span
                className={`mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                  s.completed
                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border-sky-500/20 bg-sky-500/10 text-sky-400"
                }`}
              >
                {s.completed ? "Completed" : "Upcoming"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
