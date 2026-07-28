"use client";

import { useActionState } from "react";
import { createStudentAction } from "@/app/(app)/estudiantes/nuevo/actions";
import type { SchoolClass, Grade } from "@prisma/client";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function StudentForm({
  classes,
}: {
  classes: (SchoolClass & { grade: Grade })[];
}) {
  const [error, formAction, pending] = useActionState(createStudentAction, undefined);

  return (
    <form action={formAction} className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Nombre completo</label>
          <input id="name" name="name" required placeholder="Juan Pérez" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Correo electrónico</label>
          <input id="email" name="email" type="email" required placeholder="juan@zenith.edu" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="birthDate" className={labelClass}>Fecha de nacimiento</label>
          <input id="birthDate" name="birthDate" type="date" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Teléfono</label>
          <input id="phone" name="phone" placeholder="Opcional" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>Dirección</label>
        <input id="address" name="address" placeholder="Opcional" className={inputClass} />
      </div>

      <div>
        <label htmlFor="classId" className={labelClass}>Clase</label>
        <select id="classId" name="classId" className={inputClass}>
          <option value="">Sin asignar</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.grade.name} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-[var(--border-subtle)] pt-5">
        <a
          href="/estudiantes"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          {pending ? "Creando..." : "Crear estudiante"}
        </button>
      </div>
    </form>
  );
}