import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";

const PAGE_SIZE = 15;

export async function getInvoices(statusFilter?: string, page: number = 1) {
  const where =
    statusFilter && statusFilter !== "ALL"
      ? { status: statusFilter as InvoiceStatus }
      : undefined;

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { student: { include: { user: true } }, payments: true },
      orderBy: { dueDate: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getFinanceSummary() {
  const invoices = await prisma.invoice.findMany({
    include: { payments: true },
  });

  const totalPending = invoices
    .filter((i) => i.status === InvoiceStatus.PENDING)
    .reduce((acc, i) => acc + i.amount, 0);

  const totalPaid = invoices
    .filter((i) => i.status === InvoiceStatus.PAID)
    .reduce((acc, i) => acc + i.amount, 0);

  const totalOverdue = invoices
    .filter((i) => i.status === InvoiceStatus.OVERDUE)
    .reduce((acc, i) => acc + i.amount, 0);

  return { totalPending, totalPaid, totalOverdue, count: invoices.length };
}
