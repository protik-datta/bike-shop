import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { useCategories } from "@/hooks/useCategories";

export function CategoriesSection() {
  const { data: categories } = useCategories();

  return (
    <Section>
      <Container>
        <SectionTitle
          subtitle="Define Your Discipline"
          title="Browse By Riding Style"
          description="From track supersports to long-haul adventure tourers, find the motorcycle tailored to your passion."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
