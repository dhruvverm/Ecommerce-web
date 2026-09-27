"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X, Truck } from "lucide-react";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { ProductArt } from "./product-art";
import { ButtonLink } from "./ui";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, subtotal, itemCount, setQuantity, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Escape closes, and the page behind must not scroll while the sheet is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <button
        type="button"
        aria-label="Close bag"
        onClick={closeDrawer}
        className="absolute inset-0 animate-fade cursor-default bg-overlay/60 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-md animate-slide-in flex-col bg-surface shadow-float outline-none sm:border-l sm:border-border"
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShoppingBag size={19} strokeWidth={1.75} />
            Your bag
            {itemCount > 0 && <span className="tabular text-ink-muted">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-surface-sunken text-ink-muted">
              <ShoppingBag size={30} strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">Nothing in here yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Pick something lovely and it&rsquo;ll show up right here.
              </p>
            </div>
            <ButtonLink href="/collections" onClick={closeDrawer} size="sm">
              Browse collections
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="border-b border-border bg-surface-sunken px-5 py-3">
              {remaining > 0 ? (
                <p className="flex items-center gap-2 text-[0.8125rem] text-ink-soft">
                  <Truck size={15} strokeWidth={1.75} className="shrink-0 text-primary" />
                  <span>
                    <strong className="tabular font-semibold text-ink">{formatPrice(remaining)}</strong> away
                    from free shipping
                  </span>
                </p>
              ) : (
                <p className="flex items-center gap-2 text-[0.8125rem] font-semibold text-success">
                  <Truck size={15} strokeWidth={1.75} className="shrink-0" />
                  Free shipping unlocked
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={line.key} className="flex gap-4 py-4">
                  <Link
                    href={`/products/${line.product.slug}`}
                    onClick={closeDrawer}
                    className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-surface-sunken"
                  >
                    <ProductArt
                      motif={line.product.motif}
                      palette={line.product.palette}
                      seed={line.product.id}
                      className="h-full w-full"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${line.product.slug}`}
                        onClick={closeDrawer}
                        className="font-display text-sm font-medium leading-snug hover:text-primary"
                      >
                        {line.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(line.key)}
                        aria-label={`Remove ${line.product.name}`}
                        className="-m-2 cursor-pointer p-2 text-ink-muted transition-colors hover:text-danger"
                      >
                        <Trash2 size={15} strokeWidth={1.75} />
                      </button>
                    </div>

                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {Object.values(line.options).join(" · ")}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-l-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                        >
                          <Minus size={13} strokeWidth={2.25} />
                        </button>
                        <span className="tabular w-7 text-center text-sm font-semibold">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.key, line.quantity + 1)}
                          aria-label="Increase quantity"
                          className="grid h-9 w-9 cursor-pointer place-items-center rounded-r-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                        >
                          <Plus size={13} strokeWidth={2.25} />
                        </button>
                      </div>
                      <span className="tabular font-display text-sm font-semibold">
                        {formatPrice(line.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-3 border-t border-border p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">Subtotal</span>
                <span className="tabular font-display text-xl font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-ink-muted">Taxes and shipping are calculated at checkout.</p>
              <ButtonLink href="/checkout" onClick={closeDrawer} size="lg" className="w-full">
                Checkout
              </ButtonLink>
              <ButtonLink href="/cart" onClick={closeDrawer} variant="outline" size="sm" className="w-full">
                View full bag
              </ButtonLink>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
