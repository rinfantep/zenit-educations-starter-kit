"use client";

import { useActionState } from "react";
import { createClassAction } from "@/app/(app)/clases/actions";

type Option = { id: string; display: string };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function ClassForm({
  grades,
  classrooms,
  teachers,
}: {
  grades: Option[];
  classrooms: Option[];
  teachers: Option[];
}) {
  const [error, formAction, pending] = useActionState(
    createClassAction,
    undefined,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nombre de sección
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="A"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="year" className={labelClass}>
            Año lectivo
          </label>
          <input
            id="year"
            name="year"
            type="number"
            required
            defaultValue={new Date().getFullYear()}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="gradeId" className={labelClass}>
          Grado
        </label>
        <select id="gradeId" name="gradeId" required className={inputClass}>
          <option value="">Seleccioná un grado</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              {g.display}
            </option>
          ))}
        </select>
        {grades.length === 0 && (
          <p className="mt-1.5 text-xs text-red-500">
            No hay grados creados todavía — andá a Configuración primero.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="classroomId" className={labelClass}>
            Aula
          </label>
          <select id="classroomId" name="classroomId" className={inputClass}>
            <option value="">Sin asignar</option>
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="homeroomTeacherId" className={labelClass}>
            Profesor titular
          </label>
          <select
            id="homeroomTeacherId"
            name="homeroomTeacherId"
            className={inputClass}
          >
            <option value="">Sin asignar</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.display}
              </option>
            ))}
          </select>
          {teachers.length === 0 && (
            <p className="mt-1.5 text-xs text-[var(--text-muted)]">
              Todavía no hay profesores cargados.
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-[var(--border-subtle)] pt-5">
        <a
          href="/clases"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          {pending ? "Creando..." : "Crear clase"}
        </button>
      </div>
    </form>
  );
}
