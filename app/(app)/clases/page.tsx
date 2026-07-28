import Link from "next/link";
import { Plus, Users2, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { DeleteClassButton } from "@/components/clases/delete-class-button";
import { Pagination } from "@/components/shared/pagination";

const PAGE_SIZE = 12;

export default async function ClasesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [classes, total] = await Promise.all([
    prisma.schoolClass.findMany({
      include: {
        grade: true,
        classroom: true,
        homeroomTeacher: { include: { user: true } },
        _count: { select: { students: true } },
      },
      orderBy: [{ year: "desc" }, { name: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.schoolClass.count(),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--foreground)]">
            Clases
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {total} {total === 1 ? "clase creada" : "clases creadas"}
          </p>
        </div>
        <Link
          href="/clases/nueva"
          className="flex items-center gap-2 rounded-lg bg-[var(--color-ink-900)] px-4 py-2.5 text-sm font-medium text-[var(--color-paper-50)] transition hover:bg-[var(--color-ink-700)] dark:bg-[var(--color-gold-500)] dark:text-[var(--color-ink-950)] dark:hover:bg-[var(--color-gold-300)]"
        >
          <Plus size={16} />
          Nueva clase
        </Link>
      </div>

      {classes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            Todavía no hay clases. Primero asegurate de tener grados creados en{" "}
            <Link
              href="/configuracion"
              className="text-[var(--accent)] hover:underline"
            >
              Configuración
            </Link>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg text-[var(--foreground)]">
                      {c.grade.name} — {c.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Año lectivo {c.year}
                    </p>
                  </div>
                  <DeleteClassButton id={c.id} />
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <Users2 size={14} />
                    {c._count.students} estudiantes
                    {c.homeroomTeacher &&
                      ` · Prof. ${c.homeroomTeacher.user.name}`}
                  </div>
                  {c.classroom && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} />
                      {c.classroom.name}
                    </div>
                  )}
                </div>

                <Link
                  href={`/clases/${c.id}/horario`}
                  className="mt-3 inline-block text-xs text-[var(--accent)] hover:underline"
                >
                  Ver horario →
                </Link>
              </div>
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
