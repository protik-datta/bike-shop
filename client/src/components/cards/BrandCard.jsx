import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function BrandCard({ brand }) {
  const shopUrl = `${ROUTES.SHOP}?brand=${encodeURIComponent(brand.name)}`;

  return (
    <Link
      to={shopUrl}
      className="group flex flex-col items-center justify-center p-6 bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(255,77,0,0.1)] text-center"
    >
      <div className="w-16 h-12 flex items-center justify-center mb-3">
        <img
          src={brand.logo}
          alt={brand.name}
          className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
          loading="lazy"
        />
      </div>
      <h4 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
        {brand.name}
      </h4>
      <span className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
        {brand.country}
      </span>
    </Link>
  );
}
