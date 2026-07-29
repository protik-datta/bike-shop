import React from "react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { ShieldCheck, Award, Users, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-10">
      <Container>
        <SectionTitle
          subtitle="Our Legacy & Vision"
          title="About RevMotion"
          description="Bangladesh's premier digital motorcycle showroom bridging international manufacturers and local enthusiasts."
        />

        {/* Hero story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-display uppercase tracking-wider text-[var(--color-text)]">
              Redefining Motorcycle Commerce
            </h2>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Founded by passionate motorcycling veterans in Dhaka, RevMotion was born out of a single goal: to provide Bangladeshi riders with transparent pricing, official brand warranties, and seamless door delivery for high-performance bikes.
            </p>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              We partner directly with official regional importers of Yamaha, Honda, Kawasaki, BMW Motorrad, KTM, Ducati, and Royal Enfield to eliminate gray-market uncertainty and ensure every machine carries full technical support.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border-subtle)] aspect-[16/10]">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
              alt="RevMotion Showroom"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-3">
            <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="text-lg font-bold text-[var(--color-text)]">100% Genuine Imports</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Every bike sold comes with original manufacturer VIN numbers, customs documentation, and BRTA clearance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-3">
            <Award className="w-8 h-8 text-[var(--color-gold)]" />
            <h3 className="text-lg font-bold text-[var(--color-text)]">Certified Technicians</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Our central service center in Tejgaon is equipped with computerized diagnostic tools for Japanese and European superbikes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-3">
            <Users className="w-8 h-8 text-sky-400" />
            <h3 className="text-lg font-bold text-[var(--color-text)]">Vibrant Community</h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              We organize monthly track days, weekend group tours, and rider safety clinics for all RevClub members.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
