"use client";

import { useActionState } from "react";
import { createTeacherAction } from "@/app/(app)/profesores/nuevo/actions";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function TeacherForm({
  subjects,
}: {
  subjects: { id: string; display: string }[];
}) {
  const [error, formAction, pending] = useActionState(
    createTeacherAction,
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
            Nombre completo
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder="María González"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="maria@zenith.edu"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            placeholder="Opcional"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="specialty" className={labelClass}>
            Especialidad
          </label>
          <input
            id="specialty"
            name="specialty"
            placeholder="Opcional"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Materias que dicta</label>
        {subjects.length === 0 ? (
          <p className="mt-1.5 text-xs text-[var(--text-muted)]">
            No hay materias cargadas todavía — andá a Configuración primero.
          </p>
        ) : (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {subjects.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--foreground)]"
              >
                <input
                  type="checkbox"
                  name="subjectIds"
                  value={s.id}
                  className="accent-[var(--color-gold-500)]"
                />
                {s.display}
              </label>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-[var(--border-subtle)] pt-5">
        <a
          href="/profesores"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          {pending ? "Creando..." : "Crear profesor"}
        </button>
      </div>
    </form>
  );
}
