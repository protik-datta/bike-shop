import React from "react";
import { formatPrice, calcDiscount } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export function Price({
  price,
  offerPrice = null,
  size = "md", // sm | md | lg | xl
  showDiscount = true,
  className = "",
}) {
  const isSale = offerPrice && offerPrice < price;
  const discount = isSale ? calcDiscount(price, offerPrice) : 0;

  const fontSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl font-extrabold",
  };

  const originalSizes = {
    sm: "text-xs",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base",
  };

  return (
    <div className={cn("inline-flex items-baseline flex-wrap gap-2 font-mono", className)}>
      <span className={cn("font-bold text-[var(--color-accent)]", fontSizes[size])}>
        {formatPrice(isSale ? offerPrice : price)}
      </span>
      {isSale && (
        <>
          <span
            className={cn(
              "line-through text-[var(--color-text-muted)] font-normal",
              originalSizes[size]
            )}
          >
            {formatPrice(price)}
          </span>
          {showDiscount && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
