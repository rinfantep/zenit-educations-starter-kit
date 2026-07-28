"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { changePasswordAction } from "@/app/(app)/perfil/actions";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";
const labelClass = "text-sm font-medium text-[var(--foreground)]";

export function ChangePasswordForm() {
  const [error, formAction, pending] = useActionState(
    changePasswordAction,
    undefined,
  );
  const [savedTick, setSavedTick] = useState(0);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (error) toast.error(error);
    else if (savedTick > 0) {
      toast.success("Contraseña actualizada correctamente");
      setFormKey((k) => k + 1); // limpia los inputs
    }
  }, [error]);

  return (
    <form
      key={formKey}
      action={formAction}
      className="space-y-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6"
    >
      <h3 className="font-display text-base text-[var(--foreground)]">
        Cambiar contraseña
      </h3>

      <div>
        <label className={labelClass}>Contraseña actual</label>
        <input
          name="currentPassword"
          type="password"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Nueva contraseña</label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Confirmar nueva contraseña</label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        onClick={() => setSavedTick((t) => t + 1)}
        className="rounded-lg bg-[var(--color-ink-900)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
      >
        {pending ? "Guardando..." : "Actualizar contraseña"}
      </button>
    </form>
  );
}
