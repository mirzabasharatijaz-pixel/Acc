import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const now = new Date();
  const candidates = await prisma.order.findMany({
    where: {
      status: { in: ["in_escrow"] },
      protectionEndsAt: { lte: now },
    },
    include: { seller: { include: { wallet: true } } },
  });

  let released = 0;
  for (const order of candidates) {
    const sellerWallet = order.seller.wallet?.id || (await prisma.wallet.create({ data: { userId: order.sellerId } })).id;
    const sellerTake = Number(order.totalPrice) - Number(order.sellerFee);
    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: order.id }, data: { status: "completed", escrowReleasedAt: now } });
      await tx.wallet.update({ where: { id: sellerWallet }, data: { balance: { increment: sellerTake } } });
      await tx.transactionLog.create({
        data: {
          walletId: sellerWallet,
          orderId: order.id,
          amount: sellerTake,
          type: "auto_release",
          buyerFee: order.buyerFee,
          sellerFee: order.sellerFee,
          platformRevenue: order.platformRevenue,
        },
      });
      await tx.message.create({
        data: {
          content: "Protection window ended; funds auto-released.",
          system: true,
          senderId: order.sellerId,
          conversation: {
            connectOrCreate: { where: { orderId: order.id }, create: { orderId: order.id } },
          },
        },
      });
    });
    released += 1;
  }

  return NextResponse.json({ released });
}
