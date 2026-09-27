import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, products, relatedProducts, getCollection } from "@/lib/products";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { Stars } from "@/components/ui";
import { formatPrice } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: { title: product.name, description: product.description },
  };
}

/* A small, deterministic set of reviews so every product page has real content. */
function reviewsFor(name: string) {
  return [
    {
      name: "Priya S.",
      rating: 5,
      date: "2 weeks ago",
      title: "Exactly as described",
      body: `Bought ${name} for my mother and the packaging alone got a reaction. The handwritten note is the detail that makes it feel considered rather than ordered.`,
    },
    {
      name: "Karan D.",
      rating: 5,
      date: "1 month ago",
      title: "Arrived faster than expected",
      body: "Ordered on a Tuesday afternoon, at the door Wednesday evening in Pune. Everything was intact and the box is genuinely reusable.",
    },
    {
      name: "Nisha T.",
      rating: 4,
      date: "2 months ago",
      title: "Lovely, slightly smaller than I pictured",
      body: "No complaints about quality at all — just read the dimensions properly, which is my fault and not theirs. Would buy again for a birthday.",
    },
  ];
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product, 4);
  const primaryCollection = getCollection(product.collections[0]);
  const reviews = reviewsFor(product.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="shell pt-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/collections" className="hover:text-ink">
                Shop all
              </Link>
            </li>
            {primaryCollection && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href={`/collections/${primaryCollection.slug}`} className="hover:text-ink">
                    {primaryCollection.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-ink">
              {product.name}
            </li>
          </ol>
        </nav>
      </div>

      <ProductDetail product={product} />

      {/* --------------------------------------------------------- Reviews */}
      <section className="border-t border-border bg-surface py-16">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div>
              <h2 className="font-display text-2xl font-semibold">Reviews</h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="tabular font-display text-5xl font-semibold">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-ink-muted">out of 5</span>
              </div>
              <Stars rating={product.rating} size={16} className="mt-2" />
              <p className="tabular mt-2 text-sm text-ink-muted">
                Based on {product.reviewCount.toLocaleString("en-IN")} verified purchases
              </p>

              <dl className="mt-6 space-y-2">
                {[
                  { stars: 5, pct: 82 },
                  { stars: 4, pct: 13 },
                  { stars: 3, pct: 3 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <dt className="tabular w-8 text-xs text-ink-muted">{row.stars}★</dt>
                    <dd className="flex flex-1 items-center gap-3">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                        <span className="block h-full rounded-full bg-gold" style={{ width: `${row.pct}%` }} />
                      </span>
                      <span className="tabular w-8 text-right text-xs text-ink-muted">{row.pct}%</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="divide-y divide-border">
              {reviews.map((review) => (
                <li key={review.name} className="py-6 first:pt-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-display text-sm font-semibold text-primary">
                        {review.name.charAt(0)}
                      </span>
                      <span>
                        <span className="block font-display text-sm font-semibold">{review.name}</span>
                        <span className="flex items-center gap-1.5 text-xs text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          Verified purchase
                        </span>
                      </span>
                    </div>
                    <span className="text-xs text-ink-muted">{review.date}</span>
                  </div>
                  <Stars rating={review.rating} size={13} className="mt-3" />
                  <h3 className="mt-2 font-display text-[0.9375rem] font-semibold">{review.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{review.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Related */}
      <section className="shell py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Goes well with this</h2>
          <Link href="/collections" className="link-underline shrink-0 font-display text-sm font-medium text-primary">
            Shop all
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((item, i) => (
            <ProductCard key={item.id} product={item} index={i} />
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-surface-sunken p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-display text-base font-semibold">Buy the pair and save</p>
            <p className="mt-1 text-sm text-ink-soft">
              {product.name} with {related[0]?.name} — a combination we send out constantly.
            </p>
          </div>
          <p className="tabular mt-3 shrink-0 font-display text-lg font-semibold sm:mt-0">
            {formatPrice(product.price + (related[0]?.price ?? 0))}
          </p>
        </div>
      </section>
    </>
  );
}
