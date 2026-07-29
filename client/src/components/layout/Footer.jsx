import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./Container";
import { ROUTES } from "@/constants/routes";
import { BRANDS } from "@/constants/brands";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Headphones } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)] pt-16 pb-12 text-[var(--color-text-muted)] text-sm">
      {/* Guarantees bar */}
      <Container className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-text)]">Nationwide Delivery</h4>
              <p className="text-xs text-[var(--color-text-muted)]">Insured transport to all 64 districts</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-gold-muted)] text-[var(--color-gold)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-text)]">Official Warranty</h4>
              <p className="text-xs text-[var(--color-text-muted)]">Manufacturer backed warranty coverage</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-text)]">24/7 Rider Support</h4>
              <p className="text-xs text-[var(--color-text-muted)]">Dedicated team ready to assist</p>
            </div>
          </div>
        </div>
      </Container>

      {/* Main Footer Links */}
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--color-border-subtle)]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 text-2xl font-display uppercase tracking-wider text-[var(--color-text)]"
            >
              <span className="w-7 h-7 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-black text-lg">
                R
              </span>
              <span>
                REV<span className="text-[var(--color-accent)]">MOTION</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              RevMotion is Bangladesh's premier motorcycle digital showroom. We bring world-class sportbikes, naked street fighters, adventure tourers, and classic cruisers directly to passionate riders.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                <span>Level 5, Velocity Tower, Tejgaon, Dhaka-1208</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                <span>+880 1700-000000 (Mon - Sat, 9am - 8pm)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                <span>support@revmotion.com.bd</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to={ROUTES.SHOP} className="hover:text-[var(--color-accent)] transition-colors">All Bikes</Link></li>
              <li><Link to={ROUTES.CATEGORIES} className="hover:text-[var(--color-accent)] transition-colors">Categories</Link></li>
              <li><Link to={ROUTES.COMPARE} className="hover:text-[var(--color-accent)] transition-colors">Compare Bikes</Link></li>
              <li><Link to={ROUTES.WISHLIST} className="hover:text-[var(--color-accent)] transition-colors">My Wishlist</Link></li>
              <li><Link to={ROUTES.CART} className="hover:text-[var(--color-accent)] transition-colors">Shopping Cart</Link></li>
              <li><Link to={ROUTES.ORDERS} className="hover:text-[var(--color-accent)] transition-colors">Order Tracking</Link></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base mb-4">Top Brands</h4>
            <ul className="space-y-2.5 text-xs">
              {BRANDS.slice(0, 6).map((b) => (
                <li key={b.id}>
                  <Link
                    to={`${ROUTES.SHOP}?brand=${encodeURIComponent(b.name)}`}
                    className="hover:text-[var(--color-accent)] transition-colors"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to={ROUTES.ABOUT} className="hover:text-[var(--color-accent)] transition-colors">About Us</Link></li>
              <li><Link to={ROUTES.CONTACT} className="hover:text-[var(--color-accent)] transition-colors">Contact Us</Link></li>
              <li><a href="#terms" className="hover:text-[var(--color-accent)] transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="hover:text-[var(--color-accent)] transition-colors">Privacy Policy</a></li>
              <li><a href="#emi" className="hover:text-[var(--color-accent)] transition-colors">EMI Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} RevMotion Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[var(--color-text-faint)] font-mono text-[11px]">
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>SSL Secured</span>
            <span>•</span>
            <span>Official Imports</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
