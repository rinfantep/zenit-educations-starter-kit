"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  confirmPassword: z.string().min(1),
});

export async function changePasswordAction(
  _prev: string | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) return "No autorizado.";

  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const { currentPassword, newPassword, confirmPassword } = parsed.data;

  if (newPassword !== confirmPassword)
    return "Las contraseñas nuevas no coinciden.";

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.password) return "Usuario no encontrado.";

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return "La contraseña actual es incorrecta.";

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return undefined;
}
