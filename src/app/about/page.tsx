import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { aboutArticles } from "@/lib/content";
import { collections } from "@/lib/products";
import { ProductArt } from "@/components/product-art";
import { ButtonLink, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Wrapt is a gifting studio in Bengaluru working with 62 independent makers across India. Here's how it started and how it works.",
};

const numbers = [
  { value: "62", label: "independent makers" },
  { value: "14", label: "states we buy from" },
  { value: "15 days", label: "supplier payment terms" },
  { value: "0", label: "plastic in our packaging" },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-border bg-canvas-deep">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-gold-soft opacity-60 blur-3xl"
        />
        <div className="shell relative py-16 lg:py-24">
          <p className="eyebrow">Since 2019 · Bengaluru</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            We started because someone sent a truly terrible fruit basket.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            It arrived at an office in 2018, bruised, shrink-wrapped, and signed by a company nobody could
            identify. It was the third one that week. Somebody said &ldquo;surely this can be done properly&rdquo;
            — and here we are, six years and about forty thousand boxes later.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/collections" size="lg">
              Shop the studio
              <ArrowRight size={18} strokeWidth={2} />
            </ButtonLink>
            <ButtonLink href="/about/makers" variant="outline" size="lg">
              Meet the makers
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-12">
        <dl className="shell grid grid-cols-2 gap-8 lg:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label}>
              <dt className="tabular font-display text-3xl font-semibold text-primary sm:text-4xl">{n.value}</dt>
              <dd className="mt-1 text-sm text-ink-muted">{n.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="shell grid gap-12 py-20 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          <h2 className="text-3xl">How we actually work</h2>
          <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-ink-soft">
            <p>
              Everything in the catalogue is bought at full price first and used for a month before we approach
              the maker. It is a slow way to build a range and it means we say no to most things, which is the
              point.
            </p>
            <p>
              We hold real stock in one studio rather than drop-shipping, so when a page says it ships tomorrow,
              it is already on a shelf forty feet from the packing bench. Six people wrap, seal and write notes
              by hand — roughly 180 boxes on an ordinary day, and considerably more in October.
            </p>
            <p>
              We pay makers in 15 days instead of the 60 to 90 that retail treats as normal, because a
              two-person pottery cannot bankroll a large order for a quarter. It costs us working capital. It is
              the single decision we&rsquo;d least like to reverse.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {collections.slice(0, 4).map((collection, i) => (
            <div
              key={collection.slug}
              className={`overflow-hidden rounded-xl ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"} ${
                i === 1 ? "mt-8" : ""
              }`}
            >
              <ProductArt
                motif={collection.motif}
                palette={collection.palette}
                variant={i}
                seed={`about-${collection.slug}`}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="shell">
          <SectionHeading eyebrow="Read on" title="More from the studio" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {aboutArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/about/${article.slug}`}
                className="group flex flex-col rounded-xl border border-border p-6 transition-colors hover:border-primary"
              >
                <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-[0.9375rem] text-ink-soft">{article.intro}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-medium text-primary">
                  Read
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
