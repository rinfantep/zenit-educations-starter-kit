import { ClipboardCheck, TrendingUp, Wallet } from "lucide-react";

type Evaluation = {
  id: string;
  subject: string;
  period: string;
  score: number;
  maxScore: number;
};

export function ChildCard({
  name,
  code,
  className,
  attendanceRate,
  avgScore,
  pendingBalance,
  recentEvaluations,
}: {
  name: string;
  code: string;
  className: string;
  attendanceRate: number | null;
  avgScore: number | null;
  pendingBalance: number;
  recentEvaluations: Evaluation[];
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-sm font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
          {name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <h3 className="font-display text-lg text-[var(--foreground)]">
            {name}
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            {code} · {className}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-[var(--background)] p-3 text-center">
          <ClipboardCheck size={14} className="mx-auto text-[var(--accent)]" />
          <p className="mt-1 font-display text-lg text-[var(--foreground)]">
            {attendanceRate !== null ? `${attendanceRate}%` : "—"}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">Asistencia</p>
        </div>
        <div className="rounded-lg bg-[var(--background)] p-3 text-center">
          <TrendingUp size={14} className="mx-auto text-[var(--accent)]" />
          <p className="mt-1 font-display text-lg text-[var(--foreground)]">
            {avgScore ?? "—"}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">Promedio</p>
        </div>
        <div className="rounded-lg bg-[var(--background)] p-3 text-center">
          <Wallet size={14} className="mx-auto text-[var(--accent)]" />
          <p
            className={`mt-1 font-display text-lg ${pendingBalance > 0 ? "text-red-500" : "text-emerald-500"}`}
          >
            ${pendingBalance.toFixed(0)}
          </p>
          <p className="text-[10px] text-[var(--text-muted)]">
            Saldo pendiente
          </p>
        </div>
      </div>

      {recentEvaluations.length > 0 && (
        <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
          <p className="mb-2 text-xs font-medium text-[var(--text-muted)]">
            Últimas calificaciones
          </p>
          <div className="space-y-1.5">
            {recentEvaluations.slice(0, 5).map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-[var(--foreground)]">
                  {e.subject}{" "}
                  <span className="text-xs text-[var(--text-muted)]">
                    ({e.period})
                  </span>
                </span>
                <span className="font-medium text-[var(--foreground)]">
                  {e.score}/{e.maxScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
