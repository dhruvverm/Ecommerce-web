"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Tag,
  X,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD, PROMOS } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { Button, ButtonLink } from "@/components/ui";
import { products } from "@/lib/products";

export default function CartPage() {
  const {
    lines,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promo,
    promoError,
    hydrated,
    setQuantity,
    removeItem,
    applyPromo,
    removePromo,
  } = useCart();

  const [code, setCode] = useState("");
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  const suggestions = products
    .filter((p) => p.inStock && !lines.some((l) => l.productId === p.id))
    .slice(0, 4);

  // The bag lives in browser storage, so the first paint has nothing to show yet.
  if (!hydrated) {
    return (
      <div className="shell py-16">
        <h1 className="text-3xl sm:text-4xl">Your bag</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div className="space-y-6 border-y border-border py-6">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="h-32 w-26 shrink-0 animate-pulse rounded-lg bg-surface-sunken sm:h-40 sm:w-32" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-surface-sunken" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-surface-sunken" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-surface-sunken" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-72 animate-pulse rounded-xl bg-surface-sunken" />
        </div>
        <p className="sr-only" role="status">
          Loading your bag
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="shell py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-surface-sunken text-ink-muted">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-3xl">Your bag is empty</h1>
            <p className="mt-2 text-ink-soft">
              Nothing in here yet. Have a look at what people are sending most this month.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/collections" size="lg">
              Shop all gifts
            </ButtonLink>
            <ButtonLink href="/gift-finder" variant="outline" size="lg">
              Help me choose
            </ButtonLink>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-display text-xl font-semibold">Popular right now</h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {suggestions.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-ink-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink">
            Bag
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl sm:text-4xl">Your bag</h1>
        <p className="tabular text-sm text-ink-soft">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {remaining > 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-surface-sunken px-4 py-3">
          <Truck size={17} strokeWidth={1.75} className="shrink-0 text-primary" />
          <p className="text-sm text-ink-soft">
            Add <strong className="tabular font-semibold text-ink">{formatPrice(remaining)}</strong> more and
            shipping is on us.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        {/* ----------------------------------------------------- Line items */}
        <ul className="divide-y divide-border border-y border-border">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-4 py-6 sm:gap-6">
              <Link
                href={`/products/${line.product.slug}`}
                className="h-32 w-26 shrink-0 overflow-hidden rounded-lg bg-surface-sunken sm:h-40 sm:w-32"
              >
                <ProductArt
                  motif={line.product.motif}
                  palette={line.product.palette}
                  seed={line.product.id}
                  className="h-full w-full"
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${line.product.slug}`}
                      className="font-display text-[1.0625rem] font-medium leading-snug hover:text-primary"
                    >
                      {line.product.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-ink-muted">{line.product.tagline}</p>
                    <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(line.options).map(([name, value]) => (
                        <div key={name} className="flex gap-1.5 text-xs">
                          <dt className="text-ink-muted">{name}:</dt>
                          <dd className="font-medium text-ink-soft">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-2 text-xs text-success">{line.product.shipsIn}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(line.key)}
                    aria-label={`Remove ${line.product.name} from bag`}
                    className="-m-2 shrink-0 cursor-pointer p-2 text-ink-muted transition-colors hover:text-danger"
                  >
                    <Trash2 size={17} strokeWidth={1.75} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <div className="flex items-center rounded-full border border-border-strong">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity - 1)}
                      aria-label={`Decrease quantity of ${line.product.name}`}
                      className="grid h-11 w-11 cursor-pointer place-items-center rounded-l-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      <Minus size={14} strokeWidth={2.25} />
                    </button>
                    <span className="tabular w-8 text-center text-sm font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.key, line.quantity + 1)}
                      aria-label={`Increase quantity of ${line.product.name}`}
                      className="grid h-11 w-11 cursor-pointer place-items-center rounded-r-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                    >
                      <Plus size={14} strokeWidth={2.25} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="tabular font-display text-lg font-semibold">{formatPrice(line.lineTotal)}</p>
                    {line.quantity > 1 && (
                      <p className="tabular text-xs text-ink-muted">{formatPrice(line.unitPrice)} each</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* -------------------------------------------------------- Summary */}
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-semibold">Order summary</h2>

            {/* Promo */}
            <div className="mt-5">
              {promo ? (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-success-soft px-4 py-3">
                  <span className="flex min-w-0 items-center gap-2">
                    <Tag size={15} strokeWidth={2} className="shrink-0 text-success" />
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-semibold text-success">{promo.code}</span>
                      <span className="block truncate text-xs text-success/80">{promo.label}</span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={removePromo}
                    aria-label={`Remove promo code ${promo.code}`}
                    className="shrink-0 cursor-pointer rounded-full p-1 text-success transition-colors hover:bg-success/10"
                  >
                    <X size={15} strokeWidth={2.5} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (applyPromo(code)) setCode("");
                  }}
                >
                  <label htmlFor="promo" className="mb-2 block font-display text-sm font-semibold">
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="promo"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter code"
                      aria-invalid={Boolean(promoError)}
                      aria-describedby={promoError ? "promo-error" : "promo-hint"}
                      className="h-11 min-w-0 flex-1 rounded-full border border-border-strong bg-canvas px-4 text-sm uppercase outline-none transition-colors focus:border-primary"
                    />
                    <Button type="submit" variant="outline" size="sm" disabled={!code.trim()}>
                      Apply
                    </Button>
                  </div>
                  {promoError ? (
                    <p id="promo-error" role="alert" className="mt-2 text-xs font-medium text-danger">
                      {promoError}
                    </p>
                  ) : (
                    <p id="promo-hint" className="mt-2 text-xs text-ink-muted">
                      Try <button type="button" onClick={() => setCode(PROMOS[0].code)} className="cursor-pointer font-semibold text-primary underline underline-offset-2">{PROMOS[0].code}</button> for 10% off.
                    </p>
                  )}
                </form>
              )}
            </div>

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              {discount > 0 && (
                <Row label={`Discount (${promo?.code})`} value={`−${formatPrice(discount)}`} accent="success" />
              )}
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : formatPrice(shipping)}
                accent={shipping === 0 ? "success" : undefined}
              />
              <Row label="GST (18%)" value={formatPrice(tax)} />
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
              <span className="font-display text-base font-semibold">Total</span>
              <span className="tabular font-display text-2xl font-semibold">{formatPrice(total)}</span>
            </div>

            <ButtonLink href="/checkout" size="lg" className="mt-5 w-full">
              Checkout
              <ArrowRight size={18} strokeWidth={2} />
            </ButtonLink>

            <Link
              href="/collections"
              className="mt-3 block text-center font-display text-sm font-medium text-ink-soft hover:text-ink"
            >
              Continue shopping
            </Link>

            <p className="mt-5 flex items-start gap-2 border-t border-border pt-5 text-xs text-ink-muted">
              <ShieldCheck size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-success" />
              Demo storefront — checkout is simulated and no payment is ever taken.
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-xl font-semibold sm:text-2xl">People often add</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {suggestions.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "success";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={`tabular font-medium ${accent === "success" ? "text-success" : "text-ink"}`}>{value}</dd>
    </div>
  );
}
