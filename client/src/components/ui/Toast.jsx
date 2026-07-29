import React from "react";
import { useToastStore } from "@/store/toastStore";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Toast() {
  const { toasts, remove } = useToastStore();

  if (!toasts.length) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/30 bg-emerald-950/40",
    error: "border-rose-500/30 bg-rose-950/40",
    warning: "border-amber-500/30 bg-amber-950/40",
    info: "border-sky-500/30 bg-sky-950/40",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border glass shadow-2xl animate-slideInRight",
            borders[toast.type] || borders.info
          )}
        >
          <div className="flex items-center gap-3">
            {icons[toast.type] || icons.info}
            <p className="text-sm font-medium text-[var(--color-text)]">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => remove(toast.id)}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
