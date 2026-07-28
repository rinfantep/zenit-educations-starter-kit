import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

export async function getTeachers(page: number = 1) {
  const [teachers, total] = await Promise.all([
    prisma.teacher.findMany({
      include: {
        user: true,
        subjects: { include: { subject: true } },
        classesLed: true,
      },
      orderBy: { user: { name: "asc" } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.teacher.count(),
  ]);

  return { teachers, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}
