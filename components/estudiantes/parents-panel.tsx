"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { UserPlus, Link2, X } from "lucide-react";
import {
  linkExistingParentAction,
  createAndLinkParentAction,
  unlinkParentAction,
} from "@/app/(app)/estudiantes/[id]/parent-actions";

type Parent = { id: string; name: string; email: string; phone: string | null };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function ParentsPanel({
  studentId,
  parents,
}: {
  studentId: string;
  parents: Parent[];
}) {
  const [mode, setMode] = useState<"link" | "create" | null>(null);
  const [isPending, startTransition] = useTransition();

  const linkAction = linkExistingParentAction.bind(null, studentId);
  const createAction = createAndLinkParentAction.bind(null, studentId);

  const [linkError, linkFormAction, linkPending] = useActionState(
    linkAction,
    undefined,
  );
  const [createError, createFormAction, createPending] = useActionState(
    createAction,
    undefined,
  );

  useEffect(() => {
    if (linkError) toast.error(linkError);
  }, [linkError]);

  useEffect(() => {
    if (createError) toast.error(createError);
  }, [createError]);

  function handleUnlink(parentProfileId: string) {
    startTransition(async () => {
      await unlinkParentAction(studentId, parentProfileId);
      toast.success("Padre/tutor desvinculado");
    });
  }

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base text-[var(--foreground)]">
          Padres / Tutores
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(mode === "link" ? null : "link")}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--foreground)] transition hover:border-[var(--accent)]"
          >
            <Link2 size={13} /> Vincular existente
          </button>
          <button
            onClick={() => setMode(mode === "create" ? null : "create")}
            className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink-900)] px-3 py-1.5 text-xs font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            <UserPlus size={13} /> Crear nuevo
          </button>
        </div>
      </div>

      {mode === "link" && (
        <form
          action={linkFormAction}
          className="mt-4 flex items-end gap-3 rounded-lg border border-[var(--border-subtle)] p-4"
        >
          <div className="flex-1">
            <label className={labelClass}>Correo del padre/tutor</label>
            <input
              name="parentEmail"
              type="email"
              required
              placeholder="padre@ejemplo.com"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={linkPending}
            className="rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            {linkPending ? "Vinculando..." : "Vincular"}
          </button>
        </form>
      )}

      {mode === "create" && (
        <form
          action={createFormAction}
          className="mt-4 space-y-3 rounded-lg border border-[var(--border-subtle)] p-4"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input
                name="name"
                required
                placeholder="María Pérez"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input
                name="email"
                type="email"
                required
                placeholder="maria@ejemplo.com"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Teléfono (opcional)</label>
            <input name="phone" className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={createPending}
            className="rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            {createPending ? "Creando..." : "Crear y vincular"}
          </button>
        </form>
      )}

      <div className="mt-4 divide-y divide-[var(--border-subtle)]">
        {parents.length === 0 && (
          <p className="py-3 text-sm text-[var(--text-muted)]">
            No hay padres/tutores vinculados todavía.
          </p>
        )}
        {parents.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-2.5">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {p.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {p.email}
                {p.phone && ` · ${p.phone}`}
              </p>
            </div>
            <button
              onClick={() => handleUnlink(p.id)}
              disabled={isPending}
              className="text-[var(--text-muted)] hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
