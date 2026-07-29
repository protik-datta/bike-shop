import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function SearchBar({
  placeholder = "Search bikes, brands, categories...",
  value = "",
  onChange,
  onSearch = null,
  autoFocus = false,
  className = "",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex items-center w-full glass rounded-xl border border-[var(--color-border)] focus-within:border-[var(--color-accent)] transition-all",
        className
      )}
    >
      <Search className="w-5 h-5 ml-4 text-[var(--color-text-muted)] shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-3 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] bg-transparent focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="p-1 mr-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
