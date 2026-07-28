import { prisma } from "@/lib/prisma";
import { TeacherForm } from "@/components/profesores/teacher-form";

export default async function NuevoProfesorPage() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Nuevo profesor
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Se creará una cuenta de acceso automáticamente para el profesor.
        </p>
      </div>

      <TeacherForm
        subjects={subjects.map((s) => ({ id: s.id, display: s.name }))}
      />
    </div>
  );
}
