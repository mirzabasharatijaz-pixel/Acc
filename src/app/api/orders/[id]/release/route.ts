import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { seller: { include: { wallet: true } } } });
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });
  const now = new Date();
  const canAutoRelease = order.protectionEndsAt && new Date(order.protectionEndsAt) <= now && order.status !== "disputed";
  const isAdmin = user?.role === "admin";
  if (!canAutoRelease && !isAdmin) {
    return NextResponse.json({ message: "Protection window still active or dispute open" }, { status: 400 });
  }

  const sellerWallet = order.seller.wallet?.id || (await prisma.wallet.create({ data: { userId: order.sellerId } })).id;
  const sellerTake = Number(order.totalPrice) - Number(order.sellerFee);

  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: "completed", escrowReleasedAt: now },
    });
    await tx.wallet.update({ where: { id: sellerWallet }, data: { balance: { increment: sellerTake } } });
    await tx.transactionLog.create({
      data: {
        walletId: sellerWallet,
        orderId: order.id,
        amount: sellerTake,
        type: "seller_payout",
        buyerFee: order.buyerFee,
        sellerFee: order.sellerFee,
        platformRevenue: order.platformRevenue,
      },
    });
    return updatedOrder;
  });

  await prisma.message.create({
    data: {
      content: "Funds released to seller.",
      system: true,
      senderId: user?.id || order.sellerId,
      conversation: {
        connectOrCreate: { where: { orderId: order.id }, create: { orderId: order.id } },
      },
    },
  });

  return NextResponse.json({ order: updated });
}
