import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["buyer", "seller", "admin"]).default("buyer"),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }
  const { name, email, password, role } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Email already registered" }, { status: 400 });
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      emailVerified: null,
      wallet: { create: {} },
    },
  });
  const token = signToken({ userId: user.id, role: user.role });
  setAuthCookie(token);
  return NextResponse.json({ user: { id: user.id, email: user.email }, message: "Registered" });
}
