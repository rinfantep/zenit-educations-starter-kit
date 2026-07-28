import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getParentChildren } from "@/lib/parent-queries";
import { ChildCard } from "@/components/padres/child-card";

export default async function MisHijosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const children = await getParentChildren(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Mis hijos
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Seguimiento académico, asistencia y estado de cuenta.
        </p>
      </div>

      {children.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
          <p className="text-sm text-[var(--text-muted)]">
            No hay estudiantes vinculados a tu cuenta todavía. Contactá a la
            administración del colegio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {children.map((child) => {
            const attendanceRate =
              child.attendances.length > 0
                ? Math.round(
                    (child.attendances.filter((a) => a.status === "PRESENT")
                      .length /
                      child.attendances.length) *
                      100,
                  )
                : null;

            const avgScore =
              child.evaluations.length > 0
                ? Math.round(
                    (child.evaluations.reduce(
                      (acc, e) => acc + (e.score / e.maxScore) * 100,
                      0,
                    ) /
                      child.evaluations.length) *
                      10,
                  ) / 10
                : null;

            const pendingBalance = child.invoices.reduce((acc, inv) => {
              const paid = inv.payments.reduce((a, p) => a + p.amount, 0);
              return acc + (inv.amount - paid);
            }, 0);

            return (
              <ChildCard
                key={child.id}
                name={child.user.name}
                code={child.studentCode}
                className={
                  child.class
                    ? `${child.class.grade.name} — ${child.class.name}`
                    : "Sin asignar"
                }
                attendanceRate={attendanceRate}
                avgScore={avgScore}
                pendingBalance={pendingBalance}
                recentEvaluations={child.evaluations.map((e) => ({
                  id: e.id,
                  subject: e.subject.name,
                  period: e.period.name,
                  score: e.score,
                  maxScore: e.maxScore,
                }))}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
