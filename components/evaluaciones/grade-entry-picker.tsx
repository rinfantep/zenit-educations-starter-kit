"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Option = { id: string; display: string };

export function GradeEntryPicker({
  classes,
  subjects,
  periods,
  selectedClassId,
  selectedSubjectId,
  selectedPeriodId,
}: {
  classes: Option[];
  subjects: Option[];
  periods: Option[];
  selectedClassId?: string;
  selectedSubjectId?: string;
  selectedPeriodId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const selectClass =
    "rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]";

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={selectedClassId ?? ""}
        onChange={(e) => update("classId", e.target.value)}
        className={selectClass}
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.display}
          </option>
        ))}
      </select>
      <select
        value={selectedSubjectId ?? ""}
        onChange={(e) => update("subjectId", e.target.value)}
        className={selectClass}
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.display}
          </option>
        ))}
      </select>
      <select
        value={selectedPeriodId ?? ""}
        onChange={(e) => update("periodId", e.target.value)}
        className={selectClass}
      >
        {periods.map((p) => (
          <option key={p.id} value={p.id}>
            {p.display}
          </option>
        ))}
      </select>
    </div>
  );
}
