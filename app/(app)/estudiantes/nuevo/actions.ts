"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

const studentSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  address: z.string().optional(),
  phone: z.string().optional(),
  classId: z.string().optional(),
});

async function generateStudentCode() {
  const year = new Date().getFullYear();
  const count = await prisma.student.count({
    where: { studentCode: { startsWith: `EST-${year}-` } },
  });
  const next = (count + 1).toString().padStart(4, "0");
  return `EST-${year}-${next}`;
}

export async function createStudentAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  const parsed = studentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    birthDate: formData.get("birthDate"),
    address: formData.get("address") || undefined,
    phone: formData.get("phone") || undefined,
    classId: formData.get("classId") || undefined,
  });

  if (!parsed.success) {
    return parsed.error.issues[0].message;
  }

  const { name, email, birthDate, address, phone, classId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return "Ya existe un usuario con ese correo.";

  const studentCode = await generateStudentCode();
  const tempPassword = await bcrypt.hash(
    `Zenith${new Date().getFullYear()}!`,
    10,
  );

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: tempPassword,
          role: Role.STUDENT,
        },
      });

      await tx.student.create({
        data: {
          userId: user.id,
          studentCode,
          birthDate: new Date(birthDate),
          address,
          phone,
          classId: classId || null,
        },
      });
    });
  } catch {
    return "Ocurrió un error al crear el estudiante. Intentá de nuevo.";
  }

  redirect("/estudiantes");
}
