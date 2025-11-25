import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  requireRole(user, ["admin"] as any);
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { accessDetailsSentToBuyer: true },
  });

  await prisma.message.create({
    data: {
      content: "Admin forwarded credentials to buyer.",
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
