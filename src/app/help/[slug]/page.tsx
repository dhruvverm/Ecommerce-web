import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { helpArticles, findArticle } from "@/lib/content";
import { ArticlePage } from "@/components/article-page";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return helpArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(helpArticles, slug);
  if (!article) return { title: "Not found" };
  return { title: article.title, description: article.intro };
}

export default async function HelpArticle({ params }: Params) {
  const { slug } = await params;
  const article = findArticle(helpArticles, slug);
  if (!article) notFound();

  return (
    <ArticlePage
      article={article}
      breadcrumb={{ href: "/help/shipping", label: "Help" }}
      related={helpArticles.filter((a) => a.slug !== slug).map((a) => ({ slug: a.slug, title: a.title }))}
    />
  );
}
