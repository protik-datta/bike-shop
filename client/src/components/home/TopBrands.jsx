import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { CategoryBrandCard } from "@/components/cards/CategoryBrandCard";
import { useCategories } from "@/hooks/useCategories";

export function TopBrands() {
  const { data: categories, loading, error } = useCategories();

  // Nothing to show and nothing loading — don't render an empty section.
  if (!loading && !error && categories.length === 0) return null;

  return (
    <Section bg="elevated">
      <Container>
        <SectionTitle
          subtitle="World-Class Manufacturers"
          title="Our Motorcycle Brand"
          description="We source directly from official regional distributors to guarantee genuine parts, warranties, and documentation."
          centered
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] animate-pulse"
                />
              ))
            : categories.map((category) => (
                <CategoryBrandCard key={category._id} category={category} />
              ))}
        </div>
      </Container>
    </Section>
  );
}
