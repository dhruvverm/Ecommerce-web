import { Gift } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  const suggestions = products.filter((p) => p.badge === "bestseller").slice(0, 4);

  return (
    <div className="shell py-20">
      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Gift size={34} strokeWidth={1.75} />
        </span>
        <div>
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-3 text-4xl">This one&rsquo;s already been unwrapped</h1>
          <p className="mt-3 text-ink-soft">
            The page you were after isn&rsquo;t here. It may have moved, or the link may have a typo in it.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Back home
          </ButtonLink>
          <ButtonLink href="/collections" variant="outline" size="lg">
            Shop all gifts
          </ButtonLink>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-xl font-semibold">While you&rsquo;re here</h2>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {suggestions.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
