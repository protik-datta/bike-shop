import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Heart,
  GitCompare,
  Search,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";
import { Container } from "./Container";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { useUiStore } from "@/store/uiStore";
import { ROUTES } from "@/constants/routes";
import { SearchBar } from "@/components/ui/SearchBar";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const cartCount = useCartStore((s) => s.items.reduce((acc, item) => acc + item.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const compareCount = useCompareStore((s) => s.items.length);

  const { openCartDrawer, mobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useUiStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (q) => {
    if (!q.trim()) return;
    navigate(`${ROUTES.SHOP}?search=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { label: "Home", to: ROUTES.HOME },
    { label: "Bikes", to: ROUTES.SHOP },
    { label: "Categories", to: ROUTES.CATEGORIES },
    { label: "Compare", to: ROUTES.COMPARE },
    { label: "Orders", to: ROUTES.ORDERS },
    { label: "About", to: ROUTES.ABOUT },
    { label: "Contact", to: ROUTES.CONTACT },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border-subtle)] shadow-xl py-3"
          : "bg-gradient-to-b from-black/80 to-transparent py-5"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 text-2xl sm:text-3xl font-display uppercase tracking-wider text-[var(--color-text)]"
          >
            <span className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[rgba(255,77,0,0.4)]">
              NIM
            </span>
            <span>
              NEW<span className="text-[var(--color-accent)]"> INIFITY MOTORS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors link-underline ${
                    isActive
                      ? "text-[var(--color-accent)] font-semibold"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded-full hover:bg-[var(--color-bg-subtle)]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Compare Badge */}
            <Link
              to={ROUTES.COMPARE}
              className="relative p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded-full hover:bg-[var(--color-bg-subtle)] hidden sm:flex"
              aria-label="Compare Bikes"
            >
              <GitCompare className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-bold text-[10px] flex items-center justify-center font-mono">
                  {compareCount}
                </span>
              )}
            </Link>

            {/* Wishlist Badge */}
            <Link
              to={ROUTES.WISHLIST}
              className="relative p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded-full hover:bg-[var(--color-bg-subtle)]"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative p-2 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors rounded-full hover:bg-[var(--color-bg-subtle)]"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-accent)] text-white font-bold text-[10px] flex items-center justify-center font-mono animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Placeholder */}
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--color-border-subtle)] text-xs text-[var(--color-text-muted)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Auth Active</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-[var(--color-text)] lg:hidden rounded-lg hover:bg-[var(--color-bg-subtle)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Inline Search Bar (Toggleable) */}
        {searchOpen && (
          <div className="mt-4 pb-2 animate-fadeIn">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              autoFocus
            />
          </div>
        )}
      </Container>

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[65px] bg-[var(--color-bg-card)] border-b border-[var(--color-border)] p-6 shadow-2xl lg:hidden animate-fadeIn">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `text-base font-semibold py-2 border-b border-[var(--color-border-subtle)] ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
