"use server";

import { prisma } from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const attendanceSchema = z.object({
  classId: z.string().min(1),
  date: z.string().min(1),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.nativeEnum(AttendanceStatus),
    }),
  ),
});

export async function saveAttendanceAction(input: {
  classId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus }[];
}) {
  const parsed = attendanceSchema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos." };

  const { classId, date, records } = parsed.data;
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  try {
    await prisma.$transaction(
      records.map((r) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: { studentId: r.studentId, date: attendanceDate },
          },
          update: { status: r.status },
          create: {
            studentId: r.studentId,
            classId,
            date: attendanceDate,
            status: r.status,
          },
        }),
      ),
    );
  } catch {
    return { error: "Ocurrió un error al guardar la asistencia." };
  }

  revalidatePath("/asistencia");
  revalidatePath("/dashboard");
  return { success: true };
}
