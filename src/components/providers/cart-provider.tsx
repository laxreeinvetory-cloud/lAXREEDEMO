"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CatalogueProduct } from "@/lib/laxree/catalogue-data";

/* ─────────────────────────────────────────────────────────────
   Cart Item — product + quantity
   ───────────────────────────────────────────────────────────── */
export type CartItem = {
  model: string;
  name: string;
  category: string;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: CatalogueProduct) => void;
  removeItem: (model: string) => void;
  updateQuantity: (model: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "laxree-cart";
const EMPTY: CartItem[] = [];

/* ─────────────────────────────────────────────────────────────
   Cached external store — returns the SAME reference until data
   actually changes. This prevents useSyncExternalStore infinite
   loops (getSnapshot must be referentially stable).
   ───────────────────────────────────────────────────────────── */
let cache: CartItem[] = EMPTY;
let initialized = false;

function init(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
}

function persist(items: CartItem[]): void {
  cache = items;
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("laxree-cart-change"));
  } catch {
    // ignore
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("laxree-cart-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("laxree-cart-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): CartItem[] {
  init();
  return cache; // same reference until persist() changes it
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

/* ─────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = (product: CatalogueProduct) => {
    const current = getSnapshot();
    const existing = current.find((i) => i.model === product.model);
    if (existing) {
      persist(current.map((i) => (i.model === product.model ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      persist([...current, { model: product.model, name: product.name, category: product.category, image: product.image, quantity: 1 }]);
    }
  };

  const removeItem = (model: string) => {
    persist(getSnapshot().filter((i) => i.model !== model));
  };

  const updateQuantity = (model: string, quantity: number) => {
    if (quantity < 1) { removeItem(model); return; }
    persist(getSnapshot().map((i) => (i.model === model ? { ...i, quantity } : i)));
  };

  const clearCart = () => { persist(EMPTY); };

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, totalItems }),
    [items, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
