import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_NAME = "accflipper_token";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; role: Role }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function setAuthCookie(token: string) {
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  cookies().delete(TOKEN_NAME);
}

export async function getCurrentUser() {
  const token = cookies().get(TOKEN_NAME)?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: Role };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch {
    return null;
  }
}

export function requireRole(user: any, roles: Role[]) {
  if (!user || !roles.includes(user.role as Role)) {
    throw new Error("Unauthorized");
  }
}
