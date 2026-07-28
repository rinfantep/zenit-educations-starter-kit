import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  if (!isStripeConfigured || !stripe) {
    return NextResponse.json(
      { error: "Stripe no está configurado." },
      { status: 400 },
    );
  }

  const { invoiceId } = await req.json();

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { student: { include: { user: true } }, payments: true },
  });
  if (!invoice)
    return NextResponse.json(
      { error: "Factura no encontrada." },
      { status: 404 },
    );

  const alreadyPaid = invoice.payments.reduce((acc, p) => acc + p.amount, 0);
  const remaining = invoice.amount - alreadyPaid;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: invoice.concept,
            description: `Estudiante: ${invoice.student.user.name}`,
          },
          unit_amount: Math.round(remaining * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { invoiceId: invoice.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/finanzas?paid=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/finanzas`,
  });

  return NextResponse.json({ url: session.url });
}
