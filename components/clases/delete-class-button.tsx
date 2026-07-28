"use client";

import { Trash2 } from "lucide-react";
import { deleteClassAction } from "@/app/(app)/clases/actions";

export function DeleteClassButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => {
        if (
          confirm(
            "¿Eliminar esta clase? Los estudiantes quedarán sin clase asignada.",
          )
        ) {
          deleteClassAction(id);
        }
      }}
      className="text-[var(--text-muted)] transition hover:text-red-500"
    >
      <Trash2 size={15} />
    </button>
  );
}
