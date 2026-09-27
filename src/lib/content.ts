export type Article = {
  slug: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

export const helpArticles: Article[] = [
  {
    slug: "shipping",
    title: "Shipping & delivery",
    intro:
      "We dispatch from Bengaluru and deliver across India. Here's exactly what to expect, including the bits most stores bury.",
    sections: [
      {
        heading: "Rates and timings",
        body: [
          "Standard delivery is ₹99, and free on orders over ₹1,499 after discounts. It takes 3–5 working days to metros and 4–7 elsewhere.",
          "Express delivery is ₹249 and arrives the next working day if you order before 2pm, Monday to Friday. It is available to roughly 19,000 pincodes.",
          "Scheduled delivery is ₹149 and lets you choose any date up to 60 days ahead — useful when you want it landing on the actual birthday rather than four days early.",
        ],
      },
      {
        heading: "Made-to-order items",
        body: [
          "Anything engraved, embossed or personalised adds 3–5 working days before dispatch. The product page states the real figure for that item rather than an average.",
          "Fresh items — mithai, flowers, live plants — ship on specific days so they arrive at their best, and we'll tell you the date at checkout.",
        ],
      },
      {
        heading: "Tracking",
        body: [
          "You'll get a tracking link by email and SMS the moment the parcel is picked up. If tracking hasn't moved in 48 hours, tell us and we'll chase the courier rather than asking you to.",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & exchanges",
    intro: "Fourteen days, no restocking fee, and we pay for the pickup. The exceptions are short and listed here.",
    sections: [
      {
        heading: "How it works",
        body: [
          "Email us within 14 days of delivery with your order number. We'll book a courier pickup from the delivery address, usually within two working days.",
          "Refunds go back to the original payment method within 5–7 working days of the parcel reaching us. For cash on delivery, we transfer to a bank account you nominate.",
        ],
      },
      {
        heading: "What we can't take back",
        body: [
          "Personalised and engraved items, because they're unsellable to anyone else. This is flagged on the product page before you order.",
          "Food, fresh flowers and live plants, for food-safety reasons. If any of it arrives damaged or spoiled, send a photo and we'll replace or refund it — no return needed.",
          "Anything used past the point of assessment. Opened and tried is fine; half a candle burned is not.",
        ],
      },
      {
        heading: "Damaged or wrong item",
        body: [
          "Send a photo within 48 hours and we'll dispatch a replacement immediately, usually the same day. You don't need to return the damaged one first.",
        ],
      },
    ],
  },
  {
    slug: "gift-notes",
    title: "Gift notes",
    intro: "Every order includes a note written by hand. There is no upsell on this and there never will be.",
    sections: [
      {
        heading: "How it works",
        body: [
          "Type your message in the gift note box at checkout, up to 240 characters. Someone in the studio writes it out in ink on 600gsm cotton card and tucks it inside the box.",
          "We don't correct spelling, change punctuation or 'improve' the wording. It goes on the card as you wrote it, including the bits that only make sense to the two of you.",
        ],
      },
      {
        heading: "Sending direct to the recipient",
        body: [
          "Tick 'hide prices on the packing slip' at checkout and the invoice inside carries no amounts — just the items and your note.",
          "If you'd rather it arrived anonymously, leave the note blank and tell us in the order comments. We'll leave the sender line off entirely.",
        ],
      },
      {
        heading: "Corporate orders",
        body: [
          "For bulk orders we can print a common message and hand-write the recipient's name, or hand-write the lot. Ask us for a sample photo before you commit to 400 of them.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact us",
    intro: "A real person reads every message. We answer within one working day, usually much faster.",
    sections: [
      {
        heading: "Get in touch",
        body: [
          "Email hello@wrapt.example for anything about an order, a return or a recommendation. Include your order number if you have one.",
          "For corporate gifting, email teams@wrapt.example with roughly how many gifts, your budget per head and the date you need them landing. You'll get a proposal within a day.",
          "The studio phone is answered 10am–6pm, Monday to Saturday.",
        ],
      },
      {
        heading: "Where we are",
        body: [
          "Wrapt Studio, 14/2 Kasturba Cross Road, Bengaluru 560001. The studio isn't a shop, but you're welcome to collect an order if you'd rather not wait for a courier — just tell us first.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    intro:
      "A short summary of what we collect and why. This is a demo storefront, so nothing you enter here is stored or transmitted anywhere.",
    sections: [
      {
        heading: "What a real store would collect",
        body: [
          "Contact and delivery details to fulfil the order, payment confirmation from the gateway (never the card number itself), and basic analytics about which pages people use.",
          "We would not sell your data, share it with advertisers, or email you marketing unless you asked for it.",
        ],
      },
      {
        heading: "What this demo does",
        body: [
          "Your bag and theme preference are kept in your browser's local storage. Checkout details live only in memory for the duration of the page and are never sent to a server.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of sale",
    intro: "The plain-language version. This is a demonstration storefront and no binding sale takes place.",
    sections: [
      {
        heading: "Orders",
        body: [
          "Placing an order in this demo creates no contract, takes no payment and dispatches nothing. Order numbers are generated locally for illustration.",
          "In a live store, a contract would form when we confirm dispatch, and prices shown at checkout would be the prices charged.",
        ],
      },
      {
        heading: "Pricing and availability",
        body: [
          "All prices include GST. Stock levels shown are illustrative. Where an item is genuinely unavailable, we'd tell you within one working day and refund in full.",
        ],
      },
    ],
  },
];

export const aboutArticles: Article[] = [
  {
    slug: "makers",
    title: "The makers",
    intro:
      "Sixty-two independent studios, potters, chocolatiers and binders across fourteen states. Here's how we choose them.",
    sections: [
      {
        heading: "How we pick",
        body: [
          "We buy a thing at full price, live with it for a month, and only then get in touch. If it doesn't survive a month of ordinary use it doesn't go in a box.",
          "We pay within 15 days of delivery rather than the 60–90 day terms that are normal in retail, because a four-person pottery cannot float a large order for three months.",
        ],
      },
      {
        heading: "Who they are",
        body: [
          "Among others: a two-person wheel-throwing studio in Jaipur, a ninety-year-old mithai kitchen in Mumbai, a letterpress in Pondicherry running a 1948 Heidelberg, and a chocolate maker in Idukki working with eleven cacao farms.",
          "Every product page names the maker where they're happy to be named. Some prefer not to be, and that's their call.",
        ],
      },
    ],
  },
  {
    slug: "sustainability",
    title: "Sustainability",
    intro:
      "We are a gifting company, which means we sell things people don't strictly need. Here's what we do about that rather than what we'd like you to think we do.",
    sections: [
      {
        heading: "Packaging",
        body: [
          "No plastic in any outer packaging since 2021. Boxes are recycled board, tissue is recycled and FSC-certified, void fill is shredded offcuts from our own die-cutting, and the tape is paper.",
          "The keepsake boxes are deliberately over-built so they get reused. About 70% of surveyed customers said they still had theirs a year on.",
        ],
      },
      {
        heading: "What we haven't solved",
        body: [
          "Last-mile delivery emissions, which we currently offset rather than reduce — offsetting is a weaker answer and we know it.",
          "Express shipping, which is worse per parcel than standard. We don't hide the option, but standard is the default for a reason.",
        ],
      },
    ],
  },
  {
    slug: "stockists",
    title: "Stockists",
    intro: "A handful of shops carry a small edited range alongside their own. Worth a visit if you'd rather see things first.",
    sections: [
      {
        heading: "Where to find us",
        body: [
          "Bengaluru — two concept stores in Indiranagar and one in Jayanagar.",
          "Mumbai — a Bandra lifestyle store and a Colaba bookshop that inexplicably sells a lot of our journals.",
          "Delhi NCR — one store in Shahpur Jat and a seasonal counter at Dhan Mill over Diwali.",
        ],
      },
      {
        heading: "Wholesale",
        body: [
          "We work with a small number of stockists on 50% margin with a ₹40,000 opening order. Email stockists@wrapt.example for a line sheet.",
        ],
      },
    ],
  },
];

export function findArticle(list: Article[], slug: string) {
  return list.find((a) => a.slug === slug);
}
