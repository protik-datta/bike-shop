import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Award } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[var(--color-bg)] pt-12 pb-20">
      {/* Dynamic Background Image & Lighting FX */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85&auto=format&fit=crop"
          alt="Superbike Background"
          className="w-full h-full object-cover object-center opacity-35 scale-105 animate-scaleIn"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-transparent to-[var(--color-bg)]" />

        {/* Ambient Radial Accent Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-gold)]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          {/* Badge Tagline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-accent-muted)] border border-[rgba(255,77,0,0.3)] text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider mb-6 animate-fadeInDown">
            <Zap className="w-4 h-4" />
            <span>Next-Gen Supersport & Hyper-Naked Collection</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display uppercase tracking-wider leading-[0.95] text-[var(--color-text)] mb-6 animate-fadeInUp">
            UNLEASH THE <br />
            <span className="text-gradient">BEAST WITHIN.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl mb-8 animate-fadeInUp">
            Experience the pinnacle of motorcycle engineering. Discover flagship models from Yamaha, Honda, Kawasaki, Ducati, BMW, and KTM — delivered directly to your doorstep with official warranty.
          </p>

          {/* CTA Button Group */}
          <div className="flex flex-wrap items-center gap-4 animate-fadeInUp">
            <Link to={ROUTES.SHOP}>
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Explore Inventory
              </Button>
            </Link>

            <Link to={ROUTES.COMPARE}>
              <Button size="lg" variant="secondary">
                Compare Bikes
              </Button>
            </Link>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-[var(--color-border-subtle)] text-center sm:text-left">
            <div>
              <span className="block text-2xl sm:text-3xl font-display font-bold text-[var(--color-accent)] font-mono">
                100%
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">Official Imports</span>
            </div>

            <div>
              <span className="block text-2xl sm:text-3xl font-display font-bold text-[var(--color-gold)] font-mono">
                64
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">Districts Delivered</span>
            </div>

            <div>
              <span className="block text-2xl sm:text-3xl font-display font-bold text-white font-mono">
                0% EMI
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">Flexible Banking</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
