import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CommunicationTabs } from "@/components/comunicacion/communication-tabs";

export default async function ComunicacionPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [announcements, users, conversations] = await Promise.all([
    prisma.announcement.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.user.findMany({
      where: { id: { not: session.user.id }, active: true },
      orderBy: { name: "asc" },
    }),
    prisma.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
      },
      include: { sender: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const canBroadcast =
    session.user.role === "SUPER_ADMIN" || session.user.role === "DIRECTOR";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Comunicación
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Avisos institucionales y mensajería directa.
        </p>
      </div>

      <CommunicationTabs
        currentUserId={session.user.id}
        canBroadcast={canBroadcast}
        announcements={announcements.map((a) => ({
          id: a.id,
          title: a.title,
          content: a.content,
          authorName: a.author.name,
          audience: a.audience,
          createdAt: a.createdAt.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }))}
        users={users.map((u) => ({ id: u.id, name: u.name, role: u.role }))}
        messages={conversations.map((m) => ({
          id: m.id,
          senderId: m.senderId,
          senderName: m.sender.name,
          receiverId: m.receiverId,
          content: m.content,
          createdAt: m.createdAt.toLocaleString("es-ES", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))}
      />
    </div>
  );
}
