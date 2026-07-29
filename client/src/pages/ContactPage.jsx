import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/layout/SectionTitle";
import { Button } from "@/components/ui/Button";
import { validateContactForm } from "@/utils/validators";
import { useToastStore } from "@/store/toastStore";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const { success, error: toastError } = useToastStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateContactForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toastError("Please fill out all required fields properly.");
      return;
    }
    setSubmitted(true);
    success("Message sent! Our support team will get back to you shortly.");
  };

  return (
    <div className="py-10">
      <Container>
        <SectionTitle
          subtitle="Get In Touch"
          title="Contact RevMotion"
          description="Have questions about EMI options, stock availability, or BRTA registration? Reach out to our team."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 my-10">
          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)] space-y-4">
              <h3 className="text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border-subtle)] pb-3">
                Headquarters
              </h3>

              <div className="space-y-4 text-xs text-[var(--color-text-muted)]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-accent)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[var(--color-text)] block">Dhaka Showroom & HQ</strong>
                    Level 5, Velocity Tower, Tejgaon I/A, Dhaka-1208, Bangladesh
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                  <div>
                    <strong className="text-[var(--color-text)] block">Helpline</strong>
                    +880 1700-000000 / +880 1900-000000
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                  <div>
                    <strong className="text-[var(--color-text)] block">Email Support</strong>
                    support@revmotion.com.bd
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 p-8 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-scaleIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">
                  Thank You for Reaching Out!
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
                  Your message has been assigned to our senior customer advisor. We will respond within 2 business hours.
                </p>
                <Button variant="secondary" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-4">
                  Send Us A Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed"
                      className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:outline-none ${
                        errors.name ? "border-rose-500" : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tanvir@example.com"
                      className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:outline-none ${
                        errors.email ? "border-rose-500" : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01700000000"
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-sm text-[var(--color-text)] font-mono focus:border-[var(--color-accent)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Ask about EMI, delivery times, or spec details..."
                    className={`w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-subtle)] border text-sm text-[var(--color-text)] focus:outline-none ${
                      errors.message ? "border-rose-500" : "border-[var(--color-border)] focus:border-[var(--color-accent)]"
                    }`}
                  />
                </div>

                <Button type="submit" variant="primary" icon={Send} size="lg">
                  Submit Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
