"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { UserX, UserCheck, Trash2 } from "lucide-react";
import {
  toggleTeacherActiveAction,
  deleteTeacherAction,
} from "@/app/(app)/profesores/[id]/actions";

export function TeacherProfileHeader({
  teacherId,
  name,
  code,
  email,
  active,
}: {
  teacherId: string;
  name: string;
  code: string;
  email: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTeacherActiveAction(teacherId);
      toast.success(active ? "Profesor desactivado" : "Profesor reactivado");
    });
  }

  function handleDelete() {
    if (!confirm(`¿Eliminar a ${name} permanentemente?`)) return;
    startDeleteTransition(async () => {
      const result = await deleteTeacherAction(teacherId);
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-lg font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
          {name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl text-[var(--foreground)]">
              {name}
            </h1>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
            >
              {active ? "Activo" : "Inactivo"}
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">{code}</p>
          <p className="text-xs text-[var(--text-muted)]">{email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3.5 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:opacity-60"
        >
          {active ? <UserX size={14} /> : <UserCheck size={14} />}
          {active ? "Desactivar" : "Reactivar"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-3.5 py-2 text-sm text-red-500 transition hover:border-red-500 hover:bg-red-500/10 disabled:opacity-60"
        >
          <Trash2 size={14} />
          Eliminar
        </button>
      </div>
    </div>
  );
}
