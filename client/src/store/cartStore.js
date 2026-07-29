import { create } from "zustand";
import { lsGet, lsSet } from "@/utils/localStorage";
import { LS_KEYS } from "@/constants/queryKeys";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, COUPONS } from "@/constants/checkout";

function loadPersistedCart() {
  return lsGet(LS_KEYS.CART, []);
}

function persistCart(items) {
  lsSet(LS_KEYS.CART, items);
}

function computeSummary(items, discountAmount = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + (item.offerPrice ?? item.price) * item.quantity,
    0
  );
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = Math.max(0, subtotal + delivery - discountAmount);
  return { subtotal, delivery, total };
}

export const useCartStore = create((set, get) => ({
  items:          loadPersistedCart(),
  couponCode:     "",
  couponLabel:    "",
  discountAmount: 0,

  // ── Computed ──────────────────────────────────────────────
  get summary() {
    return computeSummary(get().items, get().discountAmount);
  },
  get totalItems() {
    return get().items.reduce((s, i) => s + i.quantity, 0);
  },
  get isEmpty() {
    return get().items.length === 0;
  },

  // ── Actions ───────────────────────────────────────────────
  addItem(bike, quantity = 1) {
    const items = get().items;
    const idx = items.findIndex((i) => i._id === bike._id);
    let updated;

    if (idx > -1) {
      updated = items.map((item, i) =>
        i === idx
          ? { ...item, quantity: Math.min(item.quantity + quantity, bike.stock) }
          : item
      );
    } else {
      updated = [...items, { ...bike, quantity: Math.min(quantity, bike.stock) }];
    }

    persistCart(updated);
    set({ items: updated });
  },

  removeItem(bikeId) {
    const updated = get().items.filter((i) => i._id !== bikeId);
    persistCart(updated);
    set({ items: updated });
  },

  updateQuantity(bikeId, quantity) {
    const updated = get().items.map((i) =>
      i._id === bikeId ? { ...i, quantity: Math.max(1, quantity) } : i
    );
    persistCart(updated);
    set({ items: updated });
  },

  clearCart() {
    persistCart([]);
    set({ items: [], couponCode: "", couponLabel: "", discountAmount: 0 });
  },

  applyCoupon(code) {
    const coupon = COUPONS[code?.toUpperCase()];
    if (!coupon) return { success: false, message: "Invalid coupon code." };

    const { subtotal } = computeSummary(get().items, 0);
    const discountAmount = Math.floor(subtotal * coupon.discount);

    set({ couponCode: code.toUpperCase(), couponLabel: coupon.label, discountAmount });
    return { success: true, message: coupon.label };
  },

  removeCoupon() {
    set({ couponCode: "", couponLabel: "", discountAmount: 0 });
  },
}));
