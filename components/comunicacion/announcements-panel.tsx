"use client";

import { useActionState } from "react";
import { createAnnouncementAction } from "@/app/(app)/comunicacion/actions";
import { Role } from "@prisma/client";

const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  DIRECTOR: "Director",
  TEACHER: "Profesores",
  STUDENT: "Estudiantes",
  PARENT: "Padres",
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  authorName: string;
  audience: Role[];
  createdAt: string;
};

export function AnnouncementsPanel({
  canBroadcast,
  announcements,
}: {
  canBroadcast: boolean;
  announcements: Announcement[];
}) {
  const [error, formAction, pending] = useActionState(
    createAnnouncementAction,
    undefined,
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {canBroadcast && (
        <form
          action={formAction}
          className="space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 lg:col-span-1"
        >
          <h3 className="font-display text-base text-[var(--foreground)]">
            Nuevo aviso
          </h3>
          <input
            name="title"
            placeholder="Título"
            required
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
          <textarea
            name="content"
            placeholder="Contenido del aviso..."
            required
            rows={4}
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
          <div>
            <p className="mb-1.5 text-xs font-medium text-[var(--text-muted)]">
              Destinatarios
            </p>
            <div className="space-y-1.5">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 text-sm text-[var(--foreground)]"
                >
                  <input
                    type="checkbox"
                    name="audience"
                    value={r}
                    className="accent-[var(--color-gold-500)]"
                  />
                  {roleLabels[r]}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
          >
            {pending ? "Publicando..." : "Publicar aviso"}
          </button>
        </form>
      )}

      <div
        className={`space-y-4 ${canBroadcast ? "lg:col-span-2" : "lg:col-span-3"}`}
      >
        {announcements.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">
            No hay avisos publicados todavía.
          </p>
        )}
        {announcements.map((a) => (
          <div
            key={a.id}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-display text-base text-[var(--foreground)]">
                {a.title}
              </h4>
              <span className="text-xs text-[var(--text-muted)]">
                {a.createdAt}
              </span>
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{a.content}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {a.audience.map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-[var(--background)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]"
                >
                  {roleLabels[r]}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Por {a.authorName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
