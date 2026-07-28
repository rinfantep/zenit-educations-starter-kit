"use server";

import { auth } from "@/auth";
import { logAudit } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const invoiceSchema = z.object({
  studentId: z.string().min(1, "Seleccioná un estudiante"),
  concept: z.string().min(2, "El concepto es requerido"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
  dueDate: z.string().min(1, "La fecha de vencimiento es requerida"),
});

export async function createInvoiceAction(_prev: string | undefined, formData: FormData) {
  const session = await auth();
  const parsed = invoiceSchema.safeParse({
    studentId: formData.get("studentId"),
    concept: formData.get("concept"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const invoice = await prisma.invoice.create({
    data: {
      studentId: parsed.data.studentId,
      concept: parsed.data.concept,
      amount: parsed.data.amount,
      dueDate: new Date(parsed.data.dueDate),
      status: InvoiceStatus.PENDING,
    },
    include: { student: { include: { user: true } } },
  });

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: "create",
      entity: "Invoice",
      entityId: invoice.id,
      entityName: `${invoice.concept} — ${invoice.student.user.name}`,
    });
  }

  revalidatePath("/finanzas");
  redirect("/finanzas");
}

const paymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.coerce.number().positive(),
  method: z.string().min(1),
  reference: z.string().optional(),
});

export async function registerPaymentAction(_prev: string | undefined, formData: FormData) {
  const session = await auth();
  const parsed = paymentSchema.safeParse({
    invoiceId: formData.get("invoiceId"),
    amount: formData.get("amount"),
    method: formData.get("method"),
    reference: formData.get("reference") || undefined,
  });
  if (!parsed.success) return parsed.error.issues[0].message;

  const { invoiceId, amount, method, reference } = parsed.data;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { payments: true, student: { include: { user: true } } },
  });
  if (!invoice) return "Factura no encontrada.";

  const alreadyPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);
  const newTotal = alreadyPaid + amount;

  await prisma.$transaction([
    prisma.payment.create({ data: { invoiceId, amount, method, reference } }),
    prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newTotal >= invoice.amount ? InvoiceStatus.PAID : InvoiceStatus.PENDING },
    }),
  ]);

  if (session?.user) {
    await logAudit({
      userId: session.user.id,
      action: "create",
      entity: "Payment",
      entityId: invoiceId,
      entityName: `$${amount} — ${invoice.student.user.name}`,
      metadata: { method },
    });
  }

  revalidatePath("/finanzas");
  revalidatePath("/dashboard");
  return undefined;
}

export async function markOverdueAction() {
  await prisma.invoice.updateMany({
    where: { status: InvoiceStatus.PENDING, dueDate: { lt: new Date() } },
    data: { status: InvoiceStatus.OVERDUE },
  });
}
