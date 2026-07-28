import Link from "next/link";
import type { Student, User, SchoolClass, Grade } from "@prisma/client";

type StudentWithRelations = Student & {
  user: User;
  class: (SchoolClass & { grade: Grade }) | null;
};

export function StudentsGrid({
  students,
}: {
  students: StudentWithRelations[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {students.map((s) => (
        <Link
          key={s.id}
          href={`/estudiantes/${s.id}`}
          className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-lg font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
            {s.user.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <p className="mt-3 font-medium text-[var(--foreground)]">
            {s.user.name}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{s.studentCode}</p>
          <div className="mt-3 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
            <span className="text-xs text-[var(--text-muted)]">
              {s.class
                ? `${s.class.grade.name} — ${s.class.name}`
                : "Sin asignar"}
            </span>
            <span
              className={`h-2 w-2 rounded-full ${s.user.active ? "bg-emerald-500" : "bg-red-500"}`}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
