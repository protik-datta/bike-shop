import React from "react";
import { PackageOpen } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

export function EmptyState({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "We couldn't find what you were looking for. Try adjusting your filters or search terms.",
  actionText = null,
  onAction = null,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 surface border border-dashed border-[var(--color-border)] rounded-2xl max-w-lg mx-auto my-8",
        className
      )}
    >
      <div className="p-4 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] mb-4 border border-[var(--color-border-subtle)]">
        <Icon className="w-10 h-10 text-[var(--color-accent)]" />
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-sm">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
