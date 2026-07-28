import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDemoData } from "@/lib/seed-demo-data";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.DEMO_RESET_SECRET) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    await prisma.$transaction([
      prisma.payment.deleteMany(),
      prisma.invoice.deleteMany(),
      prisma.evaluationEntry.deleteMany(),
      prisma.reportCard.deleteMany(),
      prisma.attendance.deleteMany(),
      prisma.message.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.announcement.deleteMany(),
      prisma.document.deleteMany(),
      prisma.schedule.deleteMany(),
      prisma.auditLog.deleteMany(),
      prisma.passwordResetToken.deleteMany(),
      prisma.student.deleteMany(),
      prisma.teacherSubject.deleteMany(),
      prisma.teacher.deleteMany(),
      prisma.schoolClass.deleteMany(),
      prisma.parentProfile.deleteMany(),
      prisma.user.deleteMany({ where: { role: { not: "SUPER_ADMIN" } } }),
      prisma.classroom.deleteMany(),
      prisma.subject.deleteMany(),
      prisma.grade.deleteMany(),
      prisma.academicPeriod.deleteMany(),
    ]);

    await seedDemoData(prisma);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al resetear." }, { status: 500 });
  }
}
