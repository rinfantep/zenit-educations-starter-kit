import { prisma } from "@/lib/prisma";
import { AttendanceSheet } from "@/components/asistencia/attendance-sheet";
import { ClassDatePicker } from "@/components/asistencia/class-date-picker";

export default async function AsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; date?: string }>;
}) {
  const params = await searchParams;
  const classes = await prisma.schoolClass.findMany({
    include: { grade: true },
    orderBy: { name: "asc" },
  });

  const selectedClassId = params.classId || classes[0]?.id;
  const selectedDate = params.date || new Date().toISOString().split("T")[0];

  let students: Awaited<ReturnType<typeof getStudentsWithAttendance>> = [];
  if (selectedClassId) {
    students = await getStudentsWithAttendance(selectedClassId, selectedDate);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Asistencia
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Control diario por clase.
        </p>
      </div>

      <ClassDatePicker
        classes={classes.map((c) => ({
          id: c.id,
          display: `${c.grade.name} — ${c.name}`,
        }))}
        selectedClassId={selectedClassId}
        selectedDate={selectedDate}
      />

      {!selectedClassId ? (
        <p className="text-sm text-[var(--text-muted)]">
          Primero creá una clase.
        </p>
      ) : students.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          Esta clase no tiene estudiantes asignados.
        </p>
      ) : (
        <AttendanceSheet
          classId={selectedClassId}
          date={selectedDate}
          students={students}
        />
      )}
    </div>
  );
}

async function getStudentsWithAttendance(classId: string, date: string) {
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  const students = await prisma.student.findMany({
    where: { classId },
    include: {
      user: true,
      attendances: { where: { date: attendanceDate } },
    },
    orderBy: { user: { name: "asc" } },
  });

  return students.map((s) => ({
    id: s.id,
    name: s.user.name,
    currentStatus: s.attendances[0]?.status ?? null,
  }));
}
