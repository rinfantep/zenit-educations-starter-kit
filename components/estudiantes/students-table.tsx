import Link from "next/link";
import type { Student, User, SchoolClass, Grade } from "@prisma/client";

type StudentWithRelations = Student & {
  user: User;
  class: (SchoolClass & { grade: Grade }) | null;
};

export function StudentsTable({
  students,
}: {
  students: StudentWithRelations[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-xs uppercase tracking-wide text-[var(--text-muted)]">
            <th className="px-5 py-3 font-medium">Estudiante</th>
            <th className="px-5 py-3 font-medium">Código</th>
            <th className="px-5 py-3 font-medium">Clase</th>
            <th className="px-5 py-3 font-medium">Estado</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--background)]"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-xs font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
                    {s.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <span className="font-medium text-[var(--foreground)]">
                    {s.user.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[var(--text-muted)]">
                {s.studentCode}
              </td>
              <td className="px-5 py-3.5 text-[var(--text-muted)]">
                {s.class
                  ? `${s.class.grade.name} — ${s.class.name}`
                  : "Sin asignar"}
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    s.user.active
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}
                >
                  {s.user.active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <Link
                  href={`/estudiantes/${s.id}`}
                  className="text-sm text-[var(--accent)] hover:underline"
                >
                  Ver perfil
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
