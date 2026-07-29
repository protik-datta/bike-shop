import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { BikeCard } from "@/components/cards/BikeCard";
import { BikeCardSkeleton } from "@/components/cards/BikeCardSkeleton";
import { Button } from "@/components/ui/Button";
import { useBikes } from "@/hooks/useBikes";
import { ROUTES } from "@/constants/routes";

export function FeaturedBikes() {
  const { data: bikes, loading } = useBikes({ isFeatured: true, limit: 6 });

  return (
    <Section bg="elevated">
      <Container>
        <SectionTitle
          subtitle="Handpicked Machinery"
          title="Featured Motorcycles"
          description="Top-rated flagships chosen for exceptional engineering, performance metrics, and aesthetic dominance."
          action={
            <Link to={ROUTES.SHOP}>
              <Button variant="ghost" icon={ArrowRight} iconPosition="right">
                View All Bikes
              </Button>
            </Link>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <BikeCardSkeleton key={i} />)
            : bikes.map((bike) => <BikeCard key={bike._id} bike={bike} />)}
        </div>
      </Container>
    </Section>
  );
}
