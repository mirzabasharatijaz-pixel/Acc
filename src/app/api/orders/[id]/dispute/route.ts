import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ reason: z.string().min(3) });

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 });

  const updated = await prisma.order.update({ where: { id: order.id }, data: { status: "disputed" } });
  await prisma.dispute.create({ data: { orderId: order.id, reason: parsed.data.reason } });
  await prisma.message.create({
    data: {
      content: "Dispute opened; payout paused.",
      system: true,
      senderId: user.id,
      conversation: {
        connectOrCreate: { where: { orderId: order.id }, create: { orderId: order.id } },
      },
    },
  });
  return NextResponse.json({ order: updated });
}
