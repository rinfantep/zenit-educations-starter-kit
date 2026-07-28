import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { InvoiceStatus } from "@prisma/client";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe no configurado." },
      { status: 400 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;

    if (invoiceId) {
      const amountPaid = (session.amount_total ?? 0) / 100;

      await prisma.$transaction([
        prisma.payment.create({
          data: {
            invoiceId,
            amount: amountPaid,
            method: "stripe",
            reference: session.id,
          },
        }),
        prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: InvoiceStatus.PAID },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
