"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check, ChevronDown } from "lucide-react";
import { priceBands, occasions, recipients, type Product } from "@/lib/products";
import { ProductCard } from "./product-card";
import { Button } from "./ui";
import { cx } from "@/lib/format";

type SortKey = "featured" | "popular" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<SortKey, string> = {
  featured: "Featured",
  popular: "Most loved",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
};

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function CollectionBrowser({ products: source }: { products: Product[] }) {
  const params = useSearchParams();
  const [sort, setSort] = useState<SortKey>("featured");
  const [bands, setBands] = useState<string[]>([]);
  const [occasionFilter, setOccasionFilter] = useState<string[]>([]);
  const [recipientFilter, setRecipientFilter] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Seed filters from the URL so links like ?occasion=Birthday land pre-filtered.
  useEffect(() => {
    const occasion = params.get("occasion");
    const price = params.get("price");
    const recipient = params.get("recipient");
    const sortParam = params.get("sort") as SortKey | null;
    if (occasion) setOccasionFilter([occasion]);
    if (price) setBands([price]);
    if (recipient) setRecipientFilter([recipient]);
    if (sortParam && sortParam in sortLabels) setSort(sortParam);
  }, [params]);

  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sheetOpen]);

  const availableOccasions = useMemo(
    () => occasions.filter((o) => source.some((p) => p.occasions.includes(o))),
    [source],
  );
  const availableRecipients = useMemo(
    () => recipients.filter((r) => source.some((p) => p.recipients.includes(r))),
    [source],
  );

  const results = useMemo(() => {
    let list = source.slice();

    if (bands.length) {
      list = list.filter((p) =>
        bands.some((id) => {
          const band = priceBands.find((b) => b.id === id);
          return band ? p.price >= band.min && p.price < band.max : false;
        }),
      );
    }
    if (occasionFilter.length) {
      list = list.filter((p) => occasionFilter.some((o) => p.occasions.includes(o)));
    }
    if (recipientFilter.length) {
      list = list.filter((p) => recipientFilter.some((r) => p.recipients.includes(r)));
    }
    if (inStockOnly) list = list.filter((p) => p.inStock);

    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      case "popular":
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return list.sort(
          (a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)) || b.rating - a.rating,
        );
    }
  }, [source, bands, occasionFilter, recipientFilter, inStockOnly, sort]);

  const activeCount = bands.length + occasionFilter.length + recipientFilter.length + (inStockOnly ? 1 : 0);

  function clearAll() {
    setBands([]);
    setOccasionFilter([]);
    setRecipientFilter([]);
    setInStockOnly(false);
  }

  const filterGroups = (
    <div className="space-y-7">
      <FilterGroup title="Price">
        {priceBands.map((band) => (
          <CheckRow
            key={band.id}
            label={band.label}
            checked={bands.includes(band.id)}
            onChange={() => setBands((b) => toggle(b, band.id))}
            count={source.filter((p) => p.price >= band.min && p.price < band.max).length}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Occasion">
        {availableOccasions.map((occasion) => (
          <CheckRow
            key={occasion}
            label={occasion}
            checked={occasionFilter.includes(occasion)}
            onChange={() => setOccasionFilter((o) => toggle(o, occasion))}
            count={source.filter((p) => p.occasions.includes(occasion)).length}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Recipient">
        {availableRecipients.map((recipient) => (
          <CheckRow
            key={recipient}
            label={recipient}
            checked={recipientFilter.includes(recipient)}
            onChange={() => setRecipientFilter((r) => toggle(r, recipient))}
            count={source.filter((p) => p.recipients.includes(recipient)).length}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckRow label="In stock only" checked={inStockOnly} onChange={() => setInStockOnly((v) => !v)} />
      </FilterGroup>
    </div>
  );

  return (
    <div className="shell py-10">
      <div className="lg:grid lg:grid-cols-[17rem_1fr] lg:gap-12">
        {/* Desktop filter rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] max-h-[calc(100dvh-7rem)] overflow-y-auto pb-6 pr-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-base font-semibold">Filters</h2>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
            {filterGroups}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p className="tabular text-sm text-ink-soft">
              <span className="font-semibold text-ink">{results.length}</span>{" "}
              {results.length === 1 ? "gift" : "gifts"}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-border-strong px-4 font-display text-sm font-medium transition-colors hover:border-primary hover:text-primary lg:hidden"
              >
                <SlidersHorizontal size={15} strokeWidth={2} />
                Filters
                {activeCount > 0 && (
                  <span className="tabular grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-bold text-on-primary">
                    {activeCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <label htmlFor="sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-11 cursor-pointer appearance-none rounded-full border border-border-strong bg-surface pl-4 pr-10 font-display text-sm font-medium outline-none transition-colors hover:border-primary focus:border-primary"
                >
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  strokeWidth={2}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
                />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-4">
              {[
                ...bands.map((id) => ({
                  label: priceBands.find((b) => b.id === id)?.label ?? id,
                  clear: () => setBands((b) => b.filter((v) => v !== id)),
                })),
                ...occasionFilter.map((o) => ({
                  label: o,
                  clear: () => setOccasionFilter((v) => v.filter((x) => x !== o)),
                })),
                ...recipientFilter.map((r) => ({
                  label: r,
                  clear: () => setRecipientFilter((v) => v.filter((x) => x !== r)),
                })),
                ...(inStockOnly ? [{ label: "In stock only", clear: () => setInStockOnly(false) }] : []),
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 font-display text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-on-primary"
                >
                  {chip.label}
                  <X size={13} strokeWidth={2.5} />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="cursor-pointer px-2 py-1.5 text-xs font-semibold text-ink-muted hover:text-ink"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken text-ink-muted">
                <SlidersHorizontal size={24} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-display text-lg font-semibold">Nothing matches all of that</p>
                <p className="mx-auto mt-1 max-w-sm text-sm text-ink-muted">
                  Try loosening one filter — dropping the price band usually opens things back up.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-8 md:grid-cols-3">
              {results.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 animate-fade cursor-default bg-overlay/60 backdrop-blur-[2px]"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] animate-sheet-up flex-col rounded-t-2xl bg-surface shadow-float">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-lg font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink-soft hover:bg-surface-sunken"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterGroups}</div>
            <div className="flex gap-3 border-t border-border p-5">
              <Button variant="outline" className="flex-1" onClick={clearAll}>
                Clear all
              </Button>
              <Button className="flex-1" onClick={() => setSheetOpen(false)}>
                Show {results.length} {results.length === 1 ? "gift" : "gifts"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-3">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-1 py-1.5 transition-colors hover:bg-surface-sunken">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={cx(
          "grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition-colors",
          checked ? "border-primary bg-primary text-on-primary" : "border-border-strong bg-surface",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
        )}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="flex-1 text-[0.9375rem] text-ink-soft">{label}</span>
      {count !== undefined && <span className="tabular text-xs text-ink-muted">{count}</span>}
    </label>
  );
}
