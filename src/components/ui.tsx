import Link from "next/link";
import { Star } from "lucide-react";
import { cx } from "@/lib/format";

/* ------------------------------------------------------------------ Button */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "onDark" | "onDarkGhost";
type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-medium rounded-full transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.97] whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary shadow-soft hover:bg-primary-hover hover:shadow-card disabled:hover:bg-primary",
  secondary:
    "bg-ink text-ink-inverse hover:bg-ink-soft disabled:hover:bg-ink",
  outline:
    "border border-border-strong bg-surface text-ink hover:border-primary hover:text-primary",
  ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink",
  /* For use on the always-dark overlay band — colours are fixed, not themed. */
  onDark: "bg-white text-overlay shadow-soft hover:bg-white/90",
  onDarkGhost: "text-white hover:bg-white/10",
};

/* Every size clears the 44px minimum touch target. */
const sizes: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-6 text-[0.9375rem]",
  lg: "h-14 px-8 text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return cx(base, variants[variant], sizes[size], extra);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/* ------------------------------------------------------------------- Badge */

const badgeStyles: Record<string, string> = {
  bestseller: "bg-primary-soft text-primary",
  new: "bg-gold-soft text-gold",
  limited: "bg-blush-soft text-blush",
  handmade: "bg-success-soft text-success",
};

const badgeLabels: Record<string, string> = {
  bestseller: "Bestseller",
  new: "New in",
  limited: "Limited run",
  handmade: "Handmade",
};

export function Badge({ kind, className }: { kind: string; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 font-display text-[0.6875rem] font-semibold tracking-wide",
        badgeStyles[kind] ?? "bg-surface-sunken text-ink-soft",
        className,
      )}
    >
      {badgeLabels[kind] ?? kind}
    </span>
  );
}

/* ------------------------------------------------------------------ Rating */

export function Stars({
  rating,
  reviewCount,
  size = 14,
  className,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className={cx("inline-flex items-center gap-1.5", className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            strokeWidth={1.75}
            className={i <= rounded ? "fill-gold text-gold" : "text-border-strong"}
          />
        ))}
      </span>
      <span className="tabular text-xs font-semibold text-ink-soft">
        {rating.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="font-normal text-ink-muted"> ({reviewCount.toLocaleString("en-IN")})</span>
        )}
      </span>
      <span className="sr-only">
        Rated {rating} out of 5{reviewCount !== undefined ? ` from ${reviewCount} reviews` : ""}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ Layout */

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-[1.0625rem] text-ink-soft">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-display text-xs font-medium text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
