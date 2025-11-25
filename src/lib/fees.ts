export const BUYER_FEE_PERCENT = 2;
export const SELLER_FEE_PERCENT = 2;

export function calculateFees(basePrice: number) {
  const buyerFee = Number((basePrice * (BUYER_FEE_PERCENT / 100)).toFixed(2));
  const sellerFee = Number((basePrice * (SELLER_FEE_PERCENT / 100)).toFixed(2));
  const totalPrice = Number((basePrice + buyerFee).toFixed(2));
  const platformRevenue = Number((buyerFee + sellerFee).toFixed(2));
  return { buyerFee, sellerFee, platformRevenue, totalPrice };
}
