import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  showCloseButton = true,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative w-full bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl shadow-2xl z-10 overflow-hidden animate-scaleIn",
          maxWidth
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
            {title ? (
              <h3 className="text-lg font-bold text-[var(--color-text)]">
                {title}
              </h3>
            ) : (
              <div />
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg transition-colors hover:bg-[var(--color-bg-subtle)]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
