import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { calculateFees } from "@/lib/fees";
import { z } from "zod";

const schema = z.object({
  listingId: z.string(),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const listing = await prisma.listing.findUnique({ where: { id: parsed.data.listingId } });
  if (!listing) return NextResponse.json({ message: "Listing not found" }, { status: 404 });

  const { buyerFee, sellerFee, platformRevenue, totalPrice } = calculateFees(Number(listing.price));
  const order = await prisma.order.create({
    data: {
      buyerId: user.id,
      sellerId: listing.sellerId,
      listingId: listing.id,
      status: "pending_payment",
      totalPrice,
      buyerFee,
      sellerFee,
      platformRevenue,
    },
  });

  return NextResponse.json({ order });
}
