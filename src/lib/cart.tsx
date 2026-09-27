"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { products, type Product } from "./products";

export type CartLine = {
  /** productId plus the chosen options, so two variants of one product stay separate. */
  key: string;
  productId: string;
  quantity: number;
  options: Record<string, string>;
  unitPrice: number;
};

export type Promo = { code: string; label: string; kind: "percent" | "flat"; value: number };

const PROMOS: Promo[] = [
  { code: "WRAPPED10", label: "10% off your order", kind: "percent", value: 10 },
  { code: "FIRSTGIFT", label: "₹300 off your first order", kind: "flat", value: 300 },
  { code: "DIWALI25", label: "25% off festive hampers", kind: "percent", value: 25 },
];

export const FREE_SHIPPING_THRESHOLD = 1499;
export const STANDARD_SHIPPING = 99;
export const GST_RATE = 0.18;

type State = { lines: CartLine[]; promo: Promo | null };

type Action =
  | { type: "add"; line: CartLine }
  | { type: "setQty"; key: string; quantity: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "promo"; promo: Promo | null }
  | { type: "hydrate"; state: State };

const STORAGE_KEY = "giftbox.cart.v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "add": {
      const existing = state.lines.find((l) => l.key === action.line.key);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.key === action.line.key
              ? { ...l, quantity: Math.min(20, l.quantity + action.line.quantity) }
              : l,
          ),
        };
      }
      return { ...state, lines: [...state.lines, action.line] };
    }
    case "setQty":
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.key === action.key ? { ...l, quantity: Math.min(20, action.quantity) } : l))
          .filter((l) => l.quantity > 0),
      };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.key !== action.key) };
    case "clear":
      return { lines: [], promo: null };
    case "promo":
      return { ...state, promo: action.promo };
    default:
      return state;
  }
}

export type CartLineView = CartLine & { product: Product; lineTotal: number };

type CartValue = {
  lines: CartLineView[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promo: Promo | null;
  promoError: string | null;
  hydrated: boolean;
  drawerOpen: boolean;
  lastAdded: string | null;
  addItem: (product: Product, options: Record<string, string>, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartValue | null>(null);

export function lineKey(productId: string, options: Record<string, string>) {
  const suffix = Object.keys(options)
    .sort()
    .map((k) => `${k}:${options[k]}`)
    .join("|");
  return suffix ? `${productId}__${suffix}` : productId;
}

export function unitPriceFor(product: Product, options: Record<string, string>) {
  return product.options.reduce((total, option) => {
    const chosen = option.values.find((v) => v.label === options[option.name]);
    return total + (chosen?.priceDelta ?? 0);
  }, product.price);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], promo: null });
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  // Restore a cart left behind in a previous visit.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        if (Array.isArray(parsed.lines)) dispatch({ type: "hydrate", state: parsed });
      }
    } catch {
      // Private mode or blocked storage — an empty cart is a fine fallback.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Nothing to do; the cart still works for this session.
    }
  }, [state, hydrated]);

  const lines = useMemo<CartLineView[]>(
    () =>
      state.lines.flatMap((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return [];
        return [{ ...line, product, lineTotal: line.unitPrice * line.quantity }];
      }),
    [state.lines],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const discount = state.promo
    ? state.promo.kind === "percent"
      ? Math.round((subtotal * state.promo.value) / 100)
      : Math.min(subtotal, state.promo.value)
    : 0;
  const discounted = subtotal - discount;
  const shipping = lines.length === 0 || discounted >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = Math.round(discounted * GST_RATE);
  const total = discounted + shipping + tax;
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  const addItem = useCallback(
    (product: Product, options: Record<string, string>, quantity = 1) => {
      const key = lineKey(product.id, options);
      dispatch({
        type: "add",
        line: { key, productId: product.id, quantity, options, unitPrice: unitPriceFor(product, options) },
      });
      setLastAdded(key);
      setDrawerOpen(true);
    },
    [],
  );

  const applyPromo = useCallback((code: string) => {
    const match = PROMOS.find((p) => p.code.toLowerCase() === code.trim().toLowerCase());
    if (!match) {
      setPromoError(`We don't recognise "${code.trim()}". Check the spelling and try again.`);
      return false;
    }
    setPromoError(null);
    dispatch({ type: "promo", promo: match });
    return true;
  }, []);

  const value: CartValue = {
    lines,
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promo: state.promo,
    promoError,
    hydrated,
    drawerOpen,
    lastAdded,
    addItem,
    setQuantity: (key, quantity) => dispatch({ type: "setQty", key, quantity }),
    removeItem: (key) => dispatch({ type: "remove", key }),
    clear: () => dispatch({ type: "clear" }),
    applyPromo,
    removePromo: () => {
      setPromoError(null);
      dispatch({ type: "promo", promo: null });
    },
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export { PROMOS };
