"use client";

import Link from "next/link";
import { useState } from "react";
import { Gift, Instagram, Check, ArrowRight } from "lucide-react";
import { collections } from "@/lib/products";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/collections", label: "All gifts" },
      { href: "/gift-finder", label: "Gift finder" },
      { href: "/collections/corporate", label: "Corporate gifting" },
      { href: "/collections/self-care", label: "Self-care" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/help/shipping", label: "Shipping & delivery" },
      { href: "/help/returns", label: "Returns" },
      { href: "/help/gift-notes", label: "Gift notes" },
      { href: "/help/contact", label: "Contact us" },
    ],
  },
  {
    title: "Studio",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/about/makers", label: "The makers" },
      { href: "/about/sustainability", label: "Sustainability" },
      { href: "/about/stockists", label: "Stockists" },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("error");
      return;
    }
    setState("done");
  }

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="shell py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-on-primary">
                <Gift size={19} strokeWidth={2} />
              </span>
              <span className="font-display text-[1.375rem] font-semibold tracking-tight">Wrapt</span>
            </Link>
            <p className="mt-4 max-w-sm text-[0.9375rem] text-ink-soft">
              A small studio in Bengaluru that wraps gifts by hand and writes the notes for you. Working with
              62 independent makers across India since 2019.
            </p>

            <form onSubmit={subscribe} className="mt-7 max-w-sm" noValidate>
              <label htmlFor="newsletter" className="block font-display text-sm font-semibold">
                Get the good stuff, twice a month
              </label>
              <p id="newsletter-help" className="mt-1 text-xs text-ink-muted">
                New arrivals and occasional early access. No noise, unsubscribe in one click.
              </p>
              {state === "done" ? (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-success-soft px-4 py-3 text-sm font-medium text-success">
                  <Check size={16} strokeWidth={2.5} /> You&rsquo;re on the list. See you soon.
                </p>
              ) : (
                <>
                  <div className="mt-3 flex gap-2">
                    <input
                      id="newsletter"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      aria-describedby="newsletter-help"
                      aria-invalid={state === "error"}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      placeholder="you@example.com"
                      className="h-12 min-w-0 flex-1 rounded-full border border-border-strong bg-canvas px-4 text-[0.9375rem] outline-none transition-colors focus:border-primary"
                    />
                    <button
                      type="submit"
                      aria-label="Subscribe"
                      className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full bg-ink text-ink-inverse transition-colors hover:bg-primary hover:text-on-primary"
                    >
                      <ArrowRight size={18} strokeWidth={2} />
                    </button>
                  </div>
                  {state === "error" && (
                    <p role="alert" className="mt-2 text-xs font-medium text-danger">
                      That doesn&rsquo;t look like an email address — check it and try again.
                    </p>
                  )}
                </>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="link-underline text-[0.9375rem] text-ink-soft hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow mb-4">Collections</p>
              <ul className="space-y-2.5">
                {collections.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/collections/${c.slug}`}
                      className="link-underline text-[0.9375rem] text-ink-soft hover:text-ink"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-ink-muted">
            © {new Date().getFullYear()} Wrapt Studio. A demo storefront — no real orders are placed.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Wrapt on Instagram"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              <Instagram size={18} strokeWidth={1.75} />
            </a>
            <Link href="/help/privacy" className="text-[0.8125rem] text-ink-muted hover:text-ink">
              Privacy
            </Link>
            <Link href="/help/terms" className="text-[0.8125rem] text-ink-muted hover:text-ink">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
