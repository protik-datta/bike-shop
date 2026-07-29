import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function BikeCardSkeleton() {
  return (
    <div className="flex flex-col bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-[16/10]" />

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-4 w-24" />
        <div className="pt-3 border-t border-[var(--color-border-subtle)] flex justify-between items-center">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
