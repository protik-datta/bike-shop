import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { useToastStore } from "@/store/toastStore";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { success, warning } = useToastStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      warning("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    success("Subscribed successfully! Check your inbox for secret deals.");
    setEmail("");
  };

  return (
    <Section bg="card">
      <Container>
        <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-muted)] text-[var(--color-accent)] flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wider text-[var(--color-text)] mb-3">
            JOIN THE REV<span className="text-[var(--color-accent)]">CLUB</span>
          </h2>

          <p className="text-sm text-[var(--color-text-muted)] max-w-md mx-auto mb-8 leading-relaxed">
            Subscribe to receive exclusive price drops, newly arrived superbike inventory alerts, and invite-only test ride events.
          </p>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm animate-scaleIn">
              <CheckCircle2 className="w-5 h-5" />
              <span>You're subscribed! Welcome to the RevClub community.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
              />
              <Button type="submit" size="md" className="w-full sm:w-auto shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </Container>
    </Section>
  );
}
