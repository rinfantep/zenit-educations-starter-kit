import { prisma } from "@/lib/prisma";
import { CatalogPanel } from "@/components/configuracion/catalog-panel";
import {
  createGrade,
  deleteGrade,
  createSubject,
  deleteSubject,
  createClassroom,
  deleteClassroom,
  createPeriod,
  deletePeriod,
} from "./actions";

export default async function ConfiguracionPage() {
  const [grades, subjects, classrooms] = await Promise.all([
    prisma.grade.findMany({ orderBy: { order: "asc" } }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
    prisma.classroom.findMany({ orderBy: { name: "asc" } }),
  ]);

  const periods = await prisma.academicPeriod.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Configuración académica
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Catálogos base para armar clases: grados, materias y aulas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CatalogPanel
          title="Grados"
          description="Niveles académicos (ej. 5to Primaria)"
          items={grades.map((g) => ({
            id: g.id,
            display: `${g.name} — ${g.level}`,
          }))}
          fields={[
            { name: "name", label: "Nombre", placeholder: "5to Grado" },
            { name: "level", label: "Nivel", placeholder: "Primaria" },
            { name: "order", label: "Orden", type: "number", placeholder: "5" },
          ]}
          createAction={createGrade}
          deleteAction={deleteGrade}
        />

        <CatalogPanel
          title="Materias"
          description="Asignaturas del plan de estudios"
          items={subjects.map((s) => ({
            id: s.id,
            display: `${s.name} (${s.code})`,
          }))}
          fields={[
            { name: "name", label: "Nombre", placeholder: "Matemáticas" },
            { name: "code", label: "Código", placeholder: "MAT-01" },
          ]}
          createAction={createSubject}
          deleteAction={deleteSubject}
        />

        <CatalogPanel
          title="Aulas"
          description="Espacios físicos disponibles"
          items={classrooms.map((c) => ({
            id: c.id,
            display: `${c.name} — ${c.capacity} alumnos`,
          }))}
          fields={[
            { name: "name", label: "Nombre", placeholder: "Aula 101" },
            {
              name: "capacity",
              label: "Capacidad",
              type: "number",
              placeholder: "30",
            },
          ]}
          createAction={createClassroom}
          deleteAction={deleteClassroom}
        />

        <CatalogPanel
          title="Períodos"
          description="Trimestres o semestres del año lectivo"
          items={periods.map((p) => ({
            id: p.id,
            display: `${p.name} (${p.year}) — ${p.startDate.toLocaleDateString("es-ES")} a ${p.endDate.toLocaleDateString("es-ES")}`,
          }))}
          fields={[
            { name: "name", label: "Nombre", placeholder: "Primer Trimestre" },
            { name: "year", label: "Año", type: "number", placeholder: "2026" },
            { name: "startDate", label: "Inicio", type: "date" },
            { name: "endDate", label: "Fin", type: "date" },
          ]}
          createAction={createPeriod}
          deleteAction={deletePeriod}
        />
      </div>
    </div>
  );
}
