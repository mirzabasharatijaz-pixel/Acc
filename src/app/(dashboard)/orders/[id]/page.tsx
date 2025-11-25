import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/data";
import { Countdown } from "@/app/components/countdown";
import { OrderActions } from "@/app/components/order-actions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) return notFound();

  const buyerFee = order.buyerFee ?? 0;
  const sellerFee = order.sellerFee ?? 0;
  const basePrice = Number(order.totalPrice) - Number(buyerFee || 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Order #{order.id}</p>
          <h1 className="text-2xl font-semibold text-slate-900">{order.listing?.title}</h1>
          <p className="text-sm text-slate-600">Status: {order.status}</p>
        </div>
        <OrderActions orderId={order.id} role="buyer" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 space-y-2 lg:col-span-2">
          <p className="text-sm font-semibold text-slate-900">Protection window</p>
          {order.protectionEndsAt ? (
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Countdown target={order.protectionEndsAt} />
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                Started {order.paymentAt ? new Date(order.paymentAt).toLocaleString() : "pending"}
              </span>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Payment not captured yet.</p>
          )}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700">
            <p>After 7 days without an open dispute, funds release automatically to the seller.</p>
            <p>Disputes pause the countdown until resolved by an admin.</p>
          </div>
        </div>
        <div className="card p-4 space-y-2">
          <p className="text-sm font-semibold text-slate-900">Payment breakdown</p>
          <div className="text-sm text-slate-700 space-y-1">
            <div className="flex justify-between"><span>Base price</span><span>${basePrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Buyer fee (2%)</span><span>${Number(buyerFee || 0).toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-slate-900"><span>Total paid</span><span>${Number(order.totalPrice).toFixed(2)}</span></div>
            <div className="flex justify-between text-xs text-slate-500"><span>Seller fee (2%)</span><span>${Number(sellerFee || 0).toFixed(2)} held</span></div>
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-2">
        <p className="text-sm font-semibold text-slate-900">Delivery</p>
        <p className="text-sm text-slate-600">Seller provides credentials to AccFlipper staff. Admin verifies and forwards to buyer.</p>
        <dl className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Seller submission</dt>
            <dd>{order.accessDetailsFromSeller || "Pending seller upload"}</dd>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Sent to buyer</dt>
            <dd>{order.accessDetailsSentToBuyer ? "Yes" : "Not yet"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
