import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/cn";

export function Breadcrumb({ items = [], className = "" }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-2 text-xs text-[var(--color-text-muted)] py-3 overflow-x-auto no-scrollbar", className)}
    >
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-[var(--color-accent)] transition-colors shrink-0"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-faint)]" />
            {isLast || !item.to ? (
              <span className="font-semibold text-[var(--color-text)] truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="hover:text-[var(--color-accent)] transition-colors shrink-0"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
