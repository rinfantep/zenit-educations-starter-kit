"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const gradeEntrySchema = z.object({
  studentId: z.string(),
  score: z.number().min(0),
});

const batchSchema = z.object({
  subjectId: z.string().min(1),
  periodId: z.string().min(1),
  type: z.string().min(1),
  maxScore: z.number().positive(),
  entries: z.array(gradeEntrySchema),
});

export async function saveGradesAction(input: {
  subjectId: string;
  periodId: string;
  type: string;
  maxScore: number;
  entries: { studentId: string; score: number }[];
}) {
  const parsed = batchSchema.safeParse(input);
  if (!parsed.success) return { error: "Datos inválidos." };

  const { subjectId, periodId, type, maxScore, entries } = parsed.data;

  try {
    await prisma.$transaction(
      entries.map((e) =>
        prisma.evaluationEntry.create({
          data: {
            studentId: e.studentId,
            subjectId,
            periodId,
            type,
            score: e.score,
            maxScore,
          },
        }),
      ),
    );
  } catch {
    return { error: "Ocurrió un error al guardar las notas." };
  }

  revalidatePath("/evaluaciones");
  revalidatePath("/dashboard");
  return { success: true };
}
