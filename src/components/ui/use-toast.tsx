"use client";

import * as React from "react";

type ToastVariant = "default" | "destructive";

export type ToastState = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastContextValue = {
  toasts: ToastState[];
  toast: (t: Omit<ToastState, "id">) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    (t: Omit<ToastState, "id">) => {
      const id = `toast_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
      const next: ToastState = { id, duration: 3500, ...t };
      setToasts((prev) => [next, ...prev].slice(0, 5));
      if ((next.duration ?? 0) > 0) {
        window.setTimeout(() => dismiss(id), next.duration);
      }
    },
    [dismiss]
  );

  const value = React.useMemo(
    () => ({ toasts, toast, dismiss }),
    [toasts, toast, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProviderClient");
  }
  return ctx;
}

