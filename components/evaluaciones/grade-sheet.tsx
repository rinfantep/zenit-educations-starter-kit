"use client";

import { useState, useTransition } from "react";
import { saveGradesAction } from "@/app/(app)/evaluaciones/actions";
import { DownloadReportCard } from "./download-report-card";

type StudentRow = {
  id: string;
  name: string;
  entries: { type: string; score: number; maxScore: number }[];
};

export function GradeSheet({
  subjectId,
  periodId,
  students,
}: {
  subjectId: string;
  periodId: string;
  students: StudentRow[];
}) {
  const [type, setType] = useState("Examen");
  const [maxScore, setMaxScore] = useState(100);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(false);
    const entries = Object.entries(scores)
      .filter(([, v]) => v !== "")
      .map(([studentId, v]) => ({ studentId, score: Number(v) }));

    if (entries.length === 0) return;

    startTransition(async () => {
      const result = await saveGradesAction({
        subjectId,
        periodId,
        type,
        maxScore,
        entries,
      });
      if (result.success) {
        setSaved(true);
        setScores({});
      }
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-3">
        <div className="flex gap-3">
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Tipo (Examen, Tarea...)"
            className="rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
          <input
            type="number"
            value={maxScore}
            onChange={(e) => setMaxScore(Number(e.target.value))}
            className="w-24 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-1.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-500">Guardado ✓</span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-[var(--color-ink-900)] px-4 py-2 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            {isPending ? "Guardando..." : "Guardar notas"}
          </button>
        </div>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between px-5 py-3"
          >
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {s.name}
              </p>
              {s.entries.length > 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  {s.entries
                    .map((e) => `${e.type}: ${e.score}/${e.maxScore}`)
                    .join(" · ")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <DownloadReportCard studentId={s.id} periodId={periodId} />
              <input
                type="number"
                min={0}
                max={maxScore}
                value={scores[s.id] ?? ""}
                onChange={(e) =>
                  setScores((prev) => ({ ...prev, [s.id]: e.target.value }))
                }
                placeholder="—"
                className="w-20 rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-1.5 text-center text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
