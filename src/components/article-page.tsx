import Link from "next/link";
import type { Article } from "@/lib/content";
import { ButtonLink } from "./ui";

export function ArticlePage({
  article,
  breadcrumb,
  related,
}: {
  article: Article;
  breadcrumb: { href: string; label: string };
  related: { slug: string; title: string }[];
}) {
  return (
    <>
      <section className="grain relative border-b border-border bg-canvas-deep">
        <div className="shell py-14">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              <li>
                <Link href="/" className="hover:text-ink">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={breadcrumb.href} className="hover:text-ink">
                  {breadcrumb.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-ink">
                {article.title}
              </li>
            </ol>
          </nav>
          <h1 className="max-w-3xl text-4xl sm:text-5xl">{article.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{article.intro}</p>
        </div>
      </section>

      <div className="shell grid gap-12 py-14 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <article className="max-w-2xl">
          {article.sections.map((section) => (
            <section key={section.heading} className="mb-10 last:mb-0">
              <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <div className="mt-12 rounded-xl border border-border bg-surface p-6">
            <p className="font-display text-base font-semibold">Still need a hand?</p>
            <p className="mt-1 text-sm text-ink-soft">
              A real person answers, usually within a couple of hours during studio time.
            </p>
            <ButtonLink href="/help/contact" size="sm" className="mt-4">
              Contact the studio
            </ButtonLink>
          </div>
        </article>

        {related.length > 0 && (
          <aside className="lg:sticky lg:top-[88px] lg:self-start">
            <p className="eyebrow mb-4">Also useful</p>
            <ul className="space-y-1">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`${breadcrumb.href === "/about" ? "/about" : "/help"}/${item.slug}`}
                    className="block rounded-lg px-3 py-2.5 text-[0.9375rem] text-ink-soft transition-colors hover:bg-surface-sunken hover:text-ink"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </>
  );
}
