import { NextResponse } from "next/server";
import { BUYER_FEE_PERCENT, SELLER_FEE_PERCENT } from "@/lib/fees";

export async function GET() {
  return NextResponse.json({ buyerFeePercent: BUYER_FEE_PERCENT, sellerFeePercent: SELLER_FEE_PERCENT });
}
