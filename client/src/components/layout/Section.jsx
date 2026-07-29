import React from "react";
import { cn } from "@/utils/cn";

export function Section({
  children,
  id = null,
  className = "",
  bg = "transparent", // transparent | elevated | card
}) {
  const bgStyles = {
    transparent: "bg-transparent",
    elevated: "bg-[var(--color-bg-elevated)] border-y border-[var(--color-border-subtle)]",
    card: "bg-[var(--color-bg-card)] border-y border-[var(--color-border-subtle)]",
  };

  return (
    <section
      id={id}
      className={cn("section-py relative overflow-hidden", bgStyles[bg], className)}
    >
      {children}
    </section>
  );
}
