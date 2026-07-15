"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { CatalogueProduct } from "@/lib/laxree/site-data";

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
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "laxree-cart";
const EVENT_NAME = "laxree-cart-change";
const EMPTY_CART: CartItem[] = [];

/* ─────────────────────────────────────────────────────────────
   External store (localStorage + event-based, no setState in effect)
   ───────────────────────────────────────────────────────────── */
let cachedCart: CartItem[] = EMPTY_CART;
let cacheValid = false;

function readCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  if (cacheValid) return cachedCart;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cachedCart = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_CART;
  } catch {
    cachedCart = EMPTY_CART;
  }
  cacheValid = true;
  return cachedCart;
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    cachedCart = items;
    cacheValid = true;
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // ignore
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): CartItem[] {
  // Invalidate cache so next readCart picks up any external changes
  cacheValid = false;
  return readCart();
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

/* ─────────────────────────────────────────────────────────────
   Provider
   ───────────────────────────────────────────────────────────── */
export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Track open state for cart drawer
  const isOpenStore = useSyncExternalStore(
    (cb: () => void) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("laxree-cart-open", cb);
      return () => window.removeEventListener("laxree-cart-open", cb);
    },
    () => {
      if (typeof window === "undefined") return false;
      return (window as unknown as { __laxreeCartOpen?: boolean }).__laxreeCartOpen ?? false;
    },
    () => false
  );

  const addItem = (product: CatalogueProduct) => {
    const current = readCart();
    const existing = current.find((i) => i.model === product.model);
    if (existing) {
      existing.quantity += 1;
      writeCart([...current]);
    } else {
      writeCart([
        ...current,
        {
          model: product.model,
          name: product.name,
          category: product.category,
          image: product.image,
          quantity: 1,
        },
      ]);
    }
  };

  const removeItem = (model: string) => {
    const current = readCart();
    writeCart(current.filter((i) => i.model !== model));
  };

  const updateQuantity = (model: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(model);
      return;
    }
    const current = readCart();
    const item = current.find((i) => i.model === model);
    if (item) {
      item.quantity = quantity;
      writeCart([...current]);
    }
  };

  const clearCart = () => {
    writeCart([]);
  };

  const openCart = () => {
    if (typeof window !== "undefined") {
      (window as unknown as { __laxreeCartOpen?: boolean }).__laxreeCartOpen = true;
      window.dispatchEvent(new Event("laxree-cart-open"));
    }
  };

  const closeCart = () => {
    if (typeof window !== "undefined") {
      (window as unknown as { __laxreeCartOpen?: boolean }).__laxreeCartOpen = false;
      window.dispatchEvent(new Event("laxree-cart-open"));
    }
  };

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      isOpen: isOpenStore,
      openCart,
      closeCart,
    }),
    [items, totalItems, isOpenStore]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
