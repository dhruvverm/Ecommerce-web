import Link from "next/link";
import { ArrowRight, Sparkles, PenLine, Package, Quote, Star } from "lucide-react";
import { collections, products, priceBands, occasions } from "@/lib/products";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { ButtonLink, SectionHeading, Pill } from "@/components/ui";
import { formatPrice } from "@/lib/format";

const heroTiles = ["confetti-birthday-box", "midnight-fig-candle", "gold-vermeil-initial-necklace"]
  .map((slug) => products.find((p) => p.slug === slug)!)
  .filter(Boolean);

const bestsellers = products.filter((p) => p.badge === "bestseller").slice(0, 8);
const newIn = products.filter((p) => p.badge === "new" || p.badge === "limited").slice(0, 4);

const steps = [
  {
    icon: Sparkles,
    title: "Pick, or let us pick",
    body: "Browse by occasion and budget, or answer three questions in the gift finder and we'll shortlist four things that actually fit.",
  },
  {
    icon: PenLine,
    title: "Tell us what to write",
    body: "Add your message at checkout and someone here writes it out by hand on cotton card. No printed fonts pretending to be handwriting.",
  },
  {
    icon: Package,
    title: "We wrap, we ship",
    body: "Packed in a keepsake box with a wax seal, dispatched same day before 2pm, and tracked to their door — or straight to yours.",
  },
];

const testimonials = [
  {
    quote:
      "Ordered the Confetti Box for my sister at 11pm and it arrived the next afternoon, with the note in actual handwriting. She cried. I looked extremely competent.",
    name: "Ananya R.",
    context: "Bengaluru · Birthday Magic",
  },
  {
    quote:
      "We sent 140 Founder Hampers to clients for Diwali. One invoice, staggered dispatch dates, and three people replied asking where we got them.",
    name: "Rohit M.",
    context: "Head of Ops, Mumbai",
  },
  {
    quote:
      "The candle is the only one I've bought twice. The jar is now holding paintbrushes, which I assume was the plan all along.",
    name: "Meera K.",
    context: "Delhi · Home & Living",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------- Hero */}
      <section className="grain relative overflow-hidden bg-canvas-deep">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary-soft blur-3xl opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-gold-soft blur-3xl opacity-50"
        />

        <div className="shell relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div className="animate-rise">
            <Pill className="mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              62 independent makers · shipping India-wide
            </Pill>

            <h1 className="text-[2.75rem] leading-[1.05] sm:text-[3.75rem] lg:text-[4.25rem]">
              Gifts worth
              <br />
              <span className="text-primary">unwrapping.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-ink-soft">
              Hand-wrapped boxes from a small Bengaluru studio. You choose the thing and write the message
              — we do the tissue paper, the wax seal and the getting-it-there-on-time.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/collections" size="lg">
                Shop all gifts
                <ArrowRight size={18} strokeWidth={2} />
              </ButtonLink>
              <ButtonLink href="/gift-finder" variant="outline" size="lg">
                Help me choose
              </ButtonLink>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-border-strong pt-7 sm:gap-6">
              {[
                { value: "4.8", label: "from 6,400+ reviews" },
                { value: "Same day", label: "dispatch before 2pm" },
                { value: "14 days", label: "no-questions returns" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="tabular font-display text-xl font-semibold text-ink sm:text-2xl">{stat.value}</dt>
                  <dd className="mt-0.5 text-[0.8125rem] leading-snug text-ink-muted">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Collage of real catalogue art, offset so it reads as a stack. */}
          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-4 lg:max-w-none">
            {heroTiles.map((product, i) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={[
                  "group relative overflow-hidden rounded-xl bg-surface shadow-card transition-shadow duration-300 hover:shadow-float",
                  i === 0 ? "col-span-2 aspect-[16/11]" : "aspect-[4/5]",
                  i === 1 ? "animate-float" : "",
                  i === 2 ? "mt-8 animate-float [animation-delay:-3s]" : "",
                ].join(" ")}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <ProductArt
                  motif={product.motif}
                  palette={product.palette}
                  variant={i}
                  seed={product.id}
                  className="h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-lg bg-surface/90 px-3 py-2 backdrop-blur">
                  <span className="truncate font-display text-[0.8125rem] font-medium">{product.name}</span>
                  <span className="tabular shrink-0 font-display text-[0.8125rem] font-semibold text-primary">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Occasion chips */}
      <section className="border-y border-border bg-surface py-8">
        <div className="shell flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <p className="eyebrow shrink-0">Shop by occasion</p>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {occasions.slice(0, 9).map((occasion) => (
              <Link
                key={occasion}
                href={`/collections?occasion=${encodeURIComponent(occasion)}`}
                className="shrink-0 rounded-full border border-border px-4 py-2.5 font-display text-sm font-medium text-ink-soft transition-colors hover:border-primary hover:bg-primary-soft hover:text-primary"
              >
                {occasion}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- Collections */}
      <section className="shell py-20">
        <SectionHeading
          eyebrow="Curated edits"
          title="Six ways in"
          description="Every edit is picked by a person, not an algorithm, and rebuilt each season around what's actually good."
          action={
            <ButtonLink href="/collections" variant="outline" size="sm">
              All collections
              <ArrowRight size={16} strokeWidth={2} />
            </ButtonLink>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className={[
                "group relative flex animate-rise flex-col justify-end overflow-hidden rounded-xl p-6 shadow-soft transition-shadow duration-300 hover:shadow-card",
                i === 0 ? "sm:col-span-2 sm:aspect-[2/1]" : "aspect-[4/3]",
              ].join(" ")}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <ProductArt
                motif={collection.motif}
                palette={collection.palette}
                variant={i}
                seed={collection.slug}
                className="absolute inset-0 h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-overlay/85 via-overlay/30 to-transparent"
              />
              <div className="relative">
                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{collection.name}</h3>
                <p className="mt-1.5 max-w-sm text-sm text-white/80">{collection.headline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-medium text-white">
                  Explore
                  <ArrowRight
                    size={15}
                    strokeWidth={2}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------- Bestsellers */}
      <section className="bg-surface py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Loved most"
            title="The ones people come back for"
            description="Ranked by reorders, not by what we'd like to shift."
            action={
              <ButtonLink href="/collections?sort=popular" variant="outline" size="sm">
                See all bestsellers
                <ArrowRight size={16} strokeWidth={2} />
              </ButtonLink>
            }
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {bestsellers.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ How it works */}
      <section className="shell py-20">
        <SectionHeading eyebrow="How it works" title="Three steps, no fuss" className="max-w-3xl" />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="animate-rise rounded-xl border border-border bg-surface p-7"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                  <step.icon size={22} strokeWidth={1.75} />
                </span>
                <span className="tabular font-display text-4xl font-semibold text-border-strong">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* -------------------------------------------------------- Price bands */}
      <section className="shell pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {priceBands.map((band) => {
            const count = products.filter((p) => p.price >= band.min && p.price < band.max).length;
            return (
              <Link
                key={band.id}
                href={`/collections?price=${band.id}`}
                className="group flex items-center justify-between rounded-lg border border-border bg-surface px-5 py-5 transition-colors hover:border-primary hover:bg-primary-soft"
              >
                <span>
                  <span className="block font-display text-base font-semibold transition-colors group-hover:text-primary">
                    {band.label}
                  </span>
                  <span className="tabular text-xs text-ink-muted">{count} gifts</span>
                </span>
                <ArrowRight
                  size={17}
                  strokeWidth={2}
                  className="shrink-0 text-ink-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------------------------------------------------- Corporate */}
      <section className="shell pb-20">
        <div className="grain relative overflow-hidden rounded-2xl bg-overlay px-6 py-14 text-on-overlay sm:px-12 lg:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary opacity-25 blur-3xl"
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow text-white/60">Corporate gifting</p>
              <h2 className="mt-4 max-w-xl text-3xl text-white sm:text-4xl">
                Ten gifts or ten thousand — one invoice, one contact, zero spreadsheets.
              </h2>
              <p className="mt-4 max-w-xl text-white/75">
                Blind-embossed logos, staggered dispatch dates, address collection links you can forward to the
                whole team, and a human who answers the phone. Bulk pricing starts at ten units.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/collections/corporate" variant="onDark" size="lg">
                  See corporate hampers
                </ButtonLink>
                <ButtonLink href="/help/contact" variant="onDarkGhost" size="lg">
                  Talk to us
                </ButtonLink>
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                "Blind emboss or foil your logo",
                "Dispatch scheduled to your dates",
                "GST invoicing, 30-day terms",
                "Dedicated account manager",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90"
                >
                  <Star size={15} strokeWidth={2} className="shrink-0 fill-gold text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- New in */}
      <section className="bg-surface py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Just landed"
            title="New & limited"
            description="Short runs from makers we've been waiting on. When they're gone they're properly gone."
          />
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {newIn.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Testimonials */}
      <section className="shell py-20">
        <SectionHeading eyebrow="Word of mouth" title="What people tell us afterwards" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="flex animate-rise flex-col rounded-xl border border-border bg-surface p-7"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Quote size={26} strokeWidth={1.5} className="text-primary opacity-40" />
              <blockquote className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <span className="block font-display text-sm font-semibold">{t.name}</span>
                <span className="block text-xs text-ink-muted">{t.context}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
