import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StudentProfileHeader } from "@/components/estudiantes/student-profile-header";
import { StudentProfileTabs } from "@/components/estudiantes/student-profile-tabs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

 const student = await prisma.student.findUnique({
   where: { id },
   include: {
     user: true,
     class: { include: { grade: true } },
     documents: true,
     evaluations: {
       include: { subject: true, period: true },
       orderBy: { createdAt: "desc" },
     },
     attendances: { orderBy: { date: "desc" }, take: 30 },
     invoices: { include: { payments: true }, orderBy: { dueDate: "desc" } },
     parents: { include: { user: true } },
   },
 });

  if (!student) notFound();

  const classes = await prisma.schoolClass.findMany({
    include: { grade: true },
    orderBy: { name: "asc" },
  });

  const attendanceStats = {
    present: student.attendances.filter((a) => a.status === "PRESENT").length,
    absent: student.attendances.filter((a) => a.status === "ABSENT").length,
    late: student.attendances.filter((a) => a.status === "LATE").length,
    total: student.attendances.length,
  };

  return (
    <div className="space-y-6">
      <Link
        href="/estudiantes"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={14} />
        Volver a estudiantes
      </Link>
      <StudentProfileHeader
        studentId={student.id}
        name={student.user.name}
        code={student.studentCode}
        email={student.user.email}
        className={
          student.class
            ? `${student.class.grade.name} — ${student.class.name}`
            : "Sin asignar"
        }
        active={student.user.active}
        image={student.user.image}
      />

      <StudentProfileTabs
        studentId={student.id}
        editableData={{
          name: student.user.name,
          phone: student.phone ?? "",
          address: student.address ?? "",
          classId: student.classId ?? "",
        }}
        classes={classes.map((c) => ({
          id: c.id,
          display: `${c.grade.name} — ${c.name}`,
        }))}
        documents={student.documents.map((d) => ({
          id: d.id,
          name: d.name,
          type: d.type,
          url: d.url,
          uploadedAt: d.uploadedAt.toLocaleDateString("es-ES"),
        }))}
        evaluations={student.evaluations.map((e) => ({
          id: e.id,
          subject: e.subject.name,
          period: e.period.name,
          type: e.type,
          score: e.score,
          maxScore: e.maxScore,
        }))}
        attendanceStats={attendanceStats}
        invoices={student.invoices.map((i) => ({
          id: i.id,
          concept: i.concept,
          amount: i.amount,
          status: i.status,
          dueDate: i.dueDate.toLocaleDateString("es-ES"),
          paid: i.payments.reduce((acc, p) => acc + p.amount, 0),
        }))}
        parents={student.parents.map((p) => ({
          id: p.id,
          name: p.user.name,
          email: p.user.email,
          phone: p.phone,
        }))}
      />
    </div>
  );
}
