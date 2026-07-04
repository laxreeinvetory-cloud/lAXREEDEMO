"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ModalKind = "enquiry" | "catalogue" | null;

type ToastKind = "success" | "error" | "info";
type ToastItem = {
  id: number;
  kind: ToastKind;
  message: string;
};

type EnquiryContextValue = {
  openModal: (kind: ModalKind) => void;
  closeModal: () => void;
  activeModal: ModalKind;
  notify: (kind: ToastKind, message: string) => void;
  toasts: ToastItem[];
  dismissToast: (id: number) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

let toastIdCounter = 0;

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalKind>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const openModal = useCallback((kind: ModalKind) => {
    setActiveModal(kind);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (kind: ToastKind, message: string) => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, kind, message }]);
      // Auto-dismiss after 4.5s
      if (typeof window !== "undefined") {
        window.setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4500);
      }
    },
    []
  );

  const value = useMemo(
    () => ({ openModal, closeModal, activeModal, notify, toasts, dismissToast }),
    [openModal, closeModal, activeModal, notify, toasts, dismissToast]
  );

  return (
    <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  }
  return ctx;
}
