import React from "react";
import { cn } from "@/utils/cn";

export function Loader({
  size = "md", // sm | md | lg
  text = null,
  fullPage = false,
  className = "",
}) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "border-[var(--color-accent)] border-t-transparent rounded-full animate-spin",
          sizes[size],
          className
        )}
      />
      {text && (
        <p className="text-sm font-medium text-[var(--color-text-muted)] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-md">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{spinner}</div>;
}
