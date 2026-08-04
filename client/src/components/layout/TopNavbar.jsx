import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { Container } from "./Container";

export function TopNavbar() {
  return (
    <div className="block bg-[var(--color-bg)] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)] text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
      <Container>
        <div className="flex items-center justify-between h-8 sm:h-9">
          {/* Left: Social Icons — from sm up */}
          <div className="flex gap-2 sm:flex items-center lg:gap-4 h-full pr-3 lg:pr-4 border-r border-[var(--color-border-subtle)]">
            <a
              href="https://www.facebook.com/people/%E0%A6%A8%E0%A6%BF%E0%A6%89-%E0%A6%87%E0%A6%A8%E0%A6%AB%E0%A6%BF%E0%A6%A8%E0%A6%BF%E0%A6%9F%E0%A6%BF-%E0%A6%AE%E0%A7%8B%E0%A6%9F%E0%A6%B0%E0%A6%B8-%E0%A6%AC%E0%A6%BF%E0%A6%A1%E0%A6%BF/61569149687553/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-accent)] transition-colors"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-accent)] transition-colors"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/8801744361242"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--color-accent)] transition-colors"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          </div>

          {/* Center: Links & Address — from sm up */}
          <div className="hidden sm:flex items-center justify-center gap-3 lg:gap-4 px-3 lg:px-4 flex-1 min-w-0">
            <Link
              to={ROUTES.CONTACT || "#contact"}
              className="hover:text-[var(--color-accent)] transition-colors font-bold whitespace-nowrap"
            >
              CONTACT US
            </Link>

            <span className="text-[var(--color-accent)]">•</span>

            <a
              href="#location"
              className="hover:text-[var(--color-accent)] transition-colors font-bold whitespace-nowrap"
            >
              LOCATION
            </a>

            <div className="hidden lg:flex items-center gap-1.5 text-[var(--color-text-faint)] normal-case font-normal ml-2 truncate">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" />
              <span className="truncate">
                Port Connecting Road 10 No. Godawon Mongla Bondor, Khulna,
                Bangladesh
              </span>
            </div>
          </div>

          {/* Right: Helpline — always visible, most essential item */}
          <div className="flex items-center gap-1.5 sm:gap-2 h-full w-full sm:w-auto justify-center sm:justify-start sm:pl-4 sm:border-l sm:border-[var(--color-border-subtle)] whitespace-nowrap">
            <Phone className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" />
            <a
              href="tel:+8801939279086"
              className="hover:text-[var(--color-accent)] transition-colors font-bold"
            >
              <span className="hidden sm:inline">Helpline: </span>
              +8801939279086
            </a>
            <span>/</span>
            <a
              href="tel:+8801744361242"
              className="hover:text-[var(--color-accent)] transition-colors font-bold"
            >
              +8801744361242
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
