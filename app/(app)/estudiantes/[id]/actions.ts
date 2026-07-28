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
  address: z.string().optional(),
  classId: z.string().optional(),
});

export async function updateStudentAction(
  studentId: string,
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
    classId: formData.get("classId") || undefined,
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return "Estudiante no encontrado.";

  await prisma.$transaction([
    prisma.user.update({
      where: { id: student.userId },
      data: { name: parsed.data.name },
    }),
    prisma.student.update({
      where: { id: studentId },
      data: {
        phone: parsed.data.phone,
        address: parsed.data.address,
        classId: parsed.data.classId || null,
      },
    }),
  ]);

  revalidatePath(`/estudiantes/${studentId}`);
  revalidatePath("/estudiantes");
  return undefined;
}

export async function toggleStudentActiveAction(studentId: string) {
  const session = await auth();
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });
  if (!student) return;

  const newActive = !student.user.active;
  await prisma.user.update({
    where: { id: student.userId },
    data: { active: newActive },
  });

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: newActive ? "reactivate" : "deactivate",
      entity: "Student",
      entityId: studentId,
      entityName: student.user.name,
    });
  }

  revalidatePath(`/estudiantes/${studentId}`);
  revalidatePath("/estudiantes");
}

export async function deleteStudentAction(studentId: string) {
  const session = await auth();
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      _count: {
        select: {
          evaluations: true,
          attendances: true,
          invoices: true,
          documents: true,
        },
      },
    },
  });
  if (!student) return { error: "Estudiante no encontrado." };

  const hasHistory =
    student._count.evaluations > 0 ||
    student._count.attendances > 0 ||
    student._count.invoices > 0 ||
    student._count.documents > 0;

  if (hasHistory) {
    return {
      error:
        "Este estudiante tiene historial académico o financiero. Desactivalo en vez de eliminarlo.",
    };
  }

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: "delete",
      entity: "Student",
      entityId: studentId,
      entityName: student.user.name,
    });
  }

  await prisma.user.delete({ where: { id: student.userId } });

  redirect("/estudiantes");
}

export async function updateStudentPhotoAction(
  studentId: string,
  imageUrl: string,
) {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return;

  await prisma.user.update({
    where: { id: student.userId },
    data: { image: imageUrl },
  });
  revalidatePath(`/estudiantes/${studentId}`);
  revalidatePath("/estudiantes");
}

export async function addStudentDocumentAction(
  studentId: string,
  name: string,
  type: string,
  url: string,
) {
  await prisma.document.create({ data: { studentId, name, type, url } });
  revalidatePath(`/estudiantes/${studentId}`);
}
