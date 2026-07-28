"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const scheduleSchema = z.object({
  classId: z.string().min(1),
  subjectId: z.string().min(1),
  teacherId: z.string().min(1),
  classroomId: z.string().optional(),
  dayOfWeek: z.coerce.number().int().min(1).max(5),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export async function createScheduleSlotAction(
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = scheduleSchema.safeParse({
    classId: formData.get("classId"),
    subjectId: formData.get("subjectId"),
    teacherId: formData.get("teacherId"),
    classroomId: formData.get("classroomId") || undefined,
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const {
    classId,
    subjectId,
    teacherId,
    classroomId,
    dayOfWeek,
    startTime,
    endTime,
  } = parsed.data;

  if (startTime >= endTime)
    return "La hora de inicio debe ser antes que la de fin.";

  // Verificar que el profesor no tenga choque de horario en ese día/franja en otra clase
  const conflict = await prisma.schedule.findFirst({
    where: {
      teacherId,
      dayOfWeek,
      OR: [{ startTime: { lt: endTime }, endTime: { gt: startTime } }],
    },
  });
  if (conflict)
    return "El profesor ya tiene una clase asignada en ese horario.";

  await prisma.schedule.create({
    data: {
      classId,
      subjectId,
      teacherId,
      classroomId: classroomId || null,
      dayOfWeek,
      startTime,
      endTime,
    },
  });

  revalidatePath(`/clases/${classId}/horario`);
  return undefined;
}

export async function deleteScheduleSlotAction(id: string, classId: string) {
  await prisma.schedule.delete({ where: { id } });
  revalidatePath(`/clases/${classId}/horario`);
}
