import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { collections, products, productsInCollection } from "@/lib/products";
import { CollectionBrowser } from "@/components/collection-browser";
import { ProductArt } from "@/components/product-art";

export const metadata: Metadata = {
  title: "Shop all gifts",
  description:
    "Every gift in the Wrapt studio — filter by price, occasion and recipient to find the one that fits.",
};

export default function CollectionsPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-border bg-canvas-deep">
        <div className="shell relative py-14">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-ink-muted">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink">
                Shop all
              </li>
            </ol>
          </nav>
          <h1 className="max-w-2xl text-4xl sm:text-5xl">Every gift, all in one place</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            {products.length} things worth giving, from {collections.length} edits. Filter by budget, occasion
            or who it&rsquo;s for.
          </p>

          <div className="-mx-1 mt-8 flex gap-3 overflow-x-auto px-1 pb-2">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="group flex w-56 shrink-0 items-center gap-3 rounded-lg border border-border bg-surface p-3 transition-colors hover:border-primary"
              >
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-md">
                  <ProductArt
                    motif={collection.motif}
                    palette={collection.palette}
                    seed={collection.slug}
                    className="h-full w-full"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-display text-sm font-semibold transition-colors group-hover:text-primary">
                    {collection.name}
                  </span>
                  <span className="tabular block text-xs text-ink-muted">
                    {productsInCollection(collection.slug).length} gifts
                  </span>
                </span>
                <ArrowRight
                  size={15}
                  strokeWidth={2}
                  className="ml-auto shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Suspense fallback={<BrowserSkeleton />}>
        <CollectionBrowser products={products} />
      </Suspense>
    </>
  );
}

function BrowserSkeleton() {
  return (
    <div className="shell py-10">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] animate-pulse rounded-xl bg-surface-sunken" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-sunken" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-surface-sunken" />
          </div>
        ))}
      </div>
    </div>
  );
}
