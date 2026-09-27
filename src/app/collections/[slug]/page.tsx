import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { collections, getCollection, productsInCollection } from "@/lib/products";
import { CollectionBrowser } from "@/components/collection-browser";
import { ProductArt } from "@/components/product-art";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = productsInCollection(slug);
  const others = collections.filter((c) => c.slug !== slug);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <ProductArt
            motif={collection.motif}
            palette={collection.palette}
            variant={1}
            seed={collection.slug}
            className="h-full w-full"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-overlay/90 via-overlay/65 to-overlay/25" />
        </div>

        <div className="shell relative py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/collections" className="hover:text-white">
                  Shop all
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-white">
                {collection.name}
              </li>
            </ol>
          </nav>

          <p className="eyebrow text-white/60">{items.length} gifts in this edit</p>
          <h1 className="mt-3 max-w-2xl text-4xl text-white sm:text-5xl">{collection.headline}</h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">{collection.description}</p>
        </div>
      </section>

      <Suspense fallback={<div className="shell py-20 text-center text-ink-muted">Loading gifts…</div>}>
        <CollectionBrowser products={items} />
      </Suspense>

      <section className="border-t border-border bg-surface py-14">
        <div className="shell">
          <h2 className="font-display text-xl font-semibold">Keep looking</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((other) => (
              <Link
                key={other.slug}
                href={`/collections/${other.slug}`}
                className="group relative flex aspect-[3/2] flex-col justify-end overflow-hidden rounded-lg p-4"
              >
                <ProductArt
                  motif={other.motif}
                  palette={other.palette}
                  seed={other.slug}
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-overlay/85 to-transparent" />
                <span className="relative font-display text-sm font-semibold text-white">{other.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
