"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronDown,
  Lock,
  Truck,
  Zap,
  CalendarDays,
  Gift,
  Smartphone,
  CreditCard,
  Wallet,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, cx } from "@/lib/format";
import { ProductArt } from "@/components/product-art";
import { Button, ButtonLink } from "@/components/ui";
import { Field, SelectField, TextAreaField } from "@/components/field";

const STEPS = ["Contact", "Delivery", "Payment", "Review"] as const;

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal",
];

const SHIPPING_METHODS = [
  { id: "standard", icon: Truck, name: "Standard", eta: "3–5 working days", price: 0, note: "Free over ₹1,499" },
  { id: "express", icon: Zap, name: "Express", eta: "Next working day", price: 249, note: "Order before 2pm" },
  { id: "scheduled", icon: CalendarDays, name: "Pick a date", eta: "Arrives on the day you choose", price: 149, note: "Up to 60 days ahead" },
];

const PAYMENT_METHODS = [
  { id: "upi", icon: Smartphone, name: "UPI", note: "GPay, PhonePe, Paytm" },
  { id: "card", icon: CreditCard, name: "Card", note: "Visa, Mastercard, RuPay" },
  { id: "cod", icon: Wallet, name: "Cash on delivery", note: "₹49 handling fee" },
];

type Form = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  shippingMethod: string;
  deliveryDate: string;
  giftMessage: string;
  hidePrices: boolean;
  paymentMethod: string;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  upiId: string;
  terms: boolean;
};

const initial: Form = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  pincode: "",
  shippingMethod: "standard",
  deliveryDate: "",
  giftMessage: "",
  hidePrices: true,
  paymentMethod: "upi",
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  upiId: "",
  terms: false,
};

type Errors = Partial<Record<keyof Form, string>>;

/** Per-step validation. Messages say what is wrong and how to fix it. */
function validate(step: number, form: Form): Errors {
  const e: Errors = {};

  if (step === 0) {
    if (!form.email.trim()) e.email = "We need an email to send the order confirmation.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = "Check the email address — it's missing an @ or a domain.";

    if (!form.phone.trim()) e.phone = "A phone number lets the courier reach the recipient.";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a 10-digit Indian mobile number starting 6–9.";

    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.address1.trim()) e.address1 = "Add a house or flat number and street.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state) e.state = "Choose a state so we can quote delivery.";
    if (!form.pincode.trim()) e.pincode = "Pincode is required.";
    else if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = "Indian pincodes are exactly 6 digits.";
  }

  if (step === 1) {
    if (form.shippingMethod === "scheduled" && !form.deliveryDate) {
      e.deliveryDate = "Pick the date you'd like it to arrive.";
    }
    if (form.giftMessage.length > 240) e.giftMessage = "Keep the note under 240 characters so it fits the card.";
  }

  if (step === 2) {
    if (form.paymentMethod === "card") {
      if (!form.cardName.trim()) e.cardName = "Enter the name printed on the card.";
      const digits = form.cardNumber.replace(/\s/g, "");
      if (!digits) e.cardNumber = "Card number is required.";
      else if (!/^\d{12,19}$/.test(digits)) e.cardNumber = "A card number is 12–19 digits.";
      if (!form.cardExpiry.trim()) e.cardExpiry = "Expiry is required.";
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.cardExpiry)) e.cardExpiry = "Use MM/YY, for example 04/29.";
      if (!form.cardCvc.trim()) e.cardCvc = "CVC is required.";
      else if (!/^\d{3,4}$/.test(form.cardCvc)) e.cardCvc = "CVC is the 3 or 4 digits on the back.";
    }
    if (form.paymentMethod === "upi") {
      if (!form.upiId.trim()) e.upiId = "Enter your UPI ID.";
      else if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(form.upiId)) e.upiId = "UPI IDs look like name@bank.";
    }
    if (!form.terms) e.terms = "Please accept the terms to continue.";
  }

  return e;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, discount, tax, promo, itemCount, hydrated, clear } = useCart();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const method = SHIPPING_METHODS.find((m) => m.id === form.shippingMethod)!;
  const discounted = subtotal - discount;
  const shipping = method.id === "standard" && discounted >= 1499 ? 0 : method.price;
  const codFee = form.paymentMethod === "cod" ? 49 : 0;
  const total = discounted + shipping + tax + codFee;

  useEffect(() => {
    if (hydrated && lines.length === 0 && !placing) router.replace("/cart");
  }, [hydrated, lines.length, placing, router]);

  // Moving between steps should start at the top of the new step.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function next() {
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Announce the summary, then put the caret in the first bad field.
      requestAnimationFrame(() => {
        errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        const first = Object.keys(found)[0];
        document.getElementById(first)?.focus();
      });
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  async function placeOrder() {
    setPlacing(true);
    const orderId = `WR-${Date.now().toString().slice(-6)}`;
    try {
      sessionStorage.setItem(
        "giftbox.lastOrder",
        JSON.stringify({
          orderId,
          email: form.email,
          name: `${form.firstName} ${form.lastName}`.trim(),
          address: [form.address1, form.address2, form.city, form.state, form.pincode]
            .filter(Boolean)
            .join(", "),
          method: method.name,
          eta: method.eta,
          deliveryDate: form.deliveryDate,
          giftMessage: form.giftMessage,
          paymentMethod: PAYMENT_METHODS.find((p) => p.id === form.paymentMethod)?.name,
          total,
          itemCount,
          items: lines.map((l) => ({
            name: l.product.name,
            quantity: l.quantity,
            total: l.lineTotal,
            motif: l.product.motif,
            palette: l.product.palette,
            id: l.product.id,
          })),
        }),
      );
    } catch {
      // The confirmation page falls back to a generic message without this.
    }
    // Stand-in for a payment gateway round trip — nothing leaves the browser.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    clear();
    router.push(`/checkout/success?order=${orderId}`);
  }

  if (!hydrated || lines.length === 0) {
    return (
      <div className="shell py-16">
        <h1 className="text-3xl sm:text-4xl">Checkout</h1>
        <p className="mt-3 text-ink-muted" role="status">
          {hydrated ? "Your bag is empty — taking you back to it…" : "Loading your checkout…"}
        </p>
        <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <div className="space-y-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-surface-sunken" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-surface-sunken" />
        </div>
      </div>
    );
  }

  const errorList = Object.entries(errors).filter(([, v]) => Boolean(v)) as [string, string][];

  return (
    <div className="shell py-8 pb-28 lg:pb-8">
      <div className="flex items-center justify-between gap-4">
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink">
          <ChevronLeft size={16} strokeWidth={2} />
          Back to bag
        </Link>
        <p className="flex items-center gap-1.5 text-xs text-ink-muted">
          <Lock size={13} strokeWidth={2} />
          Secure checkout
        </p>
      </div>

      <h1 className="mt-6 text-3xl sm:text-4xl">Checkout</h1>

      {/* --------------------------------------------------- Step indicator */}
      <nav aria-label="Checkout progress" className="mt-7">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  disabled={i >= step}
                  aria-current={current ? "step" : undefined}
                  className={cx(
                    "flex items-center gap-2 rounded-full py-1.5 pr-3 text-left transition-colors",
                    i < step && "cursor-pointer hover:text-primary",
                    i >= step && "cursor-default",
                  )}
                >
                  <span
                    className={cx(
                      "tabular grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-xs font-bold transition-colors",
                      done && "bg-success text-white",
                      current && "bg-primary text-on-primary",
                      !done && !current && "bg-surface-sunken text-ink-muted",
                    )}
                  >
                    {done ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={cx(
                      "hidden font-display text-sm font-medium sm:block",
                      current ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cx("h-0.5 flex-1 rounded-full transition-colors", done ? "bg-success" : "bg-border")}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
        <div>
          {/* Error summary, anchored so keyboard users can jump to each field. */}
          {errorList.length > 0 && (
            <div
              ref={errorRef}
              role="alert"
              aria-live="polite"
              className="mb-7 rounded-lg border border-danger/40 bg-danger/5 p-4"
            >
              <p className="flex items-center gap-2 font-display text-sm font-semibold text-danger">
                <AlertCircle size={16} strokeWidth={2} />
                {errorList.length === 1 ? "One thing needs fixing" : `${errorList.length} things need fixing`}
              </p>
              <ul className="mt-2 space-y-1 pl-6">
                {errorList.map(([key, message]) => (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(key)?.focus();
                      }}
                      className="text-xs text-danger underline underline-offset-2"
                    >
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ------------------------------------------------- Step 1: Contact */}
          {step === 0 && (
            <section className="animate-fade space-y-8">
              <div>
                <h2 className="font-display text-xl font-semibold">Contact</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  For the order confirmation and delivery updates. We don&rsquo;t send marketing here unless you
                  opt in.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    error={errors.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => setErrors((prev) => ({ ...prev, email: validate(0, form).email }))}
                  />
                  <Field
                    id="phone"
                    label="Mobile number"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="98765 43210"
                    hint="Used only for delivery updates."
                    value={form.phone}
                    error={errors.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    onBlur={() => setErrors((prev) => ({ ...prev, phone: validate(0, form).phone }))}
                  />
                </div>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold">Delivery address</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Sending it straight to them? Put their address here — we&rsquo;ll leave prices off the invoice.
                </p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field
                    id="firstName"
                    label="First name"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    error={errors.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                  />
                  <Field
                    id="lastName"
                    label="Last name"
                    autoComplete="family-name"
                    required
                    value={form.lastName}
                    error={errors.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                  />
                  <Field
                    id="address1"
                    label="Flat, house no., building"
                    autoComplete="address-line1"
                    required
                    className="sm:col-span-2"
                    value={form.address1}
                    error={errors.address1}
                    onChange={(e) => set("address1", e.target.value)}
                  />
                  <Field
                    id="address2"
                    label="Area, street, landmark"
                    autoComplete="address-line2"
                    className="sm:col-span-2"
                    hint="Optional, but landmarks genuinely help couriers."
                    value={form.address2}
                    onChange={(e) => set("address2", e.target.value)}
                  />
                  <Field
                    id="city"
                    label="City"
                    autoComplete="address-level2"
                    required
                    value={form.city}
                    error={errors.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                  <SelectField
                    id="state"
                    label="State"
                    autoComplete="address-level1"
                    required
                    value={form.state}
                    error={errors.state}
                    onChange={(e) => set("state", e.target.value)}
                  >
                    <option value="">Select a state</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </SelectField>
                  <Field
                    id="pincode"
                    label="Pincode"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    required
                    value={form.pincode}
                    error={errors.pincode}
                    onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))}
                    onBlur={() => setErrors((prev) => ({ ...prev, pincode: validate(0, form).pincode }))}
                  />
                  <Field id="country" label="Country" value="India" readOnly disabled />
                </div>
              </div>
            </section>
          )}

          {/* ------------------------------------------------ Step 2: Delivery */}
          {step === 1 && (
            <section className="animate-fade space-y-8">
              <div>
                <h2 className="font-display text-xl font-semibold">How should it get there?</h2>
                <fieldset className="mt-5 space-y-3">
                  <legend className="sr-only">Shipping method</legend>
                  {SHIPPING_METHODS.map((m) => {
                    const selected = form.shippingMethod === m.id;
                    const free = m.id === "standard" && discounted >= 1499;
                    return (
                      <label
                        key={m.id}
                        className={cx(
                          "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                          selected ? "border-primary bg-primary-soft/40" : "border-border-strong hover:border-ink-muted",
                        )}
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={m.id}
                          checked={selected}
                          onChange={() => set("shippingMethod", m.id)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cx(
                            "grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors",
                            selected ? "border-primary" : "border-border-strong",
                          )}
                        >
                          {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                        </span>
                        <m.icon size={20} strokeWidth={1.75} className={cx("shrink-0", selected ? "text-primary" : "text-ink-muted")} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[0.9375rem] font-semibold">{m.name}</span>
                          <span className="block text-xs text-ink-muted">{m.eta} · {m.note}</span>
                        </span>
                        <span className="tabular shrink-0 font-display text-sm font-semibold">
                          {free || m.price === 0 ? "Free" : formatPrice(m.price)}
                        </span>
                      </label>
                    );
                  })}
                </fieldset>

                {form.shippingMethod === "scheduled" && (
                  <Field
                    id="deliveryDate"
                    label="Delivery date"
                    type="date"
                    required
                    className="mt-4 max-w-xs"
                    min={new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)}
                    value={form.deliveryDate}
                    error={errors.deliveryDate}
                    onChange={(e) => set("deliveryDate", e.target.value)}
                  />
                )}
              </div>

              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Gift size={19} strokeWidth={1.75} className="text-primary" />
                  Gift note
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Someone here writes this out by hand on cotton card. Free, always.
                </p>
                <TextAreaField
                  id="giftMessage"
                  label="Your message"
                  className="mt-5"
                  maxLength={240}
                  placeholder="Happy birthday, Ammu. Thirty looks unreasonably good on you."
                  hint={`${240 - form.giftMessage.length} characters left`}
                  value={form.giftMessage}
                  error={errors.giftMessage}
                  onChange={(e) => set("giftMessage", e.target.value)}
                />

                <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 rounded-lg bg-surface-sunken p-4">
                  <input
                    type="checkbox"
                    checked={form.hidePrices}
                    onChange={(e) => set("hidePrices", e.target.checked)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cx(
                      "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                      form.hidePrices ? "border-primary bg-primary text-on-primary" : "border-border-strong bg-surface",
                    )}
                  >
                    {form.hidePrices && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block font-display text-sm font-medium">Hide prices on the packing slip</span>
                    <span className="block text-xs text-ink-muted">
                      Recommended when it ships straight to the recipient.
                    </span>
                  </span>
                </label>
              </div>
            </section>
          )}

          {/* ------------------------------------------------- Step 3: Payment */}
          {step === 2 && (
            <section className="animate-fade space-y-8">
              <div>
                <h2 className="font-display text-xl font-semibold">Payment</h2>
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-gold/30 bg-gold-soft px-4 py-3">
                  <ShieldCheck size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-gold" />
                  <p className="text-xs text-ink-soft">
                    <strong className="font-semibold">This is a demo storefront.</strong> No payment is processed
                    and nothing you type leaves your browser — please don&rsquo;t enter real card details.
                  </p>
                </div>

                <fieldset className="mt-5">
                  <legend className="sr-only">Payment method</legend>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {PAYMENT_METHODS.map((p) => {
                      const selected = form.paymentMethod === p.id;
                      return (
                        <label
                          key={p.id}
                          className={cx(
                            "flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition-colors",
                            selected ? "border-primary bg-primary-soft/40" : "border-border-strong hover:border-ink-muted",
                          )}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={p.id}
                            checked={selected}
                            onChange={() => set("paymentMethod", p.id)}
                            className="sr-only"
                          />
                          <p.icon size={20} strokeWidth={1.75} className={selected ? "text-primary" : "text-ink-muted"} />
                          <span>
                            <span className="block font-display text-sm font-semibold">{p.name}</span>
                            <span className="block text-xs text-ink-muted">{p.note}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {form.paymentMethod === "upi" && (
                  <Field
                    id="upiId"
                    label="UPI ID"
                    className="mt-5 max-w-sm"
                    placeholder="yourname@bank"
                    autoComplete="off"
                    required
                    hint="You'd normally approve the request in your UPI app."
                    value={form.upiId}
                    error={errors.upiId}
                    onChange={(e) => set("upiId", e.target.value)}
                  />
                )}

                {form.paymentMethod === "card" && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field
                      id="cardName"
                      label="Name on card"
                      autoComplete="cc-name"
                      required
                      className="sm:col-span-2"
                      value={form.cardName}
                      error={errors.cardName}
                      onChange={(e) => set("cardName", e.target.value)}
                    />
                    <Field
                      id="cardNumber"
                      label="Card number"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      required
                      maxLength={23}
                      placeholder="0000 0000 0000 0000"
                      className="sm:col-span-2"
                      value={form.cardNumber}
                      error={errors.cardNumber}
                      onChange={(e) =>
                        set(
                          "cardNumber",
                          e.target.value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim(),
                        )
                      }
                    />
                    <Field
                      id="cardExpiry"
                      label="Expiry"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={form.cardExpiry}
                      error={errors.cardExpiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                        set("cardExpiry", digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                      }}
                    />
                    <Field
                      id="cardCvc"
                      label="CVC"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={form.cardCvc}
                      error={errors.cardCvc}
                      onChange={(e) => set("cardCvc", e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                )}

                {form.paymentMethod === "cod" && (
                  <p className="mt-5 rounded-lg bg-surface-sunken p-4 text-sm text-ink-soft">
                    Pay the courier in cash or by UPI on delivery. A ₹49 handling fee is added to the total, and
                    cash on delivery isn&rsquo;t available on orders over ₹10,000.
                  </p>
                )}
              </div>

              <label className="flex min-h-11 cursor-pointer items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => set("terms", e.target.checked)}
                  aria-invalid={Boolean(errors.terms)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cx(
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                    form.terms
                      ? "border-primary bg-primary text-on-primary"
                      : errors.terms
                        ? "border-danger bg-surface"
                        : "border-border-strong bg-surface",
                  )}
                >
                  {form.terms && <Check size={13} strokeWidth={3} />}
                </span>
                <span className="text-sm text-ink-soft">
                  I agree to the{" "}
                  <Link href="/help/terms" className="text-primary underline underline-offset-2">
                    terms of sale
                  </Link>{" "}
                  and the{" "}
                  <Link href="/help/privacy" className="text-primary underline underline-offset-2">
                    privacy policy
                  </Link>
                  .
                  {errors.terms && (
                    <span role="alert" className="mt-1 block text-xs font-medium text-danger">
                      {errors.terms}
                    </span>
                  )}
                </span>
              </label>
            </section>
          )}

          {/* -------------------------------------------------- Step 4: Review */}
          {step === 3 && (
            <section className="animate-fade space-y-6">
              <h2 className="font-display text-xl font-semibold">Check it over</h2>

              {[
                {
                  title: "Contact",
                  goto: 0,
                  rows: [
                    ["Email", form.email],
                    ["Mobile", form.phone],
                  ],
                },
                {
                  title: "Delivery address",
                  goto: 0,
                  rows: [
                    ["Name", `${form.firstName} ${form.lastName}`],
                    [
                      "Address",
                      [form.address1, form.address2, form.city, form.state, form.pincode, "India"]
                        .filter(Boolean)
                        .join(", "),
                    ],
                  ],
                },
                {
                  title: "Delivery",
                  goto: 1,
                  rows: [
                    ["Method", `${method.name} — ${method.eta}`],
                    ...(form.deliveryDate ? [["Arrives", form.deliveryDate] as [string, string]] : []),
                    ["Gift note", form.giftMessage || "None added"],
                    ["Packing slip", form.hidePrices ? "Prices hidden" : "Prices shown"],
                  ],
                },
                {
                  title: "Payment",
                  goto: 2,
                  rows: [
                    ["Method", PAYMENT_METHODS.find((p) => p.id === form.paymentMethod)?.name ?? ""],
                    ...(form.paymentMethod === "card"
                      ? [["Card", `•••• ${form.cardNumber.replace(/\s/g, "").slice(-4)}`] as [string, string]]
                      : []),
                    ...(form.paymentMethod === "upi" ? [["UPI ID", form.upiId] as [string, string]] : []),
                  ],
                },
              ].map((block) => (
                <div key={block.title} className="rounded-lg border border-border bg-surface p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-sm font-semibold">{block.title}</h3>
                    <button
                      type="button"
                      onClick={() => setStep(block.goto)}
                      className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <dl className="mt-3 space-y-1.5">
                    {block.rows.map(([label, value]) => (
                      <div key={label} className="flex gap-3 text-sm">
                        <dt className="w-28 shrink-0 text-ink-muted">{label}</dt>
                        <dd className="min-w-0 flex-1 break-words text-ink-soft">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div className="rounded-lg border border-border bg-surface p-5">
                <h3 className="font-display text-sm font-semibold">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </h3>
                <ul className="mt-3 divide-y divide-border">
                  {lines.map((line) => (
                    <li key={line.key} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                      <span className="h-14 w-12 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                        <ProductArt
                          motif={line.product.motif}
                          palette={line.product.palette}
                          seed={line.product.id}
                          className="h-full w-full"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-medium">{line.product.name}</span>
                        <span className="block truncate text-xs text-ink-muted">
                          {Object.values(line.options).join(" · ")} · Qty {line.quantity}
                        </span>
                      </span>
                      <span className="tabular shrink-0 font-display text-sm font-semibold">
                        {formatPrice(line.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Desktop step controls */}
          <div className="mt-9 hidden items-center gap-3 lg:flex">
            {step > 0 && (
              <Button variant="outline" size="lg" onClick={() => setStep((s) => s - 1)} disabled={placing}>
                <ChevronLeft size={17} strokeWidth={2} />
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button size="lg" onClick={next} className="min-w-52">
                Continue to {STEPS[step + 1]}
              </Button>
            ) : (
              <Button size="lg" onClick={placeOrder} disabled={placing} className="min-w-64">
                {placing ? (
                  <>
                    <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                    Placing your order…
                  </>
                ) : (
                  <>
                    <Lock size={17} strokeWidth={2} />
                    Place order · {formatPrice(total)}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* ---------------------------------------------------------- Summary */}
        <aside className="order-first lg:order-none lg:sticky lg:top-[88px] lg:self-start">
          <div className="rounded-xl border border-border bg-surface">
            <button
              type="button"
              onClick={() => setSummaryOpen((o) => !o)}
              aria-expanded={summaryOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-3 p-5 lg:pointer-events-none lg:cursor-default"
            >
              <span className="font-display text-base font-semibold">
                Order summary
                <span className="tabular ml-2 font-normal text-ink-muted">({itemCount})</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="tabular font-display text-lg font-semibold lg:hidden">{formatPrice(total)}</span>
                <ChevronDown
                  size={17}
                  strokeWidth={2}
                  className={cx("text-ink-muted transition-transform lg:hidden", summaryOpen && "rotate-180")}
                />
              </span>
            </button>

            <div className={cx("px-5 pb-5", summaryOpen ? "block" : "hidden lg:block")}>
              <ul className="divide-y divide-border border-t border-border">
                {lines.map((line) => (
                  <li key={line.key} className="flex items-center gap-3 py-3">
                    <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                      <ProductArt
                        motif={line.product.motif}
                        palette={line.product.palette}
                        seed={line.product.id}
                        className="h-full w-full"
                      />
                      <span className="tabular absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.625rem] font-bold text-ink-inverse">
                        {line.quantity}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[0.8125rem] font-medium">
                        {line.product.name}
                      </span>
                      <span className="block truncate text-xs text-ink-muted">
                        {Object.values(line.options).join(" · ")}
                      </span>
                    </span>
                    <span className="tabular shrink-0 font-display text-[0.8125rem] font-semibold">
                      {formatPrice(line.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2.5 border-t border-border pt-4 text-sm">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                {discount > 0 && (
                  <SummaryRow label={`Discount (${promo?.code})`} value={`−${formatPrice(discount)}`} accent />
                )}
                <SummaryRow
                  label={`Shipping — ${method.name}`}
                  value={shipping === 0 ? "Free" : formatPrice(shipping)}
                  accent={shipping === 0}
                />
                {codFee > 0 && <SummaryRow label="COD handling" value={formatPrice(codFee)} />}
                <SummaryRow label="GST (18%)" value={formatPrice(tax)} />
              </dl>

              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <span className="font-display text-base font-semibold">Total</span>
                <span className="tabular font-display text-2xl font-semibold">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <ul className="mt-5 space-y-2.5 px-1">
            {["Free handwritten note in every order", "Hand-wrapped, plastic-free packaging", "14-day returns, no restocking fee"].map(
              (item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-ink-muted">
                  <Check size={14} strokeWidth={2.5} className="mt-0.5 shrink-0 text-success" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </aside>
      </div>

      {/* Mobile sticky action bar */}
      <div className="glass fixed inset-x-0 bottom-0 z-[80] border-t border-border p-4 lg:hidden">
        <div className="flex items-center gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStep((s) => s - 1)}
              disabled={placing}
              aria-label="Back to previous step"
              className="w-14 shrink-0 px-0"
            >
              <ChevronLeft size={19} strokeWidth={2} />
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button size="lg" onClick={next} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button size="lg" onClick={placeOrder} disabled={placing} className="flex-1">
              {placing ? (
                <>
                  <Loader2 size={18} strokeWidth={2.5} className="animate-spin" />
                  Placing…
                </>
              ) : (
                <>Place order · {formatPrice(total)}</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="min-w-0 text-ink-soft">{label}</dt>
      <dd className={cx("tabular shrink-0 font-medium", accent ? "text-success" : "text-ink")}>{value}</dd>
    </div>
  );
}
