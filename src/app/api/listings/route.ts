import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  price: z.number().positive(),
});

export async function GET() {
  const listings = await prisma.listing.findMany({ include: { seller: true } });
  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: "Invalid input" }, { status: 400 });

  const listing = await prisma.listing.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      tags: parsed.data.tags,
      price: parsed.data.price,
      sellerId: user.id,
    },
  });
  return NextResponse.json({ listing });
}
