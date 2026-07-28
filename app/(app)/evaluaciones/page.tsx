import { prisma } from "@/lib/prisma";
import { GradeEntryPicker } from "@/components/evaluaciones/grade-entry-picker";
import { GradeSheet } from "@/components/evaluaciones/grade-sheet";

export default async function EvaluacionesPage({
  searchParams,
}: {
  searchParams: Promise<{
    classId?: string;
    subjectId?: string;
    periodId?: string;
  }>;
}) {
  const params = await searchParams;
  const [classes, subjects, periods] = await Promise.all([
    prisma.schoolClass.findMany({
      include: { grade: true },
      orderBy: { name: "asc" },
    }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.academicPeriod.findMany({ orderBy: { startDate: "desc" } }),
  ]);

  const classId = params.classId || classes[0]?.id;
  const subjectId = params.subjectId || subjects[0]?.id;
  const periodId = params.periodId || periods[0]?.id;

  let students: {
    id: string;
    name: string;
    entries: { type: string; score: number; maxScore: number }[];
  }[] = [];
  if (classId && subjectId && periodId) {
    const result = await prisma.student.findMany({
      where: { classId },
      include: {
        user: true,
        evaluations: { where: { subjectId, periodId } },
      },
      orderBy: { user: { name: "asc" } },
    });
    students = result.map((s) => ({
      id: s.id,
      name: s.user.name,
      entries: s.evaluations.map((e) => ({
        type: e.type,
        score: e.score,
        maxScore: e.maxScore,
      })),
    }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Evaluaciones
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Carga de notas por clase, materia y período.
        </p>
      </div>

      <GradeEntryPicker
        classes={classes.map((c) => ({
          id: c.id,
          display: `${c.grade.name} — ${c.name}`,
        }))}
        subjects={subjects.map((s) => ({ id: s.id, display: s.name }))}
        periods={periods.map((p) => ({ id: p.id, display: p.name }))}
        selectedClassId={classId}
        selectedSubjectId={subjectId}
        selectedPeriodId={periodId}
      />

      {!classId || !subjectId || !periodId ? (
        <p className="text-sm text-[var(--text-muted)]">
          Necesitás al menos una clase, una materia y un período creados.
        </p>
      ) : students.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Esta clase no tiene estudiantes.
        </p>
      ) : (
        <GradeSheet
          subjectId={subjectId}
          periodId={periodId}
          students={students}
        />
      )}
    </div>
  );
}
