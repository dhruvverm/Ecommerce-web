export type Motif =
  | "giftbox"
  | "candle"
  | "mug"
  | "bloom"
  | "chocolate"
  | "jewel"
  | "journal"
  | "hamper"
  | "teddy"
  | "frame"
  | "spa"
  | "plant";

export type ProductOption = {
  name: string;
  values: { label: string; priceDelta?: number; note?: string }[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  collections: string[];
  occasions: string[];
  recipients: string[];
  rating: number;
  reviewCount: number;
  badge?: "bestseller" | "new" | "limited" | "handmade";
  motif: Motif;
  palette: [string, string, string];
  highlights: string[];
  details: { title: string; body: string }[];
  options: ProductOption[];
  inStock: boolean;
  shipsIn: string;
};

export type Collection = {
  slug: string;
  name: string;
  headline: string;
  description: string;
  palette: [string, string, string];
  motif: Motif;
};

export const collections: Collection[] = [
  {
    slug: "birthday",
    name: "Birthday Magic",
    headline: "Make the day feel like a headline",
    description:
      "Confetti-bright boxes, personalised keepsakes and cake-adjacent treats for the people who deserve a fuss.",
    palette: ["#EC4899", "#F9A8D4", "#FDF2F8"],
    motif: "giftbox",
  },
  {
    slug: "romance",
    name: "Love & Anniversary",
    headline: "For the soft, slow, sentimental ones",
    description:
      "Hand-poured candles, letterpress notes and jewellery that says the thing you never quite manage to say out loud.",
    palette: ["#DC2626", "#FB7185", "#FFF1F2"],
    motif: "bloom",
  },
  {
    slug: "home",
    name: "Home & Living",
    headline: "Gifts that earn a permanent shelf",
    description:
      "Slow-made ceramics, linen and objects with weight to them — the kind people mention years later.",
    palette: ["#B45309", "#FBBF24", "#FFFBEB"],
    motif: "mug",
  },
  {
    slug: "self-care",
    name: "Self-Care Rituals",
    headline: "Permission to slow down, boxed",
    description:
      "Bath soaks, silk masks and aromatherapy kits for the friend who has not sat down since March.",
    palette: ["#0D9488", "#5EEAD4", "#F0FDFA"],
    motif: "spa",
  },
  {
    slug: "corporate",
    name: "Corporate Gifting",
    headline: "Thank-yous that clear the inbox",
    description:
      "Bulk-ready hampers with custom branding, dispatch scheduling and one invoice for the whole team.",
    palette: ["#4338CA", "#A5B4FC", "#EEF2FF"],
    motif: "hamper",
  },
  {
    slug: "little-joys",
    name: "Little Joys",
    headline: "For small humans with big opinions",
    description:
      "Plush, puzzles and wonderfully silly things that survive being loved extremely hard.",
    palette: ["#EA580C", "#FDBA74", "#FFF7ED"],
    motif: "teddy",
  },
];

const detailBlock = (care: string) => [
  {
    title: "What's inside",
    body: "Every order is packed by hand in our Bengaluru studio, nested in recycled tissue and sealed with a wax stamp. A blank card is included free — add your message at checkout and we'll write it in.",
  },
  { title: "Care & materials", body: care },
  {
    title: "Delivery & returns",
    body: "Free shipping across India on orders over ₹1,499. Same-day dispatch on weekdays before 2pm. Unopened gifts can be returned within 14 days, no questions, no restocking fee.",
  },
];

const wrapOption: ProductOption = {
  name: "Gift wrap",
  values: [
    { label: "Signature blush", note: "Included" },
    { label: "Midnight gold foil", priceDelta: 149 },
    { label: "Plain kraft", note: "Zero-waste" },
  ],
};

export const products: Product[] = [
  {
    id: "p-01",
    slug: "confetti-birthday-box",
    name: "The Confetti Birthday Box",
    tagline: "A whole celebration that fits in a tote bag",
    description:
      "Nine hand-picked pieces — a beeswax number candle, salted-caramel bark, a mini bottle of prosecco jelly, paper crowns and a pull-string confetti popper that is genuinely too loud. Built for the person who pretends they don't want a fuss.",
    price: 2899,
    compareAtPrice: 3450,
    collections: ["birthday"],
    occasions: ["Birthday", "Milestone"],
    recipients: ["For her", "For him", "For friends"],
    rating: 4.8,
    reviewCount: 412,
    badge: "bestseller",
    motif: "giftbox",
    palette: ["#EC4899", "#FBCFE8", "#831843"],
    highlights: ["9 curated pieces", "Confetti popper included", "Ships in a keepsake box"],
    details: detailBlock(
      "Beeswax candle, food-grade confetti and FSC-certified paper. Keep the bark refrigerated in summer; best eaten within six weeks.",
    ),
    options: [
      {
        name: "Size",
        values: [
          { label: "Classic", note: "9 pieces" },
          { label: "Grand", priceDelta: 1200, note: "14 pieces" },
        ],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-02",
    slug: "midnight-fig-candle",
    name: "Midnight Fig Hand-Poured Candle",
    tagline: "Fig leaf, black pepper, a little woodsmoke",
    description:
      "Forty hours of a very specific mood. Poured in small batches into a ribbed stoneware vessel that becomes a pen pot the second the wax runs out — which is the entire point.",
    price: 1650,
    collections: ["romance", "home", "self-care"],
    occasions: ["Anniversary", "Housewarming", "Thank you"],
    recipients: ["For her", "For him", "For hosts"],
    rating: 4.9,
    reviewCount: 863,
    badge: "bestseller",
    motif: "candle",
    palette: ["#7C2D12", "#FDBA74", "#431407"],
    highlights: ["40-hour burn", "Reusable stoneware", "Soy-coconut wax blend"],
    details: detailBlock(
      "Soy-coconut wax with phthalate-free fragrance and a cotton wick. Trim to 5mm before each burn and never leave burning unattended.",
    ),
    options: [
      {
        name: "Size",
        values: [
          { label: "200g", note: "40 hours" },
          { label: "380g", priceDelta: 900, note: "75 hours" },
        ],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-03",
    slug: "everyday-ritual-mug",
    name: "Everyday Ritual Stoneware Mug",
    tagline: "Heavy bottom, thin lip, holds heat for ages",
    description:
      "Thrown on a wheel in Jaipur and glazed in a speckled oat that never looks the same twice. 320ml — the correct amount of coffee, according to us and nobody else.",
    price: 1150,
    compareAtPrice: 1400,
    collections: ["home"],
    occasions: ["Housewarming", "Thank you", "Just because"],
    recipients: ["For hosts", "For him", "For her"],
    rating: 4.7,
    reviewCount: 298,
    badge: "handmade",
    motif: "mug",
    palette: ["#B45309", "#FDE68A", "#78350F"],
    highlights: ["320ml capacity", "Dishwasher safe", "Wheel-thrown, one of a kind"],
    details: detailBlock(
      "Lead-free stoneware glaze. Dishwasher and microwave safe. Slight variation in speckle and glaze pooling is the nature of the thing.",
    ),
    options: [
      {
        name: "Glaze",
        values: [{ label: "Speckled oat" }, { label: "Ink blue" }, { label: "Terracotta" }],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-04",
    slug: "letterpress-love-notes",
    name: "Letterpress Love Notes, Set of 12",
    tagline: "Cotton paper with a deep, satisfying bite",
    description:
      "Twelve cards pressed on 600gsm cotton rag, with envelopes lined in a blush marbled paper. Six say something. Six are blank, for when you can do better than we can.",
    price: 899,
    collections: ["romance", "birthday"],
    occasions: ["Anniversary", "Valentine's", "Just because"],
    recipients: ["For her", "For him", "For friends"],
    rating: 4.6,
    reviewCount: 187,
    motif: "journal",
    palette: ["#BE123C", "#FECDD3", "#4C0519"],
    highlights: ["600gsm cotton rag", "Lined envelopes", "12 cards, 6 blank"],
    details: detailBlock(
      "Tree-free cotton rag paper with soy-based inks. Store flat and away from damp to keep the deboss crisp.",
    ),
    options: [
      { name: "Ink", values: [{ label: "Crimson" }, { label: "Deep plum" }, { label: "Gold foil", priceDelta: 250 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-05",
    slug: "single-origin-chocolate-flight",
    name: "Single-Origin Chocolate Flight",
    tagline: "Six bars, six farms, one long argument",
    description:
      "Idukki, Ecuador, Madagascar, Tanzania, Vietnam and a 72% house blend, each with a tasting card explaining exactly why it tastes like that. Comes with a scorecard nobody fills in honestly.",
    price: 2250,
    collections: ["corporate", "home", "birthday"],
    occasions: ["Thank you", "Diwali", "Birthday"],
    recipients: ["For him", "For her", "For teams"],
    rating: 4.8,
    reviewCount: 521,
    badge: "bestseller",
    motif: "chocolate",
    palette: ["#78350F", "#FCD34D", "#451A03"],
    highlights: ["6 × 50g bars", "Tasting notes included", "Direct-trade cacao"],
    details: detailBlock(
      "Contains cocoa, cane sugar and traces of dairy and nuts. Store between 15–20°C. Best before four months from dispatch.",
    ),
    options: [
      {
        name: "Selection",
        values: [
          { label: "Dark flight", note: "70–85%" },
          { label: "Mixed flight" },
          { label: "Milk & caramel" },
        ],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-06",
    slug: "gold-vermeil-initial-necklace",
    name: "Gold Vermeil Initial Necklace",
    tagline: "18k over recycled silver, sized to layer",
    description:
      "A 12mm pendant on a 42cm chain with a 5cm extender, so it sits right whether it's worn alone or stacked under three other things. Engraved by hand, not laser — you can feel the letter.",
    price: 4200,
    compareAtPrice: 4900,
    collections: ["romance", "birthday"],
    occasions: ["Anniversary", "Birthday", "Milestone"],
    recipients: ["For her"],
    rating: 4.9,
    reviewCount: 744,
    badge: "bestseller",
    motif: "jewel",
    palette: ["#A16207", "#FDE68A", "#422006"],
    highlights: ["18k gold vermeil", "Hand-engraved initial", "Hypoallergenic"],
    details: detailBlock(
      "18k gold over recycled 925 sterling silver. Keep away from perfume and water; polish with the included cloth. Engraving is final sale.",
    ),
    options: [
      {
        name: "Chain length",
        values: [{ label: "42cm + 5cm" }, { label: "50cm", priceDelta: 200 }],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 4–6 days",
  },
  {
    id: "p-07",
    slug: "slow-sunday-bath-ritual",
    name: "Slow Sunday Bath Ritual",
    tagline: "Epsom soak, clay mask, and a very firm hint",
    description:
      "A 400g magnesium soak scented with eucalyptus and vetiver, a pink clay mask, a linen headband and a wooden body brush. For the person who answers Slack from the bath — this is us asking them to stop.",
    price: 2650,
    collections: ["self-care", "romance"],
    occasions: ["Get well", "Thank you", "Just because"],
    recipients: ["For her", "For him", "For friends"],
    rating: 4.7,
    reviewCount: 356,
    motif: "spa",
    palette: ["#0F766E", "#99F6E4", "#134E4A"],
    highlights: ["400g magnesium soak", "Linen headband", "Vegan & cruelty-free"],
    details: detailBlock(
      "Magnesium sulphate, kaolin clay and pure essential oils. Patch-test the mask first. Not recommended during pregnancy without a doctor's nod.",
    ),
    options: [
      { name: "Scent", values: [{ label: "Eucalyptus & vetiver" }, { label: "Neroli & oat" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-08",
    slug: "the-founder-hamper",
    name: "The Founder Hamper",
    tagline: "Corporate gifting that doesn't feel corporate",
    description:
      "Single-origin coffee, a leather-bound notebook, artisan crackers, honeycomb and a stoneware pour-over — in a magnetic-close box that takes your logo blind-embossed on the lid. Minimum order of ten.",
    price: 5400,
    collections: ["corporate", "home"],
    occasions: ["Thank you", "Onboarding", "Diwali"],
    recipients: ["For teams", "For clients"],
    rating: 4.8,
    reviewCount: 129,
    badge: "limited",
    motif: "hamper",
    palette: ["#4338CA", "#C7D2FE", "#1E1B4B"],
    highlights: ["Blind-emboss your logo", "Bulk pricing from 10 units", "Scheduled dispatch"],
    details: detailBlock(
      "Contains gluten, dairy and nuts. Leather is vegetable-tanned. Branding requires a vector file and adds 5 working days.",
    ),
    options: [
      {
        name: "Branding",
        values: [
          { label: "Unbranded" },
          { label: "Blind emboss", priceDelta: 400 },
          { label: "Gold foil logo", priceDelta: 750 },
        ],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 5–8 days",
  },
  {
    id: "p-09",
    slug: "peony-forever-bouquet",
    name: "Peony Forever Bouquet",
    tagline: "Preserved blooms that outlast the occasion",
    description:
      "Real peonies and eucalyptus, preserved at peak bloom and arranged in a ribbed glass dome. No water, no wilting, no guilt about the fourth bunch of flowers this month.",
    price: 3800,
    compareAtPrice: 4500,
    collections: ["romance", "home"],
    occasions: ["Anniversary", "Valentine's", "Sympathy"],
    recipients: ["For her", "For hosts"],
    rating: 4.6,
    reviewCount: 233,
    badge: "new",
    motif: "bloom",
    palette: ["#DB2777", "#FBCFE8", "#500724"],
    highlights: ["Lasts 2–3 years", "Glass dome included", "No watering, ever"],
    details: detailBlock(
      "Preserved botanicals in a hand-blown glass dome. Keep out of direct sun and humidity. Dust with a soft brush, never water.",
    ),
    options: [
      { name: "Palette", values: [{ label: "Blush" }, { label: "Ivory" }, { label: "Deep rose" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 3–5 days",
  },
  {
    id: "p-10",
    slug: "one-line-a-day-journal",
    name: "One Line A Day Journal",
    tagline: "Five years, one page, thirty seconds a night",
    description:
      "A linen-bound five-year journal with a page per date and five ruled lines on each. By year three, writing tonight's line means reading the last two — which is the whole trick of it.",
    price: 1450,
    collections: ["self-care", "home", "birthday"],
    occasions: ["New year", "Birthday", "Graduation"],
    recipients: ["For her", "For him", "For friends"],
    rating: 4.9,
    reviewCount: 617,
    badge: "bestseller",
    motif: "journal",
    palette: ["#0F766E", "#CCFBF1", "#134E4A"],
    highlights: ["5-year format", "Linen hardcover", "Ribbon marker & gilt edges"],
    details: detailBlock(
      "Linen-wrapped board covers with 368 pages of 100gsm cream paper. Lay-flat binding. Fountain-pen friendly with minimal ghosting.",
    ),
    options: [
      { name: "Cover", values: [{ label: "Forest linen" }, { label: "Blush linen" }, { label: "Charcoal linen" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-11",
    slug: "captain-bramble-bear",
    name: "Captain Bramble, Weighted Bear",
    tagline: "1.2kg of deeply serious comfort",
    description:
      "A weighted plush in organic cotton corduroy with glass-bead filling, machine washable at 30°. Big enough to be a pillow, heavy enough to actually settle a small nervous system.",
    price: 2100,
    collections: ["little-joys", "self-care"],
    occasions: ["New baby", "Birthday", "Get well"],
    recipients: ["For kids", "For friends"],
    rating: 4.9,
    reviewCount: 482,
    badge: "bestseller",
    motif: "teddy",
    palette: ["#EA580C", "#FED7AA", "#7C2D12"],
    highlights: ["1.2kg weighted", "Organic cotton", "Machine washable"],
    details: detailBlock(
      "Organic cotton corduroy shell with glass-bead and recycled polyester fill. Machine wash cold on a gentle cycle, air dry. Suitable from 3 years.",
    ),
    options: [
      { name: "Colour", values: [{ label: "Rust" }, { label: "Sand" }, { label: "Moss" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-12",
    slug: "little-explorers-puzzle-set",
    name: "Little Explorers Puzzle Set",
    tagline: "Three wooden puzzles, zero plastic",
    description:
      "Chunky rubberwood pieces with water-based inks — a solar system, a coral reef and a very opinionated map of the world. Chunky enough for small hands, handsome enough to leave out.",
    price: 1750,
    compareAtPrice: 2100,
    collections: ["little-joys"],
    occasions: ["Birthday", "New baby", "Just because"],
    recipients: ["For kids"],
    rating: 4.7,
    reviewCount: 214,
    motif: "frame",
    palette: ["#0284C7", "#BAE6FD", "#0C4A6E"],
    highlights: ["3 puzzles, 84 pieces", "FSC rubberwood", "Ages 3+"],
    details: detailBlock(
      "FSC-certified rubberwood with non-toxic water-based inks, EN71 tested. Wipe clean with a damp cloth. Small parts — ages 3 and up.",
    ),
    options: [
      { name: "Bundle", values: [{ label: "Set of 3" }, { label: "Set of 5", priceDelta: 900 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-13",
    slug: "terracotta-plant-duo",
    name: "Terracotta Plant Duo",
    tagline: "Two plants that forgive a bad week",
    description:
      "A ZZ plant and a snake plant in hand-thrown terracotta with drainage trays. Both survive low light, missed waterings and the occasional four-day trip. Chosen specifically for people who kill plants.",
    price: 2400,
    collections: ["home", "self-care"],
    occasions: ["Housewarming", "New job", "Thank you"],
    recipients: ["For hosts", "For him", "For her"],
    rating: 4.5,
    reviewCount: 168,
    badge: "new",
    motif: "plant",
    palette: ["#15803D", "#BBF7D0", "#14532D"],
    highlights: ["Low-light tolerant", "Terracotta pots included", "Care card in the box"],
    details: detailBlock(
      "Live plants in 12cm terracotta. Water every 2–3 weeks, letting soil dry fully between. Mildly toxic to cats and dogs if chewed.",
    ),
    options: [
      { name: "Pot finish", values: [{ label: "Raw terracotta" }, { label: "Chalk white", priceDelta: 200 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 3–4 days",
  },
  {
    id: "p-14",
    slug: "first-year-photo-frame",
    name: "First Year Oak Photo Frame",
    tagline: "Twelve months, one frame, quietly devastating",
    description:
      "Solid white oak with twelve 5×5cm apertures and a hand-routed month label under each. Comes with museum glass and a wall fixing kit, plus a pencil, because the labels are blank on purpose.",
    price: 3300,
    collections: ["little-joys", "home"],
    occasions: ["New baby", "Milestone", "Anniversary"],
    recipients: ["For parents", "For her", "For him"],
    rating: 4.8,
    reviewCount: 96,
    badge: "handmade",
    motif: "frame",
    palette: ["#92400E", "#FDE68A", "#451A03"],
    highlights: ["Solid white oak", "12 apertures", "Museum-grade glass"],
    details: detailBlock(
      "FSC white oak with a natural hardwax oil finish and anti-glare glass. Wall fixings included. Wipe with a dry cloth only.",
    ),
    options: [
      { name: "Finish", values: [{ label: "Natural oak" }, { label: "Smoked oak", priceDelta: 400 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 4–6 days",
  },
  {
    id: "p-15",
    slug: "festive-diwali-hamper",
    name: "Festive Diwali Hamper",
    tagline: "Diyas, mithai and something for the host",
    description:
      "Six brass diyas, saffron-pistachio barfi from a ninety-year-old Mumbai kitchen, a marigold garland and a soy diya-scented candle, in a hand-painted keepsake trunk.",
    price: 4600,
    compareAtPrice: 5200,
    collections: ["corporate", "home"],
    occasions: ["Diwali", "Thank you", "Housewarming"],
    recipients: ["For teams", "For hosts", "For clients"],
    rating: 4.8,
    reviewCount: 305,
    badge: "limited",
    motif: "hamper",
    palette: ["#B91C1C", "#FCD34D", "#450A0A"],
    highlights: ["6 brass diyas", "Fresh mithai", "Hand-painted trunk"],
    details: detailBlock(
      "Contains dairy and tree nuts. Mithai is made fresh to order — best within 10 days. Brass will patina; polish with lemon and salt.",
    ),
    options: [
      { name: "Mithai", values: [{ label: "Saffron-pistachio" }, { label: "Rose-coconut" }, { label: "Assorted" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 3–5 days",
  },
  {
    id: "p-16",
    slug: "espresso-martini-kit",
    name: "Espresso Martini Kit",
    tagline: "Everything but the vodka and the regret",
    description:
      "Cold-brew concentrate, vanilla-bean syrup, a weighted jigger, a Hawthorne strainer and two coupes. Instructions printed on the box lid in a font size you can read at 11pm.",
    price: 3150,
    collections: ["birthday", "home", "corporate"],
    occasions: ["Birthday", "Housewarming", "Thank you"],
    recipients: ["For him", "For her", "For hosts"],
    rating: 4.7,
    reviewCount: 389,
    motif: "mug",
    palette: ["#1C1917", "#FCD34D", "#0C0A09"],
    highlights: ["Makes 12 drinks", "Two crystal coupes", "Bar tools included"],
    details: detailBlock(
      "Cold-brew concentrate keeps 3 months sealed, 2 weeks once opened and refrigerated. Glassware is hand-wash only. Alcohol not included.",
    ),
    options: [
      { name: "Glassware", values: [{ label: "Coupe" }, { label: "Nick & Nora", priceDelta: 300 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-17",
    slug: "silk-sleep-set",
    name: "Mulberry Silk Sleep Set",
    tagline: "22-momme silk, eye mask and pillowcase",
    description:
      "Grade 6A mulberry silk in a colour we spent an unreasonable amount of time choosing. Kinder to hair and skin than cotton, and cool enough to make a Delhi summer briefly survivable.",
    price: 3950,
    compareAtPrice: 4600,
    collections: ["self-care", "romance"],
    occasions: ["Birthday", "Anniversary", "Thank you"],
    recipients: ["For her", "For him"],
    rating: 4.8,
    reviewCount: 528,
    badge: "bestseller",
    motif: "spa",
    palette: ["#9333EA", "#E9D5FF", "#3B0764"],
    highlights: ["22-momme grade 6A silk", "Mask + pillowcase", "Hidden zip closure"],
    details: detailBlock(
      "100% mulberry silk. Hand wash cold with pH-neutral detergent, or machine wash in the included mesh bag. Never tumble dry.",
    ),
    options: [
      { name: "Colour", values: [{ label: "Dusk lilac" }, { label: "Champagne" }, { label: "Charcoal" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-18",
    slug: "birth-flower-pendant",
    name: "Birth Flower Pendant",
    tagline: "Pressed bloom set in resin and brass",
    description:
      "A real pressed flower for their birth month, suspended in resin inside a hand-finished brass bezel on a 45cm chain. Twelve months, twelve flowers, no two pendants identical.",
    price: 2750,
    collections: ["romance", "birthday"],
    occasions: ["Birthday", "Anniversary", "Milestone"],
    recipients: ["For her", "For friends"],
    rating: 4.6,
    reviewCount: 271,
    motif: "jewel",
    palette: ["#BE185D", "#FBCFE8", "#500724"],
    highlights: ["Real pressed flower", "Brass & resin", "12 birth months"],
    details: detailBlock(
      "Solid brass bezel with UV-stable resin. Brass develops a patina over time — polish gently. Avoid prolonged sun and water.",
    ),
    options: [
      {
        name: "Birth month",
        values: [
          { label: "Jan — Carnation" },
          { label: "Apr — Daisy" },
          { label: "Jul — Larkspur" },
          { label: "Oct — Marigold" },
        ],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 4–6 days",
  },
  {
    id: "p-19",
    slug: "desk-reset-kit",
    name: "The Desk Reset Kit",
    tagline: "For whoever's been at it since seven",
    description:
      "A cedar-and-bergamot desk mist, a palm-sized brass hand warmer, blue-light glasses and a card of twelve two-minute stretches. Fits in a laptop sleeve, which is the only reason anyone uses it.",
    price: 2300,
    collections: ["corporate", "self-care"],
    occasions: ["New job", "Thank you", "Onboarding"],
    recipients: ["For teams", "For him", "For her"],
    rating: 4.5,
    reviewCount: 143,
    badge: "new",
    motif: "hamper",
    palette: ["#0369A1", "#BAE6FD", "#082F49"],
    highlights: ["Fits a laptop sleeve", "Bulk pricing available", "Refillable desk mist"],
    details: detailBlock(
      "Alcohol-free room mist with essential oils. Hand warmer is USB-C rechargeable, 4-hour runtime. Glasses carry a 40% blue-light filter.",
    ),
    options: [
      { name: "Glasses", values: [{ label: "Clear lens" }, { label: "Amber lens" }, { label: "Skip glasses", priceDelta: -450 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-20",
    slug: "sourdough-starter-kit",
    name: "Sourdough Starter Kit",
    tagline: "A live culture named Doris, and the tools",
    description:
      "A dehydrated 1920s San Francisco starter, a banneton, a lame with spare blades, a bench scraper and a linen couche. Doris revives in four days and will outlive all of us.",
    price: 2950,
    collections: ["home", "birthday"],
    occasions: ["Housewarming", "Birthday", "Just because"],
    recipients: ["For him", "For her", "For hosts"],
    rating: 4.7,
    reviewCount: 202,
    motif: "hamper",
    palette: ["#A16207", "#FEF3C7", "#422006"],
    highlights: ["Heritage live culture", "Banneton & lame", "Illustrated first-loaf guide"],
    details: detailBlock(
      "Contains wheat. Dehydrated starter keeps 12 months in a cool dry cupboard. Rattan banneton should be brushed, never washed.",
    ),
    options: [
      { name: "Banneton", values: [{ label: "Round 22cm" }, { label: "Oval 25cm" }] },
      wrapOption,
    ],
    inStock: false,
    shipsIn: "Back in stock 12 Oct",
  },
  {
    id: "p-21",
    slug: "constellation-night-light",
    name: "Constellation Night Light",
    tagline: "Their sky, on the night they were born",
    description:
      "A frosted glass dome that throws the exact star map for a date and place you choose onto the ceiling. Warm 2700K LED, USB-C, and a timer so it fades out after half an hour.",
    price: 3450,
    collections: ["little-joys", "romance"],
    occasions: ["New baby", "Anniversary", "Birthday"],
    recipients: ["For kids", "For her", "For him"],
    rating: 4.8,
    reviewCount: 357,
    badge: "bestseller",
    motif: "candle",
    palette: ["#4338CA", "#C7D2FE", "#1E1B4B"],
    highlights: ["Personalised star map", "30-minute sleep timer", "USB-C rechargeable"],
    details: detailBlock(
      "Frosted borosilicate glass with a 2700K LED and a 12-hour battery. Personalisation needs a date and city, and is final sale.",
    ),
    options: [
      { name: "Base", values: [{ label: "Walnut" }, { label: "White oak" }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 4–6 days",
  },
  {
    id: "p-22",
    slug: "rainbow-crayon-set",
    name: "Beeswax Rainbow Crayon Set",
    tagline: "Twelve fat crayons that refuse to snap",
    description:
      "Chunky beeswax blocks in a tin, pigmented with mineral colour and shaped so small hands grip them properly. Draw with the edge for a line, the face for a wash.",
    price: 950,
    collections: ["little-joys"],
    occasions: ["Birthday", "Just because", "New baby"],
    recipients: ["For kids"],
    rating: 4.6,
    reviewCount: 178,
    motif: "frame",
    palette: ["#DC2626", "#FECACA", "#7F1D1D"],
    highlights: ["12 colours", "Natural beeswax", "Ages 2+"],
    details: detailBlock(
      "Natural beeswax with food-grade mineral pigments, EN71 certified and non-toxic. Marks wipe off hard surfaces with a damp cloth.",
    ),
    options: [
      { name: "Tin", values: [{ label: "Classic 12" }, { label: "Deluxe 24", priceDelta: 550 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 1–2 days",
  },
  {
    id: "p-23",
    slug: "aged-balsamic-and-oil-duo",
    name: "Aged Balsamic & Olive Oil Duo",
    tagline: "Twelve-year balsamic, single-estate oil",
    description:
      "A 250ml Modena balsamic aged twelve years in five woods, and a cold-pressed Koroneiki olive oil bottled eight weeks ago. Both in dark glass, both worth decanting nothing into.",
    price: 3600,
    collections: ["home", "corporate"],
    occasions: ["Housewarming", "Thank you", "Diwali"],
    recipients: ["For hosts", "For clients", "For him"],
    rating: 4.7,
    reviewCount: 156,
    motif: "hamper",
    palette: ["#4D7C0F", "#D9F99D", "#1A2E05"],
    highlights: ["12-year aged balsamic", "Harvest-dated olive oil", "Pourer caps included"],
    details: detailBlock(
      "Store upright, cool and dark. Olive oil is best within 12 months of the harvest date printed on the neck. Balsamic keeps indefinitely.",
    ),
    options: [
      { name: "Size", values: [{ label: "250ml duo" }, { label: "500ml duo", priceDelta: 1400 }] },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "Ships in 2–3 days",
  },
  {
    id: "p-24",
    slug: "year-of-flowers-subscription",
    name: "A Year of Flowers",
    tagline: "Twelve deliveries, one very good decision",
    description:
      "Seasonal stems from growers within 200km, arriving on the same date each month with a note about what's in the bunch and why. Pause or skip any month from a single link.",
    price: 6999,
    compareAtPrice: 8400,
    collections: ["romance", "home"],
    occasions: ["Anniversary", "Milestone", "Thank you"],
    recipients: ["For her", "For parents", "For hosts"],
    rating: 4.9,
    reviewCount: 418,
    badge: "limited",
    motif: "bloom",
    palette: ["#DB2777", "#FBCFE8", "#500724"],
    highlights: ["12 monthly deliveries", "Seasonal & local", "Skip or pause anytime"],
    details: detailBlock(
      "Stems vary by season and grower. Recut at an angle and change water every three days. Deliveries pause automatically over public holidays.",
    ),
    options: [
      {
        name: "Length",
        values: [
          { label: "12 months" },
          { label: "6 months", priceDelta: -3200 },
          { label: "3 months", priceDelta: -5000 },
        ],
      },
      wrapOption,
    ],
    inStock: true,
    shipsIn: "First box ships in 3–5 days",
  },
];

export const occasions = [
  "Birthday",
  "Anniversary",
  "Housewarming",
  "Thank you",
  "New baby",
  "Diwali",
  "Valentine's",
  "Milestone",
  "New job",
  "Get well",
  "Graduation",
  "Just because",
  "Onboarding",
  "New year",
  "Sympathy",
];

export const recipients = [
  "For her",
  "For him",
  "For kids",
  "For friends",
  "For parents",
  "For hosts",
  "For teams",
  "For clients",
];

export const priceBands = [
  { id: "under-1500", label: "Under ₹1,500", min: 0, max: 1500 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", min: 1500, max: 3000 },
  { id: "3000-5000", label: "₹3,000 – ₹5,000", min: 3000, max: 5000 },
  { id: "over-5000", label: "₹5,000+", min: 5000, max: Infinity },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollection(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function productsInCollection(slug: string) {
  return products.filter((p) => p.collections.includes(slug));
}

export function relatedProducts(product: Product, limit = 4) {
  const scored = products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      const sharedCollections = p.collections.filter((c) => product.collections.includes(c)).length;
      const sharedOccasions = p.occasions.filter((o) => product.occasions.includes(o)).length;
      return { p, score: sharedCollections * 3 + sharedOccasions };
    })
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating);
  return scored.slice(0, limit).map((s) => s.p);
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) =>
    [p.name, p.tagline, p.description, ...p.occasions, ...p.recipients, ...p.collections]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
