import Link from "next/link";
import { getOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Orders</h1>
          <p className="text-sm text-slate-600">Track your escrow deals and countdowns.</p>
        </div>
        <Link href="/listings" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          Browse listings
        </Link>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-brand-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Order #{order.id}</p>
                <p className="text-sm text-slate-600">{order.listing?.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">${order.totalPrice}</p>
                <p className="text-xs text-slate-500">Status: {order.status}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {orders.length === 0 && <div className="card p-6 text-center text-sm text-slate-600">No orders yet.</div>}
    </div>
  );
}
