import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TeacherProfileHeader } from "@/components/profesores/teacher-profile-header";
import { EditTeacherForm } from "@/components/profesores/edit-teacher-form";

export default async function TeacherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: true,
      subjects: { include: { subject: true } },
      classesLed: { include: { grade: true } },
    },
  });

  if (!teacher) notFound();

  const [allSubjects, allClasses] = await Promise.all([
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.schoolClass.findMany({
      include: { grade: true, homeroomTeacher: { include: { user: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/profesores"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={14} />
        Volver a profesores
      </Link>

      <TeacherProfileHeader
        teacherId={teacher.id}
        name={teacher.user.name}
        code={teacher.teacherCode}
        email={teacher.user.email}
        active={teacher.user.active}
      />

      <EditTeacherForm
        teacherId={teacher.id}
        data={{
          name: teacher.user.name,
          phone: teacher.phone ?? "",
          specialty: teacher.specialty ?? "",
        }}
        allSubjects={allSubjects.map((s) => ({ id: s.id, display: s.name }))}
        selectedSubjectIds={teacher.subjects.map((s) => s.subjectId)}
        allClasses={allClasses.map((c) => ({
          id: c.id,
          display: `${c.grade.name} — ${c.name}`,
          takenBy:
            c.homeroomTeacher && c.homeroomTeacher.id !== teacher.id
              ? c.homeroomTeacher.user.name
              : null,
        }))}
        selectedClassIds={teacher.classesLed.map((c) => c.id)}
      />
    </div>
  );
}
