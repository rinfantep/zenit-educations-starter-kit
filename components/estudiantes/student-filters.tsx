"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search } from "lucide-react";
import { useViewStore } from "@/store/view-store";
import { LayoutGrid, List } from "lucide-react";

export function StudentFilters({
  classes,
}: {
  classes: { id: string; name: string; grade: { name: string } }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [, startTransition] = useTransition();
  const { studentsView, setStudentsView } = useViewStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) params.set("search", search);
      else params.delete("search");
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    }, 350);
    return () => clearTimeout(timeout);
  }, [search]);

  function handleClassChange(classId: string) {
    const params = new URLSearchParams(searchParams);
    if (classId) params.set("classId", classId);
    else params.delete("classId");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 gap-3">
        <div className="relative max-w-xs flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] py-2 pl-9 pr-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
          />
        </div>

        <select
          defaultValue={searchParams.get("classId") ?? ""}
          onChange={(e) => handleClassChange(e.target.value)}
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
        >
          <option value="">Todas las clases</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.grade.name} — {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-1">
        <button
          onClick={() => setStudentsView("table")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition ${
            studentsView === "table"
              ? "bg-[var(--background)] text-[var(--foreground)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          <List size={14} /> Tabla
        </button>
        <button
          onClick={() => setStudentsView("grid")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition ${
            studentsView === "grid"
              ? "bg-[var(--background)] text-[var(--foreground)]"
              : "text-[var(--text-muted)]"
          }`}
        >
          <LayoutGrid size={14} /> Grid
        </button>
      </div>
    </div>
  );
}
