"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const linkExistingSchema = z.object({
  parentEmail: z.string().email("Email inválido"),
});

export async function linkExistingParentAction(
  studentId: string,
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = linkExistingSchema.safeParse({
    parentEmail: formData.get("parentEmail"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.parentEmail },
    include: { parent: true },
  });

  if (!user) return "No existe ningún usuario con ese correo.";
  if (user.role !== Role.PARENT)
    return "Ese usuario no tiene rol de Padre/Madre.";
  if (!user.parent)
    return "Ese usuario no tiene un perfil de padre configurado.";

  await prisma.parentProfile.update({
    where: { id: user.parent.id },
    data: { children: { connect: { id: studentId } } },
  });

  revalidatePath(`/estudiantes/${studentId}`);
  return undefined;
}

const createParentSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
});

export async function createAndLinkParentAction(
  studentId: string,
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = createParentSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const { name, email, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing)
    return "Ya existe un usuario con ese correo. Usá 'Vincular existente' en vez de crear uno nuevo.";

  const tempPassword = await bcrypt.hash(
    `Zenith${new Date().getFullYear()}!`,
    10,
  );

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: tempPassword, role: Role.PARENT },
    });

    await tx.parentProfile.create({
      data: {
        userId: user.id,
        phone,
        children: { connect: { id: studentId } },
      },
    });
  });

  revalidatePath(`/estudiantes/${studentId}`);
  return undefined;
}

export async function unlinkParentAction(
  studentId: string,
  parentProfileId: string,
) {
  await prisma.parentProfile.update({
    where: { id: parentProfileId },
    data: { children: { disconnect: { id: studentId } } },
  });
  revalidatePath(`/estudiantes/${studentId}`);
}
