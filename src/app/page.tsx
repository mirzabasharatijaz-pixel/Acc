import Link from "next/link";
import { ShieldCheck, Clock, MessageCircle, Wallet } from "lucide-react";

const features = [
  {
    title: "7-day buyer protection",
    description: "Funds stay in escrow for exactly 168 hours. Automatic release if no dispute is open.",
    icon: Clock,
  },
  {
    title: "Admin-verified delivery",
    description: "Seller uploads credentials to staff, who verify and forward to the buyer securely.",
    icon: ShieldCheck,
  },
  {
    title: "Integrated chat",
    description: "Conversations stay tied to each order with system updates on every step.",
    icon: MessageCircle,
  },
  {
    title: "Transparent fees",
    description: "2% buyer fee + 2% seller fee automatically tracked in platform revenue.",
    icon: Wallet,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-10 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">AccFlipper · Escrow-first marketplace</p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900">
            Buy and sell digital assets safely with a 7-day escrow timer and admin-backed delivery.
          </h1>
          <p className="text-lg text-slate-600">
            Every payment starts a protection countdown. Sellers are paid only after assets are verified or the timer expires without a dispute.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/listings" className="btn px-5 py-3 text-base">
              Browse listings
            </Link>
            <Link href="/auth/register" className="rounded-lg border border-slate-200 px-5 py-3 text-base font-semibold text-slate-700">
              Become a seller
            </Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800">Deal flow</h3>
            <ol className="mt-2 space-y-1 text-sm text-slate-600">
              <li>1) Buyer pays price + 2% fee → order enters escrow.</li>
              <li>2) Seller submits access → admin verifies & forwards.</li>
              <li>3) 7-day protection countdown runs; disputes pause the timer.</li>
              <li>4) No dispute? funds auto-release to seller minus 2% fee.</li>
            </ol>
          </div>
        </div>
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Live order</p>
              <p className="text-lg font-semibold text-slate-900">#AF-2841 · Premium game account</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">In escrow</span>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">Protection window</p>
            <p className="text-3xl font-bold text-brand-700">6 days 22h 14m</p>
            <p className="text-xs text-slate-500">Auto-release unless a dispute is opened.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Buyer pays</p>
              <p className="text-lg font-semibold">$500 + $10 fee</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs uppercase text-slate-500">Seller receives</p>
              <p className="text-lg font-semibold">$490 (after fee)</p>
            </div>
          </div>
          <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/50 p-4 text-sm text-brand-800">
            Admin oversees delivery and can pause or release funds at any time.
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="card p-4 space-y-2">
            <feature.icon className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
