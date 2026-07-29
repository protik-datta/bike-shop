import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { BikeCard } from "@/components/cards/BikeCard";
import { BikeCardSkeleton } from "@/components/cards/BikeCardSkeleton";
import { useBikes } from "@/hooks/useBikes";

export function TrendingBikes() {
  const { data: bikes, loading } = useBikes({ isPopular: true, limit: 4 });

  return (
    <Section>
      <Container>
        <SectionTitle
          subtitle="Rider Favorites"
          title="Trending On The Streets"
          description="The most searched, reviewed, and requested motorcycles among Bangladeshi street riders this month."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <BikeCardSkeleton key={i} />)
            : bikes.map((bike) => <BikeCard key={bike._id} bike={bike} />)}
        </div>
      </Container>
    </Section>
  );
}
