import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ScheduleGrid } from "@/components/clases/schedule-grid";
import { AddScheduleSlotForm } from "@/components/clases/add-schedule-slot-form";

export default async function ClassSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const schoolClass = await prisma.schoolClass.findUnique({
    where: { id },
    include: { grade: true },
  });
  if (!schoolClass) notFound();

  const [slots, subjects, teachers, classrooms] = await Promise.all([
    prisma.schedule.findMany({
      where: { classId: id },
      include: {
        subject: true,
        teacher: { include: { user: true } },
        classroom: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.teacher.findMany({
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.classroom.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/clases"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={14} />
        Volver a clases
      </Link>

      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Horario — {schoolClass.grade.name} {schoolClass.name}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Grilla semanal de clases.
        </p>
      </div>

      <AddScheduleSlotForm
        classId={id}
        subjects={subjects.map((s) => ({ id: s.id, display: s.name }))}
        teachers={teachers.map((t) => ({ id: t.id, display: t.user.name }))}
        classrooms={classrooms.map((c) => ({ id: c.id, display: c.name }))}
      />

      <ScheduleGrid
        classId={id}
        slots={slots.map((s) => ({
          id: s.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          subject: s.subject.name,
          teacher: s.teacher.user.name,
          classroom: s.classroom?.name ?? null,
        }))}
      />
    </div>
  );
}
