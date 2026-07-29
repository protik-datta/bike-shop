import React from "react";
import { cn } from "@/utils/cn";

export function SectionTitle({
  subtitle = null,
  title,
  description = null,
  centered = false,
  action = null,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14",
        centered ? "text-center md:flex-col md:items-center" : "",
        className
      )}
    >
      <div className={centered ? "max-w-2xl mx-auto" : "max-w-xl"}>
        {subtitle && (
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-accent)] mb-2 block">
            {subtitle}
          </span>
        )}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-wider text-[var(--color-text)]">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-[var(--color-text-muted)] mt-3">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
