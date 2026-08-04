import React from "react";
import { Link } from "react-router-dom";
import { Container } from "./Container";
import { ROUTES } from "@/constants/routes";
import { BRANDS } from "@/constants/brands";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import delivery1 from "../../../public/pathao.webp";
import delivery2 from "../../../public/redx.png";
import delivery3 from "../../../public/fedex.jpg";
import delivery4 from "../../../public/sundarban.png";
import delivery5 from "../../../public/panda.png";
import payment1 from "../../../public/bkash.jpeg";
import payment2 from "../../../public/nagad.png";
import payment3 from "../../../public/rocket.png";
import payment4 from "../../../public/dbbl.jpg";
import payment5 from "../../../public/visa.jpg";
import payment6 from "../../../public/mastercard.webp";

export function Footer() {
  // Payment methods list
  const paymentMethods = [
    {
      name: "bKash",
      logo: payment1,
    },
    {
      name: "Nagad",
      logo: payment2,
    },
    {
      name: "Rocket",
      logo: payment3,
    },
    {
      name: "DBBL Nexus",
      logo: payment4,
    },
    {
      name: "VISA",
      logo: payment5,
    },
    {
      name: "MasterCard",
      logo: payment6,
    },
  ];

  // Shipping methods list
  const shippingMethods = [
    {
      name: "Pathao",
      logo: delivery1,
    },
    {
      name: "REDX",
      logo: delivery2,
    },
    {
      name: "FedEx",
      logo: delivery3,
    },
    {
      name: "Sundarban",
      logo: delivery4,
    },
    {
      name: "Foodpanda",
      logo: delivery5,
    },
  ];

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
              <h4 className="font-bold text-[var(--color-text)]">
                Nationwide Delivery
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Insured transport to all 64 districts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[var(--color-gold-muted)] text-[var(--color-gold)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-text)]">
                Official Warranty
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Manufacturer backed warranty coverage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-500/15 text-sky-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-[var(--color-text)]">
                24/7 Rider Support
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Dedicated team ready to assist
              </p>
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
                NIM
              </span>
              <span>
                NEW INFINITY{" "}
                <span className="text-[var(--color-accent)]">MOTORS</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              New Infinity Motors BD is Bangladesh's premier motorcycle digital
              showroom. We bring world-class sportbikes, naked street fighters,
              adventure tourers, and classic cruisers directly to passionate
              riders.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                <span>
                  Port Connecting Road 10 No. Godawon Mongla Bondor, Khulna,
                  Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                <span>+8801939279086 / +8801744361242</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                <span>support@newinfinitymotors.com.bd</span>
              </div>

              {/* social links */}
              <div className="flex items-center gap-2 mt-5">
                <a
                  href="https://www.facebook.com/people/%E0%A6%A8%E0%A6%BF%E0%A6%89-%E0%A6%87%E0%A6%A8%E0%A6%AB%E0%A6%BF%E0%A6%A8%E0%A6%BF%E0%A6%9F%E0%A6%BF-%E0%A6%AE%E0%A7%8B%E0%A6%9F%E0%A6%B0%E0%A6%B8-%E0%A6%AC%E0%A6%BF%E0%A6%A1%E0%A6%BF/61569149687553/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/8801744361242"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to={ROUTES.SHOP}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  All Bikes
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CATEGORIES}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.COMPARE}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Compare Bikes
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.WISHLIST}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CART}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ORDERS}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-bold text-[var(--color-text)] text-base mb-4">
              Top Brands
            </h4>
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
            <h4 className="font-bold text-[var(--color-text)] text-base mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  to={ROUTES.ABOUT}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.CONTACT}
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href="#terms"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#emi"
                  className="hover:text-[var(--color-accent)] transition-colors"
                >
                  EMI Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment & Shipping Systems Section */}
        <div className="py-8 border-b border-[var(--color-border-subtle)] space-y-6">
          <h3 className="text-lg font-bold text-[var(--color-text)] relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-red-600">
            Payment Links
          </h3>

          <div className="space-y-4">
            {/* Payment Systems */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-text)] mb-3">
                Payment System:
              </h4>
              <div className="flex flex-wrap items-center">
                {paymentMethods.map((pm, index) => (
                  <div
                    key={index}
                    className="h-17 px-2 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                  >
                    <img
                      src={pm.logo}
                      alt={pm.name}
                      className="h-13 max-w-[120px] object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = pm.name;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Systems */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-text)] mb-3">
                Shipping System:
              </h4>
              <div className="flex flex-wrap items-center">
                {shippingMethods.map((sm, index) => (
                  <div
                    key={index}
                    className="h-17 px-3 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                  >
                    <img
                      src={sm.logo}
                      alt={sm.name}
                      className="h-13 max-w-[100px] object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.innerText = sm.name;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} New Infinity Motors BD. All rights
            reserved.
          </p>
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
