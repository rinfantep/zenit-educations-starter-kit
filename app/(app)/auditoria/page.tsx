import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAuditLogs } from "@/lib/audit-queries";
import { Pagination } from "@/components/shared/pagination";
import { ShieldAlert } from "lucide-react";

const actionLabels: Record<string, string> = {
  create: "Creó",
  update: "Editó",
  delete: "Eliminó",
  deactivate: "Desactivó",
  reactivate: "Reactivó",
};

const actionColors: Record<string, string> = {
  create: "text-emerald-500",
  update: "text-blue-500",
  delete: "text-red-500",
  deactivate: "text-amber-500",
  reactivate: "text-emerald-500",
};

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "DIRECTOR") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { logs, total, totalPages } = await getAuditLogs(page);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Auditoría
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          {total} {total === 1 ? "acción registrada" : "acciones registradas"}
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-subtle)] py-16 text-center">
          <ShieldAlert size={24} className="mx-auto text-[var(--text-muted)]" />
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            No hay actividad registrada todavía.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]">
          <div className="divide-y divide-[var(--border-subtle)]">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div>
                  <p className="text-[var(--foreground)]">
                    <span className="font-medium">{log.user.name}</span>{" "}
                    <span className={actionColors[log.action]}>
                      {actionLabels[log.action] ?? log.action}
                    </span>{" "}
                    {log.entity}
                    {log.entityName && (
                      <span className="text-[var(--text-muted)]">
                        {" "}
                        — {log.entityName}
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  {log.createdAt.toLocaleString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
