import React from "react";
import { Link } from "react-router-dom";
import { Tag, Sparkles, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export function OffersSection() {
  return (
    <Section bg="card">
      <Container>
        <div className="relative rounded-3xl overflow-hidden border border-[rgba(255,77,0,0.3)] bg-gradient-to-r from-[var(--color-bg-elevated)] via-black to-[var(--color-bg-elevated)] p-8 sm:p-12 lg:p-16">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Limited Time Season Fest</span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-wider leading-none text-white">
                FLAT <span className="text-[var(--color-accent)]">৳20,000 CASHBACK</span> ON ALL 150CC+ BIKES
              </h2>

              <p className="text-sm sm:text-base text-[var(--color-text-muted)] max-w-lg leading-relaxed">
                Upgrade your ride with zero-interest 36-month EMI, free comprehensive insurance for 1 year, and nationwide home delivery.
              </p>

              <div className="flex items-center gap-6 pt-2 font-mono text-xs text-[var(--color-gold)] font-bold uppercase">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Use Code: NIM20</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-accent)]" />
                  <span>Ends In 04 Days</span>
                </div>
              </div>

              <div className="pt-4">
                <Link to={ROUTES.SHOP}>
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Claim Offer Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Offer Highlight Bike Image */}
            <div className="relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1571732154690-f6d1c3e5178a?w=800&q=80"
                alt="Special Offer Bike"
                className="w-full max-w-md rounded-2xl border border-[var(--color-border-subtle)] shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
