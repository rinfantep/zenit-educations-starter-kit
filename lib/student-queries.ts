import { prisma } from "@/lib/prisma";


export async function getClassesForFilter() {
  return prisma.schoolClass.findMany({
    include: { grade: true },
    orderBy: { name: "asc" },
  });
}

const PAGE_SIZE = 12;

export async function getStudents({
  search,
  classId,
  page = 1,
}: {
  search?: string;
  classId?: string;
  page?: number;
}) {
  const where = {
    classId: classId || undefined,
    user: search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : undefined,
  };

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: { user: true, class: { include: { grade: true } } },
      orderBy: { user: { name: "asc" } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.student.count({ where }),
  ]);

  return { students, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}