import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-ember-500 text-ink-950 hover:bg-ember-400 disabled:bg-ember-500/40",
  secondary:
    "bg-ink-800 text-ink-100 border border-ink-600 hover:bg-ink-700 disabled:opacity-50",
  danger:
    "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 disabled:opacity-50",
  ghost:
    "text-ink-300 hover:text-ink-100 hover:bg-ink-800 disabled:opacity-50",
};

const SIZES = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
