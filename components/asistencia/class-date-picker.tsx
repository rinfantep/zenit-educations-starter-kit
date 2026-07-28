"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function ClassDatePicker({
  classes,
  selectedClassId,
  selectedDate,
}: {
  classes: { id: string; display: string }[];
  selectedClassId?: string;
  selectedDate: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={selectedClassId ?? ""}
        onChange={(e) => update("classId", e.target.value)}
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.display}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => update("date", e.target.value)}
        className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
      />
    </div>
  );
}
