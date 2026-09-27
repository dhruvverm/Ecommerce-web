"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X, ArrowRight, Gift } from "lucide-react";
import { collections, searchProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { formatPrice, cx } from "@/lib/format";
import { ProductArt } from "./product-art";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/collections", label: "Shop all" },
  { href: "/collections/birthday", label: "Birthday" },
  { href: "/collections/romance", label: "Anniversary" },
  { href: "/collections/corporate", label: "Corporate" },
  { href: "/gift-finder", label: "Gift finder" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openDrawer, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen && !menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSearchOpen(false);
      setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  const results = searchProducts(query).slice(0, 5);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:text-ink-inverse"
      >
        Skip to main content
      </a>

      <div className="relative z-[60] overflow-hidden bg-overlay py-2 text-on-overlay">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap will-change-transform">
          {Array.from({ length: 2 }).map((_, dup) => (
            <div key={dup} className="flex shrink-0 gap-10" aria-hidden={dup === 1}>
              {[
                "Free shipping over ₹1,499",
                "Hand-wrapped in Bengaluru",
                "Same-day dispatch before 2pm",
                "Gift notes written by hand",
                "14-day easy returns",
              ].map((item) => (
                <span key={item} className="font-display text-xs font-medium tracking-wide">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={cx(
          "sticky top-0 z-[70] transition-shadow duration-300",
          scrolled ? "glass shadow-soft" : "bg-canvas",
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-surface-sunken"
            >
              <Menu size={21} strokeWidth={1.75} />
            </button>
          </div>

          <Link
            href="/"
            className="group flex items-center gap-2.5 lg:flex-none"
            aria-label="Wrapt — home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-on-primary transition-transform duration-300 group-hover:-rotate-6">
              <Gift size={19} strokeWidth={2} />
            </span>
            <span className="font-display text-[1.375rem] font-semibold tracking-tight">Wrapt</span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex lg:items-center lg:gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "rounded-full px-4 py-2.5 font-display text-[0.9375rem] font-medium transition-colors",
                    active ? "bg-surface-sunken text-primary" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <Search size={19} strokeWidth={1.75} />
            </button>
            <ThemeToggle className="hidden sm:grid" />
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Open bag, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink transition-colors hover:bg-surface-sunken"
            >
              <ShoppingBag size={19} strokeWidth={1.75} />
              {hydrated && itemCount > 0 && (
                <span className="tabular absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-bold text-on-primary">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------- Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 animate-fade cursor-default bg-overlay/60 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm animate-slide-in flex-col bg-surface shadow-float [animation-name:sheet-up] sm:[animation-name:slide-in]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-lg font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink-soft hover:bg-surface-sunken"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5 font-display text-lg font-medium transition-colors hover:bg-surface-sunken"
                >
                  {item.label}
                  <ArrowRight size={17} strokeWidth={1.75} className="text-ink-muted" />
                </Link>
              ))}
              <p className="eyebrow px-4 pb-2 pt-6">Collections</p>
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-surface-sunken"
                >
                  <span className="h-8 w-8 shrink-0 overflow-hidden rounded-md">
                    <ProductArt motif={c.motif} palette={c.palette} seed={c.slug} className="h-full w-full" />
                  </span>
                  <span className="text-[0.9375rem] text-ink-soft">{c.name}</span>
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              <span className="text-sm text-ink-muted">Appearance</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------- Search */}
      {searchOpen && (
        <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="Search">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 animate-fade cursor-default bg-overlay/60 backdrop-blur-sm"
          />
          <div className="shell relative pt-[12vh]">
            <div className="mx-auto max-w-2xl animate-rise overflow-hidden rounded-xl bg-surface shadow-float">
              <div className="flex items-center gap-3 border-b border-border px-5">
                <Search size={19} strokeWidth={1.75} className="shrink-0 text-ink-muted" />
                <input
                  ref={searchInput}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search gifts, occasions, people…"
                  aria-label="Search gifts"
                  className="h-14 flex-1 bg-transparent outline-none placeholder:text-ink-muted"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="-mr-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink-muted hover:text-ink"
                >
                  <X size={18} strokeWidth={1.75} />
                </button>
              </div>

              {query.trim() === "" ? (
                <div className="p-5">
                  <p className="eyebrow mb-3">Popular right now</p>
                  <div className="flex flex-wrap gap-2">
                    {["Birthday", "Candle", "For her", "Corporate", "Under ₹1,500", "Diwali"].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="cursor-pointer rounded-full border border-border px-3.5 py-2 font-display text-sm text-ink-soft transition-colors hover:border-primary hover:text-primary"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="font-display text-base font-semibold">No matches for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Try an occasion like &ldquo;birthday&rdquo;, or browse{" "}
                    <Link href="/collections" className="text-primary underline underline-offset-4">
                      all collections
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <ul className="max-h-[52vh] divide-y divide-border overflow-y-auto">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface-sunken"
                      >
                        <span className="h-14 w-12 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                          <ProductArt motif={p.motif} palette={p.palette} seed={p.id} className="h-full w-full" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[0.9375rem] font-medium">{p.name}</span>
                          <span className="block truncate text-xs text-ink-muted">{p.tagline}</span>
                        </span>
                        <span className="tabular shrink-0 font-display text-sm font-semibold">
                          {formatPrice(p.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
