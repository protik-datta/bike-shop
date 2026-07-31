import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedBikes } from "@/components/home/FeaturedBikes";
import { TrendingBikes } from "@/components/home/TrendingBikes";
import { LatestArrivals } from "@/components/home/LatestArrivals";
import { BestSellers } from "@/components/home/BestSellers";
import { TopBrands } from "@/components/home/TopBrands";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { OffersSection } from "@/components/home/OffersSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <TopBrands />
      <FeaturedBikes />
      <CategoriesSection />
      <LatestArrivals />
      <ServicesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
}
