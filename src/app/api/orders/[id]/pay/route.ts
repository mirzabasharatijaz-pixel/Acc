import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { addDays } from "date-fns";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
  if (order.status !== "pending_payment") return NextResponse.json({ message: "Payment already captured" }, { status: 400 });

  const paymentAt = new Date();
  const protectionEndsAt = addDays(paymentAt, 7);
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "in_escrow",
      paymentAt,
      protectionEndsAt,
    },
  });

  await prisma.transactionLog.create({
    data: {
      walletId: user.wallet?.id || (await prisma.wallet.create({ data: { userId: order.sellerId } })).id,
      orderId: order.id,
      amount: order.totalPrice,
      type: "buyer_payment",
      buyerFee: order.buyerFee,
      sellerFee: order.sellerFee,
      platformRevenue: order.platformRevenue,
    },
  });

  await prisma.message.create({
    data: {
      content: "Payment received. Protection period started.",
      system: true,
      senderId: user.id,
      conversation: {
        connectOrCreate: {
          where: { orderId: order.id },
          create: { orderId: order.id },
        },
      },
    },
  });

  return NextResponse.json({ order: updated });
}
