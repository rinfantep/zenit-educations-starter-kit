"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const announcementSchema = z.object({
  title: z.string().min(2, "El título es requerido"),
  content: z.string().min(5, "El contenido es requerido"),
  audience: z
    .array(z.nativeEnum(Role))
    .min(1, "Seleccioná al menos un destinatario"),
});

export async function createAnnouncementAction(
  _prev: string | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) return "No autorizado.";

  const parsed = announcementSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    audience: formData.getAll("audience"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const { title, content, audience } = parsed.data;

  await prisma.$transaction(async (tx) => {
    const announcement = await tx.announcement.create({
      data: { title, content, audience, authorId: session.user.id },
    });

    const recipients = await tx.user.findMany({
      where: { role: { in: audience }, active: true },
      select: { id: true },
    });

    await tx.notification.createMany({
      data: recipients.map((r) => ({
        userId: r.id,
        title: "Nuevo aviso: " + announcement.title,
        body: content.slice(0, 120),
      })),
    });
  });

  revalidatePath("/comunicacion");
  return undefined;
}

const messageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1, "El mensaje no puede estar vacío"),
});

export async function sendMessageAction(
  _prev: string | undefined,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user) return "No autorizado.";

  const parsed = messageSchema.safeParse({
    receiverId: formData.get("receiverId"),
    content: formData.get("content"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.$transaction([
    prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: parsed.data.receiverId,
        content: parsed.data.content,
      },
    }),
    prisma.notification.create({
      data: {
        userId: parsed.data.receiverId,
        title: "Nuevo mensaje",
        body: parsed.data.content.slice(0, 100),
      },
    }),
  ]);

  revalidatePath("/comunicacion");
  return undefined;
}

export async function markNotificationReadAction(id: string) {
  await prisma.notification.update({ where: { id }, data: { read: true } });
  revalidatePath("/comunicacion");
}
