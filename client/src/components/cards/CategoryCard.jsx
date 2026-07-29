import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buildRoute, ROUTES } from "@/constants/routes";

export function CategoryCard({ category }) {
  const url = buildRoute(ROUTES.CATEGORY_DETAIL, { slug: category.slug });

  return (
    <Link
      to={url}
      className="group relative flex flex-col justify-end aspect-[4/3] rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] p-6 transition-all duration-300 hover:border-[var(--color-accent)] hover:shadow-2xl hover:shadow-[rgba(255,77,0,0.15)]"
    >
      {/* Background Image with Dark Overlay Gradient */}
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] font-mono block mb-1">
          {category.bikeCount || 10}+ Bikes
        </span>
        <h3 className="text-2xl font-display uppercase tracking-wider text-white group-hover:text-[var(--color-accent)] transition-colors flex items-center justify-between">
          <span>{category.name}</span>
          <ArrowRight className="w-5 h-5 text-[var(--color-accent)] -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
        </h3>
        <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mt-1 font-normal opacity-80 group-hover:opacity-100 transition-opacity">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
