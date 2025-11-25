import { prisma } from "./prisma";
import { calculateFees } from "./fees";
import { addDays } from "date-fns";

export async function getListings() {
  try {
    return await prisma.listing.findMany({ include: { seller: true } });
  } catch (error) {
    console.warn("Database unavailable, using fallback listing", error);
    return [
      {
        id: "demo-listing",
        title: "Demo asset",
        description: "Sample listing used because the database is not available.",
        category: "demo",
        tags: ["sample"],
        price: 500,
        sellerId: "demo-seller",
        seller: { name: "Demo Seller" },
        status: "active",
      } as any,
    ];
  }
}

export async function getOrders() {
  try {
    return await prisma.order.findMany({ include: { listing: true } });
  } catch (error) {
    console.warn("Database unavailable, using fallback orders", error);
    return [
      {
        id: "demo-order",
        listingId: "demo-listing",
        listing: { title: "Demo asset" },
        status: "in_escrow",
        totalPrice: 510,
      } as any,
    ];
  }
}

export async function getOrderById(id: string) {
  try {
    return await prisma.order.findUnique({ where: { id }, include: { listing: true } });
  } catch (error) {
    console.warn("Database unavailable, using fallback order", error);
    const { buyerFee, sellerFee, platformRevenue, totalPrice } = calculateFees(500);
    return {
      id,
      listingId: "demo-listing",
      listing: { title: "Demo asset" },
      status: "in_escrow",
      totalPrice,
      buyerFee,
      sellerFee,
      platformRevenue,
      paymentAt: new Date().toISOString(),
      protectionEndsAt: addDays(new Date(), 7).toISOString(),
      accessDetailsFromSeller: "demo@example.com / password",
      accessDetailsSentToBuyer: false,
    } as any;
  }
}
