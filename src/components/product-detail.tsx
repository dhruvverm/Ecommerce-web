"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RotateCcw,
  PenLine,
  Check,
  ChevronDown,
  Heart,
} from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart, unitPriceFor } from "@/lib/cart";
import { formatPrice, cx } from "@/lib/format";
import { ProductArt } from "./product-art";
import { Badge, Button, Stars } from "./ui";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);
  const [openDetail, setOpenDetail] = useState<string | null>(product.details[0]?.title ?? null);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.name, o.values[0].label])),
  );

  const unitPrice = unitPriceFor(product, options);
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  function add() {
    addItem(product, options, quantity);
  }

  function buyNow() {
    addItem(product, options, quantity);
    router.push("/checkout");
  }

  return (
    <div className="shell py-10">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* ------------------------------------------------------- Gallery */}
        <div className="lg:sticky lg:top-[88px] lg:self-start">
          <div className="overflow-hidden rounded-xl bg-surface-sunken">
            <ProductArt
              key={active}
              motif={product.motif}
              palette={product.palette}
              variant={active}
              seed={product.id}
              className="aspect-square w-full animate-fade"
            />
          </div>

          <div className="mt-3 flex gap-3" role="tablist" aria-label="Product images">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`View image ${i + 1} of 4`}
                onClick={() => setActive(i)}
                className={cx(
                  "h-20 w-20 cursor-pointer overflow-hidden rounded-md border-2 transition-colors",
                  active === i ? "border-primary" : "border-transparent hover:border-border-strong",
                )}
              >
                <ProductArt
                  motif={product.motif}
                  palette={product.palette}
                  variant={i}
                  seed={product.id}
                  className="h-full w-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------- Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.badge && <Badge kind={product.badge} />}
            {savings > 0 && (
              <span className="tabular rounded-full bg-ink px-2.5 py-1 font-display text-[0.6875rem] font-semibold text-ink-inverse">
                Save {formatPrice(savings)}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-lg text-ink-soft">{product.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Stars rating={product.rating} reviewCount={product.reviewCount} size={15} />
            <span className="text-xs text-ink-muted">·</span>
            <span className={cx("text-sm font-medium", product.inStock ? "text-success" : "text-ink-muted")}>
              {product.inStock ? "In stock" : "Currently sold out"}
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="tabular font-display text-3xl font-semibold">{formatPrice(unitPrice)}</span>
            {product.compareAtPrice && (
              <span className="tabular text-lg text-ink-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-muted">Inclusive of all taxes. Shipping calculated at checkout.</p>

          <p className="mt-6 text-[1.0625rem] leading-relaxed text-ink-soft">{product.description}</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-3">
            {product.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 rounded-lg bg-surface-sunken px-3 py-2.5 text-[0.8125rem] text-ink-soft"
              >
                <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-primary" />
                {highlight}
              </li>
            ))}
          </ul>

          {/* Options */}
          <div className="mt-8 space-y-6">
            {product.options.map((option) => (
              <fieldset key={option.name}>
                <legend className="mb-3 font-display text-sm font-semibold">
                  {option.name}
                  <span className="ml-2 font-normal text-ink-muted">{options[option.name]}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const selected = options[option.name] === value.label;
                    return (
                      <label
                        key={value.label}
                        className={cx(
                          "flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 font-display text-sm font-medium transition-colors",
                          selected
                            ? "border-primary bg-primary-soft text-primary"
                            : "border-border-strong text-ink-soft hover:border-ink-muted",
                        )}
                      >
                        <input
                          type="radio"
                          name={option.name}
                          value={value.label}
                          checked={selected}
                          onChange={() => setOptions((o) => ({ ...o, [option.name]: value.label }))}
                          className="sr-only"
                        />
                        {value.label}
                        {value.priceDelta ? (
                          <span className="tabular text-xs opacity-70">
                            {value.priceDelta > 0 ? "+" : "−"}
                            {formatPrice(Math.abs(value.priceDelta))}
                          </span>
                        ) : value.note ? (
                          <span className="text-xs opacity-70">{value.note}</span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border-strong">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-l-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={15} strokeWidth={2.25} />
              </button>
              <span className="tabular w-10 text-center font-display font-semibold" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                disabled={quantity >= 20}
                aria-label="Increase quantity"
                className="grid h-12 w-12 cursor-pointer place-items-center rounded-r-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={15} strokeWidth={2.25} />
              </button>
            </div>

            <Button size="lg" onClick={add} disabled={!product.inStock} className="flex-1 min-w-48">
              <ShoppingBag size={18} strokeWidth={2} />
              {product.inStock ? `Add to bag · ${formatPrice(unitPrice * quantity)}` : "Sold out"}
            </Button>

            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={saved}
              className={cx(
                "grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full border transition-colors",
                saved
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border-strong text-ink-soft hover:border-primary hover:text-primary",
              )}
            >
              <Heart size={18} strokeWidth={2} className={saved ? "fill-current" : ""} />
            </button>
          </div>

          {product.inStock && (
            <Button variant="secondary" size="lg" onClick={buyNow} className="mt-3 w-full">
              Buy it now
            </Button>
          )}

          {/* Reassurance */}
          <ul className="mt-8 grid gap-3 border-y border-border py-6 sm:grid-cols-3">
            {[
              { icon: Truck, title: product.shipsIn, body: "Free over ₹1,499" },
              { icon: PenLine, title: "Handwritten note", body: "Free with every order" },
              { icon: RotateCcw, title: "14-day returns", body: "No restocking fee" },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <item.icon size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-primary" />
                <span>
                  <span className="block font-display text-[0.8125rem] font-semibold">{item.title}</span>
                  <span className="block text-xs text-ink-muted">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Details accordion */}
          <div className="mt-2 divide-y divide-border">
            {product.details.map((detail) => {
              const open = openDetail === detail.title;
              return (
                <div key={detail.title}>
                  <h2>
                    <button
                      type="button"
                      onClick={() => setOpenDetail(open ? null : detail.title)}
                      aria-expanded={open}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left font-display text-[0.9375rem] font-semibold transition-colors hover:text-primary"
                    >
                      {detail.title}
                      <ChevronDown
                        size={17}
                        strokeWidth={2}
                        className={cx(
                          "shrink-0 text-ink-muted transition-transform duration-300",
                          open && "rotate-180",
                        )}
                      />
                    </button>
                  </h2>
                  {open && (
                    <p className="animate-fade pb-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {detail.body}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
