import React from "react";
import { Outlet, Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ROUTES } from "@/constants/routes";
import { Toast } from "@/components/ui/Toast";

export function CheckoutLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Minimal Header */}
      <header className="border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/80 backdrop-blur-md py-4 sticky top-0 z-30">
        <Container className="flex items-center justify-between">
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

          <div className="flex items-center gap-4">
            <Link
              to={ROUTES.CART}
              className="text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Cart</span>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Checkout View */}
      <main className="flex-1 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-[var(--color-border-subtle)] py-6 text-center text-xs text-[var(--color-text-muted)]">
        <Container>
          <p>© {new Date().getFullYear()} RevMotion. All orders protected by cash-on-delivery guarantee.</p>
        </Container>
      </footer>

      <Toast />
    </div>
  );
}
