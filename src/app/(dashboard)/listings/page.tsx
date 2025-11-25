import Link from "next/link";
import { getListings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Marketplace</h1>
          <p className="text-sm text-slate-600">Browse digital assets with escrow-protected checkout.</p>
        </div>
        <Link href="/orders" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700">
          View my orders
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <div key={listing.id} className="card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-500">{listing.category}</p>
              <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">${listing.price}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{listing.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-3">{listing.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Seller: {listing.seller?.name || "Unknown"}</span>
              <span>Status: {listing.status}</span>
            </div>
            <Link href={`/orders/new?listingId=${listing.id}`} className="btn w-full">
              Buy with escrow
            </Link>
          </div>
        ))}
      </div>
      {listings.length === 0 && (
        <div className="card p-6 text-center text-sm text-slate-600">No listings yet. Be the first to sell an asset.</div>
      )}
    </div>
  );
}
