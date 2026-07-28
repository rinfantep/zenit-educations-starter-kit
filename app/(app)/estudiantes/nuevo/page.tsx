import { prisma } from "@/lib/prisma";
import { StudentForm } from "@/components/estudiantes/student-form";

export default async function NuevoEstudiantePage() {
  const classes = await prisma.schoolClass.findMany({
    include: { grade: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Nuevo estudiante
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Se creará una cuenta de acceso automáticamente para el estudiante.
        </p>
      </div>

      <StudentForm classes={classes} />
    </div>
  );
}
