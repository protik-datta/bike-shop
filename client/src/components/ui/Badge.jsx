import React from "react";
import { cn } from "@/utils/cn";

export function Badge({
  children,
  variant = "accent", // accent | gold | success | warning | danger | info | neutral
  size = "md", // sm | md
  className = "",
}) {
  const base = "inline-flex items-center font-medium rounded-full tracking-wide uppercase";

  const variants = {
    accent: "bg-[rgba(255,77,0,0.15)] text-[var(--color-accent)] border border-[rgba(255,77,0,0.3)]",
    gold: "bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)] border border-[rgba(201,168,76,0.3)]",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    info: "bg-sky-500/15 text-sky-400 border border-sky-500/30",
    neutral: "bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
