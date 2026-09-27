# Wrapt — gift storefront

A complete e-commerce storefront for a gifting studio, built with Next.js 15 (App Router),
React 19, TypeScript and Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:3000
```

`npm run build` produces a fully static export of every route (49 pages prerendered).

## What's in it

| Route | What it does |
| --- | --- |
| `/` | Home — hero, occasion strip, collection bento, bestsellers, how-it-works, price bands, corporate band, new arrivals, testimonials |
| `/collections` | All 24 products with the full filter and sort rail |
| `/collections/[slug]` | One of six curated edits, with its own hero and the same filtering |
| `/products/[slug]` | Gallery, variant options with live price deltas, quantity, add to bag, buy now, details accordion, reviews, related products |
| `/cart` | Line items, quantity steppers, promo codes, live order summary, recommendations |
| `/checkout` | Four validated steps — contact & address, delivery & gift note, payment, review — then order placement |
| `/checkout/success` | Order confirmation with fulfilment timeline and the gift note as written |
| `/gift-finder` | Three-question quiz that scores and ranks the catalogue |
| `/about`, `/about/[slug]`, `/help/[slug]` | Studio story and nine help/policy articles |

## How it's put together

**Design tokens.** Every colour, radius and shadow is a CSS custom property in
`src/app/globals.css`, exposed to Tailwind through `@theme inline`. Light and dark are two
sets of the same token names, so components never branch on theme. Scrims and dark bands use
a separate `--overlay` token that is deliberately *constant* across themes — white text sitting
on an image gradient must not flip when the rest of the UI does.

**Product art.** There are no bitmap images anywhere. `src/components/product-art.tsx` draws
twelve illustration motifs as inline SVG, coloured per product from a three-stop palette. That
keeps the catalogue visually consistent, costs zero network requests, and stays crisp at any
size. A `variant` prop shifts the backdrop so a product gallery can show the same motif four ways.

**Cart.** `src/lib/cart.tsx` is a reducer behind a context provider, persisted to
`localStorage` and restored on mount. Lines are keyed by product *plus* chosen options, so two
variants of one product stay separate. Every storage access is wrapped — blocked storage
degrades to a session-only cart rather than throwing.

**Catalogue.** `src/lib/products.ts` holds 24 products and 6 collections with occasions,
recipients, option sets, price deltas and copy. Filtering, sorting, search, related-product
scoring and the gift-finder ranking all read from it.

## Accessibility

Built to the checks that matter rather than retrofitted: one `h1` per route including loading
states, a skip link, visible focus rings, 44px minimum touch targets, labelled form fields with
errors placed beside the field *and* summarised at the top with anchor links, focus moved to the
first invalid field on submit, `aria-live` on status messages, and `prefers-reduced-motion`
honoured globally. Prices and quantities use tabular figures so digits don't jitter.

## Note on checkout

Checkout is simulated. No payment gateway is wired up, nothing leaves the browser, and order
numbers are generated locally. The payment step says so on screen. Wiring a real gateway means
replacing the `placeOrder` function in `src/app/checkout/page.tsx` with a server action.
