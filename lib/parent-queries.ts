import { prisma } from "@/lib/prisma";

export async function getParentChildren(userId: string) {
  const parentProfile = await prisma.parentProfile.findUnique({
    where: { userId },
    include: {
      children: {
        include: {
          user: true,
          class: { include: { grade: true } },
          attendances: { orderBy: { date: "desc" }, take: 30 },
          evaluations: {
            include: { subject: true, period: true },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
          invoices: {
            include: { payments: true },
            where: { status: { in: ["PENDING", "OVERDUE"] } },
          },
        },
      },
    },
  });

  return parentProfile?.children ?? [];
}
