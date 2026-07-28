"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ---- Grados ----
const gradeSchema = z.object({
  name: z.string().min(2),
  level: z.string().min(2),
  order: z.coerce.number().int(),
});

export async function createGrade(
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = gradeSchema.safeParse({
    name: formData.get("name"),
    level: formData.get("level"),
    order: formData.get("order"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.grade.create({ data: parsed.data });
  revalidatePath("/configuracion");
  return undefined;
}

export async function deleteGrade(id: string) {
  await prisma.grade.delete({ where: { id } });
  revalidatePath("/configuracion");
}

// ---- Materias ----
const subjectSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
});

export async function createSubject(
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = subjectSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const exists = await prisma.subject.findUnique({
    where: { code: parsed.data.code },
  });
  if (exists) return "Ya existe una materia con ese código.";

  await prisma.subject.create({ data: parsed.data });
  revalidatePath("/configuracion");
  return undefined;
}

export async function deleteSubject(id: string) {
  await prisma.subject.delete({ where: { id } });
  revalidatePath("/configuracion");
}

// ---- Aulas ----
const classroomSchema = z.object({
  name: z.string().min(2),
  capacity: z.coerce.number().int().positive(),
});

export async function createClassroom(
  _prev: string | undefined,
  formData: FormData,
) {
  const parsed = classroomSchema.safeParse({
    name: formData.get("name"),
    capacity: formData.get("capacity"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.classroom.create({ data: parsed.data });
  revalidatePath("/configuracion");
  return undefined;
}

export async function deleteClassroom(id: string) {
  await prisma.classroom.delete({ where: { id } });
  revalidatePath("/configuracion");
}

// ---- Períodos académicos ----
const periodSchema = z.object({
  name: z.string().min(2),
  year: z.coerce.number().int(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export async function createPeriod(_prev: string | undefined, formData: FormData) {
  const parsed = periodSchema.safeParse({
    name: formData.get("name"),
    year: formData.get("year"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  await prisma.academicPeriod.create({
    data: {
      name: parsed.data.name,
      year: parsed.data.year,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
    },
  });
  revalidatePath("/configuracion");
  return undefined;
}

export async function deletePeriod(id: string) {
  await prisma.academicPeriod.delete({ where: { id } });
  revalidatePath("/configuracion");
}