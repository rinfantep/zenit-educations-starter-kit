"use server";

import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const classSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  year: z.coerce.number().int().min(2020),
  gradeId: z.string().min(1, "Seleccioná un grado"),
  classroomId: z.string().optional(),
  homeroomTeacherId: z.string().optional(),
});

export async function createClassAction(
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = classSchema.safeParse({
    name: formData.get("name"),
    year: formData.get("year"),
    gradeId: formData.get("gradeId"),
    classroomId: formData.get("classroomId") || undefined,
    homeroomTeacherId: formData.get("homeroomTeacherId") || undefined,
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  const { name, year, gradeId, classroomId, homeroomTeacherId } = parsed.data;

  const existing = await prisma.schoolClass.findUnique({
    where: { name_year: { name, year } },
  });
  if (existing) return "Ya existe una clase con ese nombre para ese año.";

  await prisma.schoolClass.create({
    data: {
      name,
      year,
      gradeId,
      classroomId: classroomId || null,
      homeroomTeacherId: homeroomTeacherId || null,
    },
  });

  revalidatePath("/clases");
  redirect("/clases");
}

export async function deleteClassAction(id: string) {
  const session = await auth();
  const schoolClass = await prisma.schoolClass.findUnique({
    where: { id },
    include: { grade: true },
  });
  if (!schoolClass) return;

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: "delete",
      entity: "SchoolClass",
      entityId: id,
      entityName: `${schoolClass.grade.name} — ${schoolClass.name}`,
    });
  }

  await prisma.schoolClass.delete({ where: { id } });
  revalidatePath("/clases");
}

const updateClassSchema = z.object({
  classroomId: z.string().optional(),
  homeroomTeacherId: z.string().optional(),
});

export async function updateClassAction(classId: string, formData: FormData) {
  const parsed = updateClassSchema.safeParse({
    classroomId: formData.get("classroomId") || undefined,
    homeroomTeacherId: formData.get("homeroomTeacherId") || undefined,
  });
  if (!parsed.success) return;

  await prisma.schoolClass.update({
    where: { id: classId },
    data: {
      classroomId: parsed.data.classroomId || null,
      homeroomTeacherId: parsed.data.homeroomTeacherId || null,
    },
  });

  revalidatePath("/clases");
}
