import Link from "next/link";
import { Plus } from "lucide-react";
import { getStudents, getClassesForFilter } from "@/lib/student-queries";
import { StudentsView } from "@/components/estudiantes/students-view";
import { StudentFilters } from "@/components/estudiantes/student-filters";
import { Pagination } from "@/components/shared/pagination";

export default async function EstudiantesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; classId?: string; page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ students, total, totalPages }, classes] = await Promise.all([
    getStudents({ search: params.search, classId: params.classId, page }),
    getClassesForFilter(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--foreground)]">
            Estudiantes
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {total}{" "}
            {total === 1 ? "estudiante registrado" : "estudiantes registrados"}
          </p>
        </div>
        <Link
          href="/estudiantes/nuevo"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          <Plus size={16} />
          Nuevo estudiante
        </Link>
      </div>

      <StudentFilters classes={classes} />

      <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
        <StudentsView students={students} />
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
