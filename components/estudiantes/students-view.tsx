"use client";

import { useViewStore } from "@/store/view-store";
import { StudentsTable } from "./students-table";
import { StudentsGrid } from "./students-grid";
import type { Student, User, SchoolClass, Grade } from "@prisma/client";

type StudentWithRelations = Student & {
  user: User;
  class: (SchoolClass & { grade: Grade }) | null;
};

export function StudentsView({
  students,
}: {
  students: StudentWithRelations[];
}) {
  const { studentsView } = useViewStore();

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          No se encontraron estudiantes.
        </p>
      </div>
    );
  }

  return studentsView === "table" ? (
    <StudentsTable students={students} />
  ) : (
    <StudentsGrid students={students} />
  );
}
