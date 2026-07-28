"use client";

import { useActionState } from "react";
import { Trash2, Plus } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};
type CatalogItem = { id: string; display: string };

export function CatalogPanel({
  title,
  description,
  items,
  fields,
  createAction,
  deleteAction,
}: {
  title: string;
  description: string;
  items: CatalogItem[];
  fields: Field[];
  createAction: (
    prev: string | undefined,
    formData: FormData,
  ) => Promise<string | undefined>;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [error, formAction, pending] = useActionState(createAction, undefined);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <h3 className="font-display text-lg text-[var(--foreground)]">{title}</h3>
      <p className="text-sm text-[var(--text-muted)]">{description}</p>

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        {fields.map((f) => (
          <div key={f.name} className="flex-1 min-w-[120px]">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              {f.label}
            </label>
            <input
              name={f.name}
              type={f.type ?? "text"}
              placeholder={f.placeholder}
              required
              className="mt-1 w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-ink-900)] px-3.5 py-2 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] disabled:opacity-60 dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]"
        >
          <Plus size={15} /> Agregar
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 divide-y divide-[var(--border-subtle)]">
        {items.length === 0 && (
          <p className="py-3 text-sm text-[var(--text-muted)]">
            Sin registros todavía.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2.5"
          >
            <span className="text-sm text-[var(--foreground)]">
              {item.display}
            </span>
            <form action={deleteAction.bind(null, item.id)}>
              <button
                type="submit"
                className="text-[var(--text-muted)] transition hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
