import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { data: categories } = useCategories();

  return (
    <div className="py-10">
      <Container>
        <SectionTitle
          subtitle="Explore By Category"
          title="All Motorcycle Disciplines"
          description="Find the exact riding style engineered for your preference — track, highway, or off-road."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </Container>
    </div>
  );
}
