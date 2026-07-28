"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { updateStudentAction } from "@/app/(app)/estudiantes/[id]/actions";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function EditStudentForm({
  studentId,
  data,
  classes,
}: {
  studentId: string;
  data: { name: string; phone: string; address: string; classId: string };
  classes: { id: string; display: string }[];
}) {
  const action = updateStudentAction.bind(null, studentId);
  const [error, formAction, pending] = useActionState(action, undefined);
    
  
  const [savedTick, setSavedTick] = useState(0);  


    
  useEffect(() => {
    if (error) toast.error(error);
    else if (savedTick > 0) toast.success("Datos actualizados");
  }, [error]);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6"
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
          <label className={labelClass}>Clase</label>
          <select
            name="classId"
            defaultValue={data.classId}
            className={inputClass}
          >
            <option value="">Sin asignar</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.display}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={labelClass}>Dirección</label>
        <input
          name="address"
          defaultValue={data.address}
          className={inputClass}
        />
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
