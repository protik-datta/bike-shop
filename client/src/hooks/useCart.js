import { useCartStore } from "@/store/cartStore";
import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/constants/checkout";

export function useCart() {
  const store = useCartStore();

  const subtotal = store.items.reduce(
    (s, i) => s + (i.offerPrice ?? i.price) * i.quantity,
    0
  );
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total    = Math.max(0, subtotal + delivery - store.discountAmount);

  return {
    items:          store.items,
    totalItems:     store.items.reduce((s, i) => s + i.quantity, 0),
    isEmpty:        store.items.length === 0,
    summary:        { subtotal, delivery, total },
    couponCode:     store.couponCode,
    couponLabel:    store.couponLabel,
    discountAmount: store.discountAmount,
    addItem:        store.addItem,
    removeItem:     store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart:      store.clearCart,
    applyCoupon:    store.applyCoupon,
    removeCoupon:   store.removeCoupon,
  };
}
