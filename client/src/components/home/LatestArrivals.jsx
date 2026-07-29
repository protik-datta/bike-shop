import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { BikeCard } from "@/components/cards/BikeCard";
import { BikeCardSkeleton } from "@/components/cards/BikeCardSkeleton";
import { useBikes } from "@/hooks/useBikes";

export function LatestArrivals() {
  const { data: bikes, loading } = useBikes({ isNewArrival: true, limit: 4 });

  return (
    <Section bg="card">
      <Container>
        <SectionTitle
          subtitle="Fresh Off The Container"
          title="Latest Arrivals"
          description="Newly released model years featuring state-of-the-art electronics, updated livery, and upgraded components."
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
