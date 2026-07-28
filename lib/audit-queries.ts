import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 25;

export async function getAuditLogs(page: number = 1) {
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count(),
  ]);

  return { logs, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}
