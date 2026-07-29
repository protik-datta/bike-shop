import React from "react";
import { cn } from "@/utils/cn";

export function Skeleton({ className = "", circle = false, style = {} }) {
  return (
    <div
      className={cn(
        "skeleton",
        circle ? "rounded-full" : "rounded-md",
        className
      )}
      style={style}
    />
  );
}
