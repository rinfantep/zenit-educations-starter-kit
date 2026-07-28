"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { createScheduleSlotAction } from "@/app/(app)/clases/[id]/horario/actions";

type Option = { id: string; display: string };

const days = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
];

const inputClass =
  "rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";

export function AddScheduleSlotForm({
  classId,
  subjects,
  teachers,
  classrooms,
}: {
  classId: string;
  subjects: Option[];
  teachers: Option[];
  classrooms: Option[];
}) {
  const [error, formAction, pending] = useActionState(
    createScheduleSlotAction,
    undefined,
  );
  const [savedTick, setSavedTick] = useState(0);

  useEffect(() => {
    if (error) toast.error(error);
    else if (savedTick > 0) toast.success("Bloque agregado al horario");
  }, [error]);

  return (
    <form
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-4"
    >
      <input type="hidden" name="classId" value={classId} />

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Día
        </label>
        <select name="dayOfWeek" required className={`mt-1 ${inputClass}`}>
          {days.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Inicio
        </label>
        <input
          name="startTime"
          type="time"
          required
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Fin
        </label>
        <input
          name="endTime"
          type="time"
          required
          className={`mt-1 ${inputClass}`}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Materia
        </label>
        <select name="subjectId" required className={`mt-1 ${inputClass}`}>
          <option value="">Seleccioná</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.display}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Profesor
        </label>
        <select name="teacherId" required className={`mt-1 ${inputClass}`}>
          <option value="">Seleccioná</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.display}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-[var(--text-muted)]">
          Aula
        </label>
        <select name="classroomId" className={`mt-1 ${inputClass}`}>
          <option value="">Sin asignar</option>
          {classrooms.map((c) => (
            <option key={c.id} value={c.id}>
              {c.display}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={pending}
        onClick={() => setSavedTick((t) => t + 1)}
        className="rounded-lg bg-[var(--color-ink-900)] px-4 py-2 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
      >
        {pending ? "Agregando..." : "Agregar bloque"}
      </button>
    </form>
  );
}
