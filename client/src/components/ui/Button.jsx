import React from "react";
import { cn } from "@/utils/cn";

export function Button({
  children,
  variant = "primary", // primary | secondary | outline | ghost | danger
  size = "md", // sm | md | lg
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none";

  const variants = {
    primary:
      "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-lg shadow-[rgba(255,77,0,0.25)] hover:shadow-[rgba(255,77,0,0.4)] active:scale-[0.98]",
    secondary:
      "bg-[var(--color-bg-subtle)] text-[var(--color-text)] hover:bg-[var(--color-border)] border border-[var(--color-border-subtle)] active:scale-[0.98]",
    outline:
      "border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-muted)] active:scale-[0.98]",
    ghost:
      "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]",
    danger:
      "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-900/30 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2.5 font-semibold",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === "right" && (
        <Icon className="w-4 h-4 shrink-0" />
      )}
    </button>
  );
}
