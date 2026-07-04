"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useEnquiry } from "@/components/providers/enquiry-provider";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const ACCENTS = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-brass",
};

const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function Toaster() {
  const { toasts, dismissToast } = useEnquiry();
  // useSyncExternalStore is the React-idiomatic way to detect client mount
  // without calling setState inside an effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    clientSnapshot,
    serverSnapshot
  );

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed top-4 left-1/2 z-[100] flex w-[min(92vw,440px)] -translate-x-1/2 flex-col gap-3"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-brass/30 bg-charcoal/95 px-5 py-4 shadow-2xl backdrop-blur-xl"
              role="status"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${ACCENTS[t.kind]}`} />
              <p className="flex-1 font-body text-sm leading-snug text-ivory">
                {t.message}
              </p>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="shrink-0 rounded-full p-1 text-sand transition-colors hover:text-ivory"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
