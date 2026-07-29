import React from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BikeCard } from "@/components/cards/BikeCard";
import { BikeCardSkeleton } from "@/components/cards/BikeCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCategoryDetail } from "@/hooks/useCategories";
import { useBikes } from "@/hooks/useBikes";
import { ROUTES } from "@/constants/routes";

export default function CategoryDetailPage() {
  const { slug } = useParams();

  const { data: category } = useCategoryDetail(slug);
  const { data: bikes, loading } = useBikes({ category: slug });

  return (
    <div className="py-10">
      <Container>
        <Breadcrumb
          items={[
            { label: "Categories", to: ROUTES.CATEGORIES },
            { label: category?.name || slug },
          ]}
        />

        {/* Header Banner */}
        <div className="relative rounded-3xl overflow-hidden my-8 p-8 sm:p-12 border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)]">
          {category?.image && (
            <img
              src={category.image}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] font-mono block mb-2">
              Category Focus
            </span>
            <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wider text-white mb-4">
              {category?.name || slug} Motorcycles
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {category?.description}
            </p>
          </div>
        </div>

        {/* Bikes Grid */}
        <div className="my-8">
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-6">
            Available {category?.name} Models ({bikes.length})
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <BikeCardSkeleton key={i} />
              ))}
            </div>
          ) : bikes.length === 0 ? (
            <EmptyState
              title={`No ${category?.name} bikes found`}
              description="We currently don't have active stock in this category."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bikes.map((bike) => (
                <BikeCard key={bike._id} bike={bike} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
