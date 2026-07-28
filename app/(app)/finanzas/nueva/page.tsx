import { prisma } from "@/lib/prisma";
import { InvoiceForm } from "@/components/finanzas/invoice-form";

export default async function NuevaFacturaPage() {
  const students = await prisma.student.findMany({
    include: { user: true },
    orderBy: { user: { name: "asc" } },
  });

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--foreground)]">
          Nueva factura
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Matrícula, mensualidad u otro concepto.
        </p>
      </div>

      <InvoiceForm
        students={students.map((s) => ({ id: s.id, display: s.user.name }))}
      />
    </div>
  );
}
