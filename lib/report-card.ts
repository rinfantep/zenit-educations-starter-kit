import { prisma } from "@/lib/prisma";

export async function getReportCardData(studentId: string, periodId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      class: { include: { grade: true } },
    },
  });
  if (!student) return null;

  const period = await prisma.academicPeriod.findUnique({
    where: { id: periodId },
  });
  if (!period) return null;

  const entries = await prisma.evaluationEntry.findMany({
    where: { studentId, periodId },
    include: { subject: true },
  });

  const bySubject = new Map<
    string,
    { name: string; entries: typeof entries }
  >();
  for (const e of entries) {
    const key = e.subjectId;
    if (!bySubject.has(key))
      bySubject.set(key, { name: e.subject.name, entries: [] });
    bySubject.get(key)!.entries.push(e);
  }

  const subjects = Array.from(bySubject.values()).map((s) => {
    const totalWeighted = s.entries.reduce(
      (acc, e) => acc + (e.score / e.maxScore) * 100 * e.weight,
      0,
    );
    const totalWeight = s.entries.reduce((acc, e) => acc + e.weight, 0);
    const average = totalWeight > 0 ? totalWeighted / totalWeight : 0;
    return {
      name: s.name,
      average: Math.round(average * 10) / 10,
      entries: s.entries.map((e) => ({
        type: e.type,
        score: e.score,
        maxScore: e.maxScore,
      })),
    };
  });

  const overallAverage =
    subjects.length > 0
      ? Math.round(
          (subjects.reduce((acc, s) => acc + s.average, 0) / subjects.length) *
            10,
        ) / 10
      : 0;

  return {
    studentName: student.user.name,
    studentCode: student.studentCode,
    className: student.class
      ? `${student.class.grade.name} — ${student.class.name}`
      : "Sin clase",
    periodName: period.name,
    year: period.year,
    subjects,
    overallAverage,
  };
}
