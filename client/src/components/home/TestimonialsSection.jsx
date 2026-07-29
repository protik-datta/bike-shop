import React from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { Rating } from "@/components/ui/Rating";
import { MOCK_TESTIMONIALS } from "@/data/testimonials";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  return (
    <Section>
      <Container>
        <SectionTitle
          subtitle="Real Rider Stories"
          title="Verified Customer Feedback"
          description="Hear from riders across Dhaka, Chittagong, Sylhet, and Rajshahi who bought their dream bikes with us."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border)] transition-all duration-300 relative overflow-hidden"
            >
              <Quote className="absolute top-4 right-4 w-10 h-10 text-[var(--color-border-subtle)] opacity-40 pointer-events-none" />

              <div>
                <div className="mb-4">
                  <Rating rating={item.rating} size="sm" showValue />
                </div>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed italic mb-6">
                  "{item.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-[var(--color-accent)]/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text)]">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[var(--color-text-faint)]">
                    Purchased <span className="text-[var(--color-accent)]">{item.bike}</span> • {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
