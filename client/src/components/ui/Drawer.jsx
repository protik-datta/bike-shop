import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = "right", // right | left
  width = "max-w-md",
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

  const positions = {
    right: "top-0 right-0 h-full animate-slideInRight",
    left: "top-0 left-0 h-full animate-slideInLeft",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={cn(
          "fixed w-full bg-[var(--color-bg-card)] border-l border-[var(--color-border)] shadow-2xl flex flex-col z-10",
          positions[position],
          width
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)] shrink-0">
          <h3 className="text-lg font-bold text-[var(--color-text)]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg transition-colors hover:bg-[var(--color-bg-subtle)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
