"use client";

import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { ProductArt } from "./product-art";
import { Badge, Stars } from "./ui";
import { formatPrice, cx } from "@/lib/format";
import { useCart } from "@/lib/cart";

export function ProductCard({
  product,
  index = 0,
  className,
}: {
  product: Product;
  index?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  function quickAdd(event: React.MouseEvent) {
    event.preventDefault();
    // Quick-add takes the first value of every option; the product page is there for the rest.
    const defaults = Object.fromEntries(product.options.map((o) => [o.name, o.values[0].label]));
    addItem(product, defaults, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article
      className={cx("group animate-rise", className)}
      style={{ animationDelay: `${Math.min(index, 7) * 45}ms` }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-sunken">
          <ProductArt
            motif={product.motif}
            palette={product.palette}
            seed={product.id}
            className="h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <div className="flex flex-wrap gap-1.5">
              {product.badge && <Badge kind={product.badge} />}
              {discount > 0 && (
                <span className="rounded-full bg-ink px-2.5 py-1 font-display text-[0.6875rem] font-semibold text-ink-inverse">
                  −{discount}%
                </span>
              )}
            </div>
            {!product.inStock && (
              <span className="rounded-full bg-surface/90 px-2.5 py-1 font-display text-[0.6875rem] font-semibold text-ink-soft backdrop-blur">
                Sold out
              </span>
            )}
          </div>

          {product.inStock && (
            <button
              type="button"
              onClick={quickAdd}
              aria-label={`Quick add ${product.name} to bag`}
              className={cx(
                "absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full shadow-card transition-all duration-200 ease-out cursor-pointer",
                "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100",
                added ? "bg-success text-white" : "bg-surface text-ink hover:bg-primary hover:text-on-primary",
              )}
            >
              {added ? <Check size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
            </button>
          )}
        </div>

        <div className="mt-4 space-y-1.5">
          <Stars rating={product.rating} reviewCount={product.reviewCount} size={12} />
          <h3 className="font-display text-[1.0625rem] font-medium leading-snug text-ink transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <p className="line-clamp-1 text-sm text-ink-muted">{product.tagline}</p>
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="tabular font-display text-[1.0625rem] font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="tabular text-sm text-ink-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
