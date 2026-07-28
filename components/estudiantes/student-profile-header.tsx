"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { UserX, UserCheck, Trash2 } from "lucide-react";
import {
  toggleStudentActiveAction,
  deleteStudentAction,
  updateStudentPhotoAction,
} from "@/app/(app)/estudiantes/[id]/actions";
import { AvatarUpload } from "@/components/shared/avatar-upload";

export function StudentProfileHeader({
  studentId,
  name,
  code,
  email,
  className,
  active,
  image,
}: {
  studentId: string;
  name: string;
  code: string;
  email: string;
  className: string;
  active: boolean;
  image?: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleStudentActiveAction(studentId);
      toast.success(
        active ? "Estudiante desactivado" : "Estudiante reactivado",
      );
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `¿Eliminar a ${name} permanentemente? Esta acción no se puede deshacer.`,
      )
    )
      return;
    startDeleteTransition(async () => {
      const result = await deleteStudentAction(studentId);
      if (result?.error) toast.error(result.error);
    });
  }

  function handlePhotoUploaded(url: string) {
    startTransition(async () => {
      await updateStudentPhotoAction(studentId, url);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <AvatarUpload
          currentImage={image}
          name={name}
          onUploaded={handlePhotoUploaded}
        />
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
          <p className="text-sm text-[var(--text-muted)]">
            {code} · {className}
          </p>
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
