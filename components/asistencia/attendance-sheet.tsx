"use client";

import { useState, useTransition } from "react";
import { saveAttendanceAction } from "@/app/(app)/asistencia/actions";
import { Check, X, Clock, FileText } from "lucide-react";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";

type StudentRow = {
  id: string;
  name: string;
  currentStatus: AttendanceStatus | null;
};

const statusConfig: Record<
  AttendanceStatus,
  { label: string; icon: typeof Check; color: string }
> = {
  PRESENT: { label: "Presente", icon: Check, color: "emerald" },
  ABSENT: { label: "Ausente", icon: X, color: "red" },
  LATE: { label: "Tarde", icon: Clock, color: "amber" },
  EXCUSED: { label: "Justificado", icon: FileText, color: "blue" },
};

export function AttendanceSheet({
  classId,
  date,
  students,
}: {
  classId: string;
  date: string;
  students: StudentRow[];
}) {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(
      students.map((s) => [s.id, s.currentStatus ?? "PRESENT"]),
    ),
  );
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function markAll(status: AttendanceStatus) {
    setStatuses(Object.fromEntries(students.map((s) => [s.id, status])));
  }

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      const result = await saveAttendanceAction({
        classId,
        date,
        records: Object.entries(statuses).map(([studentId, status]) => ({
          studentId,
          status,
        })),
      });
      if (result.success) setSaved(true);
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-3">
        <button
          onClick={() => markAll("PRESENT")}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          Marcar todos presentes
        </button>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-500">Guardado ✓</span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-lg bg-[var(--color-ink-900)] px-4 py-2 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            {isPending ? "Guardando..." : "Guardar asistencia"}
          </button>
        </div>
      </div>

      <div className="divide-y divide-[var(--border-subtle)]">
        {students.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between px-5 py-3"
          >
            <span className="text-sm font-medium text-[var(--foreground)]">
              {s.name}
            </span>
            <div className="flex gap-1.5">
              {(Object.keys(statusConfig) as AttendanceStatus[]).map(
                (status) => {
                  const { icon: Icon, label } = statusConfig[status];
                  const active = statuses[s.id] === status;
                  return (
                    <button
                      key={status}
                      title={label}
                      onClick={() =>
                        setStatuses((prev) => ({ ...prev, [s.id]: status }))
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <Icon size={14} />
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
