"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const teacherSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  subjectIds: z.array(z.string()).optional(),
});

async function generateTeacherCode() {
  const year = new Date().getFullYear();
  const count = await prisma.teacher.count({
    where: { teacherCode: { startsWith: `PROF-${year}-` } },
  });
  const next = (count + 1).toString().padStart(3, "0");
  return `PROF-${year}-${next}`;
}

export async function createTeacherAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  const parsed = teacherSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    specialty: formData.get("specialty") || undefined,
    subjectIds: formData.getAll("subjectIds") as string[],
  });

  if (!parsed.success) return parsed.error.issues[0].message;

  const { name, email, phone, specialty, subjectIds } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return "Ya existe un usuario con ese correo.";

  const teacherCode = await generateTeacherCode();
  const tempPassword = await bcrypt.hash(
    `Zenith${new Date().getFullYear()}!`,
    10,
  );

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, password: tempPassword, role: Role.TEACHER },
      });

      const teacher = await tx.teacher.create({
        data: { userId: user.id, teacherCode, phone, specialty },
      });

      if (subjectIds && subjectIds.length > 0) {
        await tx.teacherSubject.createMany({
          data: subjectIds.map((subjectId) => ({
            teacherId: teacher.id,
            subjectId,
          })),
        });
      }
    });
  } catch {
    return "Ocurrió un error al crear el profesor. Intentá de nuevo.";
  }

  redirect("/profesores");
}
