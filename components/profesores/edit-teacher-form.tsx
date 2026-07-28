"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateTeacherAction } from "@/app/(app)/profesores/[id]/actions";

type Option = { id: string; display: string };
type ClassOption = Option & { takenBy: string | null };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function EditTeacherForm({
  teacherId,
  data,
  allSubjects,
  selectedSubjectIds,
  allClasses,
  selectedClassIds,
}: {
  teacherId: string;
  data: { name: string; phone: string; specialty: string };
  allSubjects: Option[];
  selectedSubjectIds: string[];
  allClasses: ClassOption[];
  selectedClassIds: string[];
}) {
  const action = updateTeacherAction.bind(null, teacherId);
  const [error, formAction, pending] = useActionState(action, undefined);
  const [savedTick, setSavedTick] = useState(0);

  useEffect(() => {
    if (error) toast.error(error);
    else if (savedTick > 0) toast.success("Datos actualizados");
  }, [error]);

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6"
    >
      <div>
        <label className={labelClass}>Nombre completo</label>
        <input
          name="name"
          defaultValue={data.name}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            name="phone"
            defaultValue={data.phone}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Especialidad</label>
          <input
            name="specialty"
            defaultValue={data.specialty}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Materias que dicta</label>
        {allSubjects.length === 0 ? (
          <p className="mt-1.5 text-xs text-[var(--text-muted)]">
            No hay materias cargadas todavía.
          </p>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {allSubjects.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                <input
                  type="checkbox"
                  name="subjectIds"
                  value={s.id}
                  defaultChecked={selectedSubjectIds.includes(s.id)}
                  className="accent-[var(--color-gold-500)]"
                />
                {s.display}
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Clases a cargo (titular)</label>
        {allClasses.length === 0 ? (
          <p className="mt-1.5 text-xs text-[var(--text-muted)]">
            No hay clases creadas todavía.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {allClasses.map((c) => (
              <label
                key={c.id}
                className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
                  c.takenBy
                    ? "border-[var(--border-subtle)] opacity-50"
                    : "border-[var(--border-subtle)] text-[var(--foreground)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="classIds"
                    value={c.id}
                    defaultChecked={selectedClassIds.includes(c.id)}
                    disabled={!!c.takenBy}
                    className="accent-[var(--color-gold-500)]"
                  />
                  {c.display}
                </span>
                {c.takenBy && (
                  <span className="text-xs text-[var(--text-muted)]">
                    a cargo de {c.takenBy}
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        onClick={() => setSavedTick((t) => t + 1)}
        className="rounded-lg bg-[var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
