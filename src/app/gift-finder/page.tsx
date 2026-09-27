"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { products, recipients, occasions, priceBands } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button, ButtonLink } from "@/components/ui";
import { cx } from "@/lib/format";

type Answers = { recipient?: string; occasion?: string; band?: string };

const questions = [
  {
    key: "recipient" as const,
    title: "Who is it for?",
    hint: "We'll skip anything that clearly won't land.",
    options: recipients,
  },
  {
    key: "occasion" as const,
    title: "What's the occasion?",
    hint: "Pick the closest one — nothing is ruled out completely.",
    options: occasions,
  },
  {
    key: "band" as const,
    title: "What are you spending?",
    hint: "We'll stretch one band either way if something great sits just outside.",
    options: priceBands.map((b) => b.label),
  },
];

export default function GiftFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= questions.length;

  const results = useMemo(() => {
    if (!done) return [];
    const band = priceBands.find((b) => b.label === answers.band);
    return products
      .filter((p) => p.inStock)
      .map((p) => {
        let score = 0;
        if (answers.recipient && p.recipients.includes(answers.recipient)) score += 4;
        if (answers.occasion && p.occasions.includes(answers.occasion)) score += 3;
        if (band && p.price >= band.min && p.price < band.max) score += 3;
        else if (band && p.price >= band.min * 0.7 && p.price < band.max * 1.3) score += 1;
        return { p, score: score + p.rating / 10 };
      })
      .filter((r) => r.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.p);
  }, [done, answers]);

  function choose(key: keyof Answers, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <div className="grain relative bg-canvas-deep">
      <div className="shell py-14 lg:py-20">
        {!done ? (
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between gap-4">
              <p className="eyebrow">
                Step {step + 1} of {questions.length}
              </p>
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  <ArrowLeft size={15} strokeWidth={2} />
                  Back
                </button>
              )}
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${(step / questions.length) * 100}%` }}
              />
            </div>

            <h1 className="mt-8 text-3xl sm:text-4xl">{questions[step].title}</h1>
            <p className="mt-2 text-ink-soft">{questions[step].hint}</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {questions[step].options.map((option) => {
                const selected = answers[questions[step].key] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(questions[step].key, option)}
                    className={cx(
                      "min-h-14 cursor-pointer rounded-lg border bg-surface px-5 py-4 text-left font-display text-[0.9375rem] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-card",
                      selected ? "border-primary text-primary" : "border-border-strong",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-2 font-display text-xs font-semibold text-primary">
                <Sparkles size={14} strokeWidth={2} />
                {results.length} matches
              </span>
              <h1 className="mt-5 text-3xl sm:text-4xl">Here&rsquo;s what we&rsquo;d send</h1>
              <p className="mt-3 text-ink-soft">
                For <strong className="text-ink">{answers.recipient}</strong>, for{" "}
                <strong className="text-ink">{answers.occasion?.toLowerCase()}</strong>, around{" "}
                <strong className="text-ink">{answers.band?.toLowerCase()}</strong>.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="sm" onClick={reset}>
                  <RotateCcw size={15} strokeWidth={2} />
                  Start again
                </Button>
                <ButtonLink href="/collections" variant="ghost" size="sm">
                  Browse everything instead
                </ButtonLink>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="mx-auto mt-14 max-w-md rounded-xl border border-border bg-surface p-8 text-center">
                <p className="font-display text-lg font-semibold">Nothing fits all three</p>
                <p className="mt-2 text-sm text-ink-soft">
                  That combination is a narrow one. Loosen the budget and try again, or have a look at the full
                  catalogue.
                </p>
                <Button size="sm" onClick={reset} className="mt-5">
                  Try different answers
                </Button>
              </div>
            ) : (
              <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
                {results.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
