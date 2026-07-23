"use client";

/**
 * Shared admin toast system.
 *
 * Usage (any admin page):
 *   import { toast, AdminToaster } from "@/lib/admin/admin-toast";
 *   toast("success", "Saved");
 *   // then render <AdminToaster /> once at the root of the page.
 *
 * This is a module-level singleton so `toast()` can be called from anywhere
 * and every mounted <AdminToaster /> reflects the same queue.
 */
import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

let items: ToastItem[] = [];
let listeners: Array<(items: ToastItem[]) => void> = [];
let counter = 0;

function emit() {
  for (const l of listeners) l(items);
}

export function toast(kind: ToastKind, message: string) {
  const id = ++counter;
  items = [...items, { id, kind, message }];
  emit();
  if (typeof window !== "undefined") {
    window.setTimeout(() => {
      items = items.filter((t) => t.id !== id);
      emit();
    }, 4000);
  }
}

export function AdminToaster() {
  const [local, setLocal] = useState<ToastItem[]>(items);

  useEffect(() => {
    listeners.push(setLocal);
    setLocal(items);
    return () => {
      listeners = listeners.filter((l) => l !== setLocal);
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    items = items.filter((t) => t.id !== id);
    emit();
  }, []);

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[min(92vw,380px)] flex-col gap-2.5"
      aria-live="polite"
      aria-atomic="true"
    >
      {local.map((t) => {
        const Icon =
          t.kind === "success"
            ? CheckCircle2
            : t.kind === "error"
            ? AlertCircle
            : Info;
        const accent =
          t.kind === "success"
            ? "text-emerald-400"
            : t.kind === "error"
            ? "text-red-400"
            : "text-brass";
        const ring =
          t.kind === "success"
            ? "border-emerald/30"
            : t.kind === "error"
            ? "border-red-500/30"
            : "border-brass/30";
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border ${ring} bg-charcoal/95 px-4 py-3 shadow-2xl backdrop-blur-xl`}
            role="status"
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`} />
            <p className="flex-1 font-body text-sm leading-snug text-ivory pr-1">
              {t.message}
            </p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 rounded p-0.5 text-sand transition-colors hover:text-ivory"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
