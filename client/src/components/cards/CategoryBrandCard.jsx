import React from "react";
import { Link } from "react-router-dom";
import { buildRoute, ROUTES } from "@/constants/routes";
import { useBikes } from "@/hooks/useBikes";

export function CategoryBrandCard({ category }) {
  const url = buildRoute(ROUTES.CATEGORY_DETAIL, { slug: category.slug });

  // The categories API doesn't return a product count itself, so ask the
  // bikes endpoint for just 1 result and read the real total off its
  // pagination info (same filter CategoryDetailPage already uses).
  const { pagination, loading } = useBikes({ category: category.slug, limit: 1 });
  const count = pagination?.total ?? 0;

  return (
    <Link
      to={url}
      className="group flex flex-col items-center text-center"
    >
      <div className="w-full aspect-square rounded-2xl bg-white border border-[var(--color-border-subtle)] flex items-center justify-center p-5 sm:p-6 transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:shadow-xl group-hover:shadow-[rgba(255,77,0,0.15)] group-hover:-translate-y-1">
        <img
          src={category.image}
          alt={category.name}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <h4 className="mt-3 text-xs sm:text-sm font-bold uppercase tracking-wide text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
        {category.name}
      </h4>
      <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
        {loading ? "…" : `${count} ${count === 1 ? "product" : "products"}`}
      </span>
    </Link>
  );
}
