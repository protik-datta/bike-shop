import React from "react";
import { ShieldCheck, Truck, CreditCard, Wrench, RefreshCw, FileText } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionTitle } from "@/components/layout/SectionTitle";

export function ServicesSection() {
  const services = [
    {
      icon: ShieldCheck,
      title: "Official Warranty",
      desc: "Every bike includes manufacturer-backed warranty up to 2 years or 20,000 km.",
    },
    {
      icon: Truck,
      title: "Enclosed Home Delivery",
      desc: "Hydraulic lift truck delivery to all 64 districts in Bangladesh.",
    },
    {
      icon: CreditCard,
      title: "Flexible 0% EMI",
      desc: "Up to 36 months 0% interest EMI across 18 leading Bangladeshi partner banks.",
    },
    {
      icon: Wrench,
      title: "Free Service Package",
      desc: "First 4 periodic maintenance services free at authorized service centers.",
    },
    {
      icon: RefreshCw,
      title: "Trade-In & Upgrade",
      desc: "Exchange your existing motorcycle for top market value towards a new bike.",
    },
    {
      icon: FileText,
      title: "BRTA Registration",
      desc: "Complete BRTA license plate & registration processing handled by our team.",
    },
  ];

  return (
    <Section bg="elevated">
      <Container>
        <SectionTitle
          subtitle="End-To-End Convenience"
          title="The Ecosystem"
          description="We handle every detail from showroom selection to registration, servicing, and door delivery."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
