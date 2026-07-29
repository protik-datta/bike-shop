import { create } from "zustand";

export const useUiStore = create((set) => ({
  // ── Drawer ──────────────────────────────────────────────
  cartDrawerOpen:    false,
  mobileMenuOpen:    false,
  searchOverlayOpen: false,

  openCartDrawer:    () => set({ cartDrawerOpen: true }),
  closeCartDrawer:   () => set({ cartDrawerOpen: false }),
  toggleCartDrawer:  () => set((s) => ({ cartDrawerOpen: !s.cartDrawerOpen })),

  openMobileMenu:    () => set({ mobileMenuOpen: true }),
  closeMobileMenu:   () => set({ mobileMenuOpen: false }),
  toggleMobileMenu:  () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),

  openSearchOverlay: () => set({ searchOverlayOpen: true }),
  closeSearchOverlay:() => set({ searchOverlayOpen: false }),
  toggleSearch:      () => set((s) => ({ searchOverlayOpen: !s.searchOverlayOpen })),

  // ── Global loading ───────────────────────────────────────
  globalLoading: false,
  setGlobalLoading: (val) => set({ globalLoading: val }),

  // ── Scroll lock ──────────────────────────────────────────
  lockScroll() { document.body.style.overflow = "hidden"; },
  unlockScroll() { document.body.style.overflow = ""; },
}));
