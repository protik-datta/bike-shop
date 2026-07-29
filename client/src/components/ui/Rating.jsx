import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

export function Rating({
  rating = 0,
  maxRating = 5,
  showValue = false,
  reviewCount = null,
  size = "md", // sm | md | lg
  className = "",
}) {
  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, idx) => {
          const fillAmount = Math.min(Math.max(rating - idx, 0), 1);
          return (
            <div key={idx} className="relative">
              <Star className={cn(starSizes[size], "text-[var(--color-border)]")} />
              {fillAmount > 0 && (
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${fillAmount * 100}%` }}
                >
                  <Star className={cn(starSizes[size], "text-[var(--color-gold)] fill-[var(--color-gold)]")} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-[var(--color-text)] font-mono ml-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-[var(--color-text-muted)] font-normal">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
