"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Mail, PenLine, Package, Truck, Home } from "lucide-react";
import { ProductArt } from "@/components/product-art";
import { ButtonLink } from "@/components/ui";
import { formatPrice } from "@/lib/format";
import type { Motif } from "@/lib/products";

type Order = {
  orderId: string;
  email: string;
  name: string;
  address: string;
  method: string;
  eta: string;
  deliveryDate?: string;
  giftMessage?: string;
  paymentMethod?: string;
  total: number;
  itemCount: number;
  items: { id: string; name: string; quantity: number; total: number; motif: Motif; palette: [string, string, string] }[];
};

const timeline = [
  { icon: Check, title: "Order placed", body: "Just now", done: true },
  { icon: PenLine, title: "Note written by hand", body: "Within a few hours", done: false },
  { icon: Package, title: "Wrapped & sealed", body: "Same working day", done: false },
  { icon: Truck, title: "Out for delivery", body: "You'll get a tracking link", done: false },
];

function SuccessBody() {
  const params = useSearchParams();
  const orderId = params.get("order") ?? "WR-000000";
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("giftbox.lastOrder");
      if (raw) setOrder(JSON.parse(raw) as Order);
    } catch {
      // Fall back to the generic confirmation below.
    }
  }, []);

  return (
    <div className="shell py-14">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 animate-rise place-items-center rounded-full bg-success text-white">
          <Check size={30} strokeWidth={3} />
        </div>
        <p className="eyebrow mt-6">Order {order?.orderId ?? orderId}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">That&rsquo;s wrapped.</h1>
        <p className="mt-4 text-lg text-ink-soft">
          {order?.name ? `Thanks, ${order.name.split(" ")[0]}. ` : "Thank you. "}
          We&rsquo;ve emailed a confirmation
          {order?.email ? (
            <>
              {" "}
              to <strong className="font-semibold text-ink">{order.email}</strong>
            </>
          ) : null}
          , and someone in the studio is already on the note.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-2 text-xs text-ink-soft">
          <Mail size={14} strokeWidth={2} />
          Demo storefront — no real order was created and no payment was taken.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <div>
          <h2 className="font-display text-xl font-semibold">What happens next</h2>
          <ol className="mt-6 space-y-0">
            {timeline.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                      step.done ? "bg-success text-white" : "bg-surface-sunken text-ink-muted"
                    }`}
                  >
                    <step.icon size={18} strokeWidth={2} />
                  </span>
                  {i < timeline.length - 1 && <span className="my-1 w-0.5 flex-1 rounded-full bg-border" />}
                </div>
                <div className="pb-8">
                  <p className="font-display text-[0.9375rem] font-semibold">{step.title}</p>
                  <p className="text-sm text-ink-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {order?.giftMessage && (
            <div className="rounded-xl border border-border bg-surface p-6">
              <p className="eyebrow mb-3">Your note, as written</p>
              <p className="font-display text-lg italic leading-relaxed text-ink-soft">
                &ldquo;{order.giftMessage}&rdquo;
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/collections" size="lg">
              Keep shopping
            </ButtonLink>
            <ButtonLink href="/" variant="outline" size="lg">
              <Home size={17} strokeWidth={2} />
              Back home
            </ButtonLink>
          </div>
        </div>

        <aside>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-base font-semibold">Order details</h2>

            {order ? (
              <>
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      <span className="h-14 w-12 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                        <ProductArt motif={item.motif} palette={item.palette} seed={item.id} className="h-full w-full" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[0.8125rem] font-medium">{item.name}</span>
                        <span className="tabular block text-xs text-ink-muted">Qty {item.quantity}</span>
                      </span>
                      <span className="tabular shrink-0 font-display text-[0.8125rem] font-semibold">
                        {formatPrice(item.total)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-display text-sm font-semibold">Total paid</span>
                  <span className="tabular font-display text-xl font-semibold">{formatPrice(order.total)}</span>
                </div>

                <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                  <div>
                    <dt className="text-xs text-ink-muted">Delivering to</dt>
                    <dd className="mt-0.5 text-ink-soft">{order.name}</dd>
                    <dd className="text-ink-soft">{order.address}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-muted">Shipping</dt>
                    <dd className="mt-0.5 text-ink-soft">
                      {order.method} — {order.deliveryDate || order.eta}
                    </dd>
                  </div>
                  {order.paymentMethod && (
                    <div>
                      <dt className="text-xs text-ink-muted">Paid with</dt>
                      <dd className="mt-0.5 text-ink-soft">{order.paymentMethod}</dd>
                    </div>
                  )}
                </dl>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">
                Your confirmation email has the full breakdown. Need it again?{" "}
                <Link href="/help/contact" className="text-primary underline underline-offset-2">
                  Get in touch
                </Link>
                .
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-20 text-center">
          <h1 className="text-3xl">Confirming your order…</h1>
          <p className="mt-2 text-ink-muted" role="status">
            One moment.
          </p>
        </div>
      }
    >
      <SuccessBody />
    </Suspense>
  );
}
