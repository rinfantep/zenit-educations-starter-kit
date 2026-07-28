"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";

const updateSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  subjectIds: z.array(z.string()).optional(),
  classIds: z.array(z.string()).optional(),
});

export async function updateTeacherAction(
  teacherId: string,
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    specialty: formData.get("specialty") || undefined,
    subjectIds: formData.getAll("subjectIds") as string[],
    classIds: formData.getAll("classIds") as string[],
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
  if (!teacher) return "Profesor no encontrado.";

  const {
    name,
    phone,
    specialty,
    subjectIds = [],
    classIds = [],
  } = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: teacher.userId }, data: { name } });
    await tx.teacher.update({
      where: { id: teacherId },
      data: { phone, specialty },
    });

    // Sincronizar materias: borrar todas y recrear las seleccionadas
    await tx.teacherSubject.deleteMany({ where: { teacherId } });
    if (subjectIds.length > 0) {
      await tx.teacherSubject.createMany({
        data: subjectIds.map((subjectId) => ({ teacherId, subjectId })),
      });
    }

    // Sincronizar clases a cargo: quitar este profesor de todas sus clases actuales,
    // luego asignarlo a las seleccionadas
    await tx.schoolClass.updateMany({
      where: { homeroomTeacherId: teacherId },
      data: { homeroomTeacherId: null },
    });
    if (classIds.length > 0) {
      await tx.schoolClass.updateMany({
        where: { id: { in: classIds } },
        data: { homeroomTeacherId: teacherId },
      });
    }
  });

  revalidatePath(`/profesores/${teacherId}`);
  revalidatePath("/profesores");
  revalidatePath("/clases");
  return undefined;
}

export async function toggleTeacherActiveAction(teacherId: string) {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: { user: true },
  });
  if (!teacher) return;

  const newActive = !teacher.user.active;
  await prisma.user.update({
    where: { id: teacher.userId },
    data: { active: newActive },
  });

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: newActive ? "reactivate" : "deactivate",
      entity: "Teacher",
      entityId: teacherId,
      entityName: teacher.user.name,
    });
  }

  revalidatePath(`/profesores/${teacherId}`);
  revalidatePath("/profesores");
}

export async function deleteTeacherAction(teacherId: string) {
  const session = await auth();
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      user: true,
      _count: { select: { classesLed: true, schedules: true } },
    },
  });
  if (!teacher) return { error: "Profesor no encontrado." };

  const hasHistory =
    teacher._count.classesLed > 0 || teacher._count.schedules > 0;
  if (hasHistory) {
    return {
      error:
        "Este profesor tiene clases o horarios asignados. Desactivalo en vez de eliminarlo.",
    };
  }

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: "delete",
      entity: "Teacher",
      entityId: teacherId,
      entityName: teacher.user.name,
    });
  }

  await prisma.user.delete({ where: { id: teacher.userId } });
  redirect("/profesores");
}
