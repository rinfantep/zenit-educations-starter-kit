import Link from "next/link";
import { Plus, BookOpen, GraduationCap } from "lucide-react";
import { getTeachers } from "@/lib/teacher-queries";
import { Pagination } from "@/components/shared/pagination";

export default async function ProfesoresPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { teachers, total, totalPages } = await getTeachers(page);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--foreground)]">
            Profesores
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {total}{" "}
            {total === 1 ? "profesor registrado" : "profesores registrados"}
          </p>
        </div>
        <Link
          href="/profesores/nuevo"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          <Plus size={16} />
          Nuevo profesor
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Todavía no hay profesores registrados.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((t) => (
              <Link
                key={t.id}
                href={`/profesores/${t.id}`}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-sm font-medium text-[var(--color-paper-50)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)]">
                    {t.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--foreground)]">
                      {t.user.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {t.teacherCode}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    {t.subjects.length > 0
                      ? t.subjects.map((s) => s.subject.name).join(", ")
                      : "Sin materias asignadas"}
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} />
                    {t.classesLed.length}{" "}
                    {t.classesLed.length === 1
                      ? "clase a cargo"
                      : "clases a cargo"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)]">
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </>
      )}
    </div>
  );
}
