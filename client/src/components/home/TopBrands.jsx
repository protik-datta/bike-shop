import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { BrandCard } from "@/components/cards/BrandCard";
import { BRANDS } from "@/constants/brands";

export function TopBrands() {
  return (
    <Section bg="elevated">
      <Container>
        <SectionTitle
          subtitle="World-Class Manufacturers"
          title="Official Brand Partners"
          description="We source directly from official regional distributors to guarantee genuine parts, warranties, and documentation."
          centered
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {BRANDS.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
