import { prisma } from "@/lib/prisma";
import { ClassForm } from "@/components/clases/class-form";

export default async function NuevaClasePage() {
  const [grades, classrooms, teachers] = await Promise.all([
    prisma.grade.findMany({ orderBy: { order: "asc" } }),
    prisma.classroom.findMany({ orderBy: { name: "asc" } }),
    prisma.teacher.findMany({
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Nueva clase
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Combina un grado con un año lectivo para formar una clase.
        </p>
      </div>

      <ClassForm
        grades={grades.map((g) => ({
          id: g.id,
          display: `${g.name} — ${g.level}`,
        }))}
        classrooms={classrooms.map((c) => ({
          id: c.id,
          display: `${c.name} (${c.capacity} alumnos)`,
        }))}
        teachers={teachers.map((t) => ({ id: t.id, display: t.user.name }))}
      />
    </div>
  );
}
